import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Loading = () => {
  return (
    <SafeAreaView>
      <Text className='text-3xl font-bold'>Loading...</Text>
    </SafeAreaView>
  )
}

export default Loading

const styles = StyleSheet.create({})