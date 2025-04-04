import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getProducts, getTotalProductsCount } from '@/src/database/products'; // Assuming getTotalProductsCount is added
import { useSQLiteContext } from 'expo-sqlite';
import { formatDate } from '@/src/services/dateService';

export default function InventoryLists() {
  const database = useSQLiteContext();
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [totalProducts, setTotalProducts] = useState(0);

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
  }, [searchQuery, currentPage]);  // Fetch data when either searchQuery or currentPage changes

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 whenever search query changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderProduct = ({ item, index }: { item: any; index: number }) => (
    <View
      style={[
        styles.row,
        {
          backgroundColor: index % 2 === 0 ? '#FFF' : '#F5EEDC', // Change color for odd/even rows
        },
      ]}
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

        {/* Search Field */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />

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
            style={[
              styles.button,
              { backgroundColor: currentPage === 1 ? '#ccc' : '#27548A' }, // Change color for "Previous" button
            ]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1} // Disable "Previous" button on 1st page
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
          <Text style={styles.pageNumber}>
            Page {currentPage} of {totalPages}
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: currentPage === totalPages ? '#ccc' : '#27548A' }, // Change color for "Next" button
            ]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages} // Disable "Next" button on last page
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 18
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
    fontSize: 18
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    padding: 8,
    fontSize: 18,
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
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
