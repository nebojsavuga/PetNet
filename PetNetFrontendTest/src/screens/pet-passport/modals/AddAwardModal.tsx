import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    Pressable,
    Platform,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Typography } from '../../../constants/Typography';
import { Award } from '../../../types/Pet';

const AddAwardModal = ({ visible, onClose, onSave, awardToEdit }: {
    visible: boolean;
    onClose: () => void;
    onSave: (award: Award) => void;
    awardToEdit?: Award;
}) => {

    const [place, setPlace] = useState<'1st' | '2nd' | '3rd' | 'Participated'>('Participated');
    const [awardName, setAwardName] = useState('');
    const [showName, setShowName] = useState('');
    const [id, setId] = useState<string | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);
    useEffect(() => {
        if (awardToEdit) {
            setId(awardToEdit._id);
            setPlace(awardToEdit.place);
            setAwardName(awardToEdit.awardName);
            setShowName(awardToEdit.showName);
            setDate(new Date(awardToEdit.date));
        } else {
            setPlace('Participated');
            setAwardName('');
            setShowName('');
            setDate(null);
        }
    }, [awardToEdit]);

    const handleSubmit = () => {
        if (!awardName || !showName || !date) return;
        onSave({
            _id: id,
            place,
            awardName,
            showName,
            date: new Date(date).toISOString()
        });
        setPlace('Participated');
        setAwardName('');
        setShowName('');
        setDate(null);
        setId(null);
    };

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Pressable style={styles.backdrop} onPress={onClose}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <Pressable onPress={() => { }} style={styles.modalBackground}>
                            <SafeAreaView style={{ width: '100%' }}>
                                <Text style={[Typography.bodyBold, { color: '#F1EFF2', marginBottom: 10, textAlign: 'center' }]}>
                                    Add Pet Award
                                </Text>

                                {/* Award Name */}
                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 5 }]}>Award Name</Text>
                                    <TextInput
                                        value={awardName}
                                        onChangeText={setAwardName}
                                        placeholder="Best in Show"
                                        placeholderTextColor="#D8D5D9"
                                        onFocus={() => setFocusedInput('awardName')}
                                        onBlur={() => setFocusedInput(null)}
                                        style={[
                                            Typography.bodySmall,
                                            styles.inputField,
                                            { borderColor: focusedInput === 'awardName' ? '#BF38F2' : '#4C454D' }
                                        ]}
                                    />
                                </View>

                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 5 }]}>Show Name</Text>
                                    <TextInput
                                        value={showName}
                                        onChangeText={setShowName}
                                        placeholder="Belgrade Dog Expo"
                                        placeholderTextColor="#D8D5D9"
                                        onFocus={() => setFocusedInput('showName')}
                                        onBlur={() => setFocusedInput(null)}
                                        style={[
                                            Typography.bodySmall,
                                            styles.inputField,
                                            { borderColor: focusedInput === 'showName' ? '#BF38F2' : '#4C454D' }
                                        ]}
                                    />
                                </View>

                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 5 }]}>Place</Text>
                                    <View style={styles.pickerWrapper}>
                                        <Picker
                                            selectedValue={place}
                                            onValueChange={setPlace}
                                            style={styles.picker}
                                            dropdownIconColor="#D8D5D9"
                                            itemStyle={{ color: '#F1EFF2', fontSize: 14 }}
                                            mode="dropdown"
                                        >
                                            <Picker.Item label="1st" value="1st" />
                                            <Picker.Item label="2nd" value="2nd" />
                                            <Picker.Item label="3rd" value="3rd" />
                                            <Picker.Item label="Participated" value="Participated" />
                                        </Picker>
                                    </View>
                                </View>

                                <View style={styles.input}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 5 }]}>Date</Text>
                                    <Pressable onPress={() => setIsDatePickerOpen(true)} style={styles.inputField}>
                                        <Text style={[Typography.bodySmall, { color: date ? '#F7F7F7' : '#D8D5D9' }]}>
                                            {date ? date.toLocaleDateString() : "Select a date"}
                                        </Text>
                                    </Pressable>

                                    {isDatePickerOpen && (
                                        <DateTimePicker
                                            value={date || new Date()}
                                            mode="date"
                                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                            maximumDate={new Date()}
                                            onChange={(event, selectedDate) => {
                                                setIsDatePickerOpen(Platform.OS === 'ios');
                                                if (selectedDate) setDate(selectedDate);
                                            }}
                                            themeVariant="dark"
                                        />
                                    )}
                                </View>

                                <Pressable style={styles.saveButton} onPress={handleSubmit}>
                                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
                                </Pressable>
                                <Pressable style={styles.cancelButton} onPress={onClose}>
                                    <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>Cancel</Text>
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
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center'
    },
    modalBackground: {
        backgroundColor: '#4C454D',
        borderRadius: 16,
        padding: 20,
        width: '90%',
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

export default AddAwardModal;
