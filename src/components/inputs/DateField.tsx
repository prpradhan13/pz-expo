import { Text, TouchableOpacity, View } from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";

type DateFieldProps = {
  label?: string;
  value: string;
  onChange: (event: any, selectedDate?: Date) => void;
};

const DateField: React.FC<DateFieldProps> = ({ 
    label,
    value,
    onChange
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      onChange(event, selectedDate);  // Pass the selected date to parent
      setShowDatePicker(false); // Close the date picker after selection
    } else if (event.type === "dismissed") {
      setShowDatePicker(false); // Close the picker if the user cancels
    }
  };

  return (
    <View className="flex gap-2">
      <Text className="text-secondaryText tracking-wider"> {label} </Text>
      <View className="bg-cardBackground rounded-md p-3 flex flex-row items-center justify-between">
        <Text className="text-primaryTextColor">
          {value ? new Date(value).toLocaleDateString() : ""}
        </Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Entypo name="calendar" size={24} color="#CFCFCF" />
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(value)}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default DateField;
