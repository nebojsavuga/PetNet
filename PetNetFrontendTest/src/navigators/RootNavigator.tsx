import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import WalletConnectionScreen from "../screens/WalletConnectionScreen";
import { useEffect, useState } from "react";
import OnboardingNavigator from "./OnboardingNavigator";
import { HomeNavigator } from "./HomeNavigator";
import { RootStackParamList } from "../types/RootStackParamList";

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator = () => {
    const [step, setStep] = useState<"splash" | "wallet" | "onboarding" | "home">("splash");

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="WalletConnectionScreen" component={WalletConnectionScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="HomeStack" component={HomeNavigator} />
        </Stack.Navigator>
    );
};

export default RootNavigator;