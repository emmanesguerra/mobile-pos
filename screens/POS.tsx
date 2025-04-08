import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import OrderList from '@/components/POS/OrderList';
import QuickList from '@/components/POS/QuickList';
import { useSQLiteContext } from 'expo-sqlite';
import { getNonBarcodedProducts } from '@/src/database/products';
import { insertOrder, insertOrderItems } from '@/src/database/orders';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import { generateRefNo } from '@/src/services/refNoService';
import NumericKeypad from '@/components/POS/NumericKeypad';

export default function Pos() {
  const database = useSQLiteContext();
  const [orders, setOrders] = useState<any[]>([]);
  const [paidAmount, setPaidAmount] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const { productRefresh, setProductRefresh, orderRefresh, setOrderRefresh } = useSettingsContext();

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

  const handleSubmitOrder = async () => {
    if (orders.length === 0) {
      alert('No items in the order.');
      return;
    }

    try {
      // Insert the main order and get the inserted order ID
      const refNo = await generateRefNo(database);
      const orderId = await insertOrder(database, refNo, total, paidAmount);
      
      if (!orderId) {
        console.warn('Failed to insert order. Aborting order item insert.');
        return;
      }

      // Map orders to orderItems with orderId
      const orderItems = orders.map((item) => ({
        product_id: item.code,
        quantity: item.quantity,
        price: item.price,
      }));

      // Insert the order items
      await insertOrderItems(database, orderId, orderItems);

      console.log('Order successfully saved:', { orderId, orderItems });

      // Clear order state
      setOrderRefresh(true);
      setOrders([]);
      setPaidAmount(0);
      alert('Order submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  const handleClearOrder = () => {
    setOrders([]);
    setPaidAmount(0);
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

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearOrder}>
              <Text style={styles.clearButtonText}>Clear Items</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Total Price</Text>
              <Text style={styles.summaryLabel}></Text>
              <Text style={styles.summaryValue}>
                <Text style={styles.currencySymbol}>₱</Text>
                <Text style={styles.summaryValuePrice}>{total}</Text>
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Change</Text>
              <Text style={styles.summaryLabel}>(₱{paidAmount} - ₱{total})</Text>
              <Text style={styles.summaryValue}>
                <Text style={styles.currencySymbol}>₱</Text>
                <Text style={[styles.summaryValuePrice, { color: change < 0 ? '#F00' : '#008000' }]}>{change}</Text>
              </Text>
            </View>
          </View>


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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    padding: 10,
  },

  summaryBox: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  summaryValue: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },

  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },

  summaryValuePrice: {
    fontSize: 40,
    fontWeight: 'bold',
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  clearButton: {
    backgroundColor: '#A94A4A',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    width: '100%',
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
