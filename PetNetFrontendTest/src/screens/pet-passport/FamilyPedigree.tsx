import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import dayjs from 'dayjs';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type FamilyPedigreeDataRouteProp = RouteProp<PetPassportStackParamList, 'FamilyPedigree'>;

const FamilyPedigree = () => {
    const route = useRoute<FamilyPedigreeDataRouteProp>();
    const { petId } = route.params as { petId: string };
    const navigation = useNavigation();
    const [pet, setPet] = useState<Pet>();
    const [father, setFather] = useState<Pet>();
    const [mother, setMother] = useState<Pet>();
    const [children, setChildren] = useState<Pet[]>([]);

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                    console.warn('No JWT token found');
                    return;
                }
                const response = await fetch(`${API_URL}/pets/${petId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch pets:', response.status);
                    return;
                }

                const pet = await response.json();
                setPet(pet);

            } catch (error) {
                console.error('Failed to load user or pets:', error);
            }
        };
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
                setChildren(family?.children);
                setFather(family?.father);
                setMother(family?.mother);

            } catch (error) {
                console.error('Failed to load pet family:', error);
            }
        };

        fetchPet();
        fetchFamily();
    }, []);
    const calculateAge = (dob: string) => {
        const years = dayjs().diff(dayjs(dob), 'year');
        const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
        return `${years}y ${months}m`;
    };

    const RenderPet = (selectedPet: Pet | undefined, navigation: any, typeOfFamilyMember: string) => {
        if (!selectedPet) {
            return (<SafeAreaView style={styles.petCard}>
                <Ionicons name='close-circle-outline' size={45} color="#F7F7F7" style={{ marginHorizontal: 6 }} />
                <SafeAreaView style={styles.petInfo}>
                    <Text style={[Typography.heading, { color: '#F1EFF2' }]}>This pet doesn't have a {typeOfFamilyMember}</Text>
                </SafeAreaView>
            </SafeAreaView>)
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
                        <Text style={[Typography.heading, { color: "#F7F7F7" }]}>{selectedPet.name}</Text>
                        <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                            {typeOfFamilyMember} • {calculateAge(selectedPet.dateOfBirth)}
                        </Text>
                    </SafeAreaView>
                    <Ionicons name='chevron-forward-outline' size={20} color="#B2ABB3" style={styles.rightArrow} />
                </SafeAreaView>
            </Pressable>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={children}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <>
                        <View style={styles.container}>
                            <PetHeaderSection
                                title="Family Pedigree"
                                pet={pet}
                                onBack={() => navigation.goBack()}
                                onShare={() => navigation.navigate('PetQrScreen', { petId: pet?._id })}
                            />
                        </View>

                        <Text style={[Typography.heading, { color: '#F7F7F7', marginLeft: 10, marginTop: 20, marginBottom: 10 }]}>Parents</Text>
                        <View>
                            {RenderPet(father, navigation, 'father')}
                            {RenderPet(mother, navigation, 'mother')}
                        </View>

                        <Text style={[Typography.heading, { color: '#F7F7F7', marginLeft: 10, marginTop: 30, marginBottom: 10 }]}>Children</Text>
                    </>
                }
                renderItem={({ item }) => RenderPet(item, navigation, 'children')}
                ListEmptyComponent={
                    <SafeAreaView style={styles.petCard}>
                        <Ionicons name='close-circle-outline' size={45} color="#F7F7F7" style={{ marginHorizontal: 6 }} />
                        <SafeAreaView style={styles.petInfo}>
                            <Text style={[Typography.heading, { color: '#F1EFF2' }]}>This pet doesn't have children</Text>
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
        backgroundColor: '#322E33',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
        backgroundColor: '#322E33',
        borderRadius: 12,
        paddingVertical: 20,
        marginBottom: 12,
        width: '95%',
        marginHorizontal: 'auto',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A3A3D',
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
    }
})