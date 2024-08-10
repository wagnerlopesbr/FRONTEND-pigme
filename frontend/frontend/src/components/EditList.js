import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getLists, updateList, getPkList } from '../utils/crud_actions';
import ProductsSelection from './ProductsSelection';
import { tokenAtom, userAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import InputSpinner from 'react-native-input-spinner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const EditList = ({ route }) => {
  const [token] = useAtom(tokenAtom);
  const [user] = useAtom(userAtom);
  const navigation = useNavigation();
  const { listId } = route.params;

  const [list, setList] = useState({
    title: '',
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
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

  const handleInputChange = (field, value) => {
    setList({ ...list, [field]: value });
  };

  const handleSave = async () => {
  if (list.products.length > 40) {
    Alert.alert(
      'Limite Excedido',
      'Você não pode adicionar mais de 40 produtos à lista.',
      [{ text: 'OK' }]
    );
    return;
  }

  try {
    const transformedProducts = list.products.map(product => ({
      title: product.name || product.title,
      price: product.price,
      brand: product.brand,
      quantity: product.quantity || 1,
      id: product.id,
    }));

    const updatedList = { ...list, transformedProducts };

    await updateList(listId, updatedList, token);
    Alert.alert('Sucesso', 'Lista atualizada com sucesso!', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível atualizar a lista.');
  }
};


  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleAddProducts = (products) => {
    const transformedProducts = products.map(product => ({
      brand: product.brand,
      price: product.price,
      title: product.name || product.title,
      quantity: product.quantity || 1,
      id: product.id,
    }));
    setList(prevState => ({
      ...prevState,
      products: [...prevState.products, ...transformedProducts]
    }));
    toggleModal();
  };

  const handleQuantityChange = (id, quantity) => {
    setList(prevState => ({
      ...prevState,
      products: prevState.products.map(product =>
        product.id === id ? { ...product, quantity } : product
      )
    }));
  };

  const handleRemoveProduct = (id) => {
    setList(prevState => ({
      ...prevState,
      products: prevState.products.filter(product => product.id !== id)
    }));
  };

  const renderProduct = ({ item, index }) => {
    const backgroundColor = index % 2 === 0 ? '#FFF0F0' : '#FFF6F6';
    return (
      <View style={[styles.productContainer, { backgroundColor }]}>
        <View style={styles.productInfo}>
          <InputSpinner
            height={25}
            buttonFontSize={10}
            buttonTextColor='black'
            background={backgroundColor}
            arrows={true}
            min={1}
            step={1}
            value={item.quantity}
            onChange={(qtt) => handleQuantityChange(item.id, qtt)}
            style={styles.quantityInput}
            buttonStyle={{ backgroundColor, width: 50 }}
            textColor='#000'
            inputStyle={styles.inputStyle}
            rounded={false}
            containerProps={{ marginRight: -10, marginLeft: -10, paddingHorizontal: 50 }}
          />
          <Text style={styles.productText}>
            {item.title || item.name} - {item.brand}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleRemoveProduct(item.id)}>
          <Icon name="pail-remove-outline" size={25} color='black' marginRight={10} />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={list.title}
        onChangeText={(text) => handleInputChange('title', text)}
      />
      <View style={styles.headerContainer}>
        <Text style={[ styles.label, { paddingTop: 0, paddingBottom: 3 }]}>
          Produtos: <Text style={{ fontSize: 14, color: '#444', fontStyle: 'italic' }}>({list.products.length} no total)</Text>
        </Text>
        <TouchableOpacity onPress={toggleModal}>
          <Icon name="cart-plus" size={25} color='black' marginRight={10} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={list.products}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>Não há produtos na lista.</Text>}
      />
      
      <View style={{ paddingBottom: 20 }}>
        <Button title="Salvar" onPress={handleSave} />
      </View>

      <ProductsSelection
        isVisible={isModalVisible}
        onClose={toggleModal}
        onAddProducts={handleAddProducts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: '#FFF9F9',
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
    paddingVertical: -5,
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
    fontSize: 16,
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

export default EditList;
