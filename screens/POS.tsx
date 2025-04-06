import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SQLiteDatabase } from 'expo-sqlite';
import OrderList from '@/components/POS/OrderList';
import { useSQLiteContext } from 'expo-sqlite';
import { getNonBarcodedProducts } from '@/src/database/products';

const mockOrders = [
  { id: 1, name: 'Apple', quantity: 2, price: 10 },
  { id: 2, name: 'Banana', quantity: 1, price: 5 },
  { id: 3, name: 'Orange Juice', quantity: 1, price: 25 },
  { id: 4, name: 'Apple', quantity: 2, price: 10 },
  { id: 5, name: 'Banana', quantity: 1, price: 5 },
];

export default function Pos() {
  const database = useSQLiteContext();
  const [orders, setOrders] = useState(mockOrders);
  const [paidAmount, setPaidAmount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);

  // Fetch products with isBarcoded = 0
  const fetchNonBarcodedProducts = async () => {
    try {
      const nonBarcodedProducts = await getNonBarcodedProducts(database);
      setProducts(nonBarcodedProducts);
    } catch (error) {
      console.error('Error fetching non-barcoded products:', error);
    }
  };

  useEffect(() => {
    fetchNonBarcodedProducts();
  }, []);

  const handleQuantityChange = (id: number, action: 'increment' | 'decrement') => {
    setOrders((prevOrders) =>
      prevOrders.map((item) =>
        item.id === id
          ? {
            ...item,
            quantity: action === 'increment' ? item.quantity + 1 : item.quantity > 1 ? item.quantity - 1 : 1,
          }
          : item
      )
    );
  };

  const total = orders.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const change = paidAmount - total > 0 ? paidAmount - total : 0;

  const handleSubmitOrder = () => {
    console.log('Order submitted:', { orders, paidAmount, total, change });
    setOrders(mockOrders); // Reset to initial orders, or clear as needed
    setPaidAmount(0); // Reset paid amount
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Left Pane - Order List */}
        <OrderList
          orders={orders}
          handleQuantityChange={handleQuantityChange}
          total={total}
          paidAmount={paidAmount}
          change={change}
          handleSubmitOrder={handleSubmitOrder}
        />

        {/* Middle Pane - Placeholder */}
        <View style={styles.middlePane}>
          <Text style={styles.title}>Middle Pane</Text>
          <Text>Content goes here...</Text>
        </View>

        {/* Right Pane - Custom Product List */}
        <View style={styles.rightPane}>
          {products.length === 0 ? (
            <Text>No products available</Text>
          ) : (
            <View style={styles.buttonContainer}>
              {products.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productButton}
                  onPress={() => console.log('Selected product:', product)}
                >
                  <Text style={[styles.productButtonText, styles.productButtonTextName]}>
                    {product.product_name}
                  </Text>
                  <Text style={[styles.productButtonText, styles.productButtonTextPrice]}>
                    {product.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#7469B6',
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 5,
    justifyContent: 'flex-start',
    gap: 10,
  },
  middlePane: {
    flex: 1,
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPane: {
    flex: 1,
    backgroundColor: '#fce4ec',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',  // Allows wrapping of buttons in case of overflow
    justifyContent: 'space-between', // Space out the buttons evenly
  },
  productButton: {
    backgroundColor: '#4F6F52',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '30%',
  },
  productButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  productButtonTextName: {
    fontSize: 12,
  },
  productButtonTextPrice: {
    fontSize: 30,
  },
});
