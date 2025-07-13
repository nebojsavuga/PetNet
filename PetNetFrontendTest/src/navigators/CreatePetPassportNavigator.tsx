import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1Screen from "../screens/create-pet-passport/Step1Screen";
import Step2Screen from "../screens/create-pet-passport/Step2Screen";
import Step3Screen from "../screens/create-pet-passport/Step3Screen";
import { PetPassportProvider } from "../contexts/CreatePetPassportContext";

const Stack = createNativeStackNavigator();

const CreatePetPassportNavigator = () => (
    <PetPassportProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Step1" component={Step1Screen} />
            <Stack.Screen name="Step2" component={Step2Screen} />
            <Stack.Screen name="Step3" component={Step3Screen} />
        </Stack.Navigator>
    </PetPassportProvider>
);

export default CreatePetPassportNavigator;