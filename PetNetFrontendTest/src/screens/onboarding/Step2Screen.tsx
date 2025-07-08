import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'

type Step2NavProp = NativeStackNavigationProp<OnboardingStackParamList, "Step2">;

const Step2Screen = () => {
    const navigation = useNavigation<Step2NavProp>()

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.backButton}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
            </View>
            <View style={styles.upperContent}>
                <Text style={[Typography.h2, { color: '#F7F7F7' }]}>What’s your Email Address?</Text>
                <View style={styles.emailSection}>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Email</Text>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>
                        By submitting your email you confirm{'\n'}you’ve read the{' '}
                        <Text style={{ color: '#BF38F2', fontWeight: '600' }}>Privacy Notice</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.openMailButton} onPress={() => navigation.navigate("Step2")}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Open Mail</Text>
                </Pressable>
                <Pressable style={styles.resendButton} onPress={() => navigation.navigate("Step2")}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Resend</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step2Screen

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
        paddingVertical: 48,
        position: 'relative'
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
        gap: 32,
        width: '100%'
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
        gap: 12,
        alignItems: 'flex-start'
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D'
    }
})