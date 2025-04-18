import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Product } from '@/src/interfaces/Product';

interface QuicklistProps {
  products: Product[];
  onAddToOrder: (product: Product) => void;
}

const Quicklist: React.FC<QuicklistProps> = ({ products, onAddToOrder }) => {
  return (
    <View style={styles.rightPane}>
      {products.length === 0 ? (
        <Text>No products available</Text>
      ) : (
        <View style={styles.buttonContainer}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[styles.productButton, { backgroundColor: product.bgColor }]}
              onPress={() => onAddToOrder(product)}
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
  );
};

const styles = StyleSheet.create({
  rightPane: {
    flex: 1,
    backgroundColor: '#fce4e7',
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '30%',
    elevation: 10,
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
    fontSize: 25,
  },
});

export default Quicklist;
