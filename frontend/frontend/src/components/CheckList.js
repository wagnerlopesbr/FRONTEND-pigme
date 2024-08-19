import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getPkList } from '../utils/crud_actions';
import { tokenAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'react-native-elements';


const CheckList = ({ route }) => {
  const { listId } = route.params;
  const [token] = useAtom(tokenAtom);
  const [list, setList] = useState({
    title: '',
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  const fetchList = async () => {
    try {
      const response = await getPkList(listId, token);
      setList({
        title: response.title || '',
        products: response.products || [],
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar lista:', error.message || error);
    }
  };

  useEffect(() => {
    fetchList();
  }, [listId]);

  const cleanSelection = () => {
    setSelectedProducts([]);
  };

  const toggleProductSelection = (product) => {
    setSelectedProducts(prevSelectedProducts => {
      if (prevSelectedProducts.some(p => p.id === product.id)) {
        return prevSelectedProducts.filter(p => p.id !== product.id);
      } else {
        return [...prevSelectedProducts, product];
      }
    });
  };

  const renderProduct = ({ item, index }) => {
    const isSelected = selectedProducts.some(p => p.id === item.id);
    const backgroundColor = isSelected ? '#EFA654' : index % 2 === 0 ? '#FFF0F0' : '#FFF6F6';
    return (
      <TouchableOpacity
        style={[styles.productContainer, { backgroundColor }]}
        onPress={() => toggleProductSelection(item)}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productText}>
            {item.title || item.name} - {item.brand}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: 100,
            marginRight: -10,
          }}
          onPress={() => toggleProductSelection(item)}
        >
          <CheckBox
            checked={selectedProducts.some(p => p.id === item.id)}
            onPress={() => toggleProductSelection(item)}
            containerStyle={styles.checkboxContainer}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[ styles.label, { paddingTop: 30, paddingBottom: 3 }]}>
          Lista: {list.title}
        </Text>
        <TouchableOpacity onPress={cleanSelection}>
          <Icon name="broom" size={25} color='black' marginRight={10} marginTop={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={list.products}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>Não há produtos na lista.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    marginVertical: 0,
    padding: 0,
    paddingVertical: 3,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 25,
    backgroundColor: '#FDFAFF',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingTop: 30,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingLeft: 5,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  productText: {
    fontSize: 15,
    marginRight: 8,
    flex: 1,
  },
  quantityInput: {
    width: 120,
    height: 40,
    marginRight: 8,
  },
  inputStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 0,
  },
  removeText: {
    color: 'red',
  },
  Button: {
    marginTop: 10,
    backgroundColor: 'red',
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  }
});

export default CheckList;
