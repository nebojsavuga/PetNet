import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { CreatingPetPassportStackParamList } from '../../types/CreatingPetPassportStackParamList'
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePetPassport } from '../../contexts/CreatePetPassportContext'

type Step2NavProp = NativeStackNavigationProp<CreatingPetPassportStackParamList, "Step2">;


const Step2Screen = () => {
    const { updateData } = usePetPassport();
    const navigation = useNavigation<Step2NavProp>();
    const handleImageSelected = (imageUri: string, navigation: Step2NavProp) => {
        updateData({ imageUrl: imageUri });
        navigation.navigate('Step3');
    };
    const openCamera = async (navigation: Step2NavProp) => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Camera access is needed to take a photo.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            handleImageSelected(imageUri, navigation);
        }
    };

    const openGallery = async (navigation: Step2NavProp) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'Media library access is needed.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            handleImageSelected(imageUri, navigation);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.leftGoBack}>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
            </View>
            <View style={styles.upperContent}>
                <Image source={Images.ChoosePhotoIcon} style={styles.mailSentImg} resizeMode="contain" />
            </View>
            <View style={styles.connectionSection}>
                <Pressable style={styles.openMailButton} onPress={() => openCamera(navigation)}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Take a photo</Text>
                </Pressable>
                <Pressable style={styles.resendButton} onPress={() => openGallery(navigation)}>
                    <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Upload existing photo</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Step2Screen

const styles = StyleSheet.create({
    openMailButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
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
    mailSentImg: {
        width: 48,
        height: 48
    },
    backButton: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'flex-start'
    },
    leftGoBack: {
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        width: '100%'
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%',
        alignItems: 'center',

    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
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
    resendButton: {
        display: 'flex',
        width: '100%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#391149',
        alignItems: 'center',
        justifyContent: 'center'
    },
    socialButtons: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 8
    },
    emailSection: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        paddingHorizontal: 16,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#4C454D'
    }
})