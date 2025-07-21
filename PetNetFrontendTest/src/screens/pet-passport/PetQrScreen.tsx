import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PetPassportStackParamList } from '../../navigators/PetPassportNavigator';

type PetQrScreenDataRouteProp = RouteProp<PetPassportStackParamList, 'PetQrScreen'>;

export default function PetQrScreen() {
    const route = useRoute<PetQrScreenDataRouteProp>();
    const { petId } = route.params as { petId: string };

    // TODO: make it navigate to pet passport and add 1 more req param with isPetOwner flag to not be able to add stuff 
    const qrValue = `https://yourapp.com/pet/${petId}`;
    return (
        <ImageBackground
            source={require('../../../assets/images/backgroundUpright.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <QRCode
                    value={qrValue}
                    size={276}
                    color="#000"
                    backgroundColor="#fff"
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    }
});
