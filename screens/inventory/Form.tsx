import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, Button, SafeAreaView, useWindowDimensions, ScrollView } from 'react-native';

// Reusable ProductForm Component
const ProductForm = ({ title, formData, setFormData, backgroundColor, fields }: any) => {
  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: key === "price" || key === "stock" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor }]}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{title}</Text>

        {fields.map(({ key, placeholder, keyboardType }: any) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={formData[key]}
            onChangeText={(text) => handleChange(key, text)}
          />
        ))}

        <Button title="Save Product" onPress={() => console.log('Form Data:', formData)} />
      </View>
    </View>
  );
};

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
        />
        <ProductForm
          title="Generic Products"
          formData={genericForm}
          setFormData={setGenericForm}
          backgroundColor="#FADADD"
          fields={genericFields}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  scrollContainer: {
    flexGrow: 1
  },
  rowLayout: {
    flexDirection: 'row',
    flex: 1
  },
  outerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: '80%',
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10
  },
});
