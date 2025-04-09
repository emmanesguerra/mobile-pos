import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface NumericKeypadProps {
    handleNumericInput: (value: string) => void;
    displayValue: string; // Add displayValue prop to show the input
}

const NumericKeypad: React.FC<NumericKeypadProps> = ({ handleNumericInput, displayValue }) => {
    return (
        <View style={styles.keyboardContainer}>
            {/* Input Display */}
            <View style={styles.row}>
                <View style={styles.displayContainer}>
                    <Text style={styles.displayText}>{displayValue}</Text>
                </View>
            </View>
            {/* First Row */}
            <View style={styles.row}>
                {[7, 8, 9].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.keyButton}
                        onPress={() => handleNumericInput(num.toString())}
                    >
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Second Row */}
            <View style={styles.row}>
                {[4, 5, 6].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.keyButton}
                        onPress={() => handleNumericInput(num.toString())}
                    >
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Third Row */}
            <View style={styles.row}>
                {[1, 2, 3].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.keyButton}
                        onPress={() => handleNumericInput(num.toString())}
                    >
                        <Text style={styles.keyText}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Fourth Row - 0 and Clear (C) */}
            <View style={styles.row}>
                <TouchableOpacity
                    style={[styles.keyButton, styles.keyDoubleSize]}
                    onPress={() => handleNumericInput('0')}
                >
                    <Text style={styles.keyText}>0</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleNumericInput('C')} style={styles.keyButton}>
                    <Text style={styles.keyText}>C</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    keyboardContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#624E88',
        borderRadius: 10,
        padding: 5,
    },
    displayContainer: {
        flex: 1,
        padding: 10,
        margin: 5,
        backgroundColor: '#FFF',
        borderRadius: 10,
        alignItems: 'center',
    },
    displayText: {
        fontSize: 36,
        color: '#000',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-evenly',
    },
    keyButton: {
        flex: 1,
        height: 59,
        margin: 5,
        backgroundColor: '#8967B3',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    keyDoubleSize: {
        flex: 2,
    },
    keyText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default NumericKeypad;
