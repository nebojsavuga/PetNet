
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PetPassport from '../screens/pet-passport/PetPassport';
import FamilyPedigree from '../screens/pet-passport/FamilyPedigree';
import Awards from '../screens/pet-passport/Awards';
import MedicalInterventions from '../screens/pet-passport/MedicalInterventions';
import OwnerData from '../screens/pet-passport/OwnerData';
import Vaccines from '../screens/pet-passport/Vaccines';
import PetQrScreen from '../screens/pet-passport/PetQrScreen';
import EditFamilyPedigree from '../screens/pet-passport/EditFamilyPedigree';
import PetParentsBasicInfo from '../screens/pet-passport/PetParentsBasicInfo';
import { Pet } from '../types/Pet';

export type PetPassportStackParamList = {
    PetPassport: { petId: string };
    FamilyPedigree: undefined
    Awards: undefined
    MedicalInterventions: undefined
    Vaccines: undefined
    OwnerData: undefined
    PetQrScreen: undefined
    EditFamilyPedigree: undefined
    PetParentsBasicInfo: undefined
};

const Stack = createNativeStackNavigator<PetPassportStackParamList>();

const PetPassportNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PetPassport" component={PetPassport} />
            <Stack.Screen name="FamilyPedigree" component={FamilyPedigree} />
            <Stack.Screen name="EditFamilyPedigree" component={EditFamilyPedigree} />
            <Stack.Screen name="Awards" component={Awards} />
            <Stack.Screen name="MedicalInterventions" component={MedicalInterventions} />
            <Stack.Screen name="Vaccines" component={Vaccines} />
            <Stack.Screen name="OwnerData" component={OwnerData} />
            <Stack.Screen name="PetQrScreen" component={PetQrScreen} />
            <Stack.Screen name="PetParentsBasicInfo" component={PetParentsBasicInfo} />
        </Stack.Navigator>
    );
};

export default PetPassportNavigator;
