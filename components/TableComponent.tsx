// src/components/TableComponent.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface TableComponentProps {
    headers: { field: string, label: string }[];  // Array of header objects with field and label
    data: any[];        // Array of rows, each being an object
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, data }) => {

    console.log("TableComponent Data:", data); // Log the data to check its structure

    // Function to render each row
    const renderRow = ({ item }: { item: any }) => (
        <View style={styles.tableRow}>
            {headers.map((header, idx) => (
                <Text key={idx} style={styles.tableCell}>
                    {header.field === 'updated_at' 
                        ? formatDate(item[header.field])  // If it's the date, format it
                        : item[header.field]  // Otherwise just display the field value
                    }
                </Text>
            ))}
        </View>
    );

    return (
        <View style={styles.tableContainer}>
            {/* Render Table Header */}
            <View style={styles.tableHeader}>
                {headers.map((header, index) => (
                    <Text key={index} style={styles.tableHeaderText}>
                        {header.label}
                    </Text>
                ))}
            </View>

            {/* Render Table Rows with FlatList */}
            <FlatList
                data={data}
                renderItem={renderRow}
                keyExtractor={(item, index) => item.id.toString() || index.toString()}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// Helper function to format dates (if needed)
const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString();
};

const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#27548A',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tableHeaderText: {
        flex: 1,
        textAlign: 'center',
        color: '#FFF',
        fontSize: 16,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
    },
});

export default TableComponent;
