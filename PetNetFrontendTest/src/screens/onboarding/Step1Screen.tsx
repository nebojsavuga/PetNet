import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList'

type Step1NavProp = NativeStackNavigationProp<OnboardingStackParamList, "Step1">;

const Step1Screen = () => {
    const navigation = useNavigation<Step1NavProp>();

    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
                <Text style={[Typography.h2, { color: '#F7F7F7' }]}>What’s your Email Address?</Text>
                <View style={styles.emailSection}>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Email</Text>
                    <TextInput
                        placeholder='Your email address'
                        placeholderTextColor={'#D8D5D9'}
                        onFocus={() => setFocusedInput('fullName')}
                        onBlur={() => setFocusedInput(null)}
                        style={[
                            Typography.bodySmall,
                            styles.inputField,
                            {
                                color: '#F7F7F7',
                                borderColor: focusedInput === 'fullName' ? '#D988F7' : '#4C454D',
                            },
                        ]}
                    />
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>
                        By submitting your email you confirm{'\n'}you’ve read the{' '}
                        <Text style={{ color: '#BF38F2', fontWeight: '600' }}>Privacy Notice</Text>
                    </Text>
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.createNewAccountButton} onPress={() => navigation.navigate("Step2")}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Create New Account</Text>
                </Pressable>
                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                </View>
                <View style={styles.socialButtons}>
                    <Pressable style={styles.connectWalletButton}>
                        <Text style={[Typography.bodyBold, { color: '#242424' }]}>Continue with Apple</Text>
                    </Pressable>
                    <Pressable style={styles.connectWalletButton}>
                        <Text style={[Typography.bodyBold, { color: '#242424' }]}>Continue with Google</Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Step1Screen

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
    upperContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        width: '100%'
    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
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
    createNewAccountButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
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
    inputField: {
        width: '100%',
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D',
        backgroundColor: "#FFFFFF1A"
    },
})