import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Pet } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import { User } from '../../types/User';

//const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
const API_URL = 'http://192.168.0.31:3000/api';
type OwnerDataRouteProp = RouteProp<PetPassportStackParamList, 'OwnerData'>;

const OwnerData = () => {
    const route = useRoute<OwnerDataRouteProp>();
    const { petId } = route.params as { petId: string };
    const navigation = useNavigation();
    const [pet, setPet] = useState<Pet>();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userJson = await AsyncStorage.getItem('user');
                if (userJson) {
                    setUser(JSON.parse(userJson) as User);
                }
            } catch (err) {
                console.error('Failed to load user from AsyncStorage:', err);
            }
        };
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
        loadUser();
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
                </View>
                <Text style={[Typography.heading, { color: '#F7F7F7', marginLeft: 10, marginTop: 20 }]}>Owner information</Text>
                <View style={styles.ownerInfoSection}>
                    <View style={styles.input}>
                        <Text style={[Typography.body, { color: '#F1EFF2' }]}>Name</Text>
                        <Text style={[Typography.heading, { color: '#F1EFF2' }]}>{user?.fullName}</Text>
                    </View>
                    <View style={styles.input}>
                        <Text style={[Typography.body, { color: '#F1EFF2' }]}>Location</Text>
                        <Text style={[Typography.heading, { color: '#F1EFF2' }]}>{user?.walletAddress}</Text>
                    </View>
                    <View style={styles.input}>
                        <Text style={[Typography.body, { color: '#F1EFF2' }]}>Email</Text>
                        <Text style={[Typography.heading, { color: '#F1EFF2' }]}>{user?.email}</Text>
                    </View>
                    <View style={styles.input}>
                        <Text style={[Typography.body, { color: '#F1EFF2' }]}>Phone</Text>
                        <Text style={[Typography.heading, { color: '#F1EFF2' }]}>{user?.phoneNumber}</Text>
                    </View>
                </View>
                <View style={{ marginTop: 6 }}>
                    <Pressable style={[styles.button, { flexDirection: 'row', alignItems: 'center' }]} onPress={() => console.log('Calling...')}>
                        <Ionicons name='call-outline' size={20} color="#F7F7F7" style={{ marginRight: 12 }} />
                        <Text style={[Typography.body, { color: '#F7F7F7' }]}>Call Owner</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default OwnerData;

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
    input: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
        marginBottom: 10,
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
    ownerInfoSection: {
        width: '95%',
        marginHorizontal: 'auto',
        backgroundColor: '#322E33',
        borderRadius: 8,
        marginVertical: 10,
        padding: 10
    },
})