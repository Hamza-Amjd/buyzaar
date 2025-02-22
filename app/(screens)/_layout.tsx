import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="onboarding"  />
        <Stack.Screen name="cart"  />
        <Stack.Screen name="wishlist"  />
        <Stack.Screen name="category"  />
        <Stack.Screen name="settings"  />
        <Stack.Screen name="address"  />
        <Stack.Screen name="productdetails"  />
      </Stack>
  )
}

export default _layout;
