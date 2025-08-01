import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    FlatList,
    Image
} from 'react-native';
import { Pet, Vaccination } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import { usePet } from '../../contexts/PetContext';
import { Images } from '../../constants/Images';
import AddVaccineModal from './modals/AddVaccineModal';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type VaccinesDataRouteProp = RouteProp<PetPassportStackParamList, 'Vaccines'>;

const Vaccines = () => {
    const route = useRoute<VaccinesDataRouteProp>();
    // const { pet, setPet } = usePet();
    const navigation = useNavigation();
    const { petId } = route.params as { petId: string };

    const [pet, setPet] = useState<Pet>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [vaccinations, setVaccinations] = useState<Vaccination[]>();

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
                setVaccinations(
                    (pet?.vaccinations ?? []).sort((a: Vaccination, b: Vaccination) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                );

            } catch (error) {
                console.error('Failed to load pets:', error);
            }
        };
        fetchPet();
    }, []);


    const handleClose = () => {
        setIsModalOpen(false);
    }


    const today = new Date();

    const RenderVaccination = (vaccination: Vaccination) => {
        let statusElement;
        const vaccinationDate = new Date(vaccination.timestamp);

        if (vaccination.completed) {
            statusElement = (
                <View style={styles.statusContainerGreen}>
                    <Ionicons name="checkmark-outline" size={20} color="#71BA54" style={{ marginRight: 5 }} />
                    <Text style={[Typography.button, { color: "#71BA54" }]}>Done</Text>
                </View>
            );
        } else if (vaccinationDate > today) {
            statusElement = (
                <View style={styles.statusContainerYellow}>
                    <Ionicons name="time-outline" size={20} color="#EBC948" style={{ marginRight: 5 }} />
                    <Text style={[Typography.button, { color: "#EBC948" }]}>To do</Text>
                </View>
            );
        } else {
            statusElement = (
                <View style={styles.statusContainerRed}>
                    <Ionicons name="close-outline" size={20} color="#FF5A5F" style={{ marginRight: 5 }} />
                    <Text style={[Typography.button, { color: "#FF5A5F" }]}>Missed</Text>
                </View>
            );
        }
        return (
            <SafeAreaView
                style={styles.navRow}
            >
                <View key={vaccination._id} style={styles.navRowInner}>
                    <SafeAreaView style={styles.petInfo}>
                        <Text style={[Typography.heading, { color: "#F7F7F7" }]}>{vaccination.name}</Text>
                        <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                            {new Date(vaccination.timestamp).toLocaleDateString('en-GB')}
                        </Text>

                    </SafeAreaView>
                    {statusElement}
                </View>
            </SafeAreaView>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.bottomGlow} resizeMode="contain" />
            <FlatList
                data={vaccinations}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={styles.container}>
                            <PetHeaderSection
                                title="Vaccines"
                                pet={pet}
                                onBack={() => navigation.goBack()}
                                onShare={() => navigation.navigate('PetQrScreen', { petId: petId })}
                            />
                        </View>

                        <View style={styles.content}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignContent: 'center', width: '100%' }}>
                                <Text style={[Typography.bodyMediumSemiBold, { color: '#F7F7F7' }]}>
                                    Vaccination Records
                                    {/* ({vaccinations?.length ?? 0}) */}
                                </Text>
                                <View style={styles.badge}>
                                    <Text style={[Typography.bodyExtraSmall, { color: '#71BA54' }]}>All vaccines up to date</Text>
                                </View>
                            </View>
                            <View style={styles.card}>
                                <Text style={[Typography.bodyMedium, { color: '#D8D5D9', textAlign: 'center' }]}>Add new vaccination or revaccination</Text>
                                <Pressable style={styles.button} onPress={() => setIsModalOpen(true)}>
                                    <Ionicons name="add" size={18} color="#322E33" />
                                    <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add vaccine</Text>
                                </Pressable>
                            </View>
                        </View>
                    </SafeAreaView>
                }
                renderItem={({ item }) => RenderVaccination(item)}
                contentContainerStyle={styles.scrollContent}
            />
            <AddVaccineModal
                visible={isModalOpen}
                onClose={() => handleClose()}
                currentPetId={petId}
            />
        </SafeAreaView>
    );

}

export default Vaccines;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        gap: 16
    },
    navRow: {
        width: '95%',
        marginHorizontal: 'auto',
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#322E33',
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    badge: {
        borderRadius: 100,
        borderWidth: 0.5,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderColor: '#558C3F',
        backgroundColor: '#2A4620',
        color: '#71BA54'
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
    petInfo: {
        flex: 1,
    },
    statusContainerGreen: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 999,
        backgroundColor: '#2A4620',
        borderColor: '#558C3F',
        borderWidth: 0.5,
        alignItems: 'center',
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
    },
    statusContainerYellow: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 999,
        backgroundColor: '#3F3A1D',
        borderColor: '#EBC948',
        borderWidth: 0.5,
        alignItems: 'center',
    },
    statusContainerRed: {
        flexDirection: 'row',
        padding: 10,
        borderRadius: 999,
        backgroundColor: '#4D2022',
        borderColor: '#FF5A5F',
        borderWidth: 0.5,
        alignItems: 'center',
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
    bottomGlow: {
        position: 'absolute',
        top: 250,
        left: -150,
        width: 700,
        height: 700,
        opacity: 0.6,
    },
})