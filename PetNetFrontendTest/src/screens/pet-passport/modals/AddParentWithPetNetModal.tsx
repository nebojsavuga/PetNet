import { AppState, Image, Keyboard, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Typography } from '../../../constants/Typography'
import { Picker } from '@react-native-picker/picker';
import { Styles } from '../../../constants/Styles';
import { Images } from '../../../constants/Images';
import QRScanModal from './QRScanModal';
import { useCameraPermissions } from 'expo-image-picker';
import { Camera, CameraView } from 'expo-camera';
import { Overlay } from '../../../components/Overlay';
import { fetchUserAndPets } from '../../../services/PetService';
import { Pet } from '../../../types/Pet';


const AddParentWithPetNetModal = ({ visible, onClose }: {
    visible: boolean;
    onClose: () => void;
}) => {

    const [isQRScanning, setIsQRScanning] = useState(false);
    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);
    const [pets, setPets] = useState<Pet[]>([]);
    const [permission, requestPermission] = useCameraPermissions();
    const [parent, setParent] = useState<
        | 'Pipo'
        | 'Svrca'
        | 'Krompirkovic'
        | 'Belka'
        | ''
    >('');

    useEffect(() => {
        const loadData = async () => {
            const { user, pets, error } = await fetchUserAndPets();

            if (error) {
                console.warn(error);
                return;
            }

            if (pets) {
                setPets(pets);
            }
        };

        loadData();
    }, []);

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
                                            Add Parent with PetNet Account
                                        </Text>
                                    </View>

                                    <View style={styles.input}>
                                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 4 }]}>Choose from your list of pet passports</Text>
                                        <View style={[styles.inputField, { paddingHorizontal: 0, justifyContent: 'center' }]}>
                                            <Picker
                                                selectedValue={parent}
                                                onValueChange={(itemValue) => setParent(itemValue)}
                                                style={styles.picker}
                                                dropdownIconColor="#D8D5D9"
                                                itemStyle={{ color: '#F1EFF2', fontSize: 14 }}
                                                mode="dropdown"
                                            >
                                                <Picker.Item label="Select gender..." value="" color="#D8D5D9" />
                                                <Picker.Item label="Pipo" value="Pipo" />
                                                <Picker.Item label="Svrca" value="Svrca" />
                                                <Picker.Item label="Krompirkovic" value="Krompirkovic" />
                                                <Picker.Item label="Belka" value="Belka" />
                                            </Picker>
                                        </View>
                                    </View>

                                    <Pressable style={Styles.defaultButton} onPress={handleScanner}>
                                        <Image source={Images.qrCodeIcon} style={{ width: 18, height: 18 }} />
                                        <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Scan QR code to add</Text>
                                    </Pressable>
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
                                    if (known.includes(data)) setParent(data as any);
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

export default AddParentWithPetNetModal

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
