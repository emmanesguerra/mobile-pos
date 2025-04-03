import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import ProductForm from '@/components/ProductForm';

export default function InventoryForm() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const [barcodedForm, setBarcodedForm] = useState({ code: '', name: '', price: '', stock: '' });
  const [genericForm, setGenericForm] = useState({ name: '', price: '' });

  const barcodedFields = [
    { key: 'code', placeholder: 'Product Code', keyboardType: 'default' },
    { key: 'name', placeholder: 'Product Name', keyboardType: 'default' },
    { key: 'price', placeholder: 'Price', keyboardType: 'numeric' },
    { key: 'stock', placeholder: 'Stock', keyboardType: 'numeric' },
  ];

  const genericFields = [
    { key: 'name', placeholder: 'Product Name', keyboardType: 'default' },
    { key: 'price', placeholder: 'Price', keyboardType: 'numeric' },
  ];

  const handleSubmit = (formData: any) => {
      console.log("Adding New Product:", formData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={isPortrait ? styles.scrollContainer : styles.rowLayout}
        horizontal={!isPortrait}
      >
        <ProductForm
          title="Barcoded Products"
          formData={barcodedForm}
          setFormData={setBarcodedForm}
          backgroundColor="#D0E8C5"
          fields={barcodedFields}
          action={"Add"}
          onSubmit={handleSubmit}
        />
        <ProductForm
          title="Generic Products"
          formData={genericForm}
          setFormData={setGenericForm}
          backgroundColor="#FADADD"
          fields={genericFields}
          action={"Add"}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  rowLayout: {
    flexDirection: 'row',
    flex: 1,
  },
});
