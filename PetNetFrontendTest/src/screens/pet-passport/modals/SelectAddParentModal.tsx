import { Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useState } from 'react'
import { Picker } from '@react-native-picker/picker';
import { Typography } from '../../../constants/Typography';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PetPassportStackParamList } from '../../../navigators/PetPassportNavigator';
import { Pet } from '../../../types/Pet';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SelectAddParentModal = ({ visible, onClose, onExistingSelected, pet }: {
    visible: boolean;
    onClose: () => void;
    onExistingSelected: () => void;
    pet: Pet | undefined;
}) => {

    const navigator = useNavigation<NativeStackNavigationProp<PetPassportStackParamList>>();

    const handleTemporaryPetNavigation = () => {
        console.log('Navigating to PetParentsBasicInfo with pet:', pet);
        onClose();
        navigator.navigate('PetParentsBasicInfo', { pet });
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <Pressable onPress={() => { }} style={styles.modalBackground}>
                            <SafeAreaView style={{ width: '100%', gap: 32 }}>
                                <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <Text style={[Typography.bodyMediumBold, { color: '#F1EFF2', textAlign: 'center' }]}>
                                        Does it have the Pet Net Account?
                                    </Text>
                                    <Text style={[Typography.bodySmall, { color: '#F1EFF2', textAlign: 'center' }]}>
                                        Pets who have account on our network can be added in Family Pedigree by just entering the UID
                                    </Text>
                                </View>

                                <View style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 8 }}>
                                    <Pressable style={styles.saveButton} onPress={onExistingSelected}>
                                        <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Parent has the PetNet Account</Text>
                                    </Pressable>
                                    <Pressable style={styles.cancelButton} onPress={() => handleTemporaryPetNavigation()}>
                                        <Text style={[Typography.bodySmall, { color: '#D988F7' }]}>Create a Temporary Account</Text>
                                    </Pressable>
                                </View>
                            </SafeAreaView>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

export default SelectAddParentModal

const styles = StyleSheet.create({
    backdrop: {
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
    cancelButton: {
        width: '100%',
        padding: 14,
        marginTop: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
});
