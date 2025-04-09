import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';

const ProductForm = ({
    title,
    formData,
    setFormData,
    backgroundColor,
    fields,
    action = 'Add',
    onSubmit,
    withCamera
}: any) => {
    const [selectedBgColor, setSelectedBgColor] = useState(formData.bgColor || '#FFF');
    const colorOptions = [
        '#9FB3DF',
        '#9EC6F3',
        '#A5B68D',
        '#9F5255',
        '#FFB4A2',
        '#8174A0',
        '#DE8F5F',
        '#C96868'
    ];

    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: key === 'price' || key === 'stock' ? value.replace(/[^0-9.]/g, '') : value,
        }));
    };

    const handleColorSelection = (color: string) => {
        setFormData((prev: any) => ({
            ...prev,
            bgColor: color,
        }));
    };

    return (
        <View style={[styles.outerContainer, { backgroundColor }]}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>{title}</Text>

                {fields.map(({ key, placeholder, keyboardType, disabled }: any) => {
                    if (keyboardType === 'picker') {
                        return (
                            <View key={key} style={styles.pickerContainer}>
                                <Text style={{ color: '#7b7b7b' }}>{placeholder}</Text>
                                <View style={styles.colorOptionsContainer}>
                                    {/* Color options with circles */}
                                    {colorOptions.map((color) => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[styles.colorCircle, { backgroundColor: color }]}
                                            onPress={() => handleColorSelection(color)}
                                        >
                                            {formData.bgColor === color && (
                                                <View style={styles.selectedIndicator} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        );
                    }

                    return (
                        <TextInput
                            key={key}
                            style={[
                              styles.input,
                              { backgroundColor: disabled === undefined ? 'transparent' : disabled ? '#D3D3D3' : 'transparent' }
                            ]}
                            placeholder={placeholder}
                            keyboardType={keyboardType}
                            value={formData[key]}
                            onChangeText={(text) => handleChange(key, text)}
                            editable={disabled === undefined ? true : !disabled}
                        />
                    );
                })}

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
    pickerContainer: {
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
    },
    colorOptionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
    },
    colorCircle: {
        width: 30,
        height: 30,
        borderRadius: 20,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIndicator: {
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: 'white',
    },
});

export default ProductForm;
