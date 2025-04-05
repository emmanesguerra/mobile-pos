// src/components/PaginationControls.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
    return (
        <View style={styles.pagination}>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: currentPage === 1 ? '#ccc' : '#27548A' }]}
                onPress={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>

            <Text style={styles.pageNumber}>
                Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: currentPage === totalPages ? '#ccc' : '#27548A' }]}
                onPress={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    pageNumber: {
        fontSize: 16,
    },
});
