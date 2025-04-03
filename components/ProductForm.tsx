import React from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';

const ProductForm = ({
  title,
  formData,
  setFormData,
  backgroundColor,
  fields,
  action = 'Add',
  onSubmit,
}: any) => {
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

        <Button title={`${action} Product`} onPress={() => onSubmit(formData)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 15,
    width: '80%',
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default ProductForm;
