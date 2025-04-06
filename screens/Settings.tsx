import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { saveSetting } from '@/src/database/settings';
import { useSQLiteContext } from 'expo-sqlite';
import { useSettingsContext } from '@/src/contexts/SettingsContext';
import { Picker } from '@react-native-picker/picker';

export default function Settings() {
  const database = useSQLiteContext();
  const { threshold, setThreshold, itemsPerPage, setItemsPerPage } = useSettingsContext();

  // Handle saving the settings when input loses focus
  const handleBlur = async (key: string, value: string) => {
    await saveSetting(database, key, value);
    alert(`Setting saved: ${key} = ${value}`);
  };

  const handleChangeItemsPerPage = (text: string) => {
    const value = text === '' ? 0 : parseInt(text, 10);
    setItemsPerPage(value);
  };

  const handleChangeThreshold = (text: string) => {
    const value = text === '' ? 0 : parseInt(text, 10);
    setThreshold(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.question}>
            Number of rows to show in the table:
          </Text>
          <Picker
            selectedValue={itemsPerPage}
            onValueChange={(value) => {
              handleChangeItemsPerPage(String(value));
              handleBlur('tableRows', String(value)); // Save on change
            }}
            style={styles.input} // Reuse your styling
          >
            {[5, 6, 7, 8, 9, 10, 15, 20, 25].map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.question}>
            Low stock threshold:
          </Text>
          <Picker
            selectedValue={threshold}
            onValueChange={(value) => {
              handleChangeThreshold(String(value));
              handleBlur('lowStockThreshold', String(value)); // Save on change
            }}
            style={styles.input} // Reuse your styling
          >
            {[5, 10, 15, 20, 25, 30, 40, 50].map((value) => (
              <Picker.Item key={value} label={`${value}`} value={value} />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#C5705D',
  },
  innerContainer: {
    flex: 1,
    padding: 30,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 5,
    justifyContent: 'flex-start',
  },
  settingItem: {
    marginBottom: 30,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    width: 100,
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F5EEDC',
    fontSize: 18,
    color: '#000'
  },
});
