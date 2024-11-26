import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTodoData,
  removeTask,
  updateTaskChange,
  updateTodoData,
} from "@/src/API/todoAPI";
import dayjs from "dayjs";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import DeleteAlert from "@/src/components/modals/DeleteAlert";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useAuth } from "@clerk/clerk-expo";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import UpdateTodo from "@/src/components/forms/UpdateTodo";

const todoScreen = () => {
  const [filter, setFilter] = useState("all");
  const [selectedTodoToAddTask, setSelectedTodoToAddTask] = useState<
    string | null
  >(null);
  const [taskInputData, setTaskInputData] = useState<string>("");
  const [selectedTaskToDelete, setSelectedTaskToDelete] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [updateTodo, setUpdateTodo] = useState({
    todoId: "",
    title: "",
    dueDate: "",
  });

  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();


  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`todo_${userId}`],
    queryFn: () => getTodoData(getToken),
  });

  const todoData = data?.todos;

  // Get today's date
  const today = dayjs();

  // Filter the todos based on the selected filter
  const filteredTodos = useMemo(() => {
    return todoData
      ?.map((todo: any) => {
        // Calculate progress percentage for each todo
        const completedTasks = todo.tasks.filter(
          (task: any) => task.completed
        ).length;
        const totalTasks = todo.tasks.length;
        const progressPercentage =
          totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

        const isTodoCompleted = completedTasks === totalTasks && totalTasks > 0;

        return {
          ...todo,
          completed: isTodoCompleted, // Update the completed status based on tasks
          progressPercentage,
        };
      })
      .filter((todo: any) => {
        const remainingDays = dayjs(todo.dueDate).diff(today, "day");

        if (filter === "overdue") return remainingDays < 0;
        if (filter === "dueSoon")
          return remainingDays > 0 && remainingDays <= 3;
        if (filter === "completed") return todo.completed;
        return true; // Default is to return all todos
      });
  }, [todoData, filter, today]);

  const handleAddTask = (todoId: string) => {
    setSelectedTodoToAddTask(todoId);
  };

  const saveAddedTask = () => {
    if (!taskInputData.trim()) {
      Toast.show({
        type: "error",
        text1: "Task title cannot be empty!",
      });
      return;
    }

    const newTask = [
      {
        tasktitle: taskInputData,
        completed: false,
      },
    ];

    updateTodoMutation.mutate({ todoId: selectedTodoToAddTask, newTask });
  };

  // Mutation for adding a new task to a todo
  const updateTodoMutation = useMutation({
    mutationFn: ({ todoId, newTask }: any) => updateTodoData({todoId, tasks: newTask, getToken}),
    onSuccess: () => {
      queryClient.invalidateQueries([`todo_${userId}`]);
      Toast.show({
        type: "success",
        text1: "Task added successfully! Best of luck 👍",
      });
      setTaskInputData("");
      setSelectedTodoToAddTask(null);
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: "Task could not be added!!!",
      });
    },
  });

  const taskAddLoading = updateTodoMutation.isPending;

  const closeTodoInput = () => {
    setTaskInputData("");
    setSelectedTodoToAddTask(null);
  };

  const updateTaskMutation = useMutation({
    mutationFn: ({ isChecked, todoId, taskId, taskTitle }) =>
      updateTaskChange({isChecked, taskId, todoId, taskTitle, getToken}),
    onSuccess: () => {
      queryClient.invalidateQueries([`todo_${userId}`]);
      Toast.show({
        type: "success",
        text1: "Wowww! You complete it 🥳🥳🥳",
      });
    },
    onError: (err, variables, context) => {
      console.log(err);
      // Roll back cache to the previous value in case of an error
      queryClient.setQueryData([`todo_${userId}`], context.previousTodos);
    },
  });

  const handleTaskChange = (
    isChecked: boolean,
    todoId: string,
    taskId: string,
    taskTitle: string
  ) => {
    const task = filteredTodos
      .find((todo: any) => todo.tasks.some((t: any) => t._id === taskId))
      ?.tasks.find((t: any) => t._id === taskId);

    if (task.completed) {
      Toast.show({
        type: "info",
        text1: "This task is already completed!",
        text2: "You can remove it.",
      });
      return;
    }

    // console.log("from handleTaskChange: ",isChecked, todoId, taskId,  taskTitle);
    updateTaskMutation.mutate({ isChecked, todoId, taskId, taskTitle });
  };

  const handleClickOnUpdateTodo = (todoId: string, title: string, dueDate: string) => {
    setUpdateModalVisible(true);
    setUpdateTodo({...updateTodo, todoId, title, dueDate})
  }

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["16%", "30%"], []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-mainBgColor">
        <ActivityIndicator color="#FF8A65" size={"large"} />
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView>
      <View className="bg-mainBgColor w-full h-screen p-6">
        <KeyboardAwareFlatList
          data={filteredTodos}
          keyExtractor={(todo) => todo?._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          renderItem={({ item }) => {
            const createdAt = dayjs(item?.createdAt).format("DD/MM/YY");
            const dueDate = dayjs(item?.dueDate).format("DD/MM/YY");
            const remainingDays = dayjs(item?.dueDate).diff(today, "day");

            return (
              <View className="p-4 bg-cardBackground rounded-lg mb-3">
                {/* Progress Bar */}
                <View className="w-full bg-mainBgColor rounded-full h-2 mb-2">
                  <View
                    className={`h-2 rounded-full ${
                      item.progressPercentage === 100
                        ? "bg-[rgb(0_128_0)]"
                        : item.progressPercentage >= 75
                        ? "bg-[#22c55e]"
                        : item.progressPercentage >= 50
                        ? "bg-[#fde047]"
                        : "bg-[#f97316]"
                    }`}
                    style={{ width: `${item.progressPercentage}%` }}
                  ></View>
                </View>

                <View className="flex flex-row justify-between items-center mb-2">
                  <View className="flex flex-row gap-3">
                    <Text
                      className={`${
                        item.progressPercentage === 100
                          ? "bg-[rgb(0_128_0)]"
                          : item.progressPercentage >= 75
                          ? "bg-[#22c55e]"
                          : item.progressPercentage >= 50
                          ? "bg-[#fde047]"
                          : "bg-[#f97316]"
                      } py-1 px-2 rounded-md text-mainBgColor font-semibold text-sm`}
                    >
                      {`${
                        item.tasks.filter((task: any) => task.completed).length
                      }/${item.tasks.length}`}
                    </Text>
                    
                    <TouchableOpacity
                      onPress={() => handleClickOnUpdateTodo(item?._id, item?.title,item?.dueDate)}
                      className="bg-mainBgColor py-1 px-2 rounded-lg"
                    >
                      <FontAwesome name="pencil" size={20} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                  <Text
                    className={`font-medium text-sm ${
                      remainingDays <= 3
                        ? "text-red-500"
                        : "text-secondaryText "
                    }`}
                  >
                    {item.completed ? (
                      <>
                        <Text className="text-green-500">Completed</Text>
                      </>
                    ) : (
                      <>
                        {remainingDays >= 0
                          ? `Left ${remainingDays} day(s)`
                          : `Overdue by ${Math.abs(remainingDays)} day(s)`}
                      </>
                    )}
                  </Text>
                </View>

                {item.dueDate === today ? (
                  <View className="">
                    <Text className="text-lg font-bold text-borderColor capitalize">
                      {`${item.title === "" ? "Today" : item.title}`}
                    </Text>
                    <Text className="text-secondaryText font-medium text-base">
                      Complete task by {dueDate}
                    </Text>
                  </View>
                ) : (
                  <View className="">
                    <Text className="text-lg font-bold text-borderColor capitalize">
                      {`${item.title === "" ? "No title" : item.title}`}
                    </Text>
                    <Text className="text-secondaryText font-medium text-base">
                      Created: {createdAt}
                    </Text>
                    <Text className="text-secondaryText font-medium text-base">
                      Complete task by {dueDate}
                    </Text>
                  </View>
                )}

                <View className="mt-2">
                  <View className="flex flex-row justify-between">
                    <Text className="text-primaryTextColor font-semibold">
                      Tasks
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleAddTask(item?._id)}
                      className="bg-primaryTextColor rounded-md p-1"
                    >
                      <AntDesign name="plus" size={15} color="black" />
                    </TouchableOpacity>
                  </View>

                  <View className="bg-mainBgColor p-2 rounded-md mt-3 flex gap-4">
                    {selectedTodoToAddTask === item?._id && (
                      <Animated.View entering={FadeInUp} className="flex flex-row gap-3 justify-between">
                        <TextInput
                          value={taskInputData}
                          onChangeText={(value) => setTaskInputData(value)}
                          placeholder="Add a task"
                          placeholderTextColor="#F3ECEC"
                          className="bg-transparent border-b-2 border-borderColor outline-none text-primaryTextColor w-[70%]"
                        />
                        <View className="flex flex-row justify-center items-center gap-3">
                          <TouchableOpacity
                            onPress={saveAddedTask}
                            className="bg-cardBackground p-2 rounded-md"
                          >
                            {taskAddLoading ? (
                              <ActivityIndicator size={16} color="#FF6E40" />
                            ) : (
                              <AntDesign name="check" size={16} color="#22c55e" />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={closeTodoInput}
                            className="bg-cardBackground p-2 rounded-md"
                          >
                            <AntDesign name="close" size={16} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    )}

                    {item?.tasks?.map((task: any) => (
                      <Animated.View entering={FadeInUp} exiting={FadeInUp} key={task?._id} className="w-full">
                        <View className="flex flex-row justify-between gap-3 ">
                          <View className="flex flex-row">
                            <BouncyCheckbox
                              size={22}
                              isChecked={task.completed}
                              onPress={(isChecked) => {
                                handleTaskChange(
                                  isChecked,
                                  item?._id,
                                  task?._id,
                                  task?.tasktitle
                                );
                              }}
                            />
                            <Text
                              className={`capitalize font-medium w-[250px] ${
                                task?.completed
                                  ? "line-through text-gray-600"
                                  : "text-secondaryText"
                              }`}
                            >
                              {task?.tasktitle}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setSelectedTaskToDelete(task?._id);
                              setModalVisible(true)
                            }}
                          >
                            <MaterialIcons
                              name="delete"
                              size={24}
                              color="#ef4444"
                            />
                          </TouchableOpacity>
                        </View>
                      </Animated.View>
                    ))}
                  </View>
                </View>

                <DeleteAlert 
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  mutationFunction={() => removeTask(selectedTaskToDelete, getToken)}
                  queryKey={"todo"}
                />
              </View>
            );
          }}
          ListEmptyComponent={
            <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
              No Data Available
            </Text>
          }
          extraScrollHeight={130}
          enableOnAndroid
        />
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 p-5">
            <View className="flex flex-row gap-3 justify-evenly flex-wrap">
              <TouchableOpacity
                className={`${
                  filter === "all" ? "bg-borderColor" : "bg-secondaryText"
                } py-1 px-3 rounded-lg`}
                onPress={() => setFilter("all")}
              >
                <Text className="text-">All</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${
                  filter === "overdue" ? "bg-borderColor" : "bg-secondaryText"
                } py-1 px-3 rounded-lg`}
                onPress={() => setFilter("overdue")}
              >
                <Text className="text-">Overdue</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${
                  filter === "dueSoon" ? "bg-borderColor" : "bg-secondaryText"
                } py-1 px-3 rounded-lg`}
                onPress={() => setFilter("dueSoon")}
              >
                <Text className="text-">Due soon</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${
                  filter === "completed" ? "bg-borderColor" : "bg-secondaryText"
                } py-1 px-3 rounded-lg`}
                onPress={() => setFilter("completed")}
              >
                <Text className="text-">Completed</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </View>

      {updateModalVisible && (
        <UpdateTodo
          updateModalVisible={updateModalVisible}
          setUpdateModalVisible={setUpdateModalVisible}
          dataToUpdate={updateTodo}
        />
      )} 

    </GestureHandlerRootView>
  );
};

export default todoScreen;
