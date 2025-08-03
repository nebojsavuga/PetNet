import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../../constants/Typography';
import { usePetPassport } from '../../contexts/CreatePetPassportContext';
import { CreatingPetPassportStackParamList } from '../../types/CreatingPetPassportStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Vaccine } from '../../types/Vaccine';
import Constants from 'expo-constants'
import { Vaccination } from '../../types/Pet';
import AddVaccineModal from './modals/AddVaccineModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images } from '../../constants/Images';

type Step4NavProp = NativeStackNavigationProp<CreatingPetPassportStackParamList, "Step4">;

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
const Step4Screen = () => {
    const navigation = useNavigation<Step4NavProp>();

    const { updateData, data } = usePetPassport();
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getVaccines = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');

                if (!token) {
                    Alert.alert('No jwt token');
                    return;
                }

                const response = await fetch(`${API_URL}/vaccines/getAll`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    Alert.alert('Error while fetching vaccines');
                    console.warn('Error while fetching vaccines: ', response.status);
                    return;
                }

                const res = await response.json();
                setVaccines(res.vaccines);
            } catch (error) {
                Alert.alert('Error while fetching vaccines');
                return
            }
        }
        getVaccines();
    }, []);

    const handleAddVaccine = (vaccine: Vaccine, timestamp: Date) => {
        const vaccination: Vaccination = {
            vaccineId: vaccine._id,
            timestamp: timestamp.toISOString(),
            completed: true,
            vaccine,
            nextDue: new Date(timestamp.getTime() + vaccine.revaccinationPeriod * 86400000).toISOString()
        };

        updateData({
            vaccinations: [...(data.vaccinations || []), vaccination]
        });
    };

    const removeVaccination = (vaccineId: string) => {
        updateData({
            vaccinations: data.vaccinations?.filter(v => v.vaccine._id !== vaccineId)
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />

            <KeyboardAvoidingView
                style={{ flex: 1, width: '100%' }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    {/* Header */}
                    <View style={styles.upperContent}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                        </Pressable>
                        <Text style={[Typography.h6, { color: '#F7F7F7', marginBottom: 16 }]}>Your pet's basic info</Text>
                    </View>

                    {/* Scrollable content */}
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {vaccines.map((vaccine) => {
                            const existing = data.vaccinations?.find(v => v.vaccine._id === vaccine._id);
                            return (
                                <View key={vaccine._id} style={styles.input}>
                                    <Text style={[Typography.bodyMediumMedium, { color: '#F1EFF2' }]}>{vaccine.name}</Text>
                                    <View style={styles.card}>
                                        {existing ? (
                                            <View style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                                                <Pressable onPress={() => removeVaccination(vaccine._id)} style={{ backgroundColor: '#FF3B30', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                                                    <Ionicons name="remove" size={18} color="#FFFFFF" />
                                                </Pressable>
                                                <Image source={Images.vaccineIcon} style={{ width: 40, height: 40 }} />
                                                <Text style={[Typography.bodyMedium, { color: '#D8D5D9' }]}>
                                                    {new Date(existing.timestamp).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: '2-digit',
                                                    })}
                                                </Text>
                                            </View>

                                        ) : (
                                            <>
                                                <Text style={[Typography.bodyMedium, { color: '#D8D5D9', textAlign: 'center' }]}>
                                                    No vaccination record
                                                </Text>
                                                <Pressable
                                                    onPress={() => {
                                                        setSelectedVaccine(vaccine);
                                                        setModalVisible(true);
                                                    }}
                                                    style={styles.button}>
                                                    <Ionicons name="add" size={18} color="#322E33" />
                                                    <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add vaccine</Text>
                                                </Pressable>
                                            </>
                                        )}
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.connectionSection}>
                        <Pressable
                            onPress={() => navigation.navigate('Step5')}
                            style={styles.createNewAccountButton}
                        >
                            <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
                        </Pressable>
                    </View>
                </View>

                <AddVaccineModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    vaccine={selectedVaccine}
                    onConfirm={(timestamp) => {
                        if (selectedVaccine) {
                            handleAddVaccine(selectedVaccine, timestamp);
                            setModalVisible(false);
                        }
                    }}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default Step4Screen

const styles = StyleSheet.create({
    scrollContent: {
        gap: 24,
        width: '100%',
        paddingBottom: 24,
    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%'
    },
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
    picker: {
        color: '#F1EFF2',
        width: '100%',
        height: 56,
        backgroundColor: 'transparent',
        fontSize: 14,
        paddingHorizontal: 16
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 32,
        marginBottom: 32
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
        alignItems: 'flex-start',
        alignSelf: 'stretch',
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
    vaccines: {
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
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        gap: 16,
        borderColor: "#4C454D",
        backgroundColor: "#FFFFFF1A",
        alignSelf: 'stretch',
    },
    button: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#E5E3E6'
    },
})