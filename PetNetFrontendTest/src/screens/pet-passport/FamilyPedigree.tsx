import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    Image,
    FlatList
} from 'react-native';
import { Pet } from "../../types/Pet";
import { useCallback, useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import dayjs from 'dayjs';
import { Images } from '../../constants/Images';
import { usePet } from '../../contexts/PetContext';
import { getPetById } from '../../services/PetService';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type FamilyPedigreeDataRouteProp = RouteProp<PetPassportStackParamList, 'FamilyPedigree'>;

const FamilyPedigree = () => {
    const route = useRoute<FamilyPedigreeDataRouteProp>();
    const { petId } = route.params as { petId: string };
    const navigation = useNavigation();
    const [pet, setPet] = useState<Pet>();
    const [parents, setParents] = useState<Pet[]>([]);
    const [children, setChildren] = useState<Pet[]>([]);


    useFocusEffect(
        useCallback(() => {
            fetchPet();
            fetchFamily();
        }, [petId])
    );

    const fetchPet = async () => {
        const { pet, error } = await getPetById(petId);

        if (error) {
            console.warn(error);
            return;
        }

        if (pet) {
            setPet(pet);
            console.log("LJUBIMCINA: ", pet);
        }
    }

    const fetchFamily = async () => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            if (!token) {
                console.warn('No JWT token found');
                return;
            }
            const response = await fetch(`${API_URL}/pets/family/${petId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                console.error('Failed to fetch pets:', response.status);
                return;
            }
            const family = await response.json();
            setParents(family?.parents || []);
            setChildren(family?.children || []);
            console.log("Parents: ", parents);

        } catch (error) {
            console.error('Failed to load pet family:', error);
        }
    };

    const calculateAge = (dob: string) => {
        const years = dayjs().diff(dayjs(dob), 'year');
        const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
        return `${years}y ${months}m`;
    };

    const RenderPet = (selectedPet: Pet | undefined, navigation: any, typeOfFamilyMember: string) => {
        if (!selectedPet) {
            return (
                <SafeAreaView style={styles.petCard}>
                    <Ionicons name='close-circle-outline' size={30} color="#F7F7F7" style={{ marginHorizontal: 6 }} />
                    <SafeAreaView style={styles.petInfo}>
                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>This pet doesn't have parents</Text>
                    </SafeAreaView>
                </SafeAreaView>
            )
        }
        return (
            <Pressable
                key={selectedPet._id}
                onPress={() => navigation.navigate('PetPassportStack', {
                    screen: 'PetPassport',
                    params: { petId: selectedPet._id }
                })}
                style={styles.navRow}
            >
                <SafeAreaView key={selectedPet._id} style={styles.navRowInner}>
                    <Image source={{ uri: selectedPet.imageUrl }} style={styles.petImage} />
                    <SafeAreaView style={styles.petInfo}>
                        <Text style={[Typography.bodyMediumSemiBold, { color: "#F7F7F7" }]}>{selectedPet.name}</Text>
                        <Text style={[Typography.bodySmall, { color: "#D8D5D9" }]}>
                            Parent • {calculateAge(selectedPet.dateOfBirth)}
                        </Text>
                    </SafeAreaView>
                    <Ionicons name='chevron-forward-outline' size={20} color="#B2ABB3" style={styles.rightArrow} />
                </SafeAreaView>
            </Pressable>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <FlatList
                data={children}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <>
                        <View style={styles.container}>
                            <PetHeaderSection
                                title="Family Pedigree"
                                pet={pet}
                                editable={true}
                                onBack={() => navigation.goBack()}
                                // onShare={() => navigation.navigate('PetQrScreen', { petId: pet?._id })}
                                onEdit={() => navigation.navigate('EditFamilyPedigree', { petId: petId })}
                            />
                        </View>

                        <Text style={[Typography.heading, { color: '#F7F7F7', marginLeft: 10, marginTop: 20, marginBottom: 10 }]}>Parents</Text>
                        <View>
                            {parents.length > 0 ? (
                                parents.map((parent) => RenderPet(parent, navigation, 'parent'))
                            ) : (
                                <SafeAreaView style={styles.petCard}>
                                    <Ionicons name='close-circle-outline' size={30} color="#F7F7F7" style={{ marginHorizontal: 6 }} />
                                    <SafeAreaView style={styles.petInfo}>
                                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>This pet doesn't have parents</Text>
                                    </SafeAreaView>
                                </SafeAreaView>
                            )}
                        </View>

                        <Text style={[Typography.heading, { color: '#F7F7F7', marginLeft: 10, marginTop: 24, marginBottom: 10 }]}>Children</Text>
                    </>
                }
                renderItem={({ item }) => RenderPet(item, navigation, 'children')}
                ListEmptyComponent={
                    <SafeAreaView style={styles.petCard}>
                        <Ionicons name='close-circle-outline' size={30} color="#F7F7F7" style={{ marginHorizontal: 6 }} />
                        <SafeAreaView style={styles.petInfo}>
                            <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>This pet doesn't have children</Text>
                        </SafeAreaView>
                    </SafeAreaView>
                }
                contentContainerStyle={styles.scrollContent}
            />
        </SafeAreaView>
    );

}

export default FamilyPedigree;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
    },
    navRow: {
        width: '95%',
        marginHorizontal: 'auto',
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#262326',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#322E33'
    },
    input: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
        marginBottom: 10,
        alignItems: 'flex-start'
    },
    navRowText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 500,
        color: '#F1EFF2',
        padding: 5
    },
    rightArrow: {
    },
    navRowInner: {
        flexDirection: 'row',
        alignItems: 'center',
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
    dataSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    button: {
        display: 'flex',
        marginHorizontal: 'auto',
        width: '95%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%'
    },
    scrollContent: {
        paddingBottom: 16,
    },
    section: {
        width: '95%',
        marginHorizontal: 'auto',
        backgroundColor: '#322E33',
        borderRadius: 8,
        marginVertical: 10,
        padding: 10
    },
    petCard: {
        flexDirection: 'row',
        backgroundColor: '#262326',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        width: '95%',
        marginHorizontal: 'auto',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#322E33',
        gap: 16
    },
    petImage: {
        width: 45,
        height: 45,
        borderRadius: 75,
        alignSelf: 'center',
        marginRight: 10
    },
    petInfo: {
        flex: 1,
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
})