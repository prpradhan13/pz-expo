import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import AntDesign from "@expo/vector-icons/AntDesign";

import { getExpenseData } from "@/src/API/expenseAPI";
import Currency from "@/src/utils/Currency";
import { useNavigation } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const expences = () => {
  const [loadingMonth, setLoadingMonth] = useState<string | null>(null);

  const { getToken, userId } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`expense_${userId}`],
    queryFn: () => getExpenseData(getToken),
  });

  const navigation = useNavigation();

  // Group expenses by month using useMemo
  const expensesByMonth = useMemo(() => {
    const groupByMonth = (expenses: any[] | undefined) => {
      if (!expenses || !expenses.length) return {}; // Check if expenses exist

      return expenses.reduce((acc, expense) => {
        const month = dayjs(expense.date).format("MMMM YYYY"); // Group by month name and year
        if (!acc[month]) {
          acc[month] = { totalSpent: 0 };
        }
        acc[month].totalSpent += expense.price;
        return acc;
      }, {});
    };

    return groupByMonth(data?.expenseData);
  }, [data?.expenseData]);

  const allExpensesMonth = Object.keys(expensesByMonth);

  const handleNavigateMonth = (month: string) => {
    setLoadingMonth(month);
    setTimeout(() => {
      navigation.navigate("expenseDetails", { selectedData: month });
      setLoadingMonth(null);
    }, 100); // Optional delay for smoother UX
  };

  return (
    <GestureHandlerRootView>
      <View className="bg-mainBgColor h-screen w-full py-5">
        <FlatList
          data={allExpensesMonth}
          keyExtractor={(allData) => allData}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View className="pb-5">
              <View className="flex px-6 gap-4">
                <View key={item}>
                  <TouchableOpacity
                    className="p-4 bg-cardBackground rounded-lg flex flex-row justify-between"
                    onPress={() => handleNavigateMonth(item)}
                  >
                    <View>
                      <Text className="text-2xl font-bold text-primaryTextColor">
                        {item}
                      </Text>
                      <Text className="text-secondaryText font-medium">
                        Total Spent:{" "}
                        <Currency price={expensesByMonth[item].totalSpent} />
                      </Text>
                    </View>

                    {loadingMonth === item && (
                      <ActivityIndicator size="large" color="#FF8A65" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
              No Data Available
            </Text>
          }
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default expences;
