import { Stack } from 'expo-router'
import React from 'react'

const authLayout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index"  />
        <Stack.Screen name="register"  />
        <Stack.Screen name="reset"  />
      </Stack>
  )
}

export default authLayout
