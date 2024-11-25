import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useAuth } from "@clerk/clerk-expo";

type LogoutAlertProps = {
    modalVisible: boolean;
    setModalVisible: Dispatch<SetStateAction<boolean>>;
}

const LogoutAlert = ({modalVisible, setModalVisible}: LogoutAlertProps) => {
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

    const { signOut } = useAuth();

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await signOut();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLogoutLoading(false);
        }
    }

  return (
    <Modal animationType="fade" transparent={true} visible={modalVisible}>
      <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
        <View className="bg-cardBackground w-[400px] h-[200px] rounded-lg flex justify-center items-center gap-6">
          <Text className="text-primaryTextColor text-lg font-semibold">
            Are you sure to Logout?
          </Text>
          <View className="flex flex-row justify-center items-center gap-6">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-mainBgColor p-2 rounded-lg"
              disabled={logoutLoading}
            >
              {logoutLoading ? (
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

export default LogoutAlert;
