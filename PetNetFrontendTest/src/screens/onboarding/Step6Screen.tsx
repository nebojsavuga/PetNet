import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList'

type Step6NavProp = NativeStackNavigationProp<OnboardingStackParamList, "Step6">;

const Step6Screen = () => {
    const navigation = useNavigation<Step6NavProp>();

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
                <Pressable style={styles.openMailButton} onPress={() => navigation.navigate("Step1")}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue to App</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step6Screen

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