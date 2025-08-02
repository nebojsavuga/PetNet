import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, View, Pressable, Text, Alert } from "react-native";
import { Images } from "../../constants/Images";
import { Ionicons } from '@expo/vector-icons';
import { Typography } from "../../constants/Typography";
import { TextInput } from "react-native-paper";
import { RootStackParamList } from "../../types/RootStackParamList";
import { usePetPassport } from "../../contexts/CreatePetPassportContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

const Step3Screen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { updateData, data } = usePetPassport();

    const [chipNumber, setChipNumber] = useState<string>('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    const handleSubmit = async () => {
        updateData({ chipNumber });
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
            Alert.alert('Unauthorized', 'You must be logged in.');
            return;
        }
        let ipfsUrl = data.imageUrl;
        if (data.imageUrl?.startsWith('file://')) {
            const formData = new FormData();
            formData.append('image', {
                uri: data.imageUrl,
                type: 'image/jpeg',
                name: 'photo.jpg',
            } as any);

            const ipfsRes = await fetch(`${API_URL}/pets/image`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const ipfsData = await ipfsRes.json();
            if (!ipfsRes.ok) {
                Alert.alert('Error', ipfsData.error || 'Failed to upload image');
                return;
            }
            ipfsUrl = ipfsData.url;
            updateData({ imageUrl: ipfsUrl });
        }
        const petResponse = await fetch(`${API_URL}/pets`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...data,
                chipNumber: chipNumber,
                imageUrl: ipfsUrl,
            }),
        });
        const petData = await petResponse.json();
        if (!petResponse.ok) {
            Alert.alert('Error', petData.error || 'Could not create pet');
            return;
        }
        navigation.reset({
            index: 0,
            routes: [{ name: 'HomeScreen' }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
            </View>
            <Text style={[Typography.h6, { color: '#F7F7F7' }]}>Your pet's Chip ID</Text>
            <View style={styles.dataSection}>
                <View style={styles.input}>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Chip ID</Text>
                    <TextInput placeholder="Your pet's Chip ID"
                        placeholderTextColor={'#D8D5D9'}
                        onFocus={() => setFocusedInput('chip')}
                        onBlur={() => setFocusedInput(null)}
                        value={chipNumber}
                        onChangeText={setChipNumber}
                        style={[
                            Typography.bodySmall,
                            styles.inputField,
                            {
                                borderColor: focusedInput === 'chip' ? '#BF38F2' : '#4C454D'
                            }
                        ]}
                    />
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.createNewAccountButton} onPress={() => handleSubmit()}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Finish</Text>
                </Pressable>
            </View>
        </SafeAreaView >
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
        alignItems: 'flex-start',
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