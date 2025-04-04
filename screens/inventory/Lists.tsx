import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getProducts, getTotalProductsCount } from '@/src/database/products';
import { useSQLiteContext } from 'expo-sqlite';
import { formatDate } from '@/src/services/dateService';
import { getLowStockProducts } from '@/src/database/products';

export default function InventoryLists() {
  const database = useSQLiteContext();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [threshold, setThreshold] = useState(50);

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
  }, [searchQuery, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 whenever search query changes
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

  const renderProduct = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[styles.row, { backgroundColor: index % 2 === 0 ? '#FFF' : '#F5EEDC' }]}
    >
      <Text style={styles.cell}>{formatDate(item.updated_at)}</Text>
      <Text style={styles.cell}>{item.product_code}</Text>
      <Text style={styles.cell}>{item.product_name}</Text>
      <Text style={styles.cell}>{item.stock}</Text>
      <Text style={styles.cell}>{item.price}</Text>
    </View>
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>

        {/* Search Field and Action Buttons */}
        <View style={styles.searchAndButtons}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />

          <TouchableOpacity
            style={[styles.button, styles.displayButton]}
            onPress={handleDisplayLowStock}
          >
            <Text style={[styles.buttonText, styles.searchText]}>Insufficient Stocks</Text>
          </TouchableOpacity>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerText}>Date Updated</Text>
          <Text style={styles.headerText}>Product Code</Text>
          <Text style={styles.headerText}>Product Name</Text>
          <Text style={styles.headerText}>Stock</Text>
          <Text style={styles.headerText}>Price (₱)</Text>
        </View>

        {/* Table Rows */}
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />

        {/* Pagination Controls */}
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentPage === 1 ? '#ccc' : '#27548A' }]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: currentPage === totalPages ? '#ccc' : '#27548A' }]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Low Stock Products */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Low Stock Products</Text>

            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Product Name</Text>
              <Text style={styles.tableHeaderText}>Stock</Text>
              <Text style={styles.tableHeaderText}>Price (₱)</Text>
            </View>

            {/* Table Rows */}
            <FlatList
              data={lowStockProducts}
              renderItem={({ item }) => {
                return (
                  <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.product_name}</Text>
                    <Text style={styles.tableCell}>{item.stock}</Text>
                    <Text style={styles.tableCell}>₱{item.price.toFixed(2)}</Text>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsModalVisible(false)} // Close the modal
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchAndButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#27548A',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    fontSize: 18,
    color: '#333',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  pageNumber: {
    fontSize: 16,
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
  searchText: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    width: '33%',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    textAlign: 'center',
    fontSize: 16,
    width: '33%',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});