import React from 'react';
import { FlatList, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const OrderList = ({ orders, handleQuantityChange, total, paidAmount, change, handleSubmitOrder, handleClearOrder }: any) => {
  return (
    <View style={styles.leftPane}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        style={styles.orderList}
        showsVerticalScrollIndicator={true}
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
    marginTop: 10,
  },
  totalText: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingRight: 10,
  },
  subtotalText: {
    fontSize: 14,
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
});

export default OrderList;
