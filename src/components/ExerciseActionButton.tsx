import { ActivityIndicator, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ExerciseActionButtonProps } from './Types';

const ExerciseActionButton = ({
    text,
    onPress,
    loading,
}: ExerciseActionButtonProps) => {
  return (
    <TouchableOpacity
    onPress={onPress}
    disabled={loading}
    className={`bg-cardBackground p-3 rounded-xl`}
  >
    {loading ? (
      <ActivityIndicator size="small" color="#FF6E40" />
    ) : (
      <Text className="text-white text-center font-semibold">{text}</Text>
    )}
  </TouchableOpacity>
  )
}

export default ExerciseActionButton;