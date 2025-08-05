import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Typography } from '../constants/Typography'
import { Images } from '../constants/Images'
import { useAuthorization } from '../utils/useAuthorization'
import { useMobileWallet } from '../utils/useMobileWallet'
import { alertAndLog } from '../utils/alertAndLog'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../types/RootStackParamList'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { isTokenExpired } from '../utils/jwt';
import { useOnboarding } from '../contexts/OnboardingContext'

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

type WalletNavProp = NativeStackNavigationProp<RootStackParamList, "WalletConnectionScreen">;


const WalletConnectionScreen = () => {
    const navigation = useNavigation<WalletNavProp>();
    const { authorizeSession } = useAuthorization();
    const { connect } = useMobileWallet();
    const { updateData, data } = useOnboarding();
    const [authorizationInProgress, setAuthorizationInProgress] = useState(false);

    const withTimeout = <T,>(p: Promise<T>, ms: number) =>
        new Promise<T>((resolve, reject) => {
            const t = setTimeout(() => reject(new Error('timeout')), ms);
            p.then(v => { clearTimeout(t); resolve(v); })
                .catch(e => { clearTimeout(t); reject(e); });
        });

    useEffect(() => {
        const checkLogin = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                const user = await AsyncStorage.getItem('user');

                if (token && user) {
                    console.log('imaga');
                    const isExpired = isTokenExpired(token);
                    if (isExpired) {
                        console.log('isteko!');
                        await AsyncStorage.removeItem('jwtToken');
                        await AsyncStorage.removeItem('user');
                        await handleConnectPress();
                        return;
                    }
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeScreen' }],
                    });
                }

                console.log('nemaga');
            } catch (err) {
                console.warn('Error checking login state:', err);
            }
        };

        checkLogin();
    }, []);
    const loginWithWalletAddress = async (walletAddress: string) => {
        try {
            const response = await withTimeout(fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress }),
            }), 6000);
            console.timeEnd('[login]');
            console.log("RESPONSE: ", response);
            if (!response.ok) {
                return null;
            }

            console.log('ok');
            const data = await response.json();
            console.log('datara: ', data);
            await AsyncStorage.setItem('jwtToken', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));

            return data;
        } catch (err) {

            return null;
        }
    };
    const handleConnectPress = useCallback(async () => {
        if (authorizationInProgress) return;

        setAuthorizationInProgress(true);

        let account;
        try {
            account = await connect();
            console.log("account: ", account);
        } catch (err) {
            alertAndLog(
                "Error during connect",
                err instanceof Error ? err.message : err
            );
        } finally {
            setAuthorizationInProgress(false);
        }

        if (!account || !account.publicKey) {
            alert("Wallet connection failed.");
            return;
        }

        const walletAddress = account.publicKey.toString();
        console.log('Wallet address: ', walletAddress);
        updateData({ walletAddress });

        const loginResult = await loginWithWalletAddress(account.publicKey.toString());

        console.log("login result: ", loginResult);
        if (loginResult) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } else {
            navigation.replace("Onboarding");
        }
    }, [authorizationInProgress, authorizeSession]);

    return (
        <SafeAreaView style={styles.container}>
            {/* <Pressable onPress={handleBack} className='flex flex-row w-full'>
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable> */}
            <Image source={Images.topLeftBlueEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.strongCentralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <Image source={Images.centralGreenEllipse} style={styles.centerGreenGlow} resizeMode="contain" />
            <View style={styles.textArea}>
                <Pressable
                    onPress={() => navigation.goBack()}

                >
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
                <Text style={[Typography.h2, { color: '#F7F7F7' }]}>Connect your crypto wallet</Text>
            </View>
            <Image
                source={Images.solanaCoin}
                style={styles.solanaCoin}
            />
            <View style={styles.connectionSection}>
                <Pressable style={styles.connectWalletButton} onPress={handleConnectPress}>
                    <Text style={[Typography.bodyBold, { color: '#242424' }]}>Connect Wallet</Text>
                </Pressable>
                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={[Typography.bodySmall, { color: '#988F99' }]}>OR</Text>
                    <View style={styles.divider} />
                </View>
                <Pressable style={styles.enterManuallyButton} onPress={() => navigation.navigate('Onboarding')}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Enter Wallet Address Manually</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default WalletConnectionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 32,
        position: 'relative'
    },
    textArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    solanaCoin: {
        width: 208,
        height: 212,
    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%'
    },
    connectWalletButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#242424"
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
        backgroundColor: "#4C454D",
        marginHorizontal: 8,
    },
    enterManuallyButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    topLeftGlow: {
        position: 'absolute',
        top: -350,
        left: -350,
        width: 900,
        height: 900,
    },
    centerGlow: {
        position: 'absolute',
        top: -30,
        left: -150,
        width: 700,
        height: 700,
        opacity: 0.9
    },
    centerGreenGlow: {
        position: 'absolute',
        top: 200,
        left: -50,
        width: 500,
        height: 500,
    },
})