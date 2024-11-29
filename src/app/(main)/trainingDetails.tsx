import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import Animated, { BounceInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import AddNewExercise from "@/src/components/forms/AddNewExercise";

type RootStackParamList = {
  trainingDetails: { selectedData: string };
};

type ExpenseDetailsRouteProp = RouteProp<RootStackParamList, "trainingDetails">;

interface Exercise {
  _id: string;
  exerciseName: string;
  sets: { repetitions: number }[];
  restTime: number;
}

interface TrainingData {
  _id: string;
  trainingName?: string;
  name?: string;
  trainingPlan?: Exercise[];
  workoutPlan?: Exercise[];
}

interface TrainingQueryResponse {
  trainingData: TrainingData[];
}

const trainingDetails = () => {
  const [addNewExerciseForm, setAddNewExerciseForm] = useState<string | null>(null)

  const route = useRoute<ExpenseDetailsRouteProp>();
  const { selectedData } = route.params;

  const { userId } = useAuth();

  const { data, isLoading, isError, error } = useQuery<TrainingQueryResponse>({
    queryKey: [`training_${userId}`],
  });

  const matchesTrainingData = useMemo(() => {
    if (!data?.trainingData) return undefined;

   return data.trainingData.find((item) => item._id === selectedData)
  }, [data?.trainingData, selectedData])

  const trainData = matchesTrainingData || {};

  const exercisePlan = trainData?.trainingPlan || [];

  if (isLoading) {
    <View className="flex-1 justify-center items-center bg-mainBgColor">
      <ActivityIndicator size="large" color="#FF6E40" />
    </View>
  }

  if (isError) {
    return (
      <View>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View className="h-screen w-full bg-mainBgColor p-5">
      <FlatList
        data={exercisePlan}
        keyExtractor={(train) => train._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <View className=" mb-5 flex flex-row justify-between items-center">
            <Text className="text-primaryTextColor font-bold text-2xl capitalize">
              {trainData?.trainingName || trainData?.name
                ? trainData?.trainingName || trainData?.name
                : "Training Plan"}
            </Text>
            
            <TouchableOpacity
              onPress={() => {
                setAddNewExerciseForm(trainData?._id)
              }}
            >
              <FontAwesome name="pencil-square-o" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View
          entering={BounceInDown.delay(index * 200)}
            className="mb-3 p-4 bg-cardBackground rounded-lg"
          >
            <Text className="font-semibold text-primaryTextColor">
              Exercise {index + 1}
            </Text>
            <Text className="text-lg text-borderColor capitalize font-semibold">
              {item?.exerciseName}
            </Text>
            <View className="mt-2 flex flex-row flex-wrap gap-2">
              {item?.sets?.map((set: any, setIndex: number) => (
                <Text
                  key={setIndex}
                  className="text-secondaryText bg-mainBgColor font-medium rounded-md p-2 w-[170px]"
                >
                  Set {setIndex + 1}:{" "}
                  <Text className="font-semibold text-borderColor">
                    {set.repetitions}
                  </Text>{" "}
                  repes
                </Text>
              ))}
            </View>
            <Text className="text-base font-medium text-secondaryText mt-3">
              *Rest in between sets{" "}
              <Text className="font-semibold">{item?.restTime} seconds</Text>
            </Text>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
            No Data Available
          </Text>
        }
      />

      {addNewExerciseForm === trainData?._id && (
        <AddNewExercise 
          addExerciseVisible={addNewExerciseForm === trainData?._id}
          setAddExerciseVisible={setAddNewExerciseForm}
          trainingId={trainData?._id}
        />
      )}
    </View>
  );
};

export default trainingDetails;

