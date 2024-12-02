import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import RestDay from "@/src/components/modals/RestDay";
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from "expo-router";

type RootStackParamList = {
  weeklyTrainingDetails: { selectedData: string };
};

type ExpenseDetailsRouteProp = RouteProp<
  RootStackParamList,
  "weeklyTrainingDetails"
>;

const weeklyPlanDetails = () => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute<ExpenseDetailsRouteProp>();
  const { selectedData } = route.params;

  const { data, isLoading, isError, error } = useQuery<any>({
    queryKey: [`weeklyplan`],
  });

  const matchesTrainingData = useMemo(() => {
    if (!data?.weeklyPlan) return undefined;

    return data.weeklyPlan.find((item: any) => item._id === selectedData);
  }, [data?.weeklyPlan, selectedData]);

  const weekly = matchesTrainingData?.week || [];

  const currentWeek = weekly[currentWeekIndex];

  const goToNextWeek = () => {
    if (currentWeekIndex < weekly.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
    }
  };

  const goToPreviousWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
    }
  };

  const clickOnDay = (day: any) => {
    if (day?.isRestDay) {
        return setModalVisible(true);
    }
    
    router.navigate({
        pathname: "/(main)/dayTrainingDetails",
        params: {selectedData: day?._id}
    })
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
    <SafeAreaView className="flex-1 bg-mainBgColor px-6 pt-6">
      <ScrollView>
        <View className="border-b-2 border-borderColor">
          <Text className="text-primaryTextColor font-bold text-center text-2xl capitalize">
            Week {currentWeek?.weekNumber}
          </Text>
          <Text className="text-secondaryText font-medium text-center text-base capitalize">
            {currentWeek?.category}
          </Text>
        </View>

        <View className="w-full grid lg:grid-cols-4 mt-3 gap-4">
            {currentWeek?.days.map((day: any) => (
              <TouchableOpacity
                key={day?._id}
                onPress={() => clickOnDay(day)}
                className="p-4 bg-cardBackground rounded-lg shadow-md cursor-pointer"
              >
                <Text className="text-lg font-medium text-borderColor">
                  Day {day?.dayNumber}
                </Text>
                <Text className="text-xl font-semibold text-secondaryText">
                  {day?.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>

        {modalVisible && (
            <RestDay 
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
        )}
        
        <View className="flex flex-row justify-between mt-6">
            <TouchableOpacity
                onPress={goToPreviousWeek}
                className={`p-2 bg-borderColor rounded-full flex flex-row items-center ${
                    currentWeekIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentWeekIndex === 0}
            >
                <AntDesign name="left" size={16} color="black" />
                <Text className="text-black font-semibold text-xs">Previous Week</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={goToNextWeek}
                className={`p-2 bg-borderColor rounded-full flex flex-row items-center ${
                    currentWeekIndex === weekly.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={currentWeekIndex === weekly.length - 1}
            >
                <Text className="text-black font-semibold text-xs">Next Week</Text>
                <AntDesign name="right" size={16} color="black" />
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default weeklyPlanDetails;
