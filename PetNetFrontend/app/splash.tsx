import { Pallete } from '@/constants/Pallete';
import { Typography } from '@/constants/Typography';
import { Text } from '@react-navigation/elements';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';


type SplashProps = {
    redirectTo: string;
};

const Splash: React.FC<SplashProps> = ({ redirectTo }) => {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace(redirectTo); // Redirect after 3 seconds
        }, 3000);

        return () => clearTimeout(timeout); // Cleanup
    }, [redirectTo]);

    return (
        <View style={styles.container}>
            {/* <Image
        source={Images.logo}
        style={styles.logo}
        resizeMode="contain"
      /> */}
            <Text style={Typography.h1}>PetNet</Text>
            <ActivityIndicator size="large" color="#1e90ff" style={{ marginTop: 0 }} />
        </View>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Pallete.primary[500],
    },
    logo: {
        width: 160,
        height: 160,
        marginBottom: 24,
    }
});