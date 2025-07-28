import { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button, Platform } from 'react-native';
import { CameraView } from "expo-camera";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const QRScanModal = ({
    visible,
    onClose,
    onScanned,
}: {
    visible: boolean;
    onClose: () => void;
    onScanned: (data: string) => void;
}) => {

    return (
        <SafeAreaView style={styles.container}>

            {Platform.OS === "android" ? <StatusBar hidden /> : null}

            <CameraView
                style={styles.camStyle}
                facing="back"
                barcodeScannerSettings={
                    {
                        barcodeTypes: ['qr'],
                    }
                }

                onBarcodeScanned={
                    ({ data }) => {
                        console.log(data);
                    }
                }
            />

        </SafeAreaView>
    )
}

export default QRScanModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        rowGap: 20
    },
    camStyle: {
        position: 'absolute',
        width: 300,
        height: 300
    }
})