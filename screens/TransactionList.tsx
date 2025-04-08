import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getOrders, getOrderItems, getTotalOrders, updateOrder } from '@/src/database/orders';
import { useSQLiteContext } from 'expo-sqlite';
import { formatDate } from '@/src/services/dateService';
import TableComponent from '@/components/Tables/TableComponent';
import PaginationControls from '@/components/Tables/PaginationControls';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import Fontisto from '@expo/vector-icons/Fontisto';
import ModalComponent from '@/components/ModalComponent';
import OrderComponent from '@/components/Order/OrderComponent';


export default function TransactionLists() {
  const database = useSQLiteContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const { itemsPerPage, orderRefresh, setOrderRefresh } = useSettingsContext();
  const [paidAmount, setPaidAmount] = useState(0);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;

        const fetchedOrders = await getOrders(database, searchQuery, itemsPerPage, offset);
        setOrders(fetchedOrders);

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
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setPaidAmount(order.paidAmount);
    setNote(order.note);

    const fetchedOrderItems = await getOrderItems(database, order.id);
    setOrderItems(fetchedOrderItems);

    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const orderHeaders = [
    { field: 'date', label: 'Order Date' },
    { field: 'ref_no', label: 'Reference Number' },
    { field: 'total', label: 'Total Amount (₱)' },
    { field: 'paidAmount', label: 'Paid Amount (₱)' },
    { field: 'actions', label: 'Actions' },
  ];

  const totalPages = Math.ceil(totalOrders / itemsPerPage);

  const handleSave = async () => {
    try {
      const orderId = selectedOrder.id;

      await updateOrder(database, orderId, paidAmount, note);

      setPaidAmount(0);
      setNote('');
      setModalVisible(false);
      setOrderRefresh(true);

    } catch (error) {
      alert('Failed to update the order. Please try again.');
    }
  };

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
            date: formatDate(order.created_at),
            actions: (
              <TouchableOpacity onPress={() => handleViewOrder(order)}>
                <Fontisto name="preview" size={24} color="black" />
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


        <ModalComponent
          isVisible={modalVisible}
          title="Order Details"
          onClose={handleCloseModal}
          onSave={handleSave}
        >
          {selectedOrder && (
            <View style={styles.modalContent}>
              <OrderComponent
                selectedOrder={selectedOrder}
                paidAmount={paidAmount}
                note={note}
                setPaidAmount={setPaidAmount}
                setNote={setNote}
              />

              <View style={styles.tableContainer}>
                <TableComponent
                  headers={[
                    { field: 'product_name', label: 'Product' },
                    { field: 'quantity', label: 'Quantity' },
                    { field: 'price', label: 'Price' },
                  ]}
                  data={orderItems.map((item) => ({
                    product_name: item.product_name,
                    quantity: item.quantity,
                    price: item.price,
                    id: item.id,
                  }))}
                />
              </View>
            </View>
          )}
        </ModalComponent>

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

  modalContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    gap: 20
  },
  tableContainer: {
    flex: 1,
    padding: 0,
  },
});
