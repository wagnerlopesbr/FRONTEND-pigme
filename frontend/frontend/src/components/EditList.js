import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getLists, updateList, getPkList } from '../utils/crud_actions';
import { getProductsWithNames } from '../utils/api_products_actions';
import { tokenAtom, userAtom, productsAtom } from '../utils/jotai';
import { useAtom } from 'jotai/react';
import { Picker } from '@react-native-picker/picker';

const EditList = ({ route }) => {
  const [token, setToken] = useAtom(tokenAtom);
  const [user, setUser] = useAtom(userAtom);
  const navigation = useNavigation();
  const { listId } = route.params;

  const [listData, setListData] = useState({
    title: '',
    products: [],
  });
  const [loading, setLoading] = useState(true);
  const [productsApiData, setProductsApiData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchList = async () => {
    try {
      const response = await getPkList(listId, token);
      setListData({
        title: response.title || '',
        products: response.products || [],
      });
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar lista:', error.message || error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProductsWithNames();
      setProductsApiData(response.products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error.message || error);
    }
  };

  useEffect(() => {
    fetchList();
    fetchProducts();
  }, [listId]);

  const handleInputChange = (field, value) => {
    setListData({ ...listData, [field]: value });
  };

  const handleSave = async () => {
    try {
      await updateList(listId, listData, token);
      Alert.alert('Sucesso', 'Lista atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a lista.');
    }
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      const product = productsApiData.find(p => p.id === selectedProduct);
      if (product) {
        setListData(prevList => ({
          ...prevList,
          products: [
            ...prevList.products,
            {
              title: product.name,
              price: product.price,
              brand: product.brand,
              category: product.category,
            },
          ],
        }));
      }
      setSelectedProduct(null); // Clear selection
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={listData.title}
        onChangeText={(text) => handleInputChange('title', text)}
      />
      <Text style={styles.label}>Produtos:</Text>
      
      {/* Dropdown to select product */}
      <View style={styles.dropdownContainer}>
        <Text style={styles.label}>Adicionar Produto:</Text>
        <Picker
          selectedValue={selectedProduct}
          onValueChange={(itemValue) => setSelectedProduct(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione um produto" value={null} />
          {productsApiData.map(product => (
            <Picker.Item key={product.id} label={product.name} value={product.id} />
          ))}
        </Picker>
        <Button title="Adicionar" onPress={handleAddProduct} />
      </View>

      {listData.products.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <TextInput
            style={styles.productInput}
            value={product.title}
            onChangeText={(text) => {
              const updatedProducts = [...listData.products];
              updatedProducts[index].title = text;
              setListData({ ...listData, products: updatedProducts });
            }}
            placeholder="Título do Produto"
          />
          <TextInput
            style={styles.productInput}
            value={String(product.price)}
            onChangeText={(text) => {
              const updatedProducts = [...listData.products];
              updatedProducts[index].price = Number(text);
              setListData({ ...list, products: updatedProducts });
            }}
            placeholder="Preço do Produto"
            keyboardType="numeric"
          />
        </View>
      ))}
      <Button title="Salvar" onPress={handleSave} />
    </ScrollView>
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
    marginBottom: 16,
  },
  productInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default EditList;
