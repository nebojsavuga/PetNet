import { StyleSheet, TextStyle } from "react-native";

export const Typography = StyleSheet.create({
    // Headings
    display: {
        fontFamily: 'SchibstedGrotesk-Bold',
        fontWeight: '700' as TextStyle['fontWeight'],
        fontSize: 34,
        lineHeight: 42,
        letterSpacing: -1,
    },
    h1: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontWeight: '600' as TextStyle['fontWeight'],
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: -1,
    },
    h2: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontWeight: '600' as TextStyle['fontWeight'],
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.5,
    },
    h3: {
        fontFamily: 'SchibstedGrotesk-Medium',
        fontWeight: '500' as TextStyle['fontWeight'],
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: -0.5,
    },
    hTranslate: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontWeight: '600' as TextStyle['fontWeight'],
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: -0.5,
    },

    // Body
    body: {
        fontFamily: 'SchibstedGrotesk-Regular',
        fontWeight: '400' as TextStyle['fontWeight'],
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        color: '#333333',
    },
    bodySmall: {
        fontFamily: 'SchibstedGrotesk-Regular',
        fontWeight: '400' as TextStyle['fontWeight'],
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        color: '#333333',
    },
    bodyBold: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontWeight: '600' as TextStyle['fontWeight'],
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
    },

    // Caption
    caption: {
        fontFamily: 'SpecialGothicExpandedOne-Regular',
        fontWeight: '400' as TextStyle['fontWeight'],
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 7,
        textTransform: 'uppercase',
        color: '#666666',
    },

    // Button text
    button: {
        fontFamily: 'SchibstedGrotesk-Medium',
        fontWeight: '500' as TextStyle['fontWeight'],
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: 0,
        color: '#FFFFFF',
    },
});