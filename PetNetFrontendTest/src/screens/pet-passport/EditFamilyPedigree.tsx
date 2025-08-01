import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import Ionicons from '@expo/vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import SelectAddParentModal from './modals/SelectAddParentModal'
import AddParentWithPetNetModal from './modals/AddParentWithPetNetModal'
import { PetPassportStackParamList } from '../../navigators/PetPassportNavigator'
import { Pet } from '../../types/Pet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants';
import dayjs from 'dayjs'
import { usePet } from '../../contexts/PetContext'

type EditFamilyPedigreeDataRouteProp = RouteProp<PetPassportStackParamList, 'EditFamilyPedigree'>;
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
const EditFamilyPedigree = () => {

    const route = useRoute<EditFamilyPedigreeDataRouteProp>();
    const { pet, setPet, updatePet } = usePet();
    const navigation = useNavigation();
    const [parents, setParents] = useState<Pet[]>([]);
    const [children, setChildren] = useState<Pet[]>([]);
    const [isInitialModalVisible, setInitialModalVisible] = useState(false);
    const [isSelectingModalVisible, setSelectingModalVisible] = useState(false);

    const handleClose = () => {
        setSelectingModalVisible(false);
        setInitialModalVisible(false);
    }

    useEffect(() => {
        fetchFamily();
    }, [])

    const fetchFamily = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                console.warn('No JWT token found');
                return;
            }

            const response = await fetch(`${API_URL}/pets/family/${pet?._id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch pets:', response.status);
                return;
            }

            const family = await response.json();
            setParents(family?.parents || []);
            setChildren(family?.children || []);
            updatePet();
            fetchFamily();

        } catch (error) {
            console.error('Failed to load pet family:', error);
        }
    };

    const calculateAge = (dob: string) => {
        const years = dayjs().diff(dayjs(dob), 'year');
        const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
        return `${years}y ${months}m`;
    };

    const deleteParent = async (parentId: string) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');

            if (!token) {
                console.warn('No JWT token found');
                return;
            }

            console.log("PETID: ", pet?._id);
            console.log("PARENTID: ", parentId)

            const response = await fetch(`${API_URL}/pets/${pet?._id}/deleteParent/${parentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('Failed to remove parent:', response.status);
                return;
            }

            const updatedChild = await response.json();
            setPet(updatedChild?.updatedPet);
            updatePet();
            fetchFamily();
        } catch (error) {
            console.error('Failed to delete pet parent:', error);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.header}>
                <Text style={[Typography.h6, { color: '#F1EFF2' }]}>Family Pedigree</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={32} color="#F1EFF2" />
                </Pressable>
            </View>
            <View style={styles.content}>
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={[Typography.bodyMedium, { color: '#F1EFF2' }]}>Parents</Text>

                        {/* ✅ Show add button ONLY if there's 1 parent */}
                        {parents.length === 1 && (
                            <Pressable style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }} onPress={() => setInitialModalVisible(true)}>
                                <Ionicons name="add" size={26} color="#F1EFF2" />
                                <Text style={[Typography.bodySmall, { color: '#F1EFF2' }]}>Add Parent</Text>
                            </Pressable>
                        )}
                    </View>
                    {parents.length === 0 && (
                        <View style={styles.card}>
                            <Text style={[Typography.bodyMedium, { color: '#D8D5D9' }]}>Currently no parents assigned</Text>
                            <Pressable style={styles.button} onPress={() => setInitialModalVisible(true)}>
                                <Ionicons name="add" size={18} color="#322E33" />
                                <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add parents</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* ✅ Case 2 & 3: Show one or two parent cards */}
                    {parents.length > 0 && (
                        <View style={{ gap: 12 }}>
                            {parents.map((parent) => (
                                <View key={parent._id} style={styles.petCardContainer}>
                                    <Pressable onPress={() => deleteParent(parent._id)} style={{ backgroundColor: '#FF3B30', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                                    </Pressable>

                                    <View style={styles.petCard}>
                                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F7F7F7' }]}>{parent.name}</Text>
                                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>
                                            {parent.breed} • {calculateAge(parent.dateOfBirth)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={[Typography.bodyMedium, { color: '#F1EFF2' }]}>Children</Text>
                    <View style={styles.card}>
                        <Text style={[Typography.bodyMedium, { color: '#D8D5D9' }]}>Currently no children assigned</Text>
                        <Pressable style={styles.button}>
                            <Ionicons name="add" size={18} color="#322E33" />
                            <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add children</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
            <SelectAddParentModal
                visible={isInitialModalVisible}
                onClose={() => handleClose()}
                onExistingSelected={() => {
                    setInitialModalVisible(false);
                    setTimeout(() => { setSelectingModalVisible(true), 300 })
                }}
                pet={pet}
            />
            <AddParentWithPetNetModal
                visible={isSelectingModalVisible}
                onClose={() => handleClose()}
                currentPetId={pet?._id}
            />
        </SafeAreaView>
    )
}

export default EditFamilyPedigree

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 32,
        position: 'relative'
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
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginTop: 16,
        width: '100%'
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
        backgroundColor: "#FFFFFF1A"
    },
    petCardContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%',
        borderColor: "#4C454D",
        backgroundColor: "#FFFFFF1A",
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        marginTop: 8
    },
    petCard: {
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
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
    }
})