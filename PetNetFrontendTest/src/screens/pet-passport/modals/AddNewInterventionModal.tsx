import { Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import Constants from 'expo-constants'
import { Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Typography } from '../../../constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';


const WEB_BASE_URL = Constants.expoConfig?.extra?.webUrl || 'http://localhost:4200';

const AddNewInterventionModal = ({ visible, onClose, petId }: {
    visible: boolean;
    onClose: () => void;
    petId: string
}) => {
    const link = `http://localhost:4200/${petId}`;

    const handleCopy = async () => {
        try {
            await Clipboard.setStringAsync(link);
        } catch (e) {
            console.warn('Copy failed', e);
        }
    };

    const handleShare = async () => {
        try {
            const content = Platform.select({
                ios: { url: link, message: link },
                android: { message: link },
                default: { message: link }
            });

            const options = Platform.select({
                ios: { subject: 'Veterinary intervention link' },
                android: { dialogTitle: 'Share intervention link' },
                default: {}
            });

            await Share.share(content!, options);
        } catch (e) {
            console.warn('Share failed', e);
        }
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <Pressable onPress={() => { }} style={styles.modalBackground}>
                            <SafeAreaView style={{ width: '100%' }}>
                                <Text style={[Typography.bodyBold, { color: '#F1EFF2', marginBottom: 10, textAlign: 'center' }]}>
                                    New Intervention Link
                                </Text>

                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 5 }]}>Link</Text>
                                    <View style={styles.linkRow}>
                                        <TextInput
                                            value={link}
                                            editable={false}
                                            placeholderTextColor="#D8D5D9"
                                            style={[Typography.bodySmall, styles.inputField, styles.linkInput]}
                                        />
                                        <Pressable style={styles.copyButton} onPress={handleCopy}>
                                            <Ionicons name="copy" size={22} color="#E5E3E6" />
                                        </Pressable>
                                    </View>
                                </View>

                                <Pressable style={styles.saveButton} onPress={handleShare}>
                                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Share with Veterinarian</Text>
                                </Pressable>
                            </SafeAreaView>
                        </Pressable>
                    </KeyboardAvoidingView>
                </Pressable>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center'
    },
    modalBackground: {
        backgroundColor: '#262326',
        borderColor: '#4C454D',
        borderWidth: 1,
        borderRadius: 16,
        padding: 20,
        width: '92%',
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        marginTop: 10,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    linkInput: {
        flex: 1,
        minWidth: 0,
        marginRight: 8,
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
    copyButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D',
        backgroundColor: '#FFFFFF1A'
    }
});

export default AddNewInterventionModal