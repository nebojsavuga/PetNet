import { Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Link } from 'expo-router'
import { Pallete } from '@/constants/Pallete'
import { Typography } from '@/constants/Typography'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '@/constants/Images'

type WalletButtonProps = {
    title: string;
    logo?: any;
    backgroundColor: string;
    borderColor?: string;
    textColor: string;
    onPress: () => void;
};

const WalletButton = ({
    title,
    logo,
    backgroundColor,
    borderColor,
    textColor,
    onPress,
}: WalletButtonProps) => (
    <Pressable
        onPress={onPress}
        style={[
            styles.walletButton,
            {
                backgroundColor,
                borderColor: borderColor ?? 'transparent',
            },
        ]}
    >
        {logo && <Image source={logo} style={styles.walletLogo} resizeMode="contain" />}
        <Text style={[styles.walletText, { color: textColor }]}>{title}</Text>
    </Pressable>
);

const step1 = () => {
    return (
        <SafeAreaView style={styles.outerContainer}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={10}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.innerContent}>
                            <View style={styles.header}>
                                <Text style={styles.logo}>PetNet</Text>
                                <View style={styles.textArea}>
                                    <Text style={Typography.h1}>Welcome back</Text>
                                    <Text style={Typography.body}>Connect with your wallet provider</Text>
                                </View>
                            </View>

                            <View style={styles.buttonGroup}>
                                <WalletButton
                                    title="Connect with MetaMask"
                                    logo={Images.metamask}
                                    backgroundColor={Pallete.greyscale.white}
                                    borderColor={Pallete.greyscale[300]}
                                    textColor={Pallete.greyscale[900]}
                                    onPress={() => console.log('Connect MetaMask')}
                                />
                                <WalletButton
                                    title="Connect with Phantom"
                                    logo={Images.phantom}
                                    backgroundColor="#551BF9"
                                    borderColor="#551BF9"
                                    textColor="#ffffff"
                                    onPress={() => console.log('Connect Phantom')}
                                />
                                <WalletButton
                                    title="Connect with Solflare"
                                    logo={Images.solflare}
                                    backgroundColor="#4f4f4f"
                                    textColor="#ffffff"
                                    onPress={() => console.log('Connect Solflare')}
                                />
                            </View>

                            <View style={styles.dividerContainer}>
                                <View style={styles.divider} />
                                <Text style={styles.orText}>OR</Text>
                                <View style={styles.divider} />
                            </View>

                            <TextInput
                                placeholder="Enter wallet address"
                                placeholderTextColor={Pallete.greyscale[400]}
                                style={styles.input}
                            />
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default step1

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: Pallete.greyscale[100],
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    innerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    header: {
        paddingVertical: 32,
        alignItems: 'center',
        gap: 24,
        width: '100%',
    },
    logo: {
        fontFamily: 'SchibstedGrotesk-SemiBold',
        fontWeight: '600' as TextStyle['fontWeight'],
        fontSize: 20,
        lineHeight: 28,
        letterSpacing: -0.5,
        color: Pallete.primary[500],
    },
    textArea: {
        gap: 8,
        alignItems: 'center',
    },
    buttonGroup: {
        alignItems: 'center',
        gap: 16,
        width: '100%',
    },
    walletButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
    },
    walletLogo: {
        width: 24,
        height: 24,
    },
    walletText: {
        ...Typography.button,
        flexShrink: 1,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 16,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: Pallete.greyscale[200],
        marginHorizontal: 8,
    },
    orText: {
        fontSize: 14,
        color: Pallete.greyscale[400],
    },
    input: {
        backgroundColor: Pallete.greyscale[50],
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderWidth: 1,
        height: 56,
        borderColor: Pallete.greyscale[300],
        borderRadius: 8,
        width: '100%',
    },
});