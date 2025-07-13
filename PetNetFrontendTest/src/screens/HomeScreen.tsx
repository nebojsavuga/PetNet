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

        // Set dummy pets (replace with actual API call)
        setPets([
          {
            _id: '1',
            name: 'Bella',
            imageUrl: 'https://www.borrowmydoggy.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F4ij0poqn%2Fproduction%2Fda89d930fc320dd912a2a25487b9ca86b37fcdd6-800x600.jpg&w=1080&q=80',
            breed: 'Golden Retriever',
            gender: 'Female',
            dateOfBirth: '2021-12-01',
            race: 'Dog',
            owner: '1',
            children: [],
            awards: [],
            vaccinations: [],
            interventions: [],
            createdAt: '',
            updatedAt: ''
          },
          {
            _id: '2',
            name: 'Cathy',
            imageUrl: 'https://i.pinimg.com/736x/0c/11/8e/0c118e6b7af51cf3718f5682a701f466.jpg',
            breed: 'Ugly cat',
            gender: 'Male',
            dateOfBirth: '2018-09-15',
            race: 'Cat',
            owner: '1',
            children: [],
            awards: [],
            vaccinations: [],
            interventions: [],
            createdAt: '',
            updatedAt: ''
          },
        ]);
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

  const renderPetCard = (pet: Pet) => {
    const vaccineText = 'Vaccination in 3 days';
    return (
      <SafeAreaView key={pet._id} style={styles.petCard}>
        <Image source={{ uri: pet.imageUrl }} style={styles.petImage} />
        <SafeAreaView style={styles.petInfo}>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petDetails}>
            {pet.breed} • {calculateAge(pet.dateOfBirth)} • {pet.gender}
          </Text>
          <View style={styles.vaccineBadge}>
            <Text style={styles.vaccineBadgeText}>{vaccineText}</Text>
          </View>
        </SafeAreaView>
      </SafeAreaView>
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
          renderItem={({ item }) => renderPetCard(item)}
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
    backgroundColor: '#E8B23C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  vaccineBadgeText: {
    fontSize: 12,
    color: '#242424',
    fontWeight: '600',
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
