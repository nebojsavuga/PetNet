import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function AboutScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>About screen</Text>
            <Link href="/(auth)/step1" style={styles.button}>
                Go to Connecton screen
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        justifyContent: 'center',
        alignItems: 'center',
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
