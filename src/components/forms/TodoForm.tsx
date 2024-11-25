import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { createTodo } from "@/src/API/todoAPI";
import { Picker } from "@react-native-picker/picker";
import Entypo from "@expo/vector-icons/Entypo";
import DateTimePicker from "@react-native-community/datetimepicker";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TodoCategoryOptions } from "@/src/utils/AdditionalData"
import { useAuth } from "@clerk/clerk-expo";
import TextField from "../inputs/TextField";
import DateField from "../inputs/DateField";
import PickerField from "../inputs/PickerField";

type Task = {
  tasktitle: string;
};

type TodoFormData = {
  title: string;
  dueDate: string;
  priority: string;
  tasks: Task[];
};

type TodoFormProps = {
  todoModalVisible: boolean;
  setTodoModalVisible: Dispatch<SetStateAction<boolean>>;
};

const priorityOptions = TodoCategoryOptions;

const TodoForm = ({ todoModalVisible, setTodoModalVisible }: TodoFormProps) => {
  const [todoFormData, setTodoFormData] = useState<TodoFormData>({
    title: "",
    dueDate: new Date().toISOString(),
    priority: "",
    tasks: [],
  });
  const [currentTask, setCurrentTask] = useState<Task>({
    tasktitle: "",
  });

  const { getToken, userId } = useAuth();

  const queryClient = useQueryClient();

  const handleChange = (name: string, value: string) => {
    setTodoFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle changes for each task
  const handleTaskChange = (field: string, value: string) => {
    setCurrentTask({ ...currentTask, [field]: value });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      handleChange("dueDate", selectedDate.toISOString()); // Store the selected date
    }
  }

  const addTask = () => {
    if (currentTask.tasktitle === "") {
      return Toast.show({
        type: "error",
        text1: "Please add a task",
      });
    }
    setTodoFormData((prev) => ({
      ...prev,
      tasks: [...prev.tasks, currentTask],
    }));

    setCurrentTask({
      tasktitle: "",
    });
  };

  const removeTask = (taskIndex: number) => {
    const updatedTask = todoFormData.tasks.filter((_, i) => i !== taskIndex);
    setTodoFormData({ ...todoFormData, tasks: updatedTask });
  };

  const createMutation = useMutation({
    mutationFn: () => createTodo({formData:todoFormData, getToken}),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Task created successfully",
      });
      queryClient.invalidateQueries([`todo_${userId}`]);
      setTodoFormData({
        title: "",
        dueDate: "",
        priority: "",
        tasks: [],
      });
      setTodoModalVisible(false);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to create todo",
      });
    },
  });

  const isCreateLoading = createMutation.isPending;

  const handleSave = () => {
    if (todoFormData.tasks.length > 0) {
      createMutation.mutate();
    } else {
      Toast.show({
        type: "info",
        text1: "Please add at least one Todo before saving!!!",
      });
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={todoModalVisible}>
      <ScrollView
        keyboardDismissMode="on-drag"
        className="w-full h-[70%] bg-black  absolute bottom-0 rounded-t-3xl p-5"
      >
        <TouchableOpacity
          onPress={() => setTodoModalVisible(false)}
          className="flex items-end"
        >
          <Text className="text-[#ef4444] font-medium">Close</Text>
        </TouchableOpacity>

        <View className="flex gap-3">
          <TextField 
            label="Title of Todo"
            placeholder="e.g. Learn React Native"
            value={todoFormData.title}
            onChangeText={(value) => handleChange("title", value)}
          />

          <DateField 
            label="How much time it taken?"
            value={todoFormData.dueDate}
            onChange={(event, selectedDate) => handleDateChange(event, selectedDate)}
          />

          <PickerField 
            label="Priority*"
            value={todoFormData.priority}
            onValueChange={(value) => handleChange("priority", value)}
            pickerItemLabel="Select priority"
            pickerOption={priorityOptions}
          />

          <TextField 
            label="Tasks"
            placeholder="e.g. Learn 2hr basic of React Native"
            value={currentTask.tasktitle}
            onChangeText={(value) => handleTaskChange("tasktitle", value)}
          />
        </View>

        {todoFormData.tasks.length > 0 && (
          <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 10}} className="my-2 bg-mainBgColor py-3 rounded-lg">
            {todoFormData.tasks.map((task, index) => (
              <Animated.View
                entering={FadeInUp}
                exiting={FadeOutDown}
                key={index}
              >
                <View className="px-3 py-1 bg-secondaryText rounded-xl flex flex-row justify-between gap-3 items-center capitalize font-medium mr-2">
                  <Text className="font-medium">
                    {task.tasktitle.length > 5
                      ? `${task.tasktitle.slice(0, 5)}...`
                      : task.tasktitle}
                  </Text>
                  <TouchableOpacity
                    onPress={() => removeTask(index)}
                    className="text-white w-[30px] h-[25px] rounded-full flex justify-center items-center"
                  >
                    <AntDesign name="close" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        )}

        <View className="w-full flex mt-5 gap-3 justify-center">
          <TouchableOpacity
            onPress={() => addTask()}
            className="bg-cardBackground p-2 rounded-lg flex items-center"
          >
            <Text className="text-lg font-bold text-primaryTextColor tracking-widest">
              ADD
            </Text>
          </TouchableOpacity>

          {todoFormData.tasks.length > 0 && (
            <Animated.View entering={FadeInUp}>
              <TouchableOpacity
                onPress={() => handleSave()}
                className="bg-cardBackground p-2 rounded-lg flex items-center"
                disabled={isCreateLoading}
              >
                {isCreateLoading ? (
                  <ActivityIndicator color={"#FF8A65"} size={24} />
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

export default TodoForm;
