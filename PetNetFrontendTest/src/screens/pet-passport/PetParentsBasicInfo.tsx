import { Alert, Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Typography } from '../../constants/Typography';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Styles } from '../../constants/Styles';
import { PetPassportStackParamList } from '../../navigators/PetPassportNavigator';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from '../../types/Pet';
import { usePet } from '../../contexts/PetContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type PetTempParentDataRouteProp = RouteProp<PetPassportStackParamList, 'PetParentsBasicInfo'>;

const PetParentsBasicInfo = () => {
    const route = useRoute<PetTempParentDataRouteProp>();
    const { pet, setPet } = usePet();

    const navigator = useNavigation();

    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [gender, setGender] = useState<
        | 'Male'
        | 'Female'
        | 'Castrated Male'
        | 'Sterilized Female'
        | 'Unknown'
        | 'Sterilized Unknown'
        | ''
    >('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(new Date(2020, 1, 1));
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const handleAddParent = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) return { error: 'No JWT token found' };

            const body = JSON.stringify({
                name,
                breed,
                gender,
                dateOfBirth: dateOfBirth?.toISOString()
            })

            console.log("BODY: ", body);
            const response = await fetch(`${API_URL}/pets/${pet._id}/add-temporary-parent`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    breed,
                    gender,
                    dateOfBirth: dateOfBirth?.toISOString(),
                    owner: '000000000000000000000000'
                })
            })

            const data = await response.json();
            setPet(data.updatedPet);
            console.log('datcina: ', data);
            if (!response.ok) {
                Alert.alert('Error', data.error || 'Failed to add parent.');
                return;
            }

            Alert.alert('Success', 'Parent added and linked successfully.');
            navigator.goBack();

        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Something went wrong.');
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.content}>
                <View style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                    <Ionicons name="arrow-back" size={32} color={'#ffffff'} onPress={navigator.goBack} />
                    <Ionicons name="close" size={32} color={'#ffffff'} />
                </View>
                <Text style={[Typography.h6, { color: '#ffffff' }]}>Your pet’s parent basic info</Text>

                <View style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 16 }}>
                    <View style={styles.input}>
                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Name</Text>
                        <TextInput placeholder="Your pet's name"
                            placeholderTextColor={'#D8D5D9'}
                            value={name}
                            onChangeText={setName}
                            onFocus={() => setFocusedInput('name')}
                            onBlur={() => setFocusedInput(null)}
                            style={[
                                Typography.bodySmall,
                                styles.inputField,
                                {
                                    borderColor: focusedInput === 'name' ? '#BF38F2' : '#4C454D'
                                }
                            ]}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Breed</Text>
                        <TextInput placeholder="e.g. Golden Retriever"
                            placeholderTextColor={'#D8D5D9'}
                            value={breed}
                            onChangeText={setBreed}
                            onFocus={() => setFocusedInput('breed')}
                            onBlur={() => setFocusedInput(null)}
                            style={[
                                Typography.bodySmall,
                                styles.inputField,
                                {
                                    borderColor: focusedInput === 'breed' ? '#BF38F2' : '#4C454D'
                                }
                            ]}
                        />
                    </View>

                    <View style={styles.input}>
                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2', marginBottom: 4 }]}>Gender</Text>
                        <View style={[styles.inputField, { paddingHorizontal: 0, justifyContent: 'center' }]}>
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue) => setGender(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#D8D5D9"
                                itemStyle={{ color: '#F1EFF2', fontSize: 14 }}
                                mode="dropdown"
                            >
                                <Picker.Item label="Select gender..." value="" color="#D8D5D9" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Castrated Male" value="Castrated Male" />
                                <Picker.Item label="Sterilized Female" value="Sterilized Female" />
                                <Picker.Item label="Unknown" value="Unknown" />
                                <Picker.Item label="Sterilized Unknown" value="Sterilized Unknown" />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.input}>
                        <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Date of birth</Text>
                        <Pressable onPress={() => setIsDatePickerOpen(true)} style={styles.inputField}>
                            <Text style={[Typography.bodySmall, { color: dateOfBirth ? '#F7F7F7' : '#D8D5D9', marginTop: 15 }]}>
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
            </View>
            <Pressable style={Styles.defaultButton} onPress={handleAddParent}>
                <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Add parent</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default PetParentsBasicInfo

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        height: '100%',
        paddingTop: 32,
        paddingBottom: 32,
        paddingHorizontal: 16,
        justifyContent: 'space-between'
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
    content: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 32
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
    picker: {
        color: '#F1EFF2',
        width: '100%',
        height: 56,
        backgroundColor: 'transparent',
        fontSize: 14,
        paddingHorizontal: 16
    },
})