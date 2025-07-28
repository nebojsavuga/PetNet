import { Button, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../constants/Typography';
import { Images } from '../constants/Images';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashNavProp = NativeStackNavigationProp<RootStackParamList, "Splash">;

const SplashScreen = () => {
    const navigation = useNavigation<SplashNavProp>();

    // AsyncStorage.removeItem('user');
    // AsyncStorage.getItem('jwtToken');

    const [ready, setReady] = useState(false);
    useEffect(() => {
        setTimeout(() => setReady(true), 50);
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.textArea}>
                <Text style={[Typography.h1, { color: '#F7F7F7' }]}>Welcome to PetNet</Text>
                <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Keep your loved ones safe</Text>
            </View>
            <Image
                source={Images.splashImg}
                style={styles.image}
            />
            <Pressable onPress={() => navigation.navigate("WalletConnectionScreen")} style={styles.continueButton}>
                <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        padding: 24,
        position: 'relative'
    },
    textArea: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 398,
        height: 398
    },
    continueButton: {
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

})