import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

import { IsPublicOptions, TrainingCategoryOptions } from "@/src/utils/AdditionalData";
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTraining } from "@/src/API/trainingAPI";
import Animated, { FadeInLeft, FadeInRight, FadeInUp, FadeOutDown, FadeOutRight } from "react-native-reanimated";
import { useAuth, useUser } from "@clerk/clerk-expo";
import TextField from "../inputs/TextField";
import PickerField from "../inputs/PickerField";

type TrainingFormProps = {
  trainingModalVisible: boolean;
  setTrainingModalVisible: Dispatch<SetStateAction<boolean>>;
};

type SetsProps = {
  repetitions: number;
};

type TrainingPlanProps = {
  exerciseName: string;
  sets: SetsProps[];
  restTime: number;
};

type TrainingFormDataProps = {
  trainingName: string;
  category: string;
  trainingPlan: TrainingPlanProps[];
  isPublic: string;
};

const TrainingForm = ({
  trainingModalVisible,
  setTrainingModalVisible,
}: TrainingFormProps) => {
  const [trainingFormData, setTrainingFormData] =
    useState<TrainingFormDataProps>({
      trainingName: "",
      category: "",
      trainingPlan: [],
      isPublic: "No",
    });

  const [currentExercise, setCurrentExercise] = useState<TrainingPlanProps>({
    exerciseName: "",
    sets: [{ repetitions: 0 }],
    restTime: 0,
  });
  const [nextStep, setNextStep] = useState<boolean>(false);

  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const userIsAdmin = user?.publicMetadata.role === "admin";

  const queryClient = useQueryClient();

  const handleChange = (name: string, value: string) => {
    setTrainingFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleExerciseChange = (field: string, value: string) => {
    setCurrentExercise({ ...currentExercise, [field]: value });
  };

  const handleSetChange = (setIndex: number, value: string) => {
    const updatedSets = [...currentExercise.sets];
    updatedSets[setIndex] = { repetitions: parseInt(value, 10) };
    setCurrentExercise({ ...currentExercise, sets: updatedSets });
  };

  const addSet = () => {
    setCurrentExercise((prev) => ({
      ...prev,
      sets: [...prev.sets, { repetitions: 0 }],
    }));
  };

  const removeSet = (setIndex: number) => {
    const updatedSets = currentExercise.sets.filter(
      (_, index) => index !== setIndex
    );
    setCurrentExercise({ ...currentExercise, sets: updatedSets });
  };

  const addExercise = () => {
    if (currentExercise.exerciseName === "") {
      return Toast.show({
        type: "error",
        text1: "Please add a exercise",
      });
    }

    setTrainingFormData((prev) => ({
      ...prev,
      trainingPlan: [...prev.trainingPlan, currentExercise],
    }));
    // Reset the current exercise fields after adding
    setCurrentExercise({
      exerciseName: "",
      sets: [{ repetitions: 0 }],
      restTime: 0,
    });
  };

  const removeExercise = (exerciseIndex: number) => {
    const updatedPlan = trainingFormData.trainingPlan.filter(
      (_, i) => i !== exerciseIndex
    );
    setTrainingFormData({ ...trainingFormData, trainingPlan: updatedPlan });
  };

  const createMutation = useMutation({
    mutationFn: () => {
      const transformedData = {
        ...trainingFormData,
        isPublic: trainingFormData.isPublic === "Yes", // Convert to boolean
      };
      return createTraining({trainingFormData: transformedData, getToken});
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Training Plan created successfully",
      });
      queryClient.invalidateQueries([`training_${userId}`]);
      setTrainingFormData({
        trainingName: "",
        category: "",
        trainingPlan: [],
        isPublic: "",
      });
      setTrainingModalVisible(false);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to create training",
      });
    },
  });

  const isCreateLoading = createMutation.isPending;

  const handleSave = () => {
    if (trainingFormData.trainingPlan.length > 0) {
      createMutation.mutate();
    } else {
      Toast.show({
        type: "error",
        text1: "Please add at least one plan before saving!!!",
      });
    }
  };

  const handleNextButton = () => {
    setNextStep(true);
  }

  const handlePrevButton = () => {
    setNextStep(!nextStep);
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={trainingModalVisible}
    >
      <ScrollView
        // keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingBottom: 50 }}
        className="w-full h-[60%] bg-black  absolute bottom-0 rounded-t-3xl px-5 py-3"
      >
        <View className={`flex flex-row ${nextStep ? 'justify-between' : ' justify-end'}`}>
          {nextStep && (
            <TouchableOpacity
                onPress={handlePrevButton}
              >
                <Text className="text-blue-500 font-medium tracking-wider">Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => setTrainingModalVisible(false)}
            className="flex"
          >
            <Text className="text-[#ef4444] font-medium tracking-wider">Close</Text>
          </TouchableOpacity>
        </View>

        {!nextStep ? (
          <Animated.View entering={FadeInLeft} exiting={FadeInRight} className="flex gap-3 mt-3">
            <TextField 
              label="Name of Workout"
              placeholder="e.g. Chest day"
              value={trainingFormData.trainingName}
              onChangeText={(value) => handleChange("trainingName", value)}
            />

            {userIsAdmin && (
              <PickerField 
                label="Is this for all?"
                value={trainingFormData.isPublic}
                onValueChange={(value) => handleChange("isPublic", value)}
                pickerOption={IsPublicOptions}
              />
            )}

            <PickerField 
              label="Category*"
              value={trainingFormData.category}
              onValueChange={(value) => handleChange("category", value)}
              pickerItemLabel="Select category"
              pickerOption={TrainingCategoryOptions}
            />

            <View className="flex items-end mt-3">
              <TouchableOpacity
                onPress={handleNextButton}
                className="bg-secondaryText py-1 w-[130px] rounded-xl"
              >
                <Text className="font-semibold text-center tracking-wider">
                  Next Step
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInRight} exiting={FadeInLeft}>
              <View className="bg-mainBgColor p-4 rounded-lg mt-4">
                <View className="flex flex-col gap-1">
                  <View>
                    <TextField 
                      label="Workout Name"
                      placeholder="e.g. Bench press"
                      value={currentExercise.exerciseName}
                      onChangeText={(value) => handleExerciseChange("exerciseName", value)}
                    />
                    
                    <View className="flex flex-row items-center gap-2 mt-3">
                      <Text className="text-secondaryText font-medium">Rest between sets:</Text>
                      <TextInput
                        keyboardType="numeric"
                        value={String(currentExercise.restTime)}
                        onChangeText={(value) => {
                          const numberValue = value ? parseInt(value, 10) : 0; // Convert the string to a number
                          handleExerciseChange(
                            "restTime",
                            numberValue.toString()
                          ); // Store as string
                        }}
                        className="bg-cardBackground p-1 w-[50px] rounded-lg px-3 flex justify-center items-center text-primaryTextColor"
                      />
                    </View>
                  </View>

                
                    <View className="flex flex-row flex-wrap gap-x-10 gap-y-2 my-2">
                      {currentExercise.sets.map((set, setIndex) => (
                        <View
                          key={setIndex}
                          className="flex flex-row items-center gap-2"
                        >
                          <Text className="text-secondaryText font-medium">
                            Set {setIndex + 1}:
                          </Text>
                          <TextInput
                            keyboardType="numeric"
                            placeholder="Repetitions"
                            placeholderTextColor="grey"
                            value={set.repetitions.toString()}
                            onChangeText={(value) =>
                              handleSetChange(setIndex, value)
                            }
                            className="bg-cardBackground tracking-widest rounded-lg p-2 w-[50px] text-primaryTextColor"
                          />
                          {currentExercise.sets.length > 1 && (
                            <TouchableOpacity
                              onPress={() => removeSet(setIndex)}
                              className="bg-cardBackground p-2 rounded-lg flex justify-center items-center"
                            >
                              <AntDesign name="close" size={16} color="#ef4444" />
                            </TouchableOpacity>
                          )}
                          {setIndex === currentExercise.sets.length - 1 && (
                            <TouchableOpacity
                              onPress={() => addSet()}
                              className="bg-cardBackground rounded-lg p-2"
                            >
                              <AntDesign name="plus" size={16} color="#22c55e" />
                            </TouchableOpacity>
                          )}
                        </View>
                      ))}
                    </View>
                  
                </View>
              </View>

            {trainingFormData.trainingPlan.length > 0 && (
              <ScrollView horizontal contentContainerStyle={{paddingHorizontal: 10}} className="my-2 bg-mainBgColor py-3 rounded-lg">
                {trainingFormData.trainingPlan.map((plan, index) => (
                  <Animated.View
                    entering={FadeInUp}
                    exiting={FadeOutDown}
                    key={index}
                    className="px-3 py-2 bg-secondaryText rounded-xl flex flex-row justify-between gap-2 items-center font-medium mr-2"
                  >
                    <Text className="font-medium">
                      {plan.exerciseName.length > 5
                        ? `${plan.exerciseName.slice(0, 8)}...`
                        : plan.exerciseName}
                    </Text>

                    <TouchableOpacity
                      onPress={() => removeExercise(index)}
                      className="w-[30px] h-[25px] rounded-full flex flex-row justify-center items-center"
                    >
                      <AntDesign name="close" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </ScrollView>
            )}

            <View className="w-full flex mt-3 gap-3 justify-center">
              <TouchableOpacity
                onPress={addExercise}
                className="bg-cardBackground p-2 rounded-lg flex items-center"
              >
                <Text className="text-lg font-bold text-primaryTextColor tracking-widest">
                  Add Exercise
                </Text>
              </TouchableOpacity>

              {trainingFormData.trainingPlan.length > 0 && (
                <Animated.View entering={FadeInUp}>
                  <TouchableOpacity
                    onPress={handleSave}
                    className="bg-cardBackground p-2 rounded-lg flex items-center"
                    disabled={isCreateLoading}
                  >
                    {isCreateLoading ? (
                      <ActivityIndicator color={"#FF8A65"} size={24} />
                    ) : (
                      <Text className="text-lg font-bold text-primaryTextColor tracking-widest">
                        Save {trainingFormData.trainingPlan.length} Plans
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </Modal>
  );
};

export default TrainingForm;
