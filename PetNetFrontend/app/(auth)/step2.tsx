import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';

const step2 = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    }

    return (
        <SafeAreaView className='flex-1 bg-greyscale50 justify-center items-center px-4'>
            <View className='flex flex-row w-full items-center justify-between'>
                <Text className='text-greyscale800'>Step 1/6</Text>
            </View>
        </SafeAreaView>
    )
}

export default step2

const styles = StyleSheet.create({});