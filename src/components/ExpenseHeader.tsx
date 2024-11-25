import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Currency from "../utils/Currency";
import AntDesign from "@expo/vector-icons/AntDesign";

const ExpenseHeader = ({ totalExpense, setSelectedMonth }: any) => {
  return (
    <View className="">
      <View className="relative">
        <TouchableOpacity className="absolute" onPress={() => setSelectedMonth(null)}>
          <AntDesign name="leftcircleo" size={24} color="#FF8A65" />
        </TouchableOpacity>
        <Text className="text-primaryTextColor font-bold text-center text-xl pb-3">
          Expense Details
        </Text>
      </View>
      <Text className="text-secondaryText font-semibold text-lg text-center">
        Total Money Spent: <Currency price={totalExpense} />
      </Text>
    </View>
  );
};

export default ExpenseHeader;
