import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { useAtom } from 'jotai/react';
import { tokenAtom } from '../utils/jotai';
import { getProductsAPI } from '../utils/api_products_actions';
import { CheckBox } from 'react-native-elements';

const { width } = Dimensions.get('window');

const ProductsSelection = ({ isVisible, onClose, onAddProducts }) => {
  const [token] = useAtom(tokenAtom);
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(new Set()); // Set instead of array because it's faster for lookups (O(1) vs O(n))

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsAPI();
        setProducts(response.products);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error.message || error);
      }
    };
    fetchProducts();
  }, []);

  // Memoizing the filtered products to avoid re-filtering on every render
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Using useCallback to memoize the function and avoid re-renders
  const toggleProductSelection = useCallback((product) => {
    setSelectedProducts(prevSelectedProducts => {
      const newSelectedProducts = new Set(prevSelectedProducts);
      if (newSelectedProducts.has(product.id)) {
        newSelectedProducts.delete(product.id);
      } else {
        newSelectedProducts.add(product.id);
      }
      return newSelectedProducts;
    });
  }, []);

  const handleAddProducts = useCallback(() => {
    if (selectedProducts.size > 0) {
      const productsToAdd = Array.from(selectedProducts).map(id =>
        products.find(product => product.id === id)
      );
      onAddProducts(productsToAdd);
    }
    setSelectedProducts(new Set());
    onClose();
  }, [selectedProducts, products, onAddProducts, onClose]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      animationIn='fadeIn'
      animationOut='fadeOut'
    >
      <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
        <View style={styles.container}>
          <Text style={styles.title}>Selecione o Produto</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            style={{ borderTopWidth: 1, borderTopColor: '#ddd', width: '100%' }}
            data={filteredProducts}
            keyExtractor={item => item.id}
            extraData={selectedProducts}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.productContainer,
                  {
                    backgroundColor: selectedProducts.has(item.id) ? '#E0E0E0' : 'white',
                  },
                ]}
                onPress={() => toggleProductSelection(item)}
              >
                <Text style={styles.productText}>{item.name} - {item.brand}</Text>
                <CheckBox
                  checked={selectedProducts.has(item.id)}
                  onPress={() => toggleProductSelection(item)}
                  containerStyle={styles.checkboxContainer}
                />
              </TouchableOpacity>
            )}
          />
          <View style={styles.actions}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleAddProducts}>
              <Text style={styles.buttonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    height: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  productText: {
    fontSize: 16,
    width: width * 0.7,
  },
  checkboxContainer: {
    marginVertical: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProductsSelection;
