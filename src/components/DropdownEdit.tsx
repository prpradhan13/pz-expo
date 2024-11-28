import { Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, { FadeInRight, FadeOutRight } from "react-native-reanimated";

const DropdownEdit = ({ onDelete, onEdit }: any) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);
  return (
    <View className="">
      <TouchableOpacity onPress={toggleDropdown}>
        {!dropdownVisible ? (
          <AntDesign name="ellipsis1" size={22} color="#F3ECEC" />
        ) : (
          <AntDesign name="close" size={22} color="#F3ECEC" />
        )}
      </TouchableOpacity>

      {dropdownVisible && (
        <Animated.View entering={FadeInRight} exiting={FadeOutRight} className="absolute top-0 right-8 w-[120px] bg-secondaryText p-2 rounded-xl z-50">
          
          <TouchableOpacity
            className="flex flex-row items-center gap-4 bg-primaryTextColor w-full px-2 py-1 rounded-xl"
            onPress={() => {
              setDropdownVisible(false);
              onEdit()
            }}
          >
            <FontAwesome name="pencil-square-o" size={18} color="#3b82f6" />
            <Text className="text-black font-medium">Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-row items-center gap-4 bg-primaryTextColor w-full px-2 py-1 rounded-xl mt-2"
            onPress={() => {
              setDropdownVisible(false);
              onDelete()
            }}
          >
            <MaterialIcons name="delete" size={18} color="#ef4444" />
            <Text className="text-black font-medium">Delete</Text>
          </TouchableOpacity>
          
        </Animated.View>
      )}
    </View>
  );
};

export default DropdownEdit;
