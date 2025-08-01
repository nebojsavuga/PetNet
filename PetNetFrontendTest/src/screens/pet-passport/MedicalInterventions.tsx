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
import { Intervention, Pet } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import { usePet } from '../../contexts/PetContext';
import { Images } from '../../constants/Images';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type MedicalInterventionsDataRouteProp = RouteProp<PetPassportStackParamList, 'MedicalInterventions'>;

const MedicalInterventions = () => {
    const route = useRoute<MedicalInterventionsDataRouteProp>();
    // const { petId } = route.params as { petId: string };
    const { pet, setPet } = usePet();
    const navigation = useNavigation();
    const [medicalInterventions, setMedicalInterventions] = useState<Intervention[]>();

    useEffect(() => {

        const fetchPet = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                    console.warn('No JWT token found');
                    return;
                }
                const response = await fetch(`${API_URL}/pets/${pet?._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    console.error('Failed to fetch pets:', response.status);
                    return;
                }

                const fetchedPet = await response.json();
                setPet(fetchedPet);
                setMedicalInterventions(pet?.interventions ?? []);

            } catch (error) {
                console.error('Failed to load pets:', error);
            }
        };
        fetchPet();
    }, []);
    const RenderIntervention = (intervention: Intervention) => {
        return (
            <SafeAreaView
                style={styles.navRow}
            >
                <View key={intervention._id} style={styles.navRowInner}>
                    <SafeAreaView style={styles.petInfo}>
                        <Text style={[Typography.heading, { color: "#F7F7F7" }]}>{intervention.interventionName}</Text>
                        <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                            {intervention.clinicName}
                        </Text>
                        <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                            {intervention.vetName}
                        </Text>
                    </SafeAreaView>
                    <Ionicons name='calendar-outline' size={20} color="#B2ABB3" style={[styles.rightArrow, { marginRight: 5 }]} />
                    <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                        {new Date(intervention.date).toLocaleDateString('en-GB')}
                    </Text>
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
                data={medicalInterventions}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={
                    <>
                        <View style={styles.container}>
                            <PetHeaderSection
                                title="Medical Interventions"
                                pet={pet}
                                onBack={() => navigation.goBack()}
                                onShare={() => navigation.navigate('PetQrScreen', { pet: pet })}
                            />
                        </View>

                        <Text style={[Typography.heading, { color: '#F7F7F7', marginLeft: 10, marginTop: 20, marginBottom: 10 }]}>Interventions ({medicalInterventions?.length ?? 0})</Text>
                        <SafeAreaView
                            style={[styles.navRow, { paddingVertical: 20, backgroundColor: '#2A4620', borderColor: '#558C3F' }]}
                        >
                            <View style={styles.navRowInner}>
                                <SafeAreaView style={styles.petInfo}>
                                    <Text style={[Typography.heading, { color: "#F1EFF2" }]}>Add new intervention</Text>
                                    <Text style={[Typography.bodySmall, { color: "#D8D5D9" }]}>
                                        Get a link for veterinarian
                                    </Text>
                                </SafeAreaView>
                                <Pressable onPress={() => console.log('Add icon pressed')} style={{ marginRight: 5 }}>
                                    <Ionicons name='add-circle-outline' size={35} color="#71BA54" />
                                </Pressable>
                            </View>
                        </SafeAreaView>
                    </>
                }
                renderItem={({ item }) => RenderIntervention(item)}
                contentContainerStyle={styles.scrollContent}
            />
        </SafeAreaView>
    );

}

export default MedicalInterventions;

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
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
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