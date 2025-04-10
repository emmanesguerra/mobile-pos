import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, NativeSyntheticEvent, TextInputSubmitEditingEventData } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import OrderList from '@/components/POS/OrderList';
import QuickList from '@/components/POS/QuickList';
import NumericKeypad from '@/components/POS/NumericKeypad';
import { useOrders } from '@/src/hooks/POS/useOrders';
import { useProducts } from '@/src/hooks/POS/useProducts';

export default function Pos() {
  const {
    orders,
    paidAmount,
    total,
    change,
    handleQuantityChange,
    handleClearOrder,
    handleNumericInput,
    handleSubmitOrder,
    onAddToOrder,
  } = useOrders();
  const { products, getProductByCodeFromDB } = useProducts();
  const textInputRef = useRef<TextInput | null>(null);
  const [scanRefresh, setScanRefresh] = useState<boolean>(false);

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      }, 100);
    }, [])
  );

  const handleSubmitEditing = async (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
    const input = event.nativeEvent.text;
    const product = await getProductByCodeFromDB(input);
    if (product) {
      onAddToOrder(product);
    }
    setScanRefresh(true);
  };

  useEffect(() => {
    if (scanRefresh && textInputRef.current) {
      textInputRef.current.clear();
      textInputRef.current.focus();
      setScanRefresh(false);
    }
  }, [scanRefresh]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>

        {/* Focusable TextInput */}
        <TextInput
          ref={textInputRef}
          style={[styles.input, { top: 1, left: 30 }]}
          placeholder="Scan a barcode"
          onSubmitEditing={handleSubmitEditing}
          autoFocus={true} 
          clearTextOnFocus={ true }
        />

        <OrderList
          orders={orders}
          handleQuantityChange={handleQuantityChange}
          total={total}
          paidAmount={paidAmount}
          change={change}
          handleSubmitOrder={handleSubmitOrder}
          handleClearOrder={handleClearOrder}
        />

        <View style={styles.middlePane}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClearOrder}>
              <Text style={styles.clearButtonText}>Clear Items</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summaryContainer}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Total Price</Text>
              <Text style={styles.summaryValue}>
                <Text style={styles.currencySymbol}>₱</Text>
                <Text style={styles.summaryValuePrice}>{total}</Text>
              </Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Change ({paidAmount} - {total})</Text>
              <Text style={styles.summaryValue}>
                <Text style={styles.currencySymbol}>₱</Text>
                <Text style={[styles.summaryValuePrice, { color: change < 0 ? '#F00' : '#008000' }]}>{change}</Text>
              </Text>
            </View>
          </View>

          <NumericKeypad
            handleNumericInput={handleNumericInput}
            displayValue={paidAmount.toString()}
          />
        </View>

        <QuickList products={products} onAddToOrder={onAddToOrder} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    position: 'absolute',
    height: 40,
    borderWidth: 0,
    width: '100%',
    paddingLeft: 10,
    fontSize: 16,
  },
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
    padding: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 12,
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
    fontSize: 35,
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
