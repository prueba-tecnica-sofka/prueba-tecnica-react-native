import React, { useEffect, useState } from 'react';  
import {  
  View,  
  Text,  
  FlatList,  
  TouchableOpacity,  
  ActivityIndicator,  
  TextInput,  
} from 'react-native';  
import { useNavigation } from '@react-navigation/native';  
import { theme } from '../../theme';
import { FloatingActionButton } from '../../components/common/FloatingButton/FloatingButton';
import ResultCounter from '../../components/products/ResultCounter/ResultCounter';
import { productListScreenStyles as styles, searchInputPlaceholderColor } from './ProductListScreen.styles';
  
interface Product {  
  id: string;  
  name: string;  
  description: string;  
  logo: string;  
  date_release: string;  
  date_revision: string;  
}  
  
interface ProductListScreenProps {  
  // Props pueden ser agregadas según necesidad  
}  
  
const ProductListScreen: React.FC<ProductListScreenProps> = () => {  
  const navigation = useNavigation<any>();  
  const [products, setProducts] = useState<Product[]>([]);  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);  
  const [searchTerm, setSearchTerm] = useState('');  
  const [isLoading, setIsLoading] = useState(true);  
  const [error, setError] = useState<string | null>(null);  
  
  // Fetch products from API  
  useEffect(() => {  
    fetchProducts();  
  }, []);  
  
  // Filter products based on search term  
  useEffect(() => {  
    if (searchTerm.trim() === '') {  
      setFilteredProducts(products);  
    } else {  
      const filtered = products.filter(  
        (product) =>  
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||  
          product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||  
          product.description.toLowerCase().includes(searchTerm.toLowerCase())  
      );  
      setFilteredProducts(filtered);  
    }  
  }, [searchTerm, products]);  
  
  const fetchProducts = async () => {  
    try {  
      setIsLoading(true);  
      setError(null);  
      const response = await fetch('http://localhost:3002/bp/products');  
        
      if (!response.ok) {  
        throw new Error('Error al cargar productos');  
      }  
        
      const data = await response.json();  
      setProducts(data.data || []);  
      setFilteredProducts(data.data || []);  
    } catch (err) {  
      setError(err instanceof Error ? err.message : 'Error desconocido');  
    } finally {  
      setIsLoading(false);  
    }  
  };  
  
  const handleProductPress = (product: Product) => {  
    navigation.navigate('ProductDetail', { productId: product.id });  
  };  
  
  const renderProductCard = ({ item }: { item: Product }) => (  
    <TouchableOpacity  
      style={styles.productCard}  
      onPress={() => handleProductPress(item)}  
      testID={`product-card-${item.id}`}  
    >  
      <View style={styles.cardHeader}>  
        <Text style={styles.productId}>{item.id}</Text>  
      </View>  
      <Text style={styles.productName}>{item.name}</Text>  
      <Text style={styles.productDescription} numberOfLines={2}>  
        {item.description}  
      </Text>  
      <View style={styles.cardFooter}>  
        <Text style={styles.dateText}>  
          Liberación: {new Date(item.date_release).toLocaleDateString()}  
        </Text>  
      </View>  
    </TouchableOpacity>  
  );  
  
  const renderEmptyState = () => (  
    <View style={styles.emptyState}>  
      <Text style={styles.emptyStateText}>  
        {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}  
      </Text>  
    </View>  
  );  
  
  const renderErrorState = () => (  
    <View style={styles.errorState}>  
      <Text style={styles.errorText}>{error}</Text>  
      <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>  
        <Text style={styles.retryButtonText}>Reintentar</Text>  
      </TouchableOpacity>  
    </View>  
  );  
  
  if (isLoading) {  
    return (  
      <View style={styles.loadingContainer}>  
        <ActivityIndicator size="large" color={theme.colors.primary} />  
        <Text style={styles.loadingText}>Cargando productos...</Text>  
      </View>  
    );  
  }  
  
  return (  
    <View style={styles.container}>  
      {/* Header con título y contador */}  
      <View style={styles.header}>  
        <Text style={styles.headerTitle}>Productos Financieros</Text>  
        <ResultCounter count={filteredProducts.length} />
      </View>  
  
      {/* Search Bar */}  
      <View style={styles.searchContainer}>  
        <TextInput  
          style={styles.searchInput}  
          placeholder="Buscar productos..."  
          placeholderTextColor={searchInputPlaceholderColor}
          value={searchTerm}  
          onChangeText={setSearchTerm}  
          testID="search-input"  
        />  
        {searchTerm.length > 0 && (  
          <TouchableOpacity  
            style={styles.clearButton}  
            onPress={() => setSearchTerm('')}  
            testID="clear-search"  
          >  
            <Text style={styles.clearButtonText}>✕</Text>  
          </TouchableOpacity>  
        )}  
      </View>  
  
      {/* Product List */}  
      {error ? (  
        renderErrorState()  
      ) : (  
        <FlatList  
          data={filteredProducts}  
          renderItem={renderProductCard}  
          keyExtractor={(item) => item.id}  
          contentContainerStyle={  
            filteredProducts.length === 0 ? styles.emptyList : styles.list  
          }  
          ListEmptyComponent={renderEmptyState}  
          testID="product-list"  
        />  
      )}  
  
      {/* Floating Action Button para agregar */}  
      <FloatingActionButton
        onPress={() => navigation.navigate('ProductForm', { mode: 'create' })}
        testID="add-product-button"
        accessibilityLabel="Agregar producto"
      />
    </View>  
  );  
};  
  

  
export default ProductListScreen;