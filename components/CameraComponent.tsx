import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

interface CameraComponentProps {
    handleBarcodeScanned: (barcodeData: string) => void;  // Prop to send back the scanned barcode
}

const CameraComponent: React.FC<CameraComponentProps> = ({ handleBarcodeScanned }) => {
    const [facing, setFacing] = useState<CameraType>('front');
    const [cameraPermission, requestPermission] = useCameraPermissions();
    const [torch, setTorch] = useState(false);
    const lastScanTime = useRef(0);

    if (!cameraPermission) {
        return <View />;
    }

    if (!cameraPermission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleScanResult = async ({ data }: { data: string }) => {
        
        handleBarcodeScanned(data);
    };

    return (
        <CameraView
            onBarcodeScanned={handleScanResult}
            barcodeScannerSettings={{
                barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'],
            }}
            style={styles.camera}
            facing={facing}
            enableTorch={torch}
            zoom={.1}
        />
    );
};

const styles = StyleSheet.create({
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
        height: 180,
        marginBottom: 10,
        borderRadius: 10
    }
});

export default CameraComponent;
