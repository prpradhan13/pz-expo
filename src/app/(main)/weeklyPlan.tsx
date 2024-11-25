import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { getWeeklyPlan } from "@/src/API/weeklyPlanAPI";
import dayjs from "dayjs";
import { router } from "expo-router";

const weeklyPlan = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`weeklyplan`],
    queryFn: getWeeklyPlan,
  });

  const planData = data?.weeklyPlan;

  const navigateTrainingDetails = (trainId: string) => {
    router.navigate({
      pathname: "/(main)/weeklyPlanDetails",
      params: { selectedData: trainId }
    });
  };

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
    <SafeAreaView className="flex-1 bg-mainBgColor px-6 pt-8">
      <FlatList
        data={planData}
        keyExtractor={(allData) => allData._id}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
                onPress={() => navigateTrainingDetails(item?._id)}
              className="p-4 bg-cardBackground rounded-xl shadow-md mb-3"
            >
              <Text className="text-lg font-bold text-borderColor capitalize">
                {item?.trainingName}
              </Text>
              <Text className="capitalize text-secondaryText">
                created at: {dayjs(item?.createdAt).format("DD MMMM YYYY")}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
            No Public Data Available
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default weeklyPlan;
