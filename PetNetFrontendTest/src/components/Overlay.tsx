import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const overlaySize = 250;

export const Overlay = () => {
    const scanAreaTop = height / 2 - overlaySize / 2;
    const scanAreaLeft = width / 2 - overlaySize / 2;

    return (
        <View style={StyleSheet.absoluteFill}>
            <View style={[styles.darkArea, { height: scanAreaTop }]} />

            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.darkArea, { width: scanAreaLeft, height: overlaySize }]} />
                <View style={[styles.scanArea, { width: overlaySize, height: overlaySize }]} />
                <View style={[styles.darkArea, { width: scanAreaLeft, height: overlaySize }]} />
            </View>

            <View style={[styles.darkArea, { flex: 1 }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    darkArea: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    scanArea: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#BF38F2',
    },
});