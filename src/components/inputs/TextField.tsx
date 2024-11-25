import { Text, TextInput, TextInputProps, View } from "react-native";
import React from "react";

type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: TextInputProps["keyboardType"];
  secureTextEntry?: boolean;
  placeholderTextColor?: string;
};

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  secureTextEntry = false,
  placeholderTextColor = "grey",
}) => {
  return (
    <View className="flex gap-2">
      <Text className={`text-secondaryText tracking-wider ${!label && "hidden"}`}>{label}</Text>
      <TextInput
        // autoCapitalize="none"
        className="bg-cardBackground tracking-widest rounded-lg px-3 py-2 text-primaryTextColor"
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

export default TextField;
