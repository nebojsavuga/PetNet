import { Alert, AppState, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Pet } from '../../../types/Pet';
import { useCameraPermissions } from 'expo-camera';
import { fetchUserAndPets, getPetById } from '../../../services/PetService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants'
import { Typography } from '../../../constants/Typography';
import { Picker } from '@react-native-picker/picker';
import { Styles } from '../../../constants/Styles';
import { Images } from '../../../constants/Images';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Vaccine } from '../../../types/Vaccine';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

const AddVaccineModal = ({ visible, onClose, currentPetId }: {
    visible: boolean;
    onClose: () => void;
    currentPetId: string
}) => {
    const [vaccine, setVaccine] = useState<string>('');
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [pet, setPet] = useState<Pet>();
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(new Date(2020, 1, 1));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    useEffect(() => {
        if (visible) getVaccines();
    }, [visible]);

    useEffect(() => {
        const fetchPet = async () => {
            const { pet, error } = await getPetById(currentPetId);

            if (error) {
                console.warn(error);
                return;
            }

            if (pet) {
                setPet(pet);
            }
        }
        fetchPet();
    }, [currentPetId])

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

    return (
        <>
            <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <Pressable style={styles.backdrop} onPress={onClose}>
                        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                            <Pressable onPress={() => { }} style={styles.modalBackground}>
                                <SafeAreaView style={{ width: '100%', gap: 32 }}>
                                    <View style={{ flexDirection: 'column', gap: 8 }}>
                                        <Text style={[Typography.bodyMediumBold, { color: '#F1EFF2', textAlign: 'center' }]}>
                                            Add Vaccination Record
                                        </Text>
                                    </View>

                                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 16 }}>
                                        <View style={styles.input}>
                                            <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 4 }]}>Type</Text>
                                            <View style={[styles.inputField, { paddingHorizontal: 0, justifyContent: 'center' }]}>
                                                <Picker
                                                    selectedValue={vaccine}
                                                    onValueChange={(itemValue) => setVaccine(itemValue)}
                                                    style={styles.picker}
                                                    dropdownIconColor="#D8D5D9"
                                                    itemStyle={{ color: '#F1EFF2', fontSize: 14 }}
                                                    mode="dropdown"
                                                >
                                                    <Picker.Item label="Select vaccine type..." value="" color="#D8D5D9" />
                                                    {vaccines.map((pet) => (
                                                        <Picker.Item key={pet._id} label={pet.name} value={pet._id} color="#262326" />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </View>

                                        <View style={styles.input}>
                                            <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 4 }]}>Date</Text>
                                            <Pressable onPress={() => setIsDatePickerOpen(true)} style={styles.inputField}>
                                                <Text style={[Typography.bodySmall, { color: dateOfBirth ? '#F7F7F7' : '#D8D5D9' }]}>
                                                    {dateOfBirth ? dateOfBirth.toLocaleDateString() : "Your date of birth"}
                                                </Text>
                                            </Pressable>
                                            {isDatePickerOpen && (
                                                <DateTimePicker
                                                    value={dateOfBirth || new Date()}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    maximumDate={new Date()}
                                                    onChange={(event, selectedDate) => {
                                                        setIsDatePickerOpen(Platform.OS === 'ios');
                                                        if (selectedDate) setDateOfBirth(selectedDate);
                                                    }}
                                                    themeVariant="dark"
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {vaccine && (
                                        <Pressable style={Styles.defaultButton}>
                                            <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
                                        </Pressable>
                                    )}


                                </SafeAreaView>
                            </Pressable>
                        </KeyboardAvoidingView>
                    </Pressable>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}


export default AddVaccineModal

const scanWindowSize = 250;
const styles = StyleSheet.create({
    backdrop: {
        position: 'relative',
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center'
    },
    modalBackground: {
        backgroundColor: '#262326',
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        width: '95%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#4C454D'
    },
    input: {
        width: '100%',
    },
    inputField: {
        width: '100%',
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D',
        backgroundColor: "#FFFFFF1A",
        color: "#ffffffff",
        justifyContent: 'center',
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#4C454D',
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF1A',
        width: '100%',
        marginTop: 4,
    },
    picker: {
        height: 56,
        width: '100%',
        color: '#F1EFF2',
    },
    saveButton: {
        width: '100%',
        padding: 14,
        marginTop: 20,
        backgroundColor: '#BF38F2',
        borderRadius: 8,
        alignItems: 'center',
    },
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayRow: {
        flex: 1,
        width: '100%',
    },
    fullDark: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    middleRow: {
        flexDirection: 'row',
        height: scanWindowSize,
        width: '100%',
    },
    sideDark: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    scanArea: {
        width: scanWindowSize,
        height: scanWindowSize,
        borderColor: '#BF38F2',
        borderWidth: 2,
        backgroundColor: 'transparent',
        borderRadius: 16
    },
    cancelButton: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    cancelText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
