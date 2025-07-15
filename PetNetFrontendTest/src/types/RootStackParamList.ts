import { NavigatorScreenParams } from "@react-navigation/native";
import { PetPassportStackParamList } from "../navigators/PetPassportNavigator";

export type RootStackParamList = {
    Splash: undefined;
    WalletConnectionScreen: undefined;
    Onboarding: undefined;
    HomeScreen: undefined;
    CreatePetPassport: undefined;
    PetPassportStack: NavigatorScreenParams<PetPassportStackParamList>;
};