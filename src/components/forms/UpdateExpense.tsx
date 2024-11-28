import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import TextField from "../inputs/TextField";
import DateField from "../inputs/DateField";
import PickerField from "../inputs/PickerField";
import { ExpenseCategoryOptions } from "@/src/utils/AdditionalData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { updateExpense } from "@/src/API/expenseAPI";
import Toast from "react-native-toast-message";
import { useNavigation } from "expo-router";

const UpdateExpense = ({
  setEditModalVisible,
  editModalVisible,
  dataForUpdate,
}: any) => {
  const [currentData, setCurrentData] = useState({
    item: dataForUpdate.item,
    price: dataForUpdate.price,
    category: dataForUpdate.category,
    date: dataForUpdate.date,
  });

  const expenseId = dataForUpdate._id;
  const { getToken, userId } = useAuth();

  const queryClient = useQueryClient();

  const navigation = useNavigation()

  const handleChange = (name: string, value: string) => {
    setCurrentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      handleChange("date", selectedDate.toISOString()); // Store the selected date
    }
  };

  const updateExpenseMutation = useMutation({
    mutationFn: () => updateExpense({ getToken, expenseId, currentData }),
    onSuccess: () => {
        queryClient.invalidateQueries([`expense_${userId}`])
        Toast.show({
            type: 'success',
            text1: 'Expense updated successfully'
        })

        setEditModalVisible(false);
        navigation.goBack();
    },
    onError: (error) => {
        console.log(error);
        
        Toast.show({
          type: "error",
          text1: "Failed to update expense",
        });
    },
  })

  const isUpdating = updateExpenseMutation.isPending;

  const handleUpdateExpense = () => {
    // console.log("handleUpdateExpense", expenseId,currentData);
    updateExpenseMutation.mutate();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={editModalVisible}>
      <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
        <View className="bg-mainBgColor w-full rounded-2xl px-3 py-4">
          <View className="flex flex-row justify-between">
            <Text className="text-primaryTextColor text-xl font-bold">
              Update Expense
            </Text>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <AntDesign name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="mt-5 flex gap-4">
            <TextField
              label="Name of item:"
              value={currentData.item}
              onChangeText={(value) => handleChange("item", value)}
            />

            <TextField
              label="Price of Product*"
              placeholder="e.g. 1000"
              value={currentData.price}
              onChangeText={(value) => handleChange("price", value)}
              keyboardType="numeric"
            />

            <PickerField
              label="Product category*"
              value={currentData.category}
              onValueChange={(value) => handleChange("category", value)}
              pickerItemLabel="Select category"
              pickerOption={ExpenseCategoryOptions}
            />

            <DateField
              label="Due Date"
              value={currentData.date}
              onChange={(event, selectedDate) =>
                handleDateChange(event, selectedDate)
              }
            />
          </View>

          <View className="w-full flex justify-center items-center mt-6">
            <TouchableOpacity
              onPress={handleUpdateExpense}
              className="bg-secondaryText py-3 w-[200px] rounded-full"
            >
              
              {isUpdating ? (
                    <ActivityIndicator size={28} color={"#FF8A65"}/>
                ) : (
                    <Text className="text-center font-bold text-lg tracking-wider uppercase">
                        Update
                    </Text>
                )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateExpense;
