import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Pet } from '../types/Pet';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const fetchUserAndPets = async (): Promise<{
    user?: { fullName: string };
    pets?: any[];
    error?: string;
}> => {
    try {
        const userJson = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('jwtToken');

        if (!token) return { error: 'No JWT token found' };

        const user = userJson ? JSON.parse(userJson) : undefined;

        const response = await fetch(`${API_URL}/pets`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return { user, error: `Failed to fetch pets: ${response.status}` };
        }

        const pets = await response.json();
        return { user, pets };
    } catch (error: any) {
        return { error: error.message };
    }
};

export const getPetById = async (petId: string): Promise<{
    pet?: Pet;
    error?: string;
}> => {
    try {
        const token = await AsyncStorage.getItem('jwtToken');

        if (!token) return { error: 'No JWT token found' };

        const response = await fetch(`${API_URL}/pets/${petId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            console.log("Error while fetching pet: ", response.status)
        }

        const pet = await response.json();
        return { pet };
    } catch (error: any) {
        return { error: error.message };
    }
}

// export const addTemporaryParent = async (petId : string, body: any): Promise<{
//     message? : string;
//     parent? : any;
//     updatedPet? : Pet;
//     error?: string;
// }> => {
//     try {
//         const token = await AsyncStorage.getItem('jwtToken');

//         if(!token) return {error : 'No JWT token found'};

//         const response = await fetch(`${API_URL}/pets/${petId}/add-temporary-parent`, {
//             headers: {
//                 'Authorization' : `Bearer ${token}`,
//                 'Content-Type' : 'application/json'
//             },
//             body: body
//         });

//         if(!response.ok){
//             console.log("Error while adding temporary pet parent: ", response.status)
//         }


//     } catch (error: any) {
//         return { error: error.message };
//     }
// }