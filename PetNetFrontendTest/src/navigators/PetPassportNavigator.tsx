
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PetPassport from '../screens/pet-passport/PetPassport';
import FamilyPedigree from '../screens/pet-passport/FamilyPedigree';
import Awards from '../screens/pet-passport/Awards';
import MedicalInterventions from '../screens/pet-passport/MedicalInterventions';
import OwnerData from '../screens/pet-passport/OwnerData';
import Vaccines from '../screens/pet-passport/Vaccines';
import PetQrScreen from '../screens/pet-passport/PetQrScreen';

export type PetPassportStackParamList = {
    PetPassport: { petId: string };
    FamilyPedigree: { petId: string };
    Awards: { petId: string };
    MedicalInterventions: { petId: string };
    Vaccines: { petId: string };
    OwnerData: { petId: string };
    PetQrScreen: { petId: string };
};

const Stack = createNativeStackNavigator<PetPassportStackParamList>();

const PetPassportNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PetPassport" component={PetPassport} />
            <Stack.Screen name="FamilyPedigree" component={FamilyPedigree} />
            <Stack.Screen name="Awards" component={Awards} />
            <Stack.Screen name="MedicalInterventions" component={MedicalInterventions} />
            <Stack.Screen name="Vaccines" component={Vaccines} />
            <Stack.Screen name="OwnerData" component={OwnerData} />
            <Stack.Screen name="PetQrScreen" component={PetQrScreen} />
        </Stack.Navigator>
    );
};

export default PetPassportNavigator;
