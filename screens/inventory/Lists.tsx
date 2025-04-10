import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getProducts, getTotalProductsCount, getLowStockProducts } from '@/src/database/products';
import { getSettingValue } from '@/src/database/settings';
import { useSQLiteContext } from 'expo-sqlite';
import { formatDate } from '@/src/services/dateService';
import TableComponent from '@/components/Tables/TableComponent';
import PaginationControls from '@/components/Tables/PaginationControls';
import ModalComponent from '@/components/ModalComponent';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';

export default function InventoryLists() {
  const database = useSQLiteContext();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { threshold, itemsPerPage, productRefresh, setProductRefresh } = useSettingsContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;

        // Fetch products based on pagination and search query
        const fetchedProducts = await getProducts(database, searchQuery, itemsPerPage, offset);
        setProducts(fetchedProducts);

        // Get the total number of products to calculate total pages
        const fetchedTotalProducts = await getTotalProductsCount(database, searchQuery);
        setTotalProducts(fetchedTotalProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchData();
    if (productRefresh) {
      setProductRefresh(false);
    }
  }, [searchQuery, itemsPerPage, currentPage, productRefresh, setProductRefresh]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 whenever search query changes
  };

  const handleClearSearch = () => {
    setSearchQuery(''); // Clear search query when button is pressed
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Fetch low stock products and show modal
  const handleDisplayLowStock = async () => {
    try {
      const lowStock = await getLowStockProducts(database, threshold); // Fetch products with low stock
      setLowStockProducts(lowStock);
      setIsModalVisible(true);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    }
  };

  const inventoryHeaders = [
    { field: 'updated_at', label: 'Updated Date' },
    { field: 'product_code', label: 'Product Code' },
    { field: 'product_name', label: 'Product Name' },
    { field: 'stock', label: 'Stock' },
    { field: 'price', label: 'Price (₱)' },
    { field: 'action', label: 'Action' }
  ];

  const lowStockHeaders = [
    { field: 'product_name', label: 'Product Name' },
    { field: 'stock', label: 'Stock' },
    { field: 'price', label: 'Price (₱)' }
  ];

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const goToEditForm = (id: number) => {
    router.push(`/${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Search and action buttons */}
        <View style={styles.searchAndButtons}>
          <View style={styles.searchWrapper}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                <AntDesign name="closecircle" size={20} color="#888" />
              </TouchableOpacity>
            ) : null}
          </View>

          <TouchableOpacity
            style={[styles.button, styles.displayButton]}
            onPress={handleDisplayLowStock}
          >
            <Text style={[styles.buttonText]}>Insufficient Stocks</Text>
          </TouchableOpacity>
        </View>

        {/* Product Table */}
        <TableComponent
          headers={inventoryHeaders}
          data={products.map((product) => ({
            updated_at: formatDate(product.updated_at),
            product_code: product.product_code,
            product_name: product.product_name,
            stock: product.stock,
            price: product.price,
            id: product.id,
            action: (
              <TouchableOpacity onPress={() => goToEditForm(product.id)}>
                <AntDesign name="edit" size={24} color="black" />
              </TouchableOpacity>
            ),
          }))}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Modal to show low stock products */}
        <ModalComponent
          isVisible={isModalVisible}
          title="Low Stock Products"
          onClose={() => setIsModalVisible(false)}
        >
          <TableComponent
            headers={lowStockHeaders}
            data={lowStockProducts.map((item) => ({
              product_name: item.product_name,
              stock: item.stock,
              price: item.price,
              id: item.id,
            }))}
          />
        </ModalComponent>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#DDA853',
  },
  innerContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 5,
  },
  searchAndButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    width: 300, 
    height: 50,
  },
  clearButton: {
    marginLeft: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#27548A',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  displayButton: {
    backgroundColor: '#8E1616',
    marginLeft: 10,
    marginTop: 0,
  },
});
