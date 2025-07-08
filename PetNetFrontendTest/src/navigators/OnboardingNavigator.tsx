import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Step1Screen from "../screens/onboarding/Step1Screen";
import Step2Screen from "../screens/onboarding/Step2Screen";
import Step3Screen from "../screens/onboarding/Step3Screen";
import Step4Screen from "../screens/onboarding/Step4Screen";
import Step5Screen from "../screens/onboarding/Step5Screen";
import Step6Screen from "../screens/onboarding/Step6Screen";

const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Step1" component={Step1Screen} />
        <Stack.Screen name="Step2" component={Step2Screen} />
        <Stack.Screen name="Step3" component={Step3Screen} />
        <Stack.Screen name="Step4" component={Step4Screen} />
        <Stack.Screen name="Step5" component={Step5Screen} />
        <Stack.Screen name="Step6" component={Step6Screen} />
    </Stack.Navigator>
);

export default OnboardingNavigator;