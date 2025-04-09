import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { formatDate } from '@/src/services/dateService';

interface OrderComponentProps {
    selectedOrder: any;
    paidAmount: number;
    note: string;
    setPaidAmount: (value: number) => void;
    setNote: (value: string) => void;
}

const OrderComponent: React.FC<OrderComponentProps> = ({
    selectedOrder,
    paidAmount,
    note,
    setPaidAmount,
    setNote
}) => {
    return (
        <View style={styles.orderDetailsContainer}>
            <Text style={styles.detailText}>
                Reference Number: <Text style={{ fontWeight: 'bold' }}>{selectedOrder.ref_no}</Text>
            </Text>
            <Text style={styles.detailText}>
                Order Date: <Text style={{ fontWeight: 'bold' }}>{formatDate(selectedOrder.created_at)}</Text>
            </Text>
            <Text style={styles.detailText}>
                Total Amount: <Text style={{ fontWeight: 'bold' }}>₱{selectedOrder.total}</Text>
            </Text>

            {/* Paid Amount as Input Field */}
            <View style={styles.rowContainer}>
                <Text style={styles.detailText}>Paid Amount ₱: </Text>
                <TextInput
                    style={[styles.input, styles.paidAmountInput]}
                    keyboardType="numeric"
                    value={paidAmount.toString()}
                    onChangeText={(text) => setPaidAmount(Number(text))}
                />
            </View>

            {/* Note */}
            <Text style={styles.detailText}>Note:</Text>
            <TextInput
                style={[styles.textarea]}
                multiline
                value={note}
                onChangeText={setNote}
                placeholder="Enter your note here"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderDetailsContainer: {
        flex: 1,
        paddingRight: 20,
        marginBottom: 20,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginLeft: 10,
        flex: 1,
    },
    paidAmountInput: {
        flex: 0.5,
    },
    textarea: {
        height: 200,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        textAlignVertical: 'top',
    },
});

export default OrderComponent;
