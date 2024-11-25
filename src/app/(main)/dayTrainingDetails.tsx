import { ActivityIndicator, FlatList, Text, View } from "react-native";
import React, { useMemo } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import Animated, { BounceInDown } from "react-native-reanimated";

type RootStackParamList = {
  dayTrainingDetails: { selectedData: string };
};

type ExpenseDetailsRouteProp = RouteProp<
  RootStackParamList,
  "dayTrainingDetails"
>;

interface Week {
  _id: string;
  weekNumber: number;
  category: string;
  days: [
    {
      _id: string;
      dayNumber: number;
      name: string;
      isRestDay: boolean;
      workoutPlan: [{
        exerciseName: string;
        sets: [{ _id: string; repetitions: number }];
        restTime: number;
      }];
    }
  ];
}

interface WeeklyPlan {
  _id: string;
  createdAt: string;
  trainingName?: string;
  week: Week[];
}

interface TrainingQueryResponse {
  weeklyPlan: WeeklyPlan[];
}

const dayTrainingDetails = () => {
  const route = useRoute<ExpenseDetailsRouteProp>();
  const { selectedData } = route.params;

  const { data, isLoading, isError, error } = useQuery<TrainingQueryResponse>({
    queryKey: [`weeklyplan`],
  });

  const matchesTrainingData = useMemo(() => {
    if (!data?.weeklyPlan) return undefined;

    for (const weeklyPlan of data.weeklyPlan) {
      for (const week of weeklyPlan.week) {
        const foundDay = week.days.find((day) => day._id === selectedData);
        if (foundDay) return foundDay;
      }
    }
    return undefined;
  }, [data?.weeklyPlan, selectedData]);

  const trainData = matchesTrainingData || {};

  const exercisePlan = trainData?.workoutPlan || [];

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
    <View className="h-screen w-full bg-mainBgColor p-5">
      <FlatList
        data={exercisePlan}
        keyExtractor={(train) => train._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <Text className="text-primaryTextColor font-bold text-center text-xl pb-3 border-b-2 border-borderColor capitalize mb-3">
            {trainData?.name
              ? trainData?.name
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

export default dayTrainingDetails;
