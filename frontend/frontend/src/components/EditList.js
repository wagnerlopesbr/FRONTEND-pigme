import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getLists, updateList, getPkList } from '../utils/crud_actions';
import ProductsSelection from './ProductsSelection';
import { tokenAtom, userAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import InputSpinner from 'react-native-input-spinner';

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
    try {
      const transformedProducts = list.products.map(product => ({
        title: product.name || product.title,
        price: product.price,
        brand: product.brand,
        quantity: product.quantity || 1,
        id: product.id,
      }));

      const updatedList = { ...list, transformedProducts };
      console.log('updatedList:', updatedList);

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
    console.log('transformedProducts:', transformedProducts);
    setList(prevState => ({
      ...prevState,
      products: [...prevState.products, ...transformedProducts]
    }));
    console.log('list agora', list);
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

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <View style={styles.productInfo}>
        <InputSpinner
          min={1}
          step={1}
          value={item.quantity}
          onChange={(qtt) => handleQuantityChange(item.id, qtt)}
          style={styles.quantityInput}
          buttonStyle={styles.spinnerButton}
          textColor='#000'
          inputStyle={styles.inputStyle}
        />
        <Text style={styles.productText}>
          {item.title || item.name} - {item.brand}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveProduct(item.id)}>
        <Text style={styles.removeText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

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
      <Text style={styles.label}>Produtos:</Text>
      <FlatList
        data={list.products}
        keyExtractor={item => item.id}
        renderItem={renderProduct}
        ListEmptyComponent={<Text>Não há produtos na lista.</Text>}
      />
      <Button title="Adicionar Produtos" onPress={toggleModal} />
      <Button title="Salvar" onPress={handleSave} />

      <ProductsSelection
        isVisible={isModalVisible}
        onClose={toggleModal}
        onAddProducts={handleAddProducts}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
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
  spinnerButton: {
    backgroundColor: '#ddd',
  },
  inputStyle: {
    fontSize: 16,
    textAlign: 'center',
    padding: 0,
  },
  removeText: {
    color: 'red',
  },
});

export default EditList;
