import { Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { OnboardingStackParamList } from '../../types/OnboardingStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CountryPicker } from "react-native-country-codes-picker";
import { useOnboarding } from '../../contexts/OnboardingContext';


type Step3NavProp = NativeStackNavigationProp<OnboardingStackParamList, "Step3">;

const Step3Screen = () => {
    const navigation = useNavigation<Step3NavProp>();
    const { data, updateData } = useOnboarding();

    const [fullName, setFullName] = useState<string>(data.fullname ?? '');
    const [city, setCity] = useState<string>('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [country, setCountry] = useState({ name: 'Serbia', flag: '🇷🇸' });
    const isFullNameValid = fullName.trim().length >= 2;
    const isCityValid = city.trim().length >= 2;
    const canContinue = isFullNameValid && isCityValid;


    const handleNext = () => {
        if (!canContinue) return;
        const address = `${city.trim()}, ${country.name}`;
        updateData({
            fullname: fullName.trim(),
            address,
        });
        navigation.navigate('Step4');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
                <Text style={[Typography.h2, { color: '#F7F7F7' }]}>Enter your personal information</Text>
                <View style={styles.dataSection}>
                    <View style={styles.input}>
                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Full name</Text>
                        <TextInput placeholder='Your full name (e.g. John Doe)'
                            placeholderTextColor={'#D8D5D9'}
                            value={fullName}
                            onChangeText={setFullName}
                            onFocus={() => setFocusedInput('fullName')}
                            onBlur={() => setFocusedInput(null)}
                            style={[
                                Typography.bodySmall,
                                styles.inputField,
                                {
                                    color: '#F7F7F7',
                                    borderColor: focusedInput === 'fullName' ? '#BF38F2' : '#4C454D',
                                },
                            ]}
                        />
                    </View>
                    <View style={styles.rowInputs}>
                        <View style={[styles.input, { flex: 1 }]}>
                            <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Country</Text>
                            <Pressable
                                onPress={() => setShowCountryPicker(true)}
                                style={[
                                    styles.inputField,
                                    {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 8,
                                        paddingHorizontal: 16,
                                        height: 56,
                                    },
                                ]}
                            >
                                {country.flag && (
                                    <Text style={{ fontSize: 20 }}>{country.flag}</Text>
                                )}
                                <Text style={{ color: '#F7F7F7', fontSize: 16 }}>
                                    {country.name}
                                </Text>
                            </Pressable>
                            <CountryPicker
                                lang="en"
                                show={showCountryPicker}
                                style={{ modal: { height: 500 } }}
                                onBackdropPress={() => setShowCountryPicker(false)}
                                pickerButtonOnPress={(item) => {
                                    setCountry({ name: item.name.en, flag: item.flag });
                                    setShowCountryPicker(false);
                                }}
                            />
                        </View>

                        <View style={[styles.input, { flex: 1 }]}>
                            <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>City</Text>
                            <TextInput placeholderTextColor={'#D8D5D9'}
                                placeholder="Your city"
                                value={city}
                                onChangeText={setCity}
                                onFocus={() => setFocusedInput('city')}
                                onBlur={() => setFocusedInput(null)}
                                style={[
                                    Typography.bodySmall,
                                    styles.inputField,
                                    {
                                        color: '#F7F7F7',
                                        borderColor: focusedInput === 'city' ? '#BF38F2' : '#4C454D',
                                    },
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable
                    style={[
                        styles.createNewAccountButton,
                        { opacity: canContinue ? 1 : 0.5, backgroundColor: canContinue ? '#BF38F2' : '#732291' },
                    ]}
                    disabled={!canContinue}
                    onPress={handleNext}
                >
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Create Account</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step3Screen

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
    input: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 4,
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
    dataSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    rowInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%'
    }
})