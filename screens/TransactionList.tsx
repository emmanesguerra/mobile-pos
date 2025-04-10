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
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';


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
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const offset = (currentPage - 1) * itemsPerPage;

        const fetchedOrders = await getOrders(database, searchQuery, itemsPerPage, offset);
        setOrders(fetchedOrders);

        const fetchedTotalOrders = await getTotalOrders(database, searchQuery);
        setTotalOrders(fetchedTotalOrders);

      } catch (error) {
        alert('Error fetching data: ' + error);
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
    { field: 'paidAmount', label: 'Paid Amount (₱)' },
    { field: 'total', label: 'Total Amount (₱)' },
    { field: 'change', label: 'Change Amount (₱)' },
    { field: 'actions', label: 'Actions' },
  ];

  const filteredOrders = orders
    .map((order) => ({
      id: order.id,
      ref_no: order.ref_no,
      total: order.total,
      paidAmount: order.paidAmount,
      change: order.paidAmount - order.total,
      date: formatDate(order.created_at),
      actions: (
        <TouchableOpacity onPress={() => handleViewOrder(order)}>
          <Fontisto name="preview" size={24} color="black" />
        </TouchableOpacity>
      ),
      changeStyle: order.paidAmount - order.total < 0 ? { color: 'red', fontWeight: 'bold' as 'bold' } : { color: 'green', fontWeight: 'bold' as 'bold' },
    }))
    .filter((order) => {
      if (filterType === 'negativeChange') {
        return order.change < 0;
      } else if (filterType === 'positiveChange') {
        return order.change > 0;
      } else {
        return true;
      }
    });

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

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

  const handleClearSearch = () => {
    setSearchQuery(''); // Clear search query when button is pressed
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>

        <View style={styles.searchAndButtons}>
          <View style={styles.searchWrapper}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search orders..."
                value={searchQuery}
                onChangeText={handleSearchChange}
              />

              {searchQuery ? (
                <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                  <AntDesign name="closecircle" size={20} color="#888" />
                </TouchableOpacity>
              ) : null}
            </View>

            <Picker
              selectedValue={filterType}
              style={styles.picker}
              onValueChange={(itemValue) => setFilterType(itemValue)}
            >
              <Picker.Item label="Display All" value="all" />
              <Picker.Item label="Excess Payment" value="positiveChange" />
              <Picker.Item label="Insufficient Payment" value="negativeChange" />
            </Picker>
          </View>
        </View>

        {/* Table for Orders */}
        <TableComponent
          headers={orderHeaders}
          data={filteredOrders.map((order) => ({
            id: order.id,
            ref_no: order.ref_no,
            total: (
              <Text style={{ color: 'green', fontWeight: 'bold' }}>₱{order.total.toFixed(2)}</Text> // Apply red text style if negative
            ),
            paidAmount: (
              <Text>₱{order.paidAmount.toFixed(2)}</Text> // Apply red text style if negative
            ),
            change: (
              <Text style={order.changeStyle}>₱{order.change.toFixed(2)}</Text>
            ),
            date: order.date,
            actions: order.actions,
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
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  inputWrapper: {
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
  picker: {
    width: 300,
    marginLeft: 10,
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
