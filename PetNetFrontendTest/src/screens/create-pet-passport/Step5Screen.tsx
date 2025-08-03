import { Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CreatingPetPassportStackParamList } from '../../types/CreatingPetPassportStackParamList';
import { Images } from '../../constants/Images';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { useNavigation } from '@react-navigation/native';
import { usePetPassport } from '../../contexts/CreatePetPassportContext';
import { Award } from '../../types/Pet';
import AddAwardModal from './modals/AddAwardModal';


type Step5NavProp = NativeStackNavigationProp<CreatingPetPassportStackParamList, "Step5">;

const Step5Screen = () => {

    const { updateData, data } = usePetPassport();
    const navigation = useNavigation<Step5NavProp>();
    const awards = data.awards || [];
    const [isModalVisible, setModalVisible] = useState(false);


    const handleAddAward = (award: Award) => {
        updateData({
            awards: [...awards, award]
        });
        setModalVisible(false);
    };

    const handleRemoveAward = (index: number) => {
        updateData({
            awards: awards.filter((_, i) => i !== index)
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />

            <KeyboardAvoidingView
                style={{ flex: 1, width: '100%' }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: awards.length === 0 ? 'space-between' : undefined }}>
                    {/* Header */}
                    <View style={styles.upperContent}>
                        <Pressable onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#F7F7F7" />
                        </Pressable>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <Text style={[Typography.h6, { color: '#F7F7F7' }]}>Awards</Text>
                            {awards.length > 0 && (
                                <Pressable onPress={() => setModalVisible(true)} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Ionicons name="add" size={24} color="#F7F7F7" />
                                    <Text style={[Typography.bodyExtraSmall, { color: '#F7F7F7' }]}>Add pet awards</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>

                    {awards.length === 0 ? (
                        <View style={styles.card}>
                            <Image source={Images.trophy} style={{ width: 48, height: 48 }} />
                            <Text style={[Typography.bodyMedium, { color: '#D8D5D9', textAlign: 'center' }]}>
                                No awards record
                            </Text>
                            <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
                                <Ionicons name="add" size={18} color="#322E33" />
                                <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add pet award</Text>
                            </Pressable>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.scrollContent}>
                            {awards.map((award, index) => (
                                <View key={index} style={styles.awardCard}>
                                    <Pressable onPress={() => handleRemoveAward(index)} style={{ backgroundColor: '#FF3B30', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                                        <Ionicons name="remove" size={18} color="#FFFFFF" />
                                    </Pressable>
                                    {award.place === '1st' ? (
                                        <Image
                                            source={Images.FirstPlace}
                                            style={{ width: 48, height: 48 }}
                                            resizeMode="contain"
                                        />
                                    ) : award.place === '2nd' ? (
                                        <Image
                                            source={Images.SecondPlace}
                                            style={{ width: 48, height: 48 }}
                                            resizeMode="contain"
                                        />
                                    ) : award.place === '3rd' ? (
                                        <Image
                                            source={Images.ThirdPlace}
                                            style={{ width: 48, height: 48 }}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Ionicons
                                            name="ribbon"
                                            size={40}
                                            color="#F7F7F7"
                                            style={{ marginRight: 10 }}
                                        />
                                    )}
                                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 4 }}>
                                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>{award.awardName}</Text>
                                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>{award.showName}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.connectionSection}>
                        <Pressable
                            onPress={() => {
                                updateData({ awards });
                                navigation.navigate('Step6');
                            }}
                            style={styles.createNewAccountButton}
                        >
                            <Text style={[Typography.bodySmall, { color: '#F7F7F7' }]}>Continue</Text>
                        </Pressable>
                    </View>
                </View>

                <AddAwardModal
                    visible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onSave={handleAddAward}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default Step5Screen

const styles = StyleSheet.create({
    scrollContent: {
        gap: 16,
        width: '100%',
        paddingBottom: 24,
    },
    connectionSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%'
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingVertical: 32,
        position: 'relative',
        paddingHorizontal: 16
    },
    upperContent: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
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
    card: {
        display: 'flex',
        flexDirection: 'column',
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        padding: 16,
        gap: 16,
        borderColor: "#4C454D",
        backgroundColor: "#FFFFFF1A",
        alignSelf: 'stretch',
    },
    button: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: '#E5E3E6'
    },
    awardCard: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#262326',
        borderWidth: 1,
        borderColor: '#322E33',
        borderRadius: 8,
        padding: 16,
        gap: 16
    }
})