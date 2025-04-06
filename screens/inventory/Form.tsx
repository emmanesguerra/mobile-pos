import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import ProductForm from '@/components/ProductForm';
import { useSQLiteContext } from 'expo-sqlite';
import { insertProduct } from '@/src/database/products';
import { useSettingsContext } from '@/src/contexts/SettingsContext';

type BarcodedFormData = {
  code: string;
  name: string;
  price: string;
  stock: string;
};

type GeneralFormData = {
  name: string;
  price: string;
  bgColor: string;
};

export default function InventoryForm() {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  const database = useSQLiteContext();
  const { setProductRefresh } = useSettingsContext(); 

  const [barcodedForm, setBarcodedForm] = useState({ code: '', name: '', price: '', stock: '' });
  const [generalForm, setGeneralForm] = useState({ name: '', price: '', bgColor: '' });

  const barcodedFields = [
    { key: 'code', placeholder: 'Product Code', keyboardType: 'default' },
    { key: 'name', placeholder: 'Product Name', keyboardType: 'default' },
    { key: 'price', placeholder: 'Price', keyboardType: 'numeric' },
    { key: 'stock', placeholder: 'Stock', keyboardType: 'numeric' },
  ];

  const generalFields = [
    { key: 'name', placeholder: 'Product Name', keyboardType: 'default' },
    { key: 'price', placeholder: 'Price', keyboardType: 'numeric' },
    { key: 'bgColor', placeholder: 'Background Color', keyboardType: 'picker' },
  ];

  const generateCodeFromNameAndTimestamp = (name: string) => {
    const namePart = name.substring(0, 4).toUpperCase();
    const timestampPart = Date.now().toString().slice(-6);
    return 'GEN' + timestampPart + namePart;
  };

  const handleSubmit = async (formData: any, isBarcoded: boolean) => {
    try {
      const { code, name, price, stock, bgColor } = formData;

      const productCode = isBarcoded ? code : generateCodeFromNameAndTimestamp(name);
      const productName = name;
      const productPrice = parseFloat(price);
      const productStock = isBarcoded ? parseInt(stock, 10) : 99;
      const productIsBarcoded = isBarcoded ? 1 : 0;
      const productBgColor = isBarcoded ? "" : bgColor;

      await insertProduct(
        database,
        productCode,
        productName,
        productStock,
        productPrice,
        productIsBarcoded,
        productBgColor
      );

      setProductRefresh(true);

      console.log("Product added:", formData);
    } catch (error) {
      console.error("Error handling submit:", error);
    }
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
          onSubmit={(formData: BarcodedFormData) => handleSubmit(formData, true)} // Barcoded products
          withCamera={true}
        />
        <ProductForm
          title="General Products"
          formData={generalForm}
          setFormData={setGeneralForm}
          backgroundColor="#FADADD"
          fields={generalFields}
          action={"Add"}
          onSubmit={(formData: GeneralFormData) => handleSubmit(formData, false)}  // General products
          withCamera={false}
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
