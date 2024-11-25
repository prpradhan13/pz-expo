import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import Toast from "react-native-toast-message";
import Animated, {
  FadeInUp,
  FadeOutDown,
} from "react-native-reanimated";
import { createExpense } from "@/src/API/expenseAPI";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ExpenseCategoryOptions } from "@/src/utils/AdditionalData";
import { useAuth } from "@clerk/clerk-expo";
import TextField from "../inputs/TextField";
import PickerField from "../inputs/PickerField";
import DateField from "../inputs/DateField";

type ExpenseFormProps = {
  modalVisible: boolean;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

type FormData = {
  item: string;
  price: string;
  category: string;
  date: string;
};

const categoryOptions = ExpenseCategoryOptions;

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const [formData, setFormData] = useState<FormData>({
    item: "",
    price: "",
    category: "",
    date: new Date().toISOString(),
  });
  const [expenseList, setExpenseList] = useState<FormData[]>([]);
  const { getToken, userId } = useAuth();
  const queryClient = useQueryClient();

  const handleChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      handleChange("date", selectedDate.toISOString()); // Store the selected date
    }
  }

  const addExpense = () => {
    if (formData.item && formData.price && formData.category) {
      setExpenseList([...expenseList, formData]);
      setFormData({
        item: "",
        price: "",
        category: "",
        date: new Date().toISOString(),
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Please fill out all fields",
      });
    }
  };

  const removeExpense = (index: number) => {
    // Create a new array without the expense at the specified index
    const updatedExpenses = expenseList.filter((_, i) => i !== index);
    setExpenseList(updatedExpenses);
    Toast.show({
      type: "success",
      text1: "Expense removed successfully.",
    });
  };

  const createMutation = useMutation({
    mutationFn: () => createExpense({formData:expenseList, getToken}),
    onSuccess: () => {
      queryClient.invalidateQueries([`expense_${userId}`]);
      Toast.show({
        type: "success",
        text1: "Expense created successfully.",
      });
      setExpenseList([]);
      setModalVisible(false);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to create expense",
      });
    },
  });

  const isCreateLoading = createMutation.isPending;

  const handleSave = () => {
    if (expenseList.length > 0) {
      createMutation.mutate();
    } else {
      Toast.show({
        type: "error",
        text1: "Please add at least one expense before submitting",
      });
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <ScrollView
        // keyboardDismissMode="on-drag"
        className="w-full h-[70%] bg-black  absolute bottom-0 rounded-t-3xl p-5"
      >
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          className="flex items-end"
        >
          <Text className="text-[#ef4444] font-medium">Close</Text>
        </TouchableOpacity>
        <View className="flex gap-3">
          <TextField 
            label="Name of Product*"
            placeholder="e.g. Food, Grocery"
            value={formData.item}
            onChangeText={(value) => handleChange("item", value)}
          />

          <TextField 
            label="Price of Product*"
            placeholder="e.g. 1000"
            value={formData.price}
            onChangeText={(value) => handleChange("price", value)}
            keyboardType="numeric"
          />

          <PickerField 
            label="Product category*"
            value={formData.category}
            onValueChange={(value) => handleChange("category", value)}
            pickerItemLabel="Select category"
            pickerOption={categoryOptions}
          />

          <DateField 
            label="Date of spent"
            value={formData.date}
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate)}
          />
        </View>

        {expenseList.length > 0 && (
          <ScrollView 
            horizontal 
            contentContainerStyle={{paddingHorizontal: 10}} 
            className="my-2 bg-mainBgColor py-3 rounded-lg"
          >
            {expenseList.map((expense, index) => (
              <Animated.View
                entering={FadeInUp}
                exiting={FadeOutDown}
                key={index}
              >
                <View className="px-3 py-1 bg-secondaryText rounded-xl flex flex-row justify-between gap-3 items-center mr-2">
                  <Text className="font-medium">
                    {" "}
                    {expense.item.length > 5
                      ? `${expense.item.slice(0, 5)}...`
                      : expense.item}{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeExpense(index)}
                    className="text-white w-[30px] h-[25px] rounded-full flex justify-center items-center"
                  >
                    <AntDesign name="close" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        )}

        <View className="w-full flex mt-3 gap-3 justify-center">
          <TouchableOpacity
            onPress={addExpense}
            className="bg-cardBackground p-2 rounded-lg flex items-center"
          >
            <Text className="text-lg font-bold text-primaryTextColor tracking-widest">
              ADD
            </Text>
          </TouchableOpacity>
          {expenseList.length > 0 && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity
                onPress={handleSave}
                className="bg-cardBackground p-2 rounded-lg flex items-center"
                disabled={isCreateLoading}
              >
                {isCreateLoading ? (
                  <ActivityIndicator color={"#FF8A65"} size={20} />
                ) : (
                  <Text className="text-lg font-bold text-primaryTextColor tracking-widest">
                    SAVE
                  </Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

export default ExpenseForm;
