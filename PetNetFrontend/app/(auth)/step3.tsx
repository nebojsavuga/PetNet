import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const step3 = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Step3 screen</Text>
            <Link href="/about" style={styles.button}>
                Go to step2 screen
            </Link>
        </View>
    )
}

export default step3

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