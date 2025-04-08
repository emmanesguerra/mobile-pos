import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import OrderList from '@/components/POS/OrderList';
import QuickList from '@/components/POS/QuickList';
import { useSQLiteContext } from 'expo-sqlite';
import { getNonBarcodedProducts } from '@/src/database/products';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import NumericKeypad from '@/components/POS/NumericKeypad';

export default function Pos() {
  const database = useSQLiteContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const { productRefresh, setProductRefresh } = useSettingsContext();

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
    setProductRefresh(false);
  }, [productRefresh, setProductRefresh]);

  const handleQuantityChange = (id: number, action: 'increment' | 'decrement') => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders
        .map((item) =>
          item.id === id
            ? {
              ...item,
              quantity: action === 'increment' ? item.quantity + 1 : item.quantity > 1 ? item.quantity - 1 : 0,
            }
            : item
        )
        .filter((item) => item.quantity > 0); // Filter out items with quantity 0
      return updatedOrders;
    });
  };

  const total = orders.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const change = paidAmount - total;

  const handleSubmitOrder = () => {
    console.log('Order submitted:', { orders, paidAmount, total, change });
    setOrders([]); // Reset to initial orders, or clear as needed
    setPaidAmount(0); // Reset paid amount
  };

  const handleClearOrder = () => {
    setOrders([]); // Clear all orders  
  };

  // Add product to orders
  const onAddToOrder = (product: any) => {
    const existingOrder = orders.find((order) => order.code === product.product_code);
    if (existingOrder) {
      // If product already exists in orders, just increase the quantity
      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.code === product.product_code
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If product doesn't exist, add new order
      setOrders((prevOrders) => [
        ...prevOrders,
        { id: Date.now(), code: product.product_code, name: product.product_name, quantity: 1, price: product.price },
      ]);
    }
  };

  // Handle numeric input
  const handleNumericInput = (value: string) => {
    if (value === 'C') {
      setPaidAmount(0);
    } else {
      setPaidAmount((prevAmount) => {
        const currentAmount = prevAmount;
        return (currentAmount * 10) + parseInt(value, 10);
      });
    }
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
          handleClearOrder={handleClearOrder}
        />

        {/* Middle Pane */}
        <View style={styles.middlePane}>

          {/* Numeric Keypad */}
          <NumericKeypad
            handleNumericInput={handleNumericInput}
            displayValue={paidAmount.toString()}
          />
        </View>

        {/* Right Pane - Custom Product List */}
        <QuickList products={products} onAddToOrder={onAddToOrder} />
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
  cameraBox: {
    width: '100%',
    height: 100,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 10,
  },
  cameraText: {
    fontSize: 16,
    color: '#333',
  },
});
