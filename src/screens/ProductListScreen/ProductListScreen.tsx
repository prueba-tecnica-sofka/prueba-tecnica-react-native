import React from 'react';
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
import type { Product } from '../../api/types';
import { useProducts } from '../../hooks/useProducts';
  
interface ProductListScreenProps {  
  // Props pueden ser agregadas según necesidad  
}  
  
const ProductListScreen: React.FC<ProductListScreenProps> = () => {  
  const navigation = useNavigation<any>();  
  const {
    filteredProducts,
    searchTerm,
    isLoading,
    error,
    setSearchTerm,
    refreshProducts,
  } = useProducts();
  
  const handleProductPress = (product: Product) => {  
    navigation.navigate('ProductDetail', { productId: product.id });  
  };  
  
  const renderProductCard = ({ item }: { item: Product }) => (  
    <TouchableOpacity  
      style={styles.productCard}  
      onPress={() => handleProductPress(item)}  
      testID={`product-card-${item.id}`}  
    >  
      <View style={styles.productInfo}>  
        <Text style={styles.productName}>{item.name}</Text>  
        <Text style={styles.productId}>ID: {item.id}</Text>  
      </View>  
      <Text style={styles.productChevron}>›</Text>
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
      <TouchableOpacity style={styles.retryButton} onPress={() => void refreshProducts()}>  
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
      <View style={styles.brandHeader}>
        <Text style={styles.brandTitle}>BANCO</Text>
      </View>

      <View style={styles.searchSection}>  
        <ResultCounter count={filteredProducts.length} />
      </View>

      <View style={styles.searchContainer}>  
        <TextInput  
          style={styles.searchInput}  
          placeholder="Search..."  
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
  
      {error ? (  
        renderErrorState()  
      ) : (  
        <FlatList  
          data={filteredProducts}  
          renderItem={renderProductCard}  
          keyExtractor={(item) => item.id}  
          onRefresh={() => void refreshProducts()}
          refreshing={isLoading}
          contentContainerStyle={  
            filteredProducts.length === 0 ? styles.emptyList : styles.list  
          }  
          ListEmptyComponent={renderEmptyState}  
          testID="product-list"  
        />  
      )}  
  
      <FloatingActionButton
        onPress={() => navigation.navigate('ProductForm', { mode: 'create' })}
        testID="add-product-button"
        accessibilityLabel="Agregar producto"
      />
    </View>  
  );  
};  
  

  
export default ProductListScreen;