import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { MainButton } from '@/src/components/buttons/Buttons';
import Toast from 'react-native-toast-message';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';

const changePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewPasswordShow, setIsNewPasswordShow] = useState(false);
    const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

    const { user } = useUser();
    const { signOut } = useAuth();

    const handleChangePassword = async () => {
        setIsLoading(true);
        try {
            if (!passwordFormData.currentPassword || !passwordFormData.newPassword || !confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'All fields are required.'
                })
                return;
            }
            if (passwordFormData.newPassword !== confirmPassword) {
                Toast.show({
                    type: 'error',
                    text1: 'Password is not matches'
                })
                return;
            }
        
            await user?.updatePassword(passwordFormData)

            Toast.show({
                type: 'success',
                text1: 'Password changed successfully!'
            });
            setPasswordFormData({...passwordFormData, currentPassword: "", newPassword: ""})
            setConfirmPassword('');
            signOut();

        } catch (error: any) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: `Error: ${error.errors[0].longMessage}`,
                text2: 'Failed to update password.'
            })
        } finally {
            setIsLoading(false)
        }

    }

  return (
    <View className='bg-mainBgColor w-full h-full px-6 pt-20'>
      <View>
        <Text className='text-primaryTextColor font-medium text-xl'> Current Password* </Text>
        <View className='bg-cardBackground py-3 px-2 rounded-xl mt-2 flex flex-row justify-between items-center'>
            <TextInput
                value={passwordFormData.currentPassword}
                onChangeText={(value) => setPasswordFormData({...passwordFormData, currentPassword: value})}
                className='bg-transparent text-primaryTextColor text-lg font-medium w-[280px]'
            />
        </View>
      </View>

      <View className='my-5'>
        <Text className='text-primaryTextColor font-medium text-xl'> New Password* </Text>
        <View className='bg-cardBackground py-3 px-2 rounded-xl mt-2 flex flex-row justify-between items-center'>
            <TextInput
                secureTextEntry={!isNewPasswordShow}
                value={passwordFormData.newPassword}
                onChangeText={(value) => setPasswordFormData({...passwordFormData, newPassword: value})}
                className='bg-transparent text-primaryTextColor text-lg font-medium w-[280px]'
            />
            <TouchableOpacity
                onPress={() => setIsNewPasswordShow((prev) => !prev)}
                className="bg-mainBgColor p-2 rounded-xl text-primaryTextColor"
              >
                <Feather name={isNewPasswordShow ? 'eye-off' : 'eye'} size={20} color="#CFCFCF" />
              </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text className='text-primaryTextColor font-medium text-xl'> Confirm Password* </Text>
        <View className='bg-cardBackground py-3 px-2 rounded-xl mt-2 flex flex-row justify-between items-center'>
            <TextInput
                secureTextEntry={!isConfirmPasswordShow}
                value={confirmPassword}
                onChangeText={(value) => setConfirmPassword(value)}
                className='bg-transparent text-primaryTextColor text-lg font-medium w-[280px]'
            />
            <TouchableOpacity
                onPress={() => setIsConfirmPasswordShow((prev) => !prev)}
                className="bg-mainBgColor p-2 rounded-xl text-primaryTextColor"
              >
                <Feather name={isConfirmPasswordShow ? 'eye-off' : 'eye'} size={20} color="#CFCFCF" />
              </TouchableOpacity>
        </View>
        <Text className='text-red-500 mt-2'> {confirmPassword === passwordFormData.newPassword ? '' : 'Password not match'} </Text>
      </View>

      <View className='flex items-center w-full mt-5'>
        <MainButton btnName='Submit' btnColor='accentColor' btnWidth={"280px"} isLoading={isLoading} onPress={handleChangePassword} />
      </View>
    </View>
  )
}

export default changePassword;