import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

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

    const [facing, setFacing] = useState<CameraType>('front');
    const [permission, requestPermission] = useCameraPermissions();

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleChange = (key: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [key]: key === "price" || key === "stock" ? value.replace(/[^0-9.]/g, "") : value,
        }));
    };

    const handleScanResult = ({ data }: { data: string }) => {
        setFormData((prev: any) => ({
            ...prev,
            code: data,
        }));
    };

    return (
        <View style={[styles.outerContainer, { backgroundColor }]}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>{title}</Text>

                {withCamera && (
                    <CameraView
                        onBarcodeScanned={handleScanResult}
                        barcodeScannerSettings={{
                            barcodeTypes: ['aztec', 'ean13', 'ean8', 'pdf417', 'upc_a', 'upc_e', 'datamatrix', 'code39', 'code93', 'itf14', 'codabar', 'code128'],
                        }}
                        style={styles.camera}
                        facing={facing}
                        zoom={1}>
                    </CameraView>
                )}

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


    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        width: '100%',
        height: 200,
        marginBottom: 10
    }
});

export default ProductForm;
