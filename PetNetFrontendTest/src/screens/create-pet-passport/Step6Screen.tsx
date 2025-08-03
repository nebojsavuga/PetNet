import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Images } from '../../constants/Images';
import { Typography } from '../../constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/RootStackParamList';
import { usePetPassport } from '../../contexts/CreatePetPassportContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

const Step6Screen = () => {
    const { data, updateData } = usePetPassport();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [isSaving, setIsSaving] = useState(true);

    useEffect(() => {
        const savePet = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                    Alert.alert('Unauthorized', 'You must be logged in.');
                    return;
                }

                let ipfsUrl = data.imageUrl;

                // Upload image to IPFS if local
                if (ipfsUrl?.startsWith('file://')) {
                    const formData = new FormData();
                    formData.append('image', {
                        uri: ipfsUrl,
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

                // Prepare vaccinations (strip out `vaccine._id`)
                const vaccinations = data.vaccinations?.map((v) => ({
                    vaccine: v.vaccine._id,
                    timestamp: v.timestamp,
                    completed: v.completed
                })) || [];

                const payload = {
                    name: data.name,
                    gender: data.gender,
                    chipNumber: data.chipNumber,
                    race: data.race,
                    breed: data.breed,
                    dateOfBirth: data.dateOfBirth,
                    imageUrl: ipfsUrl,
                    awards: data.awards || [],
                    vaccinations
                };

                const petResponse = await fetch(`${API_URL}/pets`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                const petData = await petResponse.json();

                if (!petResponse.ok) {
                    Alert.alert('Error', petData.error || 'Could not create pet');
                    return;
                }

                setIsSaving(false);
            } catch (err) {
                console.error(err);
                Alert.alert('Error', 'Unexpected error occurred while saving your pet');
            }
        };

        savePet();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
            </View>

            {isSaving ? (
                <View style={styles.middleSection}>
                    <ActivityIndicator size="large" color="#BF38F2" />
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7', marginTop: 16 }]}>Saving your pet passport...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.middleSection}>
                        <Image source={Images.finish} style={{ width: 40, height: 40 }} />
                        <Text style={[Typography.h6, { color: '#F1EFF2' }]}>You're good to go!</Text>
                        <Text style={[Typography.bodyMediumMedium, { color: '#F1EFF2', textAlign: 'center' }]}>
                            {data.name}'s Passport is successfully created
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'HomeScreen' }],
                            });
                        }}
                        style={styles.createNewAccountButton}
                    >
                        <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue to App</Text>
                    </Pressable>
                </>
            )}
        </SafeAreaView>
    )
}

export default Step6Screen

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 32,
        position: 'relative',
        paddingHorizontal: 16
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
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
    middleSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        gap: 8
    }
})