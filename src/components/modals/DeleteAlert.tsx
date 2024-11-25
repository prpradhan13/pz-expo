import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

type DeleteAlertProps = {
    modalVisible: boolean;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
    queryKey: string;
    mutationFunction: () => Promise<void>;
}

const DeleteAlert = ({ modalVisible, setModalVisible, mutationFunction, queryKey }: DeleteAlertProps) => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const navigation = useNavigation()

  const deleteMutation = useMutation({
    mutationFn: mutationFunction,
    onSuccess: (data, trainingId) => {
      queryClient.invalidateQueries([queryKey]);
      setModalVisible(false);
      
      if (queryKey === `expense_${userId}`) {
        navigation.goBack();
      }

      Toast.show({
        type: "success",
        text1: "Training deleted successfully",
      });
    },
    onError: () => {
        Toast.show({
            type: "error",
            text1: "Opps! Error while deleting"
        });
    }
  });

  const isDeleting = deleteMutation.isPending;

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
        <View className="bg-cardBackground w-[400px] h-[200px] rounded-lg flex justify-center items-center gap-6">
          <Text className="text-primaryTextColor text-lg font-semibold">
            Are you sure to delete this?
          </Text>
          <View className="flex flex-row justify-center items-center gap-6">
            <TouchableOpacity
              onPress={handleDelete}
              className="bg-mainBgColor p-2 rounded-lg"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#FF8A65" size={24} />
              ) : (
                <AntDesign name="check" size={24} color="#22c55e" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-mainBgColor p-2 rounded-lg"
            >
              <AntDesign name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteAlert;

const styles = StyleSheet.create({});
