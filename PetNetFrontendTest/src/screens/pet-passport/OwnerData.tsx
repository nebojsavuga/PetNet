import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    ScrollView,
    Image,
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
import { Images } from '../../constants/Images';
import { usePet } from '../../contexts/PetContext';
import { getPetById } from '../../services/PetService';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type OwnerDataRouteProp = RouteProp<PetPassportStackParamList, 'OwnerData'>;

const OwnerData = () => {
    const route = useRoute<OwnerDataRouteProp>();
    const { petId } = route.params as { petId: string };

    const [pet, setPet] = useState<Pet>();
    const navigation = useNavigation();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchPet = async () => {
            const { pet, error } = await getPetById(petId);

            if (error) {
                console.warn(error);
                return;
            }

            if (pet) {
                setPet(pet);
            }
        }
        fetchPet();
    }, [petId])

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
        loadUser();
    }, []);
    return (
        <SafeAreaView>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.bottomGlow} resizeMode="contain" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <PetHeaderSection
                        title="Owner data"
                        pet={pet}
                        onBack={() => navigation.goBack()}
                        onShare={() => navigation.navigate('PetQrScreen', { petId: petId })}
                    />
                </View>
                <Text style={[Typography.bodyMediumSemiBold, { color: '#F7F7F7', marginLeft: 10, marginTop: 20 }]}>Owner’s Contact Information</Text>
                <View style={styles.ownerInfoSection}>
                    <View style={styles.input}>
                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>Name</Text>
                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>{user?.fullName}</Text>
                    </View>
                    <View style={styles.input}>
                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>Location</Text>
                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>{user?.walletAddress}</Text>
                    </View>
                    <View style={styles.input}>
                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>Email</Text>
                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>{user?.email}</Text>
                    </View>
                    <View style={styles.input}>
                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>Phone</Text>
                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>{user?.phoneNumber}</Text>
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
        backgroundColor: '#262326',
        borderRadius: 8,
        marginVertical: 10,
        padding: 16,
        gap: 16,
        borderWidth: 1,
        borderColor: '#322E33'
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