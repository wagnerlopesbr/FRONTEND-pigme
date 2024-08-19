import axios from 'axios';
import Constants from 'expo-constants';

const API_PRODUCTS_URL = Constants.expoConfig.extra?.API_PRODUCTS_URL;

const getProductsAPI = async () => {
  try {
    if (!API_PRODUCTS_URL) {
      throw new Error('API_PRODUCTS_URL não está definida nas constantes de configuração.');
    }

    // Fetch all the data
    const response = await axios.get(`${API_PRODUCTS_URL}`);
    const data = response.data;

    // Create a map for brands and categories for easy lookup
    const brandsMap = new Map(data.brands.map(brand => [brand.id, brand.name]));
    const categoriesMap = new Map(data.categories.map(category => [category.id, category.name]));

    // Map products to include brand and category names instead of IDs
    const productsWithNames = data.products.map(product => ({
      ...product,
      brand: brandsMap.get(product.brand_id),
      category: categoriesMap.get(product.category_id),
    }));

    return {
      ...data,
      products: productsWithNames,
      supermarkets: response.data.supermarkets,
    };

  } catch (error) {
    console.error('Erro ao buscar produtos:', error.message || error);
    throw error;
  }
};

export { getProductsAPI };
