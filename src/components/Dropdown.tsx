import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from '@expo/vector-icons/Feather';

const Dropdown = ({ onDelete, onTogglePublic, isPublic }: any) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <View>
      <TouchableOpacity onPress={toggleDropdown}>
        {!dropdownVisible ? (
            <AntDesign name="ellipsis1" size={22} color="#F3ECEC" />
        ) : (
            <AntDesign name="close" size={22} color="#F3ECEC" />
        )}
      </TouchableOpacity>

      {dropdownVisible && (
        <View className="absolute top-8 right-0 w-[120px] bg-secondaryText p-2 rounded-xl z-50">
          {/* Option 1: Toggle Public */}
          <TouchableOpacity
            className="flex flex-row items-center gap-4 bg-primaryTextColor w-full px-2 py-1 rounded-xl"
            onPress={() => {
              setDropdownVisible(false);
              onTogglePublic();
            }}
          >
            <Feather name="user-check" size={18} color="black" />
            <Text className="text-black font-medium">
              {isPublic ? "Private" : "Public"}
            </Text>
          </TouchableOpacity>

          {/* Option 2: Delete */}
          <TouchableOpacity
            className="flex flex-row items-center gap-4 bg-primaryTextColor w-full px-2 py-1 rounded-xl mt-2"
            onPress={() => {
              setDropdownVisible(false);
              onDelete();
            }}
          >
            <MaterialIcons name="delete" size={18} color="#ef4444" />
            <Text className="text-black font-medium">Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Dropdown;

  