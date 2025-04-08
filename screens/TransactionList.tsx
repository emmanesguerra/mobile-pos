import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getOrders, getOrderItems, getTotalOrders } from '@/src/database/orders';
import { useSQLiteContext } from 'expo-sqlite';
import { formatDate } from '@/src/services/dateService';
import TableComponent from '@/components/Tables/TableComponent';
import PaginationControls from '@/components/Tables/PaginationControls';
import { useSettingsContext } from '@/src/contexts/SettingsContext';

export default function TransactionLists() {
  const database = useSQLiteContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const { itemsPerPage, orderRefresh, setOrderRefresh } = useSettingsContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;

        // Fetch orders based on pagination and search query
        const fetchedOrders = await getOrders(database, searchQuery, itemsPerPage, offset);
        setOrders(fetchedOrders);

        // Get the total number of orders to calculate total pages
        const fetchedTotalOrders = await getTotalOrders(database, searchQuery);
        setTotalOrders(fetchedTotalOrders);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    if (orderRefresh) {
      setOrderRefresh(false);
    }
  }, [searchQuery, itemsPerPage, currentPage, orderRefresh, setOrderRefresh]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to page 1 whenever search query changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const orderHeaders = [
    { field: 'date', label: 'Order Date' },
    { field: 'ref_no', label: 'Reference Number' },
    { field: 'total', label: 'Total Amount (₱)' },
    { field: 'paidAmount', label: 'Paid Amount (₱)' },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>


        <View style={styles.searchAndButtons}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search orders..."
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>

        {/* Table for Orders */}
        <TableComponent
          headers={orderHeaders}
          data={orders.map((order) => ({
            id: order.id,
            ref_no: order.ref_no,
            total: order.total,
            paidAmount: order.paidAmount,
            date: formatDate(order.date), // Format the date as needed
          }))}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#046582',
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
    paddingHorizontal: 15,
    fontSize: 16,
    flex: 1,
  },
});
