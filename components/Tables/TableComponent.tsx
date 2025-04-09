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
            {data.length === 0 ? (
                <Text style={styles.noDataText}>No data available</Text>
            ) : (
                // Render Table Rows with FlatList
                <FlatList
                    data={data}
                    renderItem={renderRow}
                    keyExtractor={(item, index) => item.id.toString() || index.toString()}
                    showsVerticalScrollIndicator={true}
                />
            )}
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
        marginBottom: 10,
        height: '80%',
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
        fontSize: 14,
    },
    tableRow: {
        flexDirection: 'row',
        borderTopWidth: 0,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#888',
        marginTop: 20,
    },
});

export default TableComponent;
