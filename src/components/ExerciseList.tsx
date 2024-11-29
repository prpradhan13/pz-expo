import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ExerciseListProps } from './Types';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import AntDesign from '@expo/vector-icons/AntDesign';

const ExerciseList = ({
    trainingPlan,
    removeExercise,
}: ExerciseListProps) => {
  return (
    <ScrollView
    horizontal
    contentContainerStyle={{ paddingHorizontal: 10 }}
    className="my-2 bg-mainBgColor py-3 rounded-lg"
  >
    {trainingPlan.map((plan, index) => (
      <Animated.View
        entering={FadeInUp}
        exiting={FadeOutDown}
        key={index}
        className="px-3 py-2 bg-secondaryText rounded-xl flex flex-row items-center mr-2"
      >
        <Text className="font-medium">
          {plan.exerciseName.length > 8
            ? `${plan.exerciseName.slice(0, 8)}...`
            : plan.exerciseName}
        </Text>
        <TouchableOpacity onPress={() => removeExercise(index)}>
          <AntDesign name="close" size={16} color="#ef4444" />
        </TouchableOpacity>
      </Animated.View>
    ))}
  </ScrollView>
  )
}

export default ExerciseList;