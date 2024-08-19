import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getPkList } from '../utils/crud_actions';
import { tokenAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'react-native-elements';

const PremiumCheckList = ({ route }) => {
  const { listId } = route.params;
  const { supermarketId } = route.params;
  const [token] = useAtom(tokenAtom);
  const [list, setList] = useState({
    title: '',
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [partialPrice, setPartialPrice] = useState(0);

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

  const getPriceForSupermarket = (product) => {
    return product.prices[supermarketId] || 0;
  };

  const calculateTotalPrice = (supermarketId) => {
    return list.products.reduce((total, product) => {
      const price = product.prices[supermarketId];
      return total + (price || 0) * product.quantity;
    }, 0);
  };

  const stringifiedPrice = (price) => {
    const strPrice = price.toString();
    const stringifiedPrice = strPrice.slice(0, -2) + ',' + strPrice.slice(-2);
    return stringifiedPrice;
  };

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

  const calculatePartialPrice = () => {
    const total = selectedProducts.reduce((sum, product) => {
      const price = getPriceForSupermarket(product);
      return sum + price * product.quantity;
    }, 0);
    setPartialPrice(total);
  };

  useEffect(() => {
    calculatePartialPrice();
  }, [selectedProducts]);

  const renderProduct = ({ item, index }) => {
  const isSelected = selectedProducts.some(p => p.id === item.id);
  const backgroundColor = isSelected ? '#EFA654' : index % 2 === 0 ? '#FFF0F0' : '#FFF6F6';
  const productPrice = getPriceForSupermarket(item);
  return (
    <TouchableOpacity
      style={[styles.productContainer, { backgroundColor }]}
      onPress={() => toggleProductSelection(item)}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productText}>
          <Text style={{ fontWeight: 'bold' }}>
            {item.quantity}x {' '}
          </Text>{item.title}
          {'\n'}
          <Text style={{ fontWeight: 'bold', color: '#4A3E54' }}>{item.brand.toUpperCase()}</Text>
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={{ fontWeight: 'bold' }}>{`R$ ${stringifiedPrice(productPrice)}`}</Text>
        <CheckBox
          checked={selectedProducts.some(p => p.id === item.id)}
          onPress={() => toggleProductSelection(item)}
          containerStyle={styles.checkboxContainer}
        />
      </View>
    </TouchableOpacity>
  );
};

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={[styles.label, { paddingTop: 30, paddingBottom: 3 }]}>
            Lista: {list.title}
            <Text style={[
              styles.priceText,
              {
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: 14,
                color: '#656565'
              }
            ]}>
              {`  Total: `}{`(R$ ${stringifiedPrice(calculateTotalPrice(supermarketId))})`}
            </Text>
          </Text>
          <View>
            <Text style={{
              marginTop: -10,
              fontSize: 20,
              fontWeight: 'bold',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              Parcial: {' '}
              <Text style={{ fontSize: 25, color: 'orange', backgroundColor: 'black' }}>
                {` R$ ${stringifiedPrice(partialPrice)} `}
              </Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={cleanSelection}>
          <Icon name="broom" size={25} color='black' marginRight={10} marginTop={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={{
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 2,
          marginVertical: 10,
        }}
        data={list.products}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>Não há produtos na lista.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  priceText: {
    marginTop: -10,
  },
   priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
    marginRight: -5,
  },
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
    backgroundColor: '#EFE6F6',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingTop: 300,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 10,
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

export default PremiumCheckList;
