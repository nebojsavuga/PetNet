import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Alert, Modal, TouchableWithoutFeedback, Keyboard, Pressable, KeyboardAvoidingView, Platform, SafeAreaView, View, StyleSheet, Text } from "react-native";
import { Typography } from "../../../constants/Typography";
import { getPetById } from "../../../services/PetService";
import { Pet } from "../../../types/Pet";
import { Vaccine } from "../../../types/Vaccine";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Styles } from "../../../constants/Styles";

const AddVaccineModal = ({ visible, onClose, vaccine, onConfirm }: {
    visible: boolean;
    onClose: () => void;
    vaccine: Vaccine | null
    onConfirm: (date: Date) => void
}) => {

    const [vaccinationDate, setVaccinationDate] = useState<Date>(new Date(2020, 1, 1));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <Pressable style={styles.modalBackground}>
                            <SafeAreaView style={{ width: '100%', gap: 32 }}>
                                <Text style={[Typography.bodyMediumBold, { color: '#F1EFF2', textAlign: 'center' }]}>
                                    Add Vaccination Record
                                </Text>

                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Vaccine</Text>
                                    <Text style={[Typography.bodyMediumMedium, { color: '#F1EFF2' }]}>{vaccine?.name}</Text>
                                </View>

                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Date</Text>
                                    <Pressable onPress={() => setIsDatePickerOpen(true)} style={styles.inputField}>
                                        <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>
                                            {vaccinationDate.toLocaleDateString()}
                                        </Text>
                                    </Pressable>
                                    {isDatePickerOpen && (
                                        <DateTimePicker
                                            value={vaccinationDate}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            maximumDate={new Date()}
                                            onChange={(event, selectedDate) => {
                                                setIsDatePickerOpen(Platform.OS === 'ios');
                                                if (selectedDate) setVaccinationDate(selectedDate);
                                            }}
                                            themeVariant="dark"
                                        />
                                    )}
                                </View>

                                <Pressable
                                    onPress={() => onConfirm(vaccinationDate)}
                                    style={Styles.defaultButton}>
                                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Confirm</Text>
                                </Pressable>
                            </SafeAreaView>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </TouchableWithoutFeedback>
        </Modal>
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