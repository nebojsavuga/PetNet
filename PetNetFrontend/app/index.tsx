import 'react-native-get-random-values'
import './globals.css'
import { StyleSheet } from 'react-native';
import Splash from './splash';
import { useFonts } from 'expo-font';

import { Buffer } from 'buffer';
global.Buffer = global.Buffer || Buffer;

export default function Index() {
    // return (
    //     <View style={styles.container}>
    //         <Text style={styles.text}>Home screen</Text>
    //         <Link href="/about" style={styles.button}>
    //             Go to About screen
    //         </Link>
    //     </View>
    // );

    const [fontsLoaded] = useFonts({
        'SchibstedGrotesk-Regular': require('../assets/fonts/SchibstedGrotesk-Regular.ttf'),
        'SchibstedGrotesk-Medium': require('../assets/fonts/SchibstedGrotesk-Medium.ttf'),
        'SchibstedGrotesk-Bold': require('../assets/fonts/SchibstedGrotesk-Bold.ttf'),
        'SchibstedGrotesk-Black': require('../assets/fonts/SchibstedGrotesk-Black.ttf'),
        'SchibstedGrotesk-SemiBold': require('../assets/fonts/SchibstedGrotesk-SemiBold.ttf'),
    });
    return <Splash redirectTo="/(auth)/step1" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
    },
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    },
});
