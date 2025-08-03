import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1Screen from "../screens/create-pet-passport/Step1Screen";
import Step2Screen from "../screens/create-pet-passport/Step2Screen";
import Step3Screen from "../screens/create-pet-passport/Step3Screen";
import Step4Screen from "../screens/create-pet-passport/Step4Screen";
import Step5Screen from "../screens/create-pet-passport/Step5Screen";
import Step6Screen from "../screens/create-pet-passport/Step6Screen";
import { PetPassportProvider } from "../contexts/CreatePetPassportContext";

const Stack = createNativeStackNavigator();

const CreatePetPassportNavigator = () => (
    <PetPassportProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Step1" component={Step1Screen} />
            <Stack.Screen name="Step2" component={Step2Screen} />
            <Stack.Screen name="Step3" component={Step3Screen} />
            <Stack.Screen name="Step4" component={Step4Screen} />
            <Stack.Screen name="Step5" component={Step5Screen} />
            <Stack.Screen name="Step6" component={Step6Screen} />
        </Stack.Navigator>
    </PetPassportProvider>
);

export default CreatePetPassportNavigator;