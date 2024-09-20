import { Stack } from 'expo-router'
import React from 'react'

const authLayout = () => {
  
  
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="reset" options={{ headerShown: false }} />
      </Stack>
  )
}

export default authLayout
