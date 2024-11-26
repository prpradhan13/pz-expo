import { Modal, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import AntDesign from '@expo/vector-icons/AntDesign';
import TextField from "../inputs/TextField";
import DateField from "../inputs/DateField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTodoDetails } from "@/src/API/todoAPI";
import { useAuth } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

const UpdateTodo = ({
  updateModalVisible,
  setUpdateModalVisible,
  dataToUpdate,
}: any) => {
    const [userFillTitle, setUserFillTitle] = useState(dataToUpdate.title);
    const [userDueDate, setUserFillDueDate] = useState(dataToUpdate.dueDate);
    
    const todoId = dataToUpdate.todoId;
    const queryClient = useQueryClient();
    const { getToken, userId } = useAuth();

    const todayDate = dayjs();
    
    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setUserFillDueDate(selectedDate.toISOString());
        }
    }

    const updateTodoMutation = useMutation({
        mutationFn: () => updateTodoDetails({todoId, userFillTitle, userDueDate, getToken}),
        onSuccess: () => {
            queryClient.invalidateQueries([`todo_${userId}`]);
            Toast.show({
                type: "success",
                text1: "Todo updated successfully",
            });
            setUserFillTitle("");
            setUserFillDueDate("");
            setUpdateModalVisible(false);
        },
        onError: () => {
            Toast.show({
              type: "error",
              text1: "Oppps!!! Todo could not be update.",
            });
        },
    })

    const handleUpdateTodo = () => {
        if(dataToUpdate.title === userFillTitle){
            Toast.show({
                type: "error",
                text1: "You must have to change the title.",
            });

            return null;
        }

        updateTodoMutation.mutate();
    }

  return (
    <Modal animationType="fade" transparent={true} visible={updateModalVisible}>
      <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
        <View className="bg-mainBgColor w-full rounded-2xl px-3 py-4">
            <View className="flex flex-row justify-between">
                <Text className="text-primaryTextColor text-xl font-bold">
                    Update Todo
                </Text>
                <TouchableOpacity
                    onPress={()=> setUpdateModalVisible(false)}
                >
                    <AntDesign name="close" size={24} color="#ef4444" />
                </TouchableOpacity>
            </View>

            <View className="mt-5 flex gap-4">
                <TextField 
                    label="Todo Title"
                    value={userFillTitle}
                    onChangeText={(value) => setUserFillTitle(value)}
                />

                <DateField 
                    label="Due Date"
                    value={userDueDate}
                    onChange={(event, selectedDate) => handleDateChange(event, selectedDate)}
                />
            </View>

            <View className="w-full flex justify-center items-center mt-6">
                <TouchableOpacity
                    onPress={handleUpdateTodo}
                    className="bg-secondaryText py-3 w-[200px] rounded-full"
                >
                    <Text className="text-center font-bold text-lg tracking-wider uppercase"> Update </Text>
                </TouchableOpacity>
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateTodo;
