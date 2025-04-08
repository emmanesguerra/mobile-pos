import { StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getOrders, getOrderItems } from '@/src/database/orders';
import { useSQLiteContext } from 'expo-sqlite';
import { formatDate } from '@/src/services/dateService';
import { useSettingsContext } from '@/src/contexts/SettingsContext';

export default function TransactionLists() {
  const database = useSQLiteContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const { itemsPerPage, orderRefresh, setOrderRefresh } = useSettingsContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders = await getOrders(database);
        const fetchedOrderItems = await getOrderItems(database);

        setOrders(fetchedOrders);
        setOrderItems(fetchedOrderItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    setOrderRefresh(false);
  }, [itemsPerPage, orderRefresh, setOrderRefresh]);

  // Render each order
  const renderOrders = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Order ID: {item.id}</Text>
      <Text style={styles.text}>Ref Code: {item.ref_no}</Text>
      <Text style={styles.text}>Total: ${item.total}</Text>
      <Text style={styles.text}>Date: {formatDate(item.date)}</Text>
    </View>
  );

  // Render each order item
  const renderOrderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.text}>Order Item ID: {item.id}</Text>
      <Text style={styles.text}>Order ID: {item.order_id}</Text>
      <Text style={styles.text}>Product ID: {item.product_id}</Text>
      <Text style={styles.text}>Quantity: {item.quantity}</Text>
      <Text style={styles.text}>Price: ${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction List</Text>

      <Text style={styles.sectionTitle}>Orders</Text>
      <FlatList
        data={orders}
        renderItem={renderOrders}
        keyExtractor={(item) => item.id.toString()}
      />

      <Text style={styles.sectionTitle}>Order Items</Text>
      <FlatList
        data={orderItems}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  item: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});
