import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/RootStackParamList";
import { useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Pressable,
    Image,
    SafeAreaView
} from 'react-native';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'PetPassport'>;

const PetPassport = () => {
    const route = useRoute();
    const { petId } = route.params as { petId: string };
    return (
        <SafeAreaView>
            <Text>Pet Passport for ID: {petId}</Text>
        </SafeAreaView>
    );
}

export default PetPassport;