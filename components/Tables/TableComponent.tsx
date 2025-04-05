// src/components/TableComponent.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface TableComponentProps {
    headers: { field: string, label: string }[];  // Array of header objects with field and label
    data: any[];        // Array of rows, each being an object
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, data }) => {

    // Function to render each row
    const renderRow = ({ item }: { item: any }) => (
        <View style={styles.tableRow}>
            {headers.map((header, idx) => (
                <Text key={idx} style={styles.tableCell}>
                    { item[header.field] }
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

const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString();
};

const styles = StyleSheet.create({
    tableContainer: {
        marginTop: 5,
        maxHeight: '80%',
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
        fontSize: 18,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
});

export default TableComponent;
