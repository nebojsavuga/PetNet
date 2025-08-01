import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    Image,
    FlatList
} from 'react-native';
import { Award, Pet } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import AddAwardModal from './modals/AddAwardModal';
import { Images } from '../../constants/Images';
import { usePet } from '../../contexts/PetContext';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type AwardsDataRouteProp = RouteProp<PetPassportStackParamList, 'Awards'>;

const Awards = () => {
    const route = useRoute<AwardsDataRouteProp>();
    const { pet, setPet } = usePet();
    const [fetchedPet, setFetchedPet] = useState(pet);
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedAward, setSelectedAward] = useState<Award | undefined>(undefined);
    const handleClose = () => {
        setSelectedAward(undefined);
        setModalVisible(false);
    }
    const handleSaveAward = async (award: Award) => {
        try {
            const token = await AsyncStorage.getItem('jwtToken');
            const response = await fetch(`${API_URL}/pets/award/${pet?._id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(award),
            });
            if (!response.ok) {
                console.error('Failed to add award');
                return;
            }

            const responseValue = await response.json();
            if (responseValue?.pet) {
                responseValue.pet.awards = (responseValue.pet.awards ?? []).sort((a: Award, b: Award) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            }
            console.log("Successfully awarded");
            setFetchedPet(responseValue?.pet);
            setModalVisible(false);
        } catch (error) {
            console.error('Error saving award:', error);
        }
    };

    const RenderAward = (award: Award, navigation: any) => {
        return (
            <Pressable
                key={award._id}
                onPress={() => {
                    setSelectedAward(award);
                    setModalVisible(true);
                }}
                style={styles.navRow}
            >
                <SafeAreaView key={award._id} style={styles.navRowInner}>
                    {award.place === '1st' ? (
                        <Image
                            source={Images.FirstPlace}
                            style={styles.awardImage}
                            resizeMode="contain"
                        />
                    ) : award.place === '2nd' ? (
                        <Image
                            source={Images.SecondPlace}
                            style={styles.awardImage}
                            resizeMode="contain"
                        />
                    ) : award.place === '3rd' ? (
                        <Image
                            source={Images.ThirdPlace}
                            style={styles.awardImage}
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

                    <SafeAreaView style={styles.petInfo}>
                        <Text style={[Typography.heading, { color: "#F7F7F7" }]}>{award.awardName}</Text>
                        <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                            {award.showName}
                        </Text>
                        <Text style={[Typography.bodyExtraSmall, { color: "#F7F7F7" }]}>
                            {new Date(award.date).toLocaleDateString('en-GB')}
                        </Text>
                    </SafeAreaView>
                </SafeAreaView>
            </Pressable>
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.bottomGlow} resizeMode="contain" />
            <FlatList
                data={fetchedPet?.awards ?? []}
                keyExtractor={(item) => item._id!}
                renderItem={({ item }) => RenderAward(item, navigation)}
                contentContainerStyle={styles.scrollContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.container}>
                            <PetHeaderSection
                                title="Awards"
                                pet={pet}
                                onBack={() => navigation.goBack()}
                                onShare={() => navigation.navigate('PetQrScreen', { pet: pet })}
                            />
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginHorizontal: 10,
                            marginTop: 20,
                            marginBottom: 10
                        }}>
                            <Text style={[
                                Typography.heading,
                                { color: '#F7F7F7' }
                            ]}>
                                Awards ({pet?.awards?.length ?? 0})
                            </Text>

                            <Pressable onPress={() => setModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: '#71BA54', marginRight: 5, fontSize: 16 }}>Add</Text>
                                <Ionicons name='add-circle-outline' size={36} color="#71BA54" />
                            </Pressable>
                        </View>
                    </>
                }
                ListEmptyComponent={
                    <SafeAreaView style={styles.petCard}>
                        <Ionicons
                            name='close-circle-outline'
                            size={20}
                            color="#F7F7F7"
                            style={{ marginRight: 12 }}
                        />
                        <SafeAreaView style={styles.petInfo}>
                            <Text style={[Typography.heading, { color: '#F1EFF2' }]}>
                                This pet doesn't have awards
                            </Text>
                        </SafeAreaView>
                    </SafeAreaView>
                }
            />
            <AddAwardModal
                visible={isModalVisible}
                onClose={() => handleClose()}
                onSave={handleSaveAward}
                awardToEdit={selectedAward}
            />
        </SafeAreaView>
    );

}

export default Awards;

const styles = StyleSheet.create({
    awardImage: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative'
    },
    navRow: {
        width: '95%',
        marginHorizontal: 'auto',
        marginBottom: 10,
        borderRadius: 8,
        backgroundColor: '#322E33',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    input: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 2,
        marginBottom: 10,
        alignItems: 'flex-start'
    },
    navRowText: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: 500,
        color: '#F1EFF2',
        padding: 5
    },
    rightArrow: {
    },
    navRowInner: {
        flexDirection: 'row',
        alignItems: 'center',
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
    button: {
        display: 'flex',
        marginHorizontal: 'auto',
        width: '95%',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#BF38F2',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rowInputs: {
        display: 'flex',
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        width: '100%'
    },
    scrollContent: {
        paddingBottom: 16,
    },
    section: {
        width: '95%',
        marginHorizontal: 'auto',
        backgroundColor: '#322E33',
        borderRadius: 8,
        marginVertical: 10,
        padding: 10
    },
    petCard: {
        flexDirection: 'row',
        backgroundColor: '#322E33',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        width: '95%',
        marginHorizontal: 'auto',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A3A3D',
    },
    pet: {
        width: 45,
        height: 45,
        borderRadius: 75,
        alignSelf: 'center',
        marginRight: 10
    },
    petInfo: {
        flex: 1,
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
    bottomGlow: {
        position: 'absolute',
        top: 250,
        left: -150,
        width: 700,
        height: 700,
        opacity: 0.6,
    },
})