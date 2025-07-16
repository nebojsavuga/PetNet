import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Pet } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";

//const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
const API_URL = 'http://192.168.0.31:3000/api';
type PetPassportRouteProp = RouteProp<PetPassportStackParamList, 'PetPassport'>;

const PetPassport = () => {
    const route = useRoute<PetPassportRouteProp>();
    const { petId } = route.params as { petId: string };
    const navigation = useNavigation();

    const [pet, setPet] = useState<Pet>();
    const navItems: { label: string; icon: string; screen: keyof PetPassportStackParamList }[] = [
        { label: 'Owner data', icon: 'person-outline', screen: 'OwnerData' },
        { label: 'Family Pedigree', icon: 'people-outline', screen: 'FamilyPedigree' },
        { label: 'Vaccines', icon: 'medkit-outline', screen: 'Vaccines' },
        { label: 'Medical interventions', icon: 'bandage-outline', screen: 'MedicalInterventions' },
        { label: 'Awards', icon: 'ribbon-outline', screen: 'Awards' },
    ];
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

        fetchPet();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <PetHeaderSection
                        title="Pet Passport"
                        pet={pet}
                        onBack={() => navigation.goBack()}
                    />
                    <View style={styles.emergencyBlock}>
                        <View style={styles.emergencyRow}>
                            <MaterialIcons name="error-outline" size={32} color="#FF3B30" />
                            <View style={styles.emergencyTextContainer}>
                                <Text style={styles.emergencyTitle}>Emergency contact</Text>
                                <Text style={styles.emergencySubtitle}>
                                    If pet is found injured or lost
                                </Text>
                            </View>
                        </View>

                        <Pressable style={styles.emergencyButton} onPress={() => {
                            console.log('Emergency call pressed');
                        }}>
                            <Entypo name="phone" size={20} color="#fff" />
                            <Text style={styles.emergencyButtonText}>Emergency call</Text>
                        </Pressable>
                    </View>
                    <View style={styles.navSection}>
                        {navItems.map(({ label, icon, screen }, index) => (
                            <Pressable
                                key={label}
                                style={[
                                    styles.navRow,
                                    index === navItems.length - 1 && styles.lastNavRow,
                                ]}
                                onPress={() => navigation.navigate(screen, { petId: pet._id })}
                            >
                                <View style={styles.navRowInner}>
                                    <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color="#D988F7" style={{ marginRight: 12 }} />
                                    <Text style={styles.navRowText}>{label}</Text>
                                </View>
                                <Ionicons name='chevron-forward-outline' size={20} color="#B2ABB3" style={styles.rightArrow} />
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default PetPassport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
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
    dataSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    rowInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%'
    },
    emergencyBlock: {
        backgroundColor: '#5E0E1B',
        borderRadius: 12,
        padding: 16,
        marginTop: 40,
        marginBottom: 20,
        width: '95%',
        marginHorizontal: 'auto'
    },
    emergencyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    emergencyTextContainer: {
        flexShrink: 1,
    },
    emergencyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    emergencySubtitle: {
        color: '#FFD1CF',
        marginTop: 4,
        fontSize: 14,
    },
    emergencyButton: {
        marginTop: 20,
        backgroundColor: '#EC2443',
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    emergencyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    navSection: {
        width: '95%',
        marginHorizontal: 'auto',
        backgroundColor: '#322E33',
        borderRadius: 6,
        marginVertical: 10
    },
    navRow: {
        width: '100%',
        borderBottomColor: '#aaa4acff',
        borderBottomWidth: 0.2,
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    scrollContent: {
        paddingBottom: 16,
    },
    lastNavRow: {
        borderBottomWidth: 0,
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})