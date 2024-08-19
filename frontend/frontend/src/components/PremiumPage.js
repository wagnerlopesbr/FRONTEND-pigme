import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl, FlatList, Animated, TouchableOpacity } from 'react-native';
import PremiumCard from './PremiumCard';
import { getLists } from '../utils/crud_actions';
import { tokenAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getProductsAPI } from '../utils/api_products_actions';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';


function PremiumPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lists, setLists] = useState([]);
  const [token] = useAtom(tokenAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [supermarkets, setSupermarkets] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState(new Set());
  const [supermarketsNames, setSupermarketsNames] = useState([]);

  const saveSelectedSupermarkets = async (selectedSupermarkets) => {
    try {
      await AsyncStorage.setItem('@selectedSupermarkets', JSON.stringify(Array.from(selectedSupermarkets)));
    } catch (error) {
      console.error('Erro ao salvar supermercados selecionados:', error);
    }
  };

  const loadSelectedSupermarkets = async () => {
    try {
      const storedData = await AsyncStorage.getItem('@selectedSupermarkets');
      return storedData ? new Set(JSON.parse(storedData)) : new Set();
    } catch (error) {
      console.error('Erro ao carregar supermercados selecionados:', error);
      return new Set();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 100,
      useNativeDriver: false,
    }).start();
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [61, 320],
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLists();
    await fetchSupermarkets();
    setRefreshing(false);
  };

  const fetchLists = async () => {
    try {
      const fetchedLists = await getLists(token);
      setLists(fetchedLists || []);
    } catch (error) {
      console.error('Erro ao buscar listas:', error.message || error);
    }
  };

  const fetchSupermarkets = async () => {
    try {
      const response = await getProductsAPI();
      const fetchedSupermarkets = response.supermarkets || [];
      setSupermarkets(fetchedSupermarkets);
      return fetchedSupermarkets;
    } catch (error) {
      console.error('Erro ao buscar supermercados:', error.message || error);
      return [];
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      await fetchLists();
      const fetchedSupermarkets = await fetchSupermarkets();
      const storedSelections = await loadSelectedSupermarkets();
      setSelectedSupermarkets(storedSelections);
      setSupermarketsNames(fetchedSupermarkets.map(supermarket => supermarket.name));
    };
    
    fetchData();
  }, []);

  const toggleSupermarketSelection = useCallback((supermarket) => {
    setSelectedSupermarkets(prevSelectedSupermarkets => {
      const newSelectedSupermarkets = new Set(prevSelectedSupermarkets);
      const newSupermarketsNames = new Set(supermarketsNames);
      if (newSelectedSupermarkets.has(supermarket.id)) {
        newSelectedSupermarkets.delete(supermarket.id);
        newSupermarketsNames.delete(supermarket.name);
      } else {
        newSelectedSupermarkets.add(supermarket.id);
        newSupermarketsNames.add(supermarket.name);
      }
      setSupermarketsNames(Array.from(newSupermarketsNames));
      saveSelectedSupermarkets(newSelectedSupermarkets);
      return newSelectedSupermarkets;
    });
  }, [supermarketsNames]);


  const selectAllSupermarkets = () => {
    const allSupermarketIds = supermarkets.map(supermarket => supermarket.id);
    setSelectedSupermarkets(new Set(allSupermarketIds));
  };

  const cleanSelection = () => {
    setSelectedSupermarkets(new Set());
  };

  return (
    <View style={styles.userListsContainer}>
      <Animated.View
        style={[
          styles.itemContainer,
          { height: heightInterpolation }
        ]}
      >
        <TouchableOpacity
          onPress={toggleExpand}
          style={[
            styles.itemTitleContainer,
          ]}
        >
          <Text style={styles.itemTitle}>
            Escolha os Supermercados
          </Text>
          <Icon name={isExpanded ? "chevron-up" : "chevron-down"} size={23} color='black' />
        </TouchableOpacity>
        {isExpanded && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, paddingRight: 0 }}>
              <TouchableOpacity onPress={selectAllSupermarkets} style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#00D71D', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, backgroundColor: '#00D71D' }}>
                <Icon name="all-inclusive" size={25} color='white' />
                <Text style={{ fontSize: 18, color: 'white' , fontWeight: 'bold', marginLeft: 15 }}>TODOS</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cleanSelection} style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#D70000', borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, backgroundColor: '#D70000' }}>
                <Text style={{ fontSize: 18, color: 'white' , fontWeight: 'bold', marginRight: 15 }}>LIMPAR</Text>
                <Icon name="broom" size={25} color='white' />
              </TouchableOpacity>
            </View>
            <FlatList
              style={{ borderTopWidth: 1, borderTopColor: '#ddd', width: '100%', marginBottom: 20 }}
              data={supermarkets}
              extraData={selectedSupermarkets}
              keyExtractor={item => item.id}
              windowSize={5}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => toggleSupermarketSelection(item)}
                  style={styles.supermarketContainer}
                >
                  <View style={styles.supermarketItemContainer}>
                    <CheckBox
                      checked={selectedSupermarkets.has(item.id)}
                      onPress={() => toggleSupermarketSelection(item)}
                      containerStyle={styles.checkboxContainer}
                    />
                    <Text style={styles.supermarketText}>
                      {item.name}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </Animated.View>
      <ScrollView
        contentContainerStyle={styles.listContainer}
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {lists.slice(0, 10).map((item) => (
          <PremiumCard
            key={item.id}
            item={item}
            supermarkets={supermarkets}
            supermarketsIds={selectedSupermarkets}
            supermarketsNames={supermarketsNames}
          />
        ))}
      </ScrollView>
    </View>
  );
}

export default PremiumPage;


const styles = StyleSheet.create({
  supermarketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    width: '100%',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  supermarketItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supermarketText: {
    fontSize: 16,
    color: 'black',
    marginLeft: -5,
  },
  itemContainer: {
    width: '100%',
    borderRadius: 5,
    borderWidth: 5,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  itemTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'lightgray',
    padding: 10,
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    backgroundColor: 'red',
    width: '93%',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginTop: 5,
    elevation: 30,
    bottom: -8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  userListsContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF9F9',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});