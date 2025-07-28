import { StyleSheet, TextStyle } from "react-native";

export const Styles = StyleSheet.create({
    defaultButton: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        borderRadius: 8,
        backgroundColor: '#BF38F2',
        color: '#ffffff',
        padding: 12,
        gap: 12,
        fontFamily: 'SchibstedGrotesk-Regular',
        fontWeight: '400' as TextStyle['fontWeight'],
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
})