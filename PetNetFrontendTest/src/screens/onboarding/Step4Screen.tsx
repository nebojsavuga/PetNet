import { Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Images } from '../../constants/Images';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../constants/Typography';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList';
import { useOnboarding } from '../../contexts/OnboardingContext';

type Step4NavProp = NativeStackNavigationProp<OnboardingStackParamList, "Step4">;

const Step4Screen = () => {

    const navigation = useNavigation<Step4NavProp>();

    const [code, setCode]  = useState(['', '', '', '', '', '']);
    const inputs = useRef<Array<TextInput | null>>([]);
    const [resendAvailable, setResendAvailable] = useState(false);
    const [timer, setTimer] = useState(28);
    useEffect(() => {
        const isComplete = code.every((digit) => digit !== '');

        if (isComplete) {
            setTimeout(() => {
                navigation.navigate('Step5');
            }, 200);
        }
    }, [code]);

    const handleChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text.slice(-1);
        setCode(newCode);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (!resendAvailable) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval!);
                        setResendAvailable(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendAvailable]);

    const handleResend = () => {
        setTimer(28);
        setResendAvailable(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />

            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>

                <Text style={[Typography.h2, { color: '#F7F7F7' }]}>Verify your mobile number</Text>

                <View style={styles.emailSection}>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>
                        Verification Code (SMS)
                    </Text>

                    <View style={styles.codeInputWrapper}>
                        {code.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputs.current[index] = ref)}
                                style={[Typography.bodySmall, styles.codeInput]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
                                        inputs.current[index - 1]?.focus();
                                    }
                                }}
                            />
                        ))}
                    </View>

                    {/* Instruction Text */}
                    <Text style={[Typography.bodyExtraSmall, { color: '#D8D5D9', alignSelf: 'flex-start' }]}>
                        Enter 6 digit code sent to +381 64 12****7
                    </Text>

                    {/* Timer / Resend */}
                    {resendAvailable ? (
                        <Pressable
                            onPress={handleResend}
                            style={styles.createNewAccountButton}>
                            <Text style={[Typography.bodySmall, { color: '#F7F7F7', fontWeight: '600' }]}>
                                Resend code
                            </Text>
                        </Pressable>
                    ) : (
                        <Text
                            style={[
                                Typography.bodySmall,
                                {
                                    color: '#732291',
                                    marginTop: 24,
                                    alignSelf: 'center',
                                    textAlign: 'center',
                                },
                            ]}
                        >
                            You can get a new code in {timer}s
                        </Text>
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default Step4Screen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#19171A',
        paddingHorizontal: 24,
        paddingVertical: 32,
        position: 'relative',
    },
    upperContent: {
        flex: 1,
        gap: 32,
        width: '100%',
    },
    emailSection: {
        gap: 12,
        width: '100%',
        alignItems: 'flex-start',
    },
    codeInputWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: 360,
        gap: 8,
        alignSelf: 'center',
    },
    codeInput: {
        width: 45,
        height: 45,
        borderWidth: 2,
        borderColor: '#4C454D',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        color: '#ffffff',
        backgroundColor: '#FFFFFF1A',
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
        marginTop: 24,
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
});