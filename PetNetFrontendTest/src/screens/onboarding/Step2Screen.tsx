import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import { Ionicons } from '@expo/vector-icons';
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { CountryPicker } from 'react-native-country-codes-picker'
import { useOnboarding } from '../../contexts/OnboardingContext'

type Step2NavProp = NativeStackNavigationProp<OnboardingStackParamList, "Step2">;

const Step2Screen = () => {
    const [show, setShow] = useState(false);
    const navigation = useNavigation<Step2NavProp>();
    const { data, updateData } = useOnboarding();

    const [selectedCountry, setSelectedCountry] = useState({
        dial_code: '+381',
        flag: '🇷🇸',
    });

    const initialLocal = (() => {
        if (!data.phoneNumber) return '';
        const digits = data.phoneNumber.replace(/\D/g, '');
        const cc = selectedCountry.dial_code.replace('+', '');
        return digits.startsWith(cc) ? digits.slice(cc.length) : digits;
    })();

    const [phoneNumber, setPhoneNumber] = useState(initialLocal);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const localDigits = phoneNumber.replace(/\D/g, '');
    const isValid = localDigits.length >= 7;

    const handleNext = () => {
        if (!isValid) return;
        const e164 = `${selectedCountry.dial_code}${localDigits}`;
        updateData({ phoneNumber: e164 });
        navigation.navigate('Step3');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />

            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>

                <Text style={[Typography.h2, { color: '#F7F7F7' }]}>What’s your mobile number?</Text>

                <View style={styles.emailSection}>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Mobile number</Text>

                    <View style={styles.mobileInputArea}>
                        <Pressable
                            onPress={() => setShow(true)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                                paddingHorizontal: 16,
                                paddingVertical: 16,
                                borderWidth: 1,
                                borderColor: '#4C454D',
                                borderRadius: 8,
                                backgroundColor: '#FFFFFF1A',
                            }}
                        >
                            <Text style={{ fontSize: 18 }}>{selectedCountry.flag}</Text>
                            <Text style={{ color: '#F7F7F7', fontSize: 14 }}>
                                {selectedCountry.dial_code}
                            </Text>
                        </Pressable>

                        <TextInput
                            placeholder="Your mobile number"
                            placeholderTextColor="#D8D5D9"
                            keyboardType="phone-pad"
                            onFocus={() => setFocusedInput('phoneNumber')}
                            onBlur={() => setFocusedInput(null)}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            style={[
                                Typography.bodySmall,
                                styles.inputField,
                                {
                                    color: '#F7F7F7',
                                    borderColor: focusedInput === 'phoneNumber' ? '#D988F7' : '#4C454D',
                                },
                            ]}
                        />

                        <CountryPicker
                            lang="en"
                            show={show}
                            style={{ modal: { height: 400 } }}
                            pickerButtonOnPress={(item) => {
                                setSelectedCountry({
                                    dial_code: item.dial_code,
                                    flag: item.flag,
                                });
                                setShow(false);
                            }}
                            onBackdropPress={() => setShow(false)}
                        />
                    </View>

                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>
                        By continuing, I agree to the PetNet App{'\n'}
                        <Text style={{ color: '#BF38F2', fontWeight: '600' }}>Terms & Conditions</Text>
                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}> and </Text>
                        <Text style={{ color: '#BF38F2', fontWeight: '600' }}>Privacy Notice</Text>
                    </Text>
                </View>
            </View>

            <Pressable
                style={[
                    styles.createNewAccountButton,
                    { backgroundColor: isValid ? '#BF38F2' : '#732291', opacity: isValid ? 1 : 0.5 },
                ]}
                disabled={!isValid}
                onPress={handleNext}
            >
                <Text
                    style={[
                        Typography.bodySmall,
                        { color: isValid ? '#F7F7F7' : '#988F99', fontWeight: isValid ? '600' : '400' },
                    ]}
                >
                    Create New Account
                </Text>
            </Pressable>
        </SafeAreaView>
    );
};

export default Step2Screen;

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
        marginTop: 24,
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
        flex: 1,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D',
        backgroundColor: '#FFFFFF1A',
    },
    countryInput: {
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mobileInputArea: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        width: '100%'
    }
})