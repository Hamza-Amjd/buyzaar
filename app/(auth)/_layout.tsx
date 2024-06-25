
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, router } from 'expo-router'
import React, { useEffect } from 'react'

const authLayout = () => {
  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        router.replace("(tabs)");
      } 
    })();
  }, [])
  
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
      </Stack>
  )
}

export default authLayout
