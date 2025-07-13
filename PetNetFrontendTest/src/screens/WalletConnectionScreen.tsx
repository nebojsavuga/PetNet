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

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

type WalletNavProp = NativeStackNavigationProp<RootStackParamList, "WalletConnectionScreen">;


const WalletConnectionScreen = () => {
    const navigation = useNavigation<WalletNavProp>();
    const { authorizeSession } = useAuthorization();
    const { connect } = useMobileWallet();
    const [authorizationInProgress, setAuthorizationInProgress] = useState(false);
    useEffect(() => {
        const checkLogin = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                const user = await AsyncStorage.getItem('user');

                if (token && user) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'HomeScreen' }],
                    });
                }
            } catch (err) {
                console.warn('Error checking login state:', err);
            }
        };

        checkLogin();
    }, []);
    const loginWithWalletAddress = async (walletAddress: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress }),
            });
            if (!response.ok) {
                // user not found or other error
                return null;
            }

            const data = await response.json();

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

        const loginResult = await loginWithWalletAddress(account.publicKey.toString());

        if (loginResult) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'HomeScreen' }],
            });
        } else {
            navigation.navigate("Onboarding");
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