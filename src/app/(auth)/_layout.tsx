import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='index' />
      <Stack.Screen name='verificationScreen' />
      <Stack.Screen name='forgotPassword' />
      <Stack.Screen name='verifyCodeToForgot' />
    </Stack>
  )
}

export default AuthLayout