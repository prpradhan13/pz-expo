import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { MainButton } from '@/src/components/buttons/Buttons'
import Toast from 'react-native-toast-message';
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';

const verifyCodeToForgot = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const { signIn, setActive } = useSignIn();
  const { signOut } = useAuth();

  const handleResetPassword = async () => {
    if (!code && !password) {
      Toast.show({
        type: "error",
        text1: "All fields are required"
      })
      
      return;
    }
    
    try {
      setLoading(true);

      const verificationToForgot = await signIn?.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      })

      if (verificationToForgot?.status === "complete") {
        await setActive({ session: verificationToForgot.createdSessionId })
        router.replace("/(auth)")
      }
      
    } catch (error: any) {
      console.error(error.errors[0]);
      Toast.show({
        type: 'error',
        text1: `${error.errors[0].longMessage}`,
        text2: 'Something went wrong'
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className='bg-mainBgColor w-full h-full px-6 pt-20'>
      <Text className='text-secondaryText'>
        We send you a 6 digit verification code.
      </Text>
      <View className='mt-8'>
        <View>
          <Text className='text-secondaryText text-lg font-medium'> Enter New Password* </Text>
          <TextInput
            value={password}
            onChangeText={(value) => setPassword(value)}
            className='bg-cardBackground text-primaryTextColor p-4 rounded-xl mt-2'
          />
        </View>
        <View className='mt-3'>
          <Text className='text-secondaryText text-lg font-medium'> Enter Verification Code* </Text>
          <TextInput
            keyboardType='numeric'
            value={code}
            onChangeText={(value) => setCode(value)}
            className='bg-cardBackground text-primaryTextColor p-4 rounded-xl mt-2'
          />
        </View>
      </View>

      <View className='flex items-center w-full mt-5'>
      <TouchableOpacity
          onPress={handleResetPassword}
          className={`bg-accentColor w-[280px] p-3 rounded-full flex justify-center items-center`}
          disabled={loading}
        >
          <Text
            style={{ fontSize: 16 }}
            className="text-primaryTextColor font-bold uppercase tracking-widest"
          >
            {loading ? (
              <ActivityIndicator color="#F3ECEC" size={20} />
            ) : (
              "Submit"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default verifyCodeToForgot

const styles = StyleSheet.create({})