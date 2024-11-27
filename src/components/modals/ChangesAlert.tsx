import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-expo';
import { togglePublic } from '@/src/API/trainingAPI';
import Toast from 'react-native-toast-message';

const ChangesAlert = ({ updatePublicModalVisible, setUpdatePublicModalVisible, trainingToMakePublicUpdate, isPublic }: any) => {
  
  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();
  const trainingId = trainingToMakePublicUpdate;
  const updatePublic = !isPublic;

  const updatePublicMutation = useMutation({
    mutationFn: () => togglePublic({getToken, trainingId, isPublic: updatePublic}),
    onSuccess: async () => {
      await queryClient.invalidateQueries([`training_${userId}`])

      Toast.show({
        type: "success",
        text1: "Training Updated successfully",
      });

      setUpdatePublicModalVisible(null);
    },
    onError: () => {
      Toast.show({
          type: "error",
          text1: "Opps! Error while UpdatePublic"
      });
    }
  })

  const isToggling = updatePublicMutation.isPending;

    const handleChange = () =>{
      updatePublicMutation.mutate();
    }

  return (
    <Modal animationType="fade" transparent={true} visible={updatePublicModalVisible}>
      <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
        <View className="bg-cardBackground w-[400px] h-[200px] rounded-lg flex justify-center items-center gap-6">
          <Text className="text-primaryTextColor text-lg font-semibold">
            Are you sure to make changes ?
          </Text>
          <View className="flex flex-row justify-center items-center gap-6">
            <TouchableOpacity
              onPress={handleChange}
              className="bg-mainBgColor p-2 rounded-lg"
              disabled={isToggling}
            >
              {isToggling ? (
                <ActivityIndicator color="#FF8A65" size={24} />
              ) : (
                <AntDesign name="check" size={24} color="#22c55e" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setUpdatePublicModalVisible(null)}
              className="bg-mainBgColor p-2 rounded-lg"
            >
              <AntDesign name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ChangesAlert;