import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Dispatch, SetStateAction } from "react";

type LogoutAlertProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

const RestDay = ({ modalVisible, setModalVisible }: LogoutAlertProps) => {
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableOpacity
        onPress={() => setModalVisible(false)}
        className="bg-black w-full h-screen bg-opacity-85 fixed top-0 left-0 flex justify-center items-center"
      >
        <View className="bg-cardBackground w-[400px] h-[200px] rounded-lg flex justify-center items-center">
          <Text className="text-primaryTextColor font-semibold text-xl">
            Come on Champ it&apos;s rest day!!!{" "}
          </Text>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default RestDay;
