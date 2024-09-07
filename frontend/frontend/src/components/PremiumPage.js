import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, StyleSheet, RefreshControl, FlatList, Animated, TouchableOpacity, Modal } from 'react-native';
import PremiumCard from './PremiumCard';
import { getLists } from '../utils/crud_actions';
import { tokenAtom, userAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getProductsAPI } from '../utils/api_products_actions';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, Circle } from 'react-native-maps';
import { geocodeZipCode, geocodeAddress } from '../utils/geocode';
import Slider from '@react-native-community/slider';

function PremiumPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lists, setLists] = useState([]);
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const [isExpanded, setIsExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [supermarkets, setSupermarkets] = useState([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState(new Set());
  const [supermarketsNames, setSupermarketsNames] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [radius, setRadius] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [supermarketsLocations, setSupermarketsLocations] = useState([]);

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

      const supermarketLocations = await Promise.all(fetchedSupermarkets.map(async (supermarket) => {
        if (supermarket.address) {
          const location = await geocodeAddress(supermarket.address);
          return {
            ...supermarket,
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
          }
        }
        return supermarket;
      }))
      setSupermarketsLocations(supermarketLocations);
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

      // Obtenha coordenadas a partir do zip_code
      if (user.zip_code) {
        const location = await geocodeZipCode(user.zip_code);
        if (location) {
          setUserLocation(location);
        }
      }
    };    
    
    fetchData();
  }, [user.zip_code]);

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

  const filterSupermarketsByRadius = (locations, center, radius) => {
    const radiusInKm = radius; // Assume radius is already in km
    return locations.filter(location => {
      const distance = getDistance(center, { latitude: location.latitude, longitude: location.longitude });
      return distance <= radiusInKm; // Use km directly
    });
  };

  // Utility function to calculate distance between two points
  const getDistance = (point1, point2) => {
    const toRad = (value) => value * Math.PI / 180;
    const lat1 = point1.latitude;
    const lon1 = point1.longitude;
    const lat2 = point2.latitude;
    const lon2 = point2.longitude;

    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
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
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.modalButton}>
                <Icon name="google-maps" size={25} color='white' />
                <Text style={styles.modalButtonText}>MAPA</Text>
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
            <Modal
              visible={modalVisible}
              transparent={false}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={{ flex: 1 }}>
                <MapView
                  style={{ flex: 1 }}
                  initialRegion={{
                    latitude: userLocation?.latitude || 0,
                    longitude: userLocation?.longitude || 0,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                >
                  {userLocation && (
                    <>
                      <Marker
                        coordinate={{
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                        }}
                        title="Sua Localização"
                        pinColor='#CC0000'
                      />
                      <Circle
                        center={{
                          latitude: userLocation.latitude,
                          longitude: userLocation.longitude,
                        }}
                        radius={radius * 1000} // Convertendo km para metros
                        strokeColor='rgba(0, 255, 0, 0.5)' // Cor da borda do círculo
                        fillColor='rgba(0, 255, 0, 0.2)' // Cor de preenchimento do círculo
                        strokeWidth={2}
                      />
                    </>
                  )}
                  {filterSupermarketsByRadius(supermarketsLocations, userLocation, radius).map((supermarket) => (
                    <Marker
                      key={supermarket.id}
                      coordinate={{ latitude: supermarket.latitude, longitude: supermarket.longitude }}
                      title={supermarket.name}
                      pinColor='blue'
                      opacity={0.9}
                    />
                  ))}
                </MapView>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}
                >
                  <Icon name="close" size={30} color='black' />
                </TouchableOpacity>
                <View style={{ position: 'absolute', bottom: 30, width: '100%', padding: 20, backgroundColor: 'rgba(0, 0, 0, 0.88)' }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Raio: {radius.toFixed(3)}m</Text>
                  <Slider
                    style={{ width: '100%' }}
                    minimumValue={0.1}
                    maximumValue={10}
                    step={0.1}
                    value={radius}
                    onValueChange={(value) => setRadius(value)}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTrackTintColor="#d3d3d3"
                  />
                </View>
              </View>
            </Modal>
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
  },
  sliderLabel: {
    textAlign: 'center',
    fontSize: 18,
  },
  modalButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  allButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#00D71D',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#00D71D',
  },
  cleanButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#D70000',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: '#D70000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // fundo semi-transparente
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 20,
  },
  map: {
    width: '100%',
    height: 300,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
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