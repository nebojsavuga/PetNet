import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image
} from 'react-native';
import dayjs from 'dayjs';
import { Pet } from '../../types/Pet';

interface PetHeaderSectionProps {
    title: string;
    pet: Pet | undefined;
    onBack: () => void;
}


const PetHeaderSection: React.FC<PetHeaderSectionProps> = ({ title, pet, onBack }) => {
    const calculateAge = (dob?: string) => {
        const years = dayjs().diff(dayjs(dob), 'year');
        const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
        return `${years}y ${months}m`;
    };
    const handleSharePress = () => {
        console.log('Share QR');
    };
    return (
        <>
            <View style={styles.upperContent}>
                <Pressable onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
                <Text style={styles.headerTitle}>{title}</Text>
                <Pressable onPress={handleSharePress}>
                    <Ionicons name="qr-code-outline" size={24} color="#F1EFF2" />
                </Pressable>
            </View>
            <View style={styles.dataSection}>
                <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
                <Text style={styles.petName}>{pet?.name}</Text>
                <Text style={styles.petDetails}>
                    {pet?.breed} • {calculateAge(pet?.dateOfBirth)} • {pet?.gender}
                </Text>
                <Text style={styles.chipId}>Chip ID: {pet?.chipNumber}</Text>
            </View>
        </>
    );
};

export default PetHeaderSection;
const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginLeft: -24,
        color: '#F1EFF2'
    },
    petImage: {
        width: 112,
        height: 112,
        borderRadius: 75,
        marginTop: 50,
        alignSelf: 'center',
        borderWidth: 6,
        borderColor: '#322E33'
    },
    petName: {
        fontSize: 30,
        fontWeight: 700,
        textAlign: 'center',
        lineHeight: 38,
        letterSpacing: 0,
        color: '#F1EFF2'
    },
    petDetails: {
        fontSize: 16,
        color: '#D8D5D9',
        textAlign: 'center',
        letterSpacing: 0,
        fontWeight: 500,
        lineHeight: 24
    },
    chipId: {
        fontSize: 14,
        color: '#D8D5D9',
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: 500,
        backgroundColor: '#262326',
        gap: 10,
        paddingTop: 4,
        paddingRight: 12,
        paddingBottom: 4,
        paddingLeft: 12,
        borderRadius: 999,
        width: '70%',
        marginHorizontal: 'auto'
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        width: '100%',
        backgroundColor: '#322E33',
        paddingHorizontal: 16,
        paddingVertical: 24
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