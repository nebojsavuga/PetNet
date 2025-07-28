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
import { Typography } from '../../constants/Typography';

interface PetHeaderSectionProps {
    title: string;
    pet: Pet | undefined;
    editable?: boolean;
    onBack: () => void;
    onShare?: () => void;
    onEdit?: () => void;
}


const PetHeaderSection: React.FC<PetHeaderSectionProps> = ({ title, pet, editable, onBack, onShare, onEdit }) => {
    const calculateAge = (dob?: string) => {
        const years = dayjs().diff(dayjs(dob), 'year');
        const months = dayjs().diff(dayjs(dob).add(years, 'year'), 'month');
        return `${years}y ${months}m`;
    };
    return (
        <>
            <View style={styles.upperContent}>
                <Pressable onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                </Pressable>
                <Text style={styles.headerTitle}>{title}</Text>
                {editable ? (
                    <Pressable onPress={onEdit}>
                        <Ionicons name="pencil-outline" size={24} color="#F1EFF2" />
                    </Pressable>
                ) : (
                    <Pressable onPress={onShare}>
                        <Ionicons name="qr-code-outline" size={24} color="#F1EFF2" />
                    </Pressable>
                )}
            </View>
            <View style={styles.dataSection}>
                <Image source={{ uri: pet?.imageUrl }} style={styles.petImage} />
                <View style={styles.data}>
                    <Text style={[Typography.h6, { color: '#F1EFF2' }]}>{pet?.name}</Text>
                    <Text style={[Typography.bodySmall, { color: '#D8D5D9', marginTop: 8 }]}>{pet?.breed}</Text>
                    <Text style={[Typography.bodySmall, { color: '#D8D5D9', marginBottom: 8 }]}>{calculateAge(pet?.dateOfBirth)} • {pet?.gender}</Text>
                    <Text style={[Typography.bodyExtraSmall, styles.chipData]}>Chip ID: {pet?.chipNumber}</Text>
                </View>
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
        alignSelf: 'center',
        borderColor: '#322E33'
    },
    petDetails: {
        fontSize: 16,
        color: '#D8D5D9',
        textAlign: 'center',
        letterSpacing: 0,
        fontWeight: 500,
        lineHeight: 24
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'row',
        gap: 32,
        width: '100%',
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
        flexDirection: 'row',
        gap: 24,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 24
    },
    rowInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%'
    },
    data: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    chipData: {
        borderRadius: 100,
        borderWidth: 0.5,
        borderColor: '#4C454D',
        paddingVertical: 4,
        paddingHorizontal: 12,
        color: '#D8D5D9'
    }
})