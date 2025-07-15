import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    SafeAreaView,
    ScrollView
} from 'react-native';
import { Pet } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from 'dayjs';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

type PetPassportRouteProp = RouteProp<PetPassportStackParamList, 'PetPassport'>;

const PetPassport = () => {
    const route = useRoute<PetPassportRouteProp>();
    const { petId } = route.params as { petId: string };
    const navigation = useNavigation();

    const [pet, setPet] = useState<Pet>();
    const calculateAge = (dob?: string) => {
        const years = dayjs().diff(dayjs(dob), 'year');
        const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
        return `${years}y ${months}m`;
    };
    const handleSharePress = () => {
        console.log('Share QR');
    };
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
                    <View style={styles.upperContent}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Pet Passport</Text>
                        <Pressable onPress={handleSharePress}>
                            <Ionicons name="qr-code-outline" size={24} color="#F1EFF2" />
                        </Pressable>
                    </View>
                    <View style={styles.dataSection}>
                        <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
                        <Text style={styles.petName}>{pet?.name}</Text>
                        <Text style={styles.petDetails}>
                            {pet?.breed} • {calculateAge(pet?.dateOfBirth)} • {pet?.gender}
                        </Text>
                        <Text style={styles.chipId}>Chip ID: {pet?.chipNumber}</Text>
                    </View>
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
    header: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
        color: '#F1EFF2'
    },
    petImage: {
        width: 112,
        height: 112,
        borderRadius: 75,
        marginTop: 50,
        alignSelf: 'center',
        borderWidth: 6,
        borderColor: '#322E33'
    },
    petName: {
        fontSize: 30,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: 0,
        color: '#F1EFF2'
    },
    petDetails: {
        fontSize: 16,
        color: '#D8D5D9',
        textAlign: 'center',
        letterSpacing: 0,
        fontWeight: 500,
        lineHeight: 24
    },
    chipId: {
        fontSize: 14,
        color: '#D8D5D9',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: 500,
        backgroundColor: '#262326',
        gap: 10,
        paddingTop: 4,
        paddingRight: 12,
        paddingBottom: 4,
        paddingLeft: 12,
        borderRadius: 999,
        width: '70%',
        marginHorizontal: 'auto'
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        width: '100%',
        backgroundColor: '#322E33',
        paddingHorizontal: 16,
        paddingVertical: 24
    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%'
    },
    picker: {
        color: '#F1EFF2',
        width: '100%',
        height: 56,
        backgroundColor: 'transparent',
        fontSize: 14,
        paddingHorizontal: 16
    },

    connectWalletButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#242424"
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        width: '100%',
        backgroundColor: "#4C454D",
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
    createNewAccountButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialButtons: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 8
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