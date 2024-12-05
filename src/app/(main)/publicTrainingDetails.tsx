import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useQuery } from "@tanstack/react-query";
import { getPublicTrainingData } from "@/src/API/trainingAPI";
import dayjs from "dayjs";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { TrainingCategoryOptions } from "@/src/utils/AdditionalData";
import { router } from "expo-router";

const publicTrainingDetails = () => {
  const [filter, setFilter] = useState<string>("all");

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["publicTraining", currentPage, limit],
    queryFn: () => getPublicTrainingData(currentPage, limit),
    keepPreviousData: true,
  });

  const publicTrainingData = data?.trainingData;

  const filterPublicTrainingData = useMemo(() => {
    return publicTrainingData?.filter((data: any) => {
      if (TrainingCategoryOptions.includes(filter)) {
        return data?.category?.toLowerCase() === filter.toLowerCase();
      }
      return true;
    });
  }, [publicTrainingData, filter]);

  const navigateTrainingDetails = (trainId: string) => {
    router.navigate({
      pathname: "/(main)/trainingDetails",
      params: { selectedData: trainId }
    });
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "50%"], []);

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
      <SafeAreaView className="bg-mainBgColor">
        <View className="w-full h-screen px-6">
          <FlatList
            data={filterPublicTrainingData}
            keyExtractor={(allData) => allData._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                    onPress={() => navigateTrainingDetails(item?._id)}
                  className="p-4 bg-cardBackground rounded-xl shadow-md mb-3"
                >
                  <Text className="text-lg font-bold text-borderColor capitalize">
                    {item?.trainingName}
                  </Text>
                  <Text className="font-medium text-secondaryText capitalize">
                    {item?.category} Workout
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
        </View>
        <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
          <BottomSheetView className="flex-1 p-5">
            <View className="mb-5">
              <Text className="font-semibold text-lg tracking-wide">
                Popular
              </Text>
              <TouchableOpacity
                  onPress={() => router.navigate("/(main)/weeklyPlan")}
                className="bg-secondaryText rounded-xl p-2 mt-2"
              >
                <Text className="text-center font-medium tracking-wide">
                  Explore Weekly Plans
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <Text className="font-semibold text-lg tracking-wide">
                Categories
              </Text>
              <View className="flex flex-row gap-3 flex-wrap mt-2">
                {TrainingCategoryOptions.map((category) => (
                  <TouchableOpacity
                    key={category}
                    className={`${
                      filter === category
                        ? "bg-borderColor"
                        : "bg-secondaryText"
                    } py-1 px-3 rounded-lg`}
                    onPress={() => setFilter(category)}
                  >
                    <Text className="capitalize">{category}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default publicTrainingDetails;
