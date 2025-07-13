import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import WalletConnectionScreen from "../screens/WalletConnectionScreen";
import { useState } from "react";
import OnboardingNavigator from "./OnboardingNavigator";
import { RootStackParamList } from "../types/RootStackParamList";
import CreatePetPassportNavigator from "./CreatePetPassportNavigator";
import HomeScreen from "../screens/HomeScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
    const [step, setStep] = useState<"splash" | "wallet" | "onboarding" | "home" | "passport">("splash");

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="WalletConnectionScreen" component={WalletConnectionScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="CreatePetPassport" component={CreatePetPassportNavigator} />
        </Stack.Navigator>
    );
};

export default RootNavigator;