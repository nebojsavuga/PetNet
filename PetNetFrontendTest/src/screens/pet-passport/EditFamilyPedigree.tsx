import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Images } from '../../constants/Images'
import { Typography } from '../../constants/Typography'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native'
import SelectAddParentModal from './modals/SelectAddParentModal'
import AddParentWithPetNetModal from './modals/AddParentWithPetNetModal'

const EditFamilyPedigree = () => {

    const navigation = useNavigation();
    const [isInitialModalVisible, setInitialModalVisible] = useState(false);
    const [isSelectingModalVisible, setSelectingModalVisible] = useState(false);

    const handleClose = () => {
        setSelectingModalVisible(false);
        setInitialModalVisible(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image source={Images.topLeftGreenEllipse} style={styles.topLeftGlow} resizeMode="contain" />
            <Image source={Images.centralPinkEllipse} style={styles.centerGlow} resizeMode="contain" />
            <View style={styles.header}>
                <Text style={[Typography.h6, { color: '#F1EFF2' }]}>Family Pedigree</Text>
                <Pressable onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={32} color="#F1EFF2" />
                </Pressable>
            </View>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={[Typography.bodyMedium, { color: '#F1EFF2' }]}>Parents</Text>
                    <View style={styles.card}>
                        <Text style={[Typography.bodyMedium, { color: '#D8D5D9' }]}>Currently no parents assigned</Text>
                        <Pressable style={styles.button} onPress={() => setInitialModalVisible(true)}>
                            <Ionicons name="add" size={18} color="#322E33" />
                            <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add parents</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
            <View style={styles.content}>
                <View style={styles.section}>
                    <Text style={[Typography.bodyMedium, { color: '#F1EFF2' }]}>Children</Text>
                    <View style={styles.card}>
                        <Text style={[Typography.bodyMedium, { color: '#D8D5D9' }]}>Currently no children assigned</Text>
                        <Pressable style={styles.button}>
                            <Ionicons name="add" size={18} color="#322E33" />
                            <Text style={[Typography.bodySmall, { color: '#322E33' }]}>Add children</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
            <SelectAddParentModal
                visible={isInitialModalVisible}
                onClose={() => handleClose()}
                onExistingSelected={() => {
                    setInitialModalVisible(false);
                    setTimeout(() => { setSelectingModalVisible(true), 300 })
                }}
            />
            <AddParentWithPetNetModal
                visible={isSelectingModalVisible}
                onClose={() => handleClose()}
            />
        </SafeAreaView>
    )
}

export default EditFamilyPedigree

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#19171A',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 32,
        position: 'relative'
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
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        marginTop: 16,
        width: '100%'
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        width: '100%'
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
        backgroundColor: "#FFFFFF1A"
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
    }
})