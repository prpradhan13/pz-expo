import { StyleSheet, Text, TextInputProps, View } from "react-native";
import React from "react";
import { Picker } from "@react-native-picker/picker";

type PickerFieldProps = {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  pickerItemLabel?: string;
  pickerOption: string[]
};

const PickerField: React.FC<PickerFieldProps> = ({
  label,
  value,
  onValueChange,
  pickerItemLabel="",
  pickerOption
}) => {
  return (
    <View className="flex gap-2">
      <Text className="text-secondaryText tracking-wider">{label}</Text>
      <View className="bg-cardBackground rounded-lg">
        <Picker
          selectedValue={value}
          onValueChange={onValueChange}
          dropdownIconColor="#F3ECEC"
          style={{ color: "#F3ECEC" }}
          // mode="dropdown"
        >
          <Picker.Item
            label={pickerItemLabel}
            value=""
            color="grey"
            style={{ fontSize: 14 }}
          />
          {pickerOption.map((category, index) => (
            <Picker.Item
              key={index}
              label={category}
              value={category}
              style={{ fontSize: 14 }}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

export default PickerField;

const styles = StyleSheet.create({});
