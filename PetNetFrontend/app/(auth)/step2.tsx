import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const step2 = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Step2 screen</Text>
            <Link href="/(auth)/step3" style={styles.button}>
                Go to step2 screen
            </Link>
        </View>
    )
}

export default step2

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