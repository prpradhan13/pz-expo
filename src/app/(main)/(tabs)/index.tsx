import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as SplashScreen from 'expo-splash-screen';

import {
  useFonts,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Pacifico_400Regular } from '@expo-google-fonts/pacifico';
import { SecondaryButton } from '@/src/components/buttons/Buttons';
import ExpenseForm from '@/src/components/forms/ExpenseForm';
import TodoForm from '@/src/components/forms/TodoForm';
import TrainingForm from '@/src/components/forms/TrainingForm';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-expo';
import {setAuthHeader} from "@/src/API/expenseAPI"

const Home = () => {
  let [fontsLoaded, error] = useFonts({
    Montserrat_700Bold,
    Pacifico_400Regular
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [trainingModalVisible, setTrainingModalVisible] = useState<boolean>(false);
  const [todoModalVisible, setTodoModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
      <View className='w-full bg-mainBgColor flex-1 justify-center items-center'>
          <View className='w-full'>
            <Text style={{ fontFamily: 'Montserrat_700Bold' }} className="capitalize text-primaryTextColor text-3xl font-semibold text-center">
              Welcome to{" "}
            </Text>
            <Text style={{ fontFamily: 'Pacifico_400Regular' }} className="capitalize text-borderColor font-pacifico font-medium text-5xl text-center leading-snug">
              project zero
            </Text>
          </View>
        
        <View className='w-[80%] mt-4 flex flex-row justify-center flex-wrap gap-3'>
          <View>
            <SecondaryButton btnName='expences' onPress={() => setModalVisible(true)} />
          </View>
          <View>
            <SecondaryButton btnName='training' onPress={() => setTrainingModalVisible(true)} />
          </View>
          <View>
            <SecondaryButton btnName='todo' onPress={() => setTodoModalVisible(true)} />
          </View>
        </View>

        {modalVisible && (
          <ExpenseForm 
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
        )}

        {trainingModalVisible && (
          <TrainingForm 
            trainingModalVisible={trainingModalVisible}
            setTrainingModalVisible={setTrainingModalVisible}
          />
        )}

        {todoModalVisible && (
          <TodoForm 
            todoModalVisible={todoModalVisible}
            setTodoModalVisible={setTodoModalVisible}
          />
        )}
      </View>

  )
}

export default Home;