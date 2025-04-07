import React from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const OrderList = ({ orders, handleQuantityChange, total, paidAmount, change, handleSubmitOrder, handleClearOrder }: any) => {
  return (
    <View style={styles.leftPane}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearOrder}>
          <Text style={styles.clearButtonText}>Clear Items</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        style={styles.orderList}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name} (₱{item.price})</Text>
              {/* Quantity control with +/- */}
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 'decrement')}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() => handleQuantityChange(item.id, 'increment')}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Subtotal */}
            <Text style={styles.itemSubtotal}>₱{item.quantity * item.price}</Text>
          </View>
        )}
      />
      {/* Order Summary */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ₱{total}</Text>
        <Text style={styles.subtotalText}>Paid Amount: ₱{paidAmount}</Text>
        <Text style={styles.subtotalText}>
          Change (₱{paidAmount} - ₱{total}) :
          <Text
            style={{
              color: change < 0 ? 'red' : 'black', // Change color of the amount if less than 0
              fontWeight: 'bold',
            }}
          >
            ₱{change}
          </Text>
        </Text>
        {/* Submit Order Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitOrder}>
          <Text style={styles.submitButtonText}>Submit Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftPane: {
    flex: 1,
    backgroundColor: '#e0f7fa',
    padding: 10,
    borderRadius: 10,
  },
  orderList: {
    flex: 1,
    paddingRight: 10,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  itemInfo: {},
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemSubtotal: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 20,
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  totalContainer: {
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginTop: 10,
  },
  totalText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  subtotalText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  submitButton: {
    backgroundColor: '#4F6F52',
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: '#A94A4A',
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: 100,
  },
  clearButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default OrderList;
