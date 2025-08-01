import { Alert, AppState, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCameraPermissions, CameraView } from 'expo-camera';
import { Overlay } from '../../../components/Overlay';
import { Picker } from '@react-native-picker/picker';
import { Images } from '../../../constants/Images';
import { Typography } from '../../../constants/Typography';
import { usePet } from '../../../contexts/PetContext';
import { fetchUserAndPets, getPetById } from '../../../services/PetService';
import { Pet } from '../../../types/Pet';
import Constants from 'expo-constants'
import { Styles } from '../../../constants/Styles';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

const AddChildWithPetNetModal = ({ visible, onClose, currentPetId }: {
    visible: boolean;
    onClose: () => void;
    currentPetId: string
}) => {

    const [isQRScanning, setIsQRScanning] = useState(false);
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const [pets, setPets] = useState<Pet[]>([]);
    const [permission, requestPermission] = useCameraPermissions();
    const [child, setChild] = useState<string>('');
    const { pet, setPet, updatePet } = usePet();

    useEffect(() => {
        if (visible) loadData();
    }, [visible]);

    useEffect(() => {
        if (isQRScanning) {
            qrLock.current = false;
        }
    }, [isQRScanning]);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const isPermissionGranted = Boolean(permission?.granted);

    const handleScanner = () => {
        if (permission?.granted) {
            setIsQRScanning(true);
        } else {
            requestPermission();
        }
    };

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

    const loadData = async () => {
        const { user, pets, error } = await fetchUserAndPets();

        if (error) {
            console.warn(error);
            return;
        }

        console.log("PETS: ", pets);
        console.log("CURRENTPETID: ", currentPetId);
        if (pets && pet) {
            const currentId = currentPetId;
            const parentIds = pet.parents || [];

            const filteredPets = pets.filter(p =>
                p._id !== currentId &&
                !parentIds.includes(p._id) &&
                !pet.children.includes(p._id)
            );

            setPets(filteredPets);
        }
    };

    const onSaveChild = async (childId: string | undefined, id: string | undefined) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');

            if (!token) {
                console.warn('No JWT token found');
                return;
            }

            const response = await fetch(`${API_URL}/pets/${id}/assign-existing-child/${childId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Error while saving parent', response.status);
                return;
            }

            const data = await response.json();
            setPet(data.updatedPet);
            Alert.alert('Success', 'Child added and linked successfully.');
            updatePet();
            onClose();

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong.');
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
                                            Add Child with PetNet Account
                                        </Text>
                                    </View>

                                    <View style={styles.input}>
                                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 4 }]}>Choose from your list of pet passports</Text>
                                        <View style={[styles.inputField, { paddingHorizontal: 0, justifyContent: 'center' }]}>
                                            <Picker
                                                selectedValue={child}
                                                onValueChange={(itemValue) => setChild(itemValue)}
                                                style={styles.picker}
                                                dropdownIconColor="#D8D5D9"
                                                itemStyle={{ color: '#F1EFF2', fontSize: 14 }}
                                                mode="dropdown"
                                            >
                                                <Picker.Item label="Select a pet from your list..." value="" color="#D8D5D9" />
                                                {pets.map((pet) => (
                                                    <Picker.Item key={pet._id} label={pet.name} value={pet._id} color="#262326" />
                                                ))}
                                            </Picker>
                                        </View>
                                    </View>

                                    <Pressable style={Styles.defaultButton} onPress={handleScanner}>
                                        <Image source={Images.qrCodeIcon} style={{ width: 18, height: 18 }} />
                                        <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Scan QR code to add</Text>
                                    </Pressable>

                                    {child !== '' && (
                                        <Pressable
                                            style={[Styles.defaultButton]}
                                            onPress={() => {
                                                onSaveChild(child, currentPetId)
                                            }}
                                        >
                                            <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
                                        </Pressable>
                                    )}
                                </SafeAreaView>
                            </Pressable>
                        </KeyboardAvoidingView>
                    </Pressable>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal visible={isQRScanning} animationType="fade" transparent={false}>
                <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                    <CameraView
                        style={StyleSheet.absoluteFillObject}
                        facing="back"
                        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                        onBarcodeScanned={({ data }) => {
                            if (data && !qrLock.current) {
                                qrLock.current = true;
                                setTimeout(async () => {
                                    console.log("QR Data:", data);
                                    setIsQRScanning(false);
                                    const known = ['Pipo', 'Svrca', 'Krompirkovic', 'Belka'];
                                    if (known.includes(data)) setChild(data as any);
                                    else alert('Unknown pet name');
                                }, 500);
                            }
                        }}

                    />

                    <Overlay />

                    <Pressable style={styles.cancelButton} onPress={() => setIsQRScanning(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                </SafeAreaView>
            </Modal>
        </>
    )
}

export default AddChildWithPetNetModal

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
        marginTop: 10,
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
