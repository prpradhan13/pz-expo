import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ExerciseSetManagerProps } from '@/src/components/Types'
import AntDesign from '@expo/vector-icons/AntDesign'

const ExerciseSetManager = ({
    sets,
    onSetChange,
    addSet,
    removeSet,
}: ExerciseSetManagerProps) => {
  return (
    <View className="flex flex-row flex-wrap gap-x-10 gap-y-2 my-2">
    {sets.map((set, index) => (
      <View key={index} className="flex flex-row items-center gap-2">
        <Text className="text-secondaryText font-medium">Set {index + 1}:</Text>
        <TextInput
          keyboardType="numeric"
          placeholder="Reps"
          value={String(set.repetitions)}
          onChangeText={(value) => onSetChange(index, value)}
          className="bg-cardBackground p-2 rounded-lg w-[50px] text-primaryTextColor"
        />
        {sets.length > 1 && (
          <TouchableOpacity onPress={() => removeSet(index)}>
            <AntDesign name="close" size={16} color="#ef4444" />
          </TouchableOpacity>
        )}
        {index === sets.length - 1 && (
          <TouchableOpacity onPress={addSet}>
            <AntDesign name="plus" size={16} color="#22c55e" />
          </TouchableOpacity>
        )}
      </View>
    ))}
  </View>
  )
}

export default ExerciseSetManager;