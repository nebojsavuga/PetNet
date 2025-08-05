import { Alert, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Images } from '../../constants/Images';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../constants/Typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList';
import { useOnboarding } from '../../contexts/OnboardingContext';
import Constants from 'expo-constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../types/RootStackParamList';

type Step4NavProp = NativeStackNavigationProp<RootStackParamList>;
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

const Step4Screen = () => {

    const navigation = useNavigation<Step4NavProp>();
    const { updateData, data } = useOnboarding();

    useEffect(() => {
        console.log("DATA: ", data);
    }, [])

    const handleSubmit = async () => {
        try {
            const payload = {
                fullName: data.fullname?.trim(),
                email: data.email?.trim().toLowerCase(),
                phoneNumber: data.phoneNumber,
                address: data.address?.trim(),
                walletAddress: data.walletAddress,
            };

            console.log('PAY: ', payload)

            if (!payload.fullName || !payload.email || !payload.phoneNumber || !payload.address || !payload.walletAddress) {
                Alert.alert('Some data is missing');
                return;
            }

            const r1 = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!r1.ok) {
                const err = await r1.json().catch(() => ({}));
                throw new Error(err?.error || `Register failed (${r1.status})`);
            }

            const r2 = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ walletAddress: payload.walletAddress }),
            });
            if (!r2.ok) {
                const err = await r2.json().catch(() => ({}));
                throw new Error(err?.error || `Login failed (${r2.status})`);
            }
            const { token, user } = await r2.json();
            await AsyncStorage.setItem('jwtToken', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            navigation.replace('HomeScreen');
        } catch (e: any) {
            console.log('[onboarding submit] error:', e?.message || e);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.backButton}>
            </View>
            <View style={styles.upperContent}>
                <Image source={Images.OnboardingFinishedIcon} style={styles.mailSentImg} resizeMode="contain" />
                <Text style={[Typography.h1, { color: '#F7F7F7' }]}>You’re good to go</Text>
                <View style={styles.emailSection}>
                    <Text style={[Typography.body, { color: '#F1EFF2', textAlign: 'center', paddingHorizontal: 20 }]}>
                        Start by creating first pet passport for your pet
                    </Text>
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.openMailButton} onPress={() => handleSubmit()}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue to App</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step4Screen

const styles = StyleSheet.create({
    openMailButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
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
    mailSentImg: {
        width: 48,
        height: 48
    },
    backButton: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start'
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        alignItems: 'center',

    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
    },
    divider: {
        flex: 1,
        height: 1,
        width: '100%',
        backgroundColor: "#4C454D",
    },
    topLeftGlow: {
        position: 'absolute',
        top: -400,
        left: -400,
        width: 800,
        height: 800,
        opacity: 0.8,
    },
    centerGlow: {
        position: 'absolute',
        top: 70,
        left: -150,
        width: 700,
        height: 700,
        opacity: 0.6,
    },
    resendButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#391149',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialButtons: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 8
    },
    emailSection: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D'
    }
})