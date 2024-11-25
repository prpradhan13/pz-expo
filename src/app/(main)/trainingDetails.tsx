import { FlatList, Text, View } from "react-native";
import React, { useMemo } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import Animated, { BounceInDown } from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";

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

  return (
    <View className="h-screen w-full bg-mainBgColor p-5">
      <FlatList
        data={exercisePlan}
        keyExtractor={(train) => train._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <Text className="text-primaryTextColor font-bold text-center text-xl pb-3 border-b-2 border-borderColor capitalize mb-3">
            {trainData?.trainingName || trainData?.name
              ? trainData?.trainingName || trainData?.name
              : "Training Plan"}
          </Text>
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
    </View>
  );
};

export default trainingDetails;

