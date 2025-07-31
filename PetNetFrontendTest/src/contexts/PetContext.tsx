import { ReactNode, createContext, useContext, useState } from "react";
import { Pet } from "../types/Pet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';


type PetContextType = {
    pet: Pet | undefined;
    setPet: (pet: Pet) => void;
    updatePet: () => Promise<void>;
};

const PetContext = createContext<PetContextType | undefined>(undefined);
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';

export const PetProvider = ({ children }: { children: ReactNode }) => {
    const [pet, setPet] = useState<Pet | undefined>(undefined);

    const updatePet = async () => {
        if (!pet?._id) return;
        const token = await AsyncStorage.getItem('jwtToken');
        const response = await fetch(`${API_URL}/pets/${pet._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const updatedPet = await response.json();
        setPet(updatedPet);
    };

    return (
        <PetContext.Provider value={{ pet, setPet, updatePet }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePet = () => {
    const context = useContext(PetContext);

    if (!context) {
        throw new Error('usePet must be used within a PetProvider');
    }

    return context;
}