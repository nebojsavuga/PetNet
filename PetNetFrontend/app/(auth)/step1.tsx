import 'react-native-get-random-values';
import { Image, Keyboard, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TextStyle, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Pallete } from '@/constants/Pallete'
import { Typography } from '@/constants/Typography'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '@/constants/Images'

import axios from 'axios';
import { Link, useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { decryptPhantomPayload, generatePhantomSession, openPhantomConnect } from '@/services/walletService'

let session = null;
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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

    const router = useRouter();
    const [manualWalletAddress, setManualWalletAddress] = useState('');

    useEffect(() => {
        const sub = Linking.addEventListener('url', ({ url }) => {
            const parsed = new URL(url);
            const phantomEncryptionPublicKey = parsed.searchParams.get('phantom_encryption_public_key');
            const nonce = parsed.searchParams.get('nonce');
            const data = parsed.searchParams.get('data');

            if (!data || !phantomEncryptionPublicKey || !nonce || !session) {
                Alert.alert('Connection failed', 'Missing Phantom response data.');
                return;
            }

            const decrypted = decryptPhantomPayload({
                data,
                nonce,
                phantomEncryptionPublicKey,
                dappSecretKey: session.dappSecretKey,
            });

            if (!decrypted) {
                Alert.alert('Decryption failed');
                return;
            }

            const { public_key } = JSON.parse(decrypted);
            console.log('Connected Phantom Wallet:', public_key);
            Alert.alert('Wallet Connected', public_key);

            setTimeout(() => {
                router.replace('/(auth)/step2');
            }, 2000);
        });

        return () => sub.remove();
    }, [])

    useEffect(() => {
        const handleRedirect = ({ url }: { url: string }) => {
            const parsed = new URL(url);
            const phantomPublicKey = parsed.searchParams.get('phantom_encryption_public_key');
            const data = parsed.searchParams.get('data');
            const nonce = parsed.searchParams.get('nonce');

            console.log('Redirected with Phantom data:', { phantomPublicKey, data, nonce });
        };

        const sub = Linking.addEventListener('url', handleRedirect);

        return () => sub.remove();
    }, []);

    const handleWalletLogin = async (
        walletType: 'phantom' | 'solflare' | 'metamask' | 'NONE',
        walletAddress?: string
    ) => {
        try {
            let selectedWalletAddress: string | null = walletAddress || null;

            if (!walletAddress) {
                switch (walletType) {
                    case 'phantom':
                        try {
                            session = await generatePhantomSession();
                            console.log('Generated Session:', session);
                            await openPhantomConnect(session);
                        } catch (error) {
                            console.error('handleConnect error:', error);
                            Alert.alert('Error', 'Could not initiate Phantom connection.');
                        }
                    case 'solflare':
                        // selectedWalletAddress = await connectWithSolflare(); // optional future
                        Alert.alert('Not implemented', 'Solflare support coming soon!');
                        return;
                    case 'metamask':
                        // selectedWalletAddress = await connectWithMetaMask(); // optional future
                        Alert.alert('Not implemented', 'MetaMask support coming soon!');
                        return;
                    default:
                        selectedWalletAddress = null;
                }
            }

            if (!selectedWalletAddress) {
                Alert.alert('Connection Failed', 'No wallet address received');
                return;
            }

            const res = await axios.post(`${apiUrl}/auth/login`, {
                selectedWalletAddress,
            });

            if (res.status === 200) {
                router.navigate('/step3');
            }
        } catch (err: any) {
            if (err.response?.status === 404) {
                router.push({
                    pathname: '/step2',
                    params: { walletAddress: err.config?.data?.walletAddress },
                });
            } else {
                Alert.alert('Error', err.message || 'Login failed');
            }
        }
    };

    const handleLogin = async (walletAddress: string) => {
        await handleWalletLogin('NONE', walletAddress);
    }

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
                                    onPress={() => handleWalletLogin('metamask')}
                                />
                                {/* <WalletButton
                                    title="Connect with Phantom"
                                    logo={Images.phantom}
                                    backgroundColor="#551BF9"
                                    borderColor="#551BF9"
                                    textColor="#ffffff"
                                    onPress={() => handleWalletLogin('phantom')}
                                /> */}
                                <Link href="/(auth)/step2" style={styles.button}>
                                    Go to step2 screen
                                </Link>
                                <WalletButton
                                    title="Connect with Solflare"
                                    logo={Images.solflare}
                                    backgroundColor="#4f4f4f"
                                    textColor="#ffffff"
                                    onPress={() => handleWalletLogin('solflare')}
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
                                value={manualWalletAddress}
                                onChangeText={setManualWalletAddress}
                            />

                            {manualWalletAddress.trim().length > 0 && (
                                <WalletButton
                                    title="Connect"
                                    backgroundColor="#4f4f4f"
                                    textColor="#ffffff"
                                    onPress={() => handleLogin(manualWalletAddress)}
                                />
                            )}
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
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
});