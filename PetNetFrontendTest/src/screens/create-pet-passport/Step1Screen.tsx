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

type Step1NavProp = NativeStackNavigationProp<CreatingPetPassportStackParamList, "Step1">;

const Step1Screen = () => {
    const navigation = useNavigation<Step1NavProp>();

    const [name, setName] = useState<string>('');
    const [species, setSpecies] = useState<'Dog' | 'Cat' | ''>('');
    const [breed, setBreed] = useState<string | undefined>('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Castrated Male' | 'Sterilized Female' | 'Unknown' | 'Sterilized Unknown' | ''>('');
    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(new Date(2001, 1, 1));
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
                    <Text style={[Typography.bodyExtraSmall, { color: '$F1EFF2' }]}>Name</Text>
                    <TextInput placeholder="Your pet's name"
                        placeholderTextColor={'#D8D5D9'}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                        style={[
                            Typography.bodySmall,
                            styles.inputField,
                            {
                                borderColor: focusedInput === 'name' ? '#BF38F2' : '#4C454D'
                            }
                        ]}
                    />
                </View>
                <View style={styles.input}>
                    <Text style={[Typography.bodyExtraSmall, { color: '$F1EFF2' }]}>Pet</Text>
                    <TextInput placeholderTextColor={'#D8D5D9'} placeholder='Dog' style={[Typography.bodySmall, styles.inputField]} />
                </View>
                <View style={styles.input}>
                    <Text style={[Typography.bodyExtraSmall, { color: '$F1EFF2' }]}>Breed</Text>
                    <TextInput placeholder="Golder Retriever"
                        placeholderTextColor={'#D8D5D9'}
                        onFocus={() => setFocusedInput('breed')}
                        onBlur={() => setFocusedInput(null)}
                        style={[
                            Typography.bodySmall,
                            styles.inputField,
                            {
                                borderColor: focusedInput === 'breed' ? '#BF38F2' : '#4C454D'
                            }
                        ]}
                    />
                </View>
                <View style={styles.input}>
                    <Text style={[Typography.bodyExtraSmall, { color: '$F1EFF2' }]}>Gender</Text>
                    <TextInput placeholderTextColor={'#D8D5D9'} placeholder='Male' style={[Typography.bodySmall, styles.inputField]} />
                </View>
                <View style={styles.input}>
                    <Text style={[Typography.bodyExtraSmall, { color: '#F1EFF2' }]}>Date of birth</Text>
                    <TextInput placeholderTextColor={'#D8D5D9'} placeholder='Your date of birth' style={[Typography.bodySmall, styles.inputField]} />
                </View>
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.createNewAccountButton} onPress={() => navigation.navigate("Step2")}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step1Screen

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
    connectWalletButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#F7F7F7',
        alignItems: 'center',
        justifyContent: 'center',
        color: "#242424"
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    divider: {
        flex: 1,
        height: 1,
        width: '100%',
        backgroundColor: "#4C454D",
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
    socialButtons: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 8
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