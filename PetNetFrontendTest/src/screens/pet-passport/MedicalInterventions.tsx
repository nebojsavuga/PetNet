import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    SafeAreaView,
    FlatList,
    Image,
    Linking,
    ScrollView
} from 'react-native';
import { Intervention, Pet } from "../../types/Pet";
import { useEffect, useState } from "react";
import Constants from 'expo-constants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';
import { PetPassportStackParamList } from "../../navigators/PetPassportNavigator";
import PetHeaderSection from "./PetHeaderSection";
import { Typography } from '../../constants/Typography';
import { usePet } from '../../contexts/PetContext';
import { Images } from '../../constants/Images';
import AddNewInterventionModal from './modals/AddNewInterventionModal';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000/api';
type MedicalInterventionsDataRouteProp = RouteProp<PetPassportStackParamList, 'MedicalInterventions'>;

type InterventionReport = {
    fileName: string;
    url: string;
    clinicName: string;
    interventionName?: string;
    uploadedAt?: string;
};

const MedicalInterventions = () => {
    const route = useRoute<MedicalInterventionsDataRouteProp>();
    const { petId } = route.params as { petId: string };
    const [pet, setPet] = useState<Pet>();
    const navigation = useNavigation();
    const [reports, setReports] = useState<InterventionReport[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('jwtToken');
                if (!token) {
                    console.warn('No JWT token found');
                    return;
                }

                const petResponse = await fetch(`${API_URL}/pets/${petId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!petResponse.ok) {
                    const errorText = await petResponse.text();
                    console.error('Failed to fetch pet:', errorText);
                    return;
                }

                const fetchedPet = await petResponse.json();
                setPet(fetchedPet);


                const reportResponse = await fetch(`${API_URL}/pets/getInterventionReports/${petId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!reportResponse.ok) {
                    const errText = await reportResponse.text();
                    console.error('Failed to fetch reports:', errText);
                    return;
                }

                const reportData = await reportResponse.json();
                setReports(reportData.reports || []);
                console.log("REPORTS: ", reports);
            } catch (error) {
                console.error('Failed to load data:', error);
            }
        };

        fetchData();
    }, []);

    const getReportDate = (r: InterventionReport) => {
        if (r.uploadedAt) return new Date(r.uploadedAt);

        const base = r.interventionName || '';
        const parts = base.split('_');
        const ts = parts[parts.length - 1];
        const n = Number(ts);
        return isNaN(n) ? new Date() : new Date(n);
    };

    const handleClose = () => {
        setModalVisible(false);
    }

    const RenderPdfReport = (report: InterventionReport, index: number) => {
        const date = getReportDate(report);

        return (
            <Pressable key={index} style={styles.navRow} onPress={() => Linking.openURL(report.url)}>
                <View style={[styles.navRowInner, { alignItems: 'center' }]}>
                    <Image source={Images.pdfIcon} style={{ width: 24, height: 24 }} />

                    {/* Leva strana: ime intervencije + klinika, u dva reda */}
                    <View style={[styles.petInfo, { flex: 1, marginLeft: 16 }]}>
                        <Text style={[Typography.heading, { color: "#F7F7F7" }]}>
                            {report.interventionName || 'Intervention'}
                        </Text>
                        <Text style={[Typography.bodySmall, { color: "#D8D5D9" }]}>
                            {report.clinicName || 'Clinic'}
                        </Text>
                    </View>

                    <View style={{ marginLeft: 8, alignItems: 'flex-end' }}>
                        <Text style={[Typography.bodySmall, { color: "#F7F7F7" }]}>
                            📅 {date.toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </Pressable>
        );
    };
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.bottomGlow} resizeMode="contain" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <PetHeaderSection
                            title="Medical Interventions"
                            pet={pet}
                            onBack={() => navigation.goBack()}
                            onShare={() => navigation.navigate('PetQrScreen', { petId: petId })}
                        />
                    </View>
                </View>

                <Text style={[Typography.bodyMediumSemiBold, { color: '#F7F7F7', marginLeft: 10, marginTop: 20, marginBottom: 10 }]}>
                    Interventions ({reports.length})
                </Text>

                <Pressable style={styles.linkButton} onPress={() => setModalVisible(true)}>
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Text style={[Typography.bodyMediumSemiBold, { color: '#F1EFF2' }]}>Add new intervention</Text>
                        <Text style={[Typography.bodySmall, { color: '#D8D5D9' }]}>Get a link for veterinarian</Text>
                    </View>
                    <Ionicons name="add-circle-outline" size={32} color="#71BA54" style={{ marginRight: 12 }} />

                </Pressable>

                {reports.length > 0 ? (
                    reports.map((report, idx) => RenderPdfReport(report, idx))
                ) : (
                    <Text style={[Typography.bodySmall, { color: '#D8D5D9', marginLeft: 10 }]}>
                        No reports found.
                    </Text>
                )}
            </ScrollView>
            <AddNewInterventionModal
                visible={isModalVisible}
                onClose={() => handleClose()}
                petId={petId}
            />
        </SafeAreaView>
    );

}

export default MedicalInterventions;

const styles = StyleSheet.create({
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
        marginBottom: 8,
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        backgroundColor: '#262326',
        borderColor: '#322E33',
        borderWidth: 1
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
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        paddingVertical: 20,
        marginBottom: 12,
        width: '95%',
        marginHorizontal: 'auto',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#3A3A3D',
    },
    petImage: {
        width: 45,
        height: 45,
        borderRadius: 75,
        alignSelf: 'center',
        marginRight: 10
    },
    petInfo: {
        flex: 1,
        gap: 2
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
    linkButton: {
        display: 'flex',
        flexDirection: 'row',
        width: '95%',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#2A462099',
        borderWidth: 1,
        borderColor: '#558C3F',
        borderRadius: 8,
        marginLeft: 10,
        padding: 16,
        marginBottom: 8
    }
})