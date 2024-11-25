import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { MainButton } from '../buttons/Buttons';
import Feather from '@expo/vector-icons/Feather';
import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import Toast from 'react-native-toast-message';
import Animated, { FadeInLeft } from "react-native-reanimated";
import { Text } from 'react-native';
import TextField from '../inputs/TextField';

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const onSignInPress = useCallback(async () => {
    setIsLoading(true)
    if (!isLoaded) {
      return
    }
    try {
      if (!emailAddress && !password) {
        Toast.show({
          type: "error",
          text1: "All Fields are required"
        })
        return;
      }

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/(main)')
        Toast.show({
          type: "success",
          text1: "Welcome to PZero"
        })
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2))
        Toast.show({
          type: "error",
          text1: "Something went wrong"
        })
      }
      
    } catch (error: any) {
      console.error('Sign in Attempt',JSON.stringify(error, null, 2))
      Toast.show({
        type: "error",
        text1: `${error.errors[0].message}`,
        text2: "Something went wrong while login 🤔"
      })
    } finally {
      setIsLoading(false);
    }

  }, [isLoaded, emailAddress, password])

  return (
    <Animated.View entering={FadeInLeft} className="w-full">
      <View className="flex items-center gap-8">
        <View className="w-full flex gap-4">
          <TextInput
            autoCapitalize="none"
            className="p-3 bg-mainBgColor outline-none rounded-md text-base text-primaryTextColor"
            placeholder="Email address"
            placeholderTextColor="#CFCFCF"
            value={emailAddress}
            onChangeText={(emailAddress)=> setEmailAddress(emailAddress)}
          />

          <View className="flex justify-between items-center relative">
              <TextInput
                className="w-full p-3 bg-mainBgColor outline-none rounded-md text-base text-primaryTextColor"
                placeholder="Enter password"
                secureTextEntry={!isPasswordShow}
                value={password}
                onChangeText={(password) => setPassword(password)}
                placeholderTextColor="#CFCFCF"
              />

              <TouchableOpacity
                onPress={() => setIsPasswordShow((prev) => !prev)}
                className="bg-cardBackground p-2 rounded-md text-primaryTextColor absolute right-1 top-2"
              >
                <Feather name={isPasswordShow ? 'eye-off' : 'eye'} size={20} color="#CFCFCF" />
              </TouchableOpacity>
            </View>

            <Link href="/(auth)/forgotPassword">
              <Text className='text-blue-500 text-center'> Forgot Password? </Text>
            </Link>

            <View className="flex items-center">
            <MainButton
              isLoading={isLoading}
              btnName={"login"}
              btnColor="mainBgColor"
              btnWidth={'60vw'}
              onPress={onSignInPress}
            />
          </View>

        </View>
      </View>
    </Animated.View>
  )
}

export default Login

const styles = StyleSheet.create({})