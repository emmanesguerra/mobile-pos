import { StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { saveSetting, getSettingValue } from '@/src/database/settings';
import { useSQLiteContext } from 'expo-sqlite';
import { useSettingsContext } from '@/src/contexts/SettingsContext';

export default function Settings() {
  const database = useSQLiteContext();
  const { threshold, setThreshold, itemsPerPage, setItemsPerPage } = useSettingsContext();

  // Function to fetch the current setting values
  const fetchSettings = async () => {
    const rows = await getSettingValue(database, 'tableRows');
    const thresholdValue = await getSettingValue(database, 'lowStockThreshold');
    
    if (rows) setItemsPerPage(parseInt(rows, 10));
    if (thresholdValue) setThreshold(parseInt(thresholdValue, 10));
  };

  // Fetch settings when the component mounts
  useEffect(() => {
    fetchSettings();
  }, []);

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
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(itemsPerPage)}
            onChangeText={handleChangeItemsPerPage}
            placeholder="Enter number of rows"
            placeholderTextColor="#888"
            onBlur={() => handleBlur('tableRows', String(itemsPerPage))} // Save on blur
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.question}>
            Low stock threshold:
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(threshold)}
            onChangeText={handleChangeThreshold} 
            placeholder="Enter stock threshold"
            placeholderTextColor="#888"
            onBlur={() => handleBlur('lowStockThreshold', String(threshold))} // Save on blur
          />
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
    width: 250,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#F9F9F9',
    color: '#000',
  },
});
