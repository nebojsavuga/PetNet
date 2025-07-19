import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Typography } from '../constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/RootStackParamList';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Pet } from '../types/Pet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

//const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
const API_URL = 'http://192.168.0.31:3000/api';

dayjs.extend(relativeTime);

type NavProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavProp>();

  const [name, setName] = useState('Aleksa');
  const [pets, setPets] = useState<Pet[]>([]);
  useEffect(() => {
    const fetchUserAndPets = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          if (user?.fullName) {
            setName(user.fullName);
          }
        }
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          console.warn('No JWT token found');
          return;
        }

        const response = await fetch(`${API_URL}/pets`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          console.error('Failed to fetch pets:', response.status);
          return;
        }

        const petsFromApi = await response.json();
        setPets(petsFromApi);

      } catch (error) {
        console.error('Failed to load user or pets:', error);
      }
    };

    fetchUserAndPets();
  }, []);
  const calculateAge = (dob: string) => {
    const years = dayjs().diff(dayjs(dob), 'year');
    const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
    return `${years}y ${months}m`;
  };

  const renderPetCard = (pet: Pet, navigation: NavProp) => {
    const incompleteVaccinations = pet.vaccinations.filter(vac => !vac.completed);

    if (incompleteVaccinations.length === 0) {
      // No incomplete vaccinations - don't show badge
      return (
        <Pressable
          key={pet._id}
          onPress={() => navigation.navigate('PetPassportStack', {
            screen: 'PetPassport',
            params: { petId: pet._id }
          })}
        >
          <SafeAreaView key={pet._id} style={styles.petCard}>
            <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
            <SafeAreaView style={styles.petInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petDetails}>
                {pet.breed} • {calculateAge(pet.dateOfBirth)} • {pet.gender}
              </Text>
              {/* No badge */}
            </SafeAreaView>
          </SafeAreaView>
        </Pressable>
      );
    }
    const latestVaccination = incompleteVaccinations[0];

    incompleteVaccinations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const now = dayjs();
    const vacDate = dayjs(latestVaccination.timestamp);

    let vaccineBadgeText = '';
    if (vacDate.isBefore(now, 'day')) {
      vaccineBadgeText = `Last Vaccination: ${vacDate.format('MMM D, YYYY')}`;
    } else {
      const diffDays = vacDate.diff(now, 'day');
      if (diffDays < 30) {
        vaccineBadgeText = `Next Vaccination in: ${diffDays}d`;
      } else {
        const diffMonths = vacDate.diff(now, 'month');
        vaccineBadgeText = `Next Vaccination in: ${diffMonths}m`;
      }
    }
    return (
      <Pressable
        key={pet._id}
        onPress={() => navigation.navigate('PetPassportStack', {
          screen: 'PetPassport',
          params: { petId: pet._id }
        })}
      >
        <SafeAreaView key={pet._id} style={styles.petCard}>
          <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
          <SafeAreaView style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petDetails}>
              {pet.breed} • {calculateAge(pet.dateOfBirth)} • {pet.gender}
            </Text>

            <View style={[styles.vaccineBadge, { backgroundColor: vacDate.isBefore(now, 'day') ? '#888888' : '#E8B23C' }]}>
              <Text style={styles.vaccineBadgeText}>{vaccineBadgeText}</Text>
            </View>
          </SafeAreaView>
        </SafeAreaView>
      </Pressable >
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.h1, styles.sectionTitle]}>Hello, {name}</Text>
        <View style={styles.icons}>
          <Ionicons name="notifications-outline" size={22} color="#fff" />
          <Ionicons name="settings-outline" size={22} color="#fff" style={{ marginLeft: 16 }} />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Pets Passports</Text>
      </View>

      {pets.length === 0 ? (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#F7F7F7', marginBottom: 8 }}>
            Create Pet Passport
          </Text>
          <Text style={{ fontSize: 14, color: '#BBB', textAlign: 'center' }}>
            Create your pet’s passport and unlock access to their health records anytime, anywhere.
          </Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => renderPetCard(item, navigation)}
          style={{ flexGrow: 0 }}
        />
      )}

      <Pressable style={styles.newPetButton} onPress={() => navigation.navigate('CreatePetPassport')}>
        <Text style={styles.newPetButtonText}>+ New Pet Passport</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#19171A',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icons: {
    flexDirection: 'row',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  viewAll: {
    color: '#A18AF4',
    fontSize: 14,
  },
  petCard: {
    flexDirection: 'row',
    backgroundColor: '#242124',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3D',
  },
  petImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  petDetails: {
    color: '#B0AEB1',
    fontSize: 14,
    marginTop: 2,
  },
  vaccineBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  vaccineBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#242424',
  },

  newPetButton: {
    backgroundColor: '#BF38F2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  newPetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
