import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native";
import TextField from "../inputs/TextField";
import { useAuth } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNewDataOnExistingTraining } from "@/src/API/trainingAPI";
import Animated, { FadeInUp } from "react-native-reanimated";
import ExerciseSetManager from "../inputs/ExerciseSetManager";
import ExerciseList from "../ExerciseList";
import ExerciseActionButton from "../ExerciseActionButton";

type SetsProps = {
  repetitions: number;
};

type TrainingPlanProps = {
  exerciseName: string;
  sets: SetsProps[];
  restTime: number;
};

const AddNewExercise = ({
  addExerciseVisible,
  setAddExerciseVisible,
  trainingId,
}: any) => {
  const [trainingFormData, setTrainingFormData] = useState<{
    trainingPlan: TrainingPlanProps[];
  }>({
    trainingPlan: [],
  });
  const [currentExercise, setCurrentExercise] = useState<TrainingPlanProps>({
    exerciseName: "",
    sets: [{ repetitions: 0 }],
    restTime: 0,
  });

  const queryClient = useQueryClient();
  const { getToken, userId } = useAuth();

  const validateExercise = (): boolean => {
    if (!currentExercise.exerciseName.trim()) {
      Toast.show({ type: "error", text1: "Exercise name is required" });
      return false;
    }
    if (currentExercise.restTime < 0) {
      Toast.show({ type: "error", text1: "Rest time must be non-negative" });
      return false;
    }
    return true;
  };

  const handleExerciseChange = (field: keyof TrainingPlanProps, value: any) => {
    setCurrentExercise((prev) => ({ ...prev, [field]: value }));
  };

  const handleSetChange = (index: number, value: string) => {
    const updatedSets = currentExercise.sets.map((set, i) =>
      i === index ? { ...set, repetitions: parseInt(value, 10) || 0 } : set
    );
    setCurrentExercise((prev) => ({ ...prev, sets: updatedSets }));
  };

  const addSet = () => {
    setCurrentExercise((prev) => ({
      ...prev,
      sets: [...prev.sets, { repetitions: 0 }],
    }));
  };

  const removeSet = (index: number) => {
    setCurrentExercise((prev) => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index),
    }));
  };

  const addExercise = () => {
    if (!validateExercise()) return;

    setTrainingFormData((prev) => ({
      trainingPlan: [...prev.trainingPlan, currentExercise],
    }));
    // Reset the current exercise fields after adding
    setCurrentExercise({
      exerciseName: "",
      sets: [{ repetitions: 0 }],
      restTime: 0,
    });
  };

  const removeExercise = (index: number) => {
    setTrainingFormData((prev) => ({
      trainingPlan: prev.trainingPlan.filter((_, i) => i !== index),
    }));
  };

  const saveExerciseMutation = useMutation({
    mutationFn: () =>
      addNewDataOnExistingTraining({
        getToken,
        trainingId,
        trainingPlan: trainingFormData.trainingPlan,
      }),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Training Plan saved successfully",
      });
      queryClient.invalidateQueries([`training_${userId}`]);
      setAddExerciseVisible(null);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Failed to create training",
      });
    },
  });

  const isLoading = saveExerciseMutation.isPending;

  const handleSave = () => {
    if (!trainingFormData.trainingPlan.length) {
      return Toast.show({ type: "error", text1: "Add at least one exercise" });
    }
    saveExerciseMutation.mutate();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={addExerciseVisible}>
      <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
        <View className="bg-mainBgColor w-full rounded-2xl px-3 py-4">
          <View className="flex flex-row justify-between">
            <Text className="text-primaryTextColor text-xl font-bold">
              Add new Exercise
            </Text>
            <TouchableOpacity onPress={() => setAddExerciseVisible(null)}>
              <AntDesign name="close" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>

          {/* Exercise Form */}
          <View className="flex flex-col gap-1">
              <TextField
                label="Workout Name"
                placeholder="e.g. Bench press"
                value={currentExercise.exerciseName}
                onChangeText={(value) =>
                  handleExerciseChange("exerciseName", value)
                }
              />

              <View className="flex flex-row items-center gap-2 mt-3">
                <Text className="text-secondaryText font-medium">
                  Rest between sets (seconds)
                </Text>
                <TextInput
                  keyboardType="numeric"
                  value={String(currentExercise.restTime)}
                  onChangeText={(value) => {
                    handleExerciseChange("restTime", parseInt(value, 10) || 0);
                  }}
                  className="bg-cardBackground p-1 w-[50px] rounded-lg px-3 flex justify-center items-center text-primaryTextColor"
                />
              </View>

              <ExerciseSetManager 
                sets={currentExercise.sets}
                onSetChange={handleSetChange}
                addSet={addSet}
                removeSet={removeSet}
              />
          </View>

          {/* Existing Exercises */}
          {trainingFormData.trainingPlan.length > 0 && (
            <ExerciseList
              trainingPlan={trainingFormData.trainingPlan}
              removeExercise={removeExercise}
            />
          )}

          {/* Action Buttons */}
          <View className="w-full flex mt-3 gap-3">
            <ExerciseActionButton text="Add Exercise" onPress={addExercise} />

            {trainingFormData.trainingPlan.length > 0 && (
              <Animated.View entering={FadeInUp}>
                <ExerciseActionButton
                  text={`Save ${trainingFormData.trainingPlan.length} Plans`}
                  onPress={handleSave}
                  loading={isLoading}
                />
              </Animated.View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddNewExercise;
