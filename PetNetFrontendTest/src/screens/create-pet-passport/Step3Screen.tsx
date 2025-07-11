import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CreatingPetPassportStackParamList } from "../../types/CreatingPetPassportStackParamList";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Image, View, Pressable, Text } from "react-native";
import { Images } from "../../constants/Images";
import { Ionicons } from '@expo/vector-icons';
import { Typography } from "../../constants/Typography";
import { TextInput } from "react-native-paper";

type Step3NavProp = NativeStackNavigationProp<CreatingPetPassportStackParamList, "Step3">;

const Step3Screen = () => {
    const navigation = useNavigation<Step3NavProp>();

    const [chip, setChip] = useState<string>('');
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.upperContent}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
            </View>
            <Text style={[Typography.h2, { color: '#F7F7F7' }]}>Your pet's basic info</Text>
            <View style={styles.dataSection}>
                <View style={styles.input}>
                    <Text style={[Typography.bodyExtraSmall, { color: '$F1EFF2' }]}>Chip ID</Text>
                    <TextInput placeholder="Your pet's Chip ID"
                        placeholderTextColor={'#D8D5D9'}
                        onFocus={() => setFocusedInput('chip')}
                        onBlur={() => setFocusedInput(null)}
                        style={[
                            Typography.bodySmall,
                            styles.inputField,
                            {
                                borderColor: focusedInput === 'chip' ? '#BF38F2' : '#4C454D'
                            }
                        ]}
                    />
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.createNewAccountButton} onPress={() => navigation.navigate("Step1")}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Finish</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step3Screen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 32,
        position: 'relative'
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        width: '100%'
    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%'
    },

    topLeftGlow: {
        position: 'absolute',
        top: -400,
        left: -400,
        width: 800,
        height: 800,
        opacity: 0.8,
    },
    centerGlow: {
        position: 'absolute',
        top: 70,
        left: -150,
        width: 700,
        height: 700,
        opacity: 0.6,
    },
    createNewAccountButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 4,
        alignItems: 'flex-start'
    },
    inputField: {
        width: '100%',
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D',
        backgroundColor: "#FFFFFF1A"
    },
    dataSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        width: '100%',
    },
    rowInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%'
    }
})