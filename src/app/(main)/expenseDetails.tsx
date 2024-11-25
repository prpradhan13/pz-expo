import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import Currency from "@/src/utils/Currency";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import dayjs from "dayjs";
import { deleteExpenseData } from "@/src/API/expenseAPI";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import DeleteAlert from "@/src/components/modals/DeleteAlert";
import TickerComp from "@/src/components/TickerComp";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import {ExpenseCategoryOptions} from "@/src/utils/AdditionalData"

// Define the type of route parameters for the expenseDetails screen
type RootStackParamList = {
  expenseDetails: { selectedData: string };
};

type ExpenseDetailsRouteProp = RouteProp<RootStackParamList, "expenseDetails">;

interface Expense {
  _id: string;
  date: string;
  price: number;
  category: string;
  item: string;
}

interface ExpenseDataResponse {
  expenseData: Expense[];
}

const expenseDetails = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<any>(null);
  const [filter, setFilter] = useState<string>("all");
  const [filterLoadings, setFilterLoadings] = useState<boolean>(false);

  const route = useRoute<ExpenseDetailsRouteProp>();
  const { selectedData } = route.params;

  const { getToken, userId } = useAuth();

  const { data, isLoading } = useQuery<ExpenseDataResponse>({
    queryKey: [`expense_${userId}`],
  });

  const flatenExpenseData = useMemo(() => {
    const groupByMonth = (expenses: any[] | undefined) => {
      if (!expenses || !expenses.length) return {}; // Check if expenses exist

      return expenses.reduce((acc, expense) => {
        const month = dayjs(expense.date).format("MMMM YYYY"); // Group by month name and year
        if (!acc[month]) {
          acc[month] = { expenses: [] };
        }
        acc[month].expenses.push(expense);
        return acc;
      }, {});
    };

    return groupByMonth(data?.expenseData || []);
  }, [data?.expenseData]);

  const expenseData = useMemo(() => {
    return flatenExpenseData[selectedData].expenses;
  }, [selectedData]);

  const filterExpenseData = useMemo(() => {
    return expenseData.filter((data: any) => {
      if (filter === "investment") return data?.category === "investment";
      if (filter === "need") return data?.category === "need";
      if (filter === "emi") return data?.category === "emi";
      if (filter === "personal") return data?.category === "personal";
      return true;
    });
  }, [expenseData, filter]);

  const filterExpensePrice = useMemo(() => {
    return filterExpenseData.reduce((acc: number, data: any) => {
      return acc + (data?.price || 0);
    }, 0);
  }, [filterExpenseData]);

  useEffect(() => {
    setFilterLoadings(true);
    const timeoutId = setTimeout(() => {
      setFilterLoadings(false);
    }, 500); // Simulated loading time
    return () => clearTimeout(timeoutId);
  }, [filter]);

  const snapPoints = useMemo(() => ["10%", "25%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView>
      <View className="w-full h-screen bg-mainBgColor">
        <View className="h-1/4 w-full flex flex-row justify-center items-center">
          <Text className="text-primaryTextColor font-bold text-lg">Total</Text>
          <Text className="text-primaryTextColor font-extrabold text-4xl"> {<Currency price={filterExpensePrice}/>} </Text>
          {/* <TickerComp value={filterExpensePrice} filterCategory={filter} /> */}
        </View>
        <View className="bg-cardBackground rounded-3xl w-full h-full px-4 py-6">
          <View className="flex flex-row gap-3 justify-evenly flex-wrap">
            {ExpenseCategoryOptions.map(
              (category) => (
                <TouchableOpacity
                  key={category}
                  className={`${
                    filter === category ? "bg-borderColor" : "bg-secondaryText"
                  } py-1 px-3 rounded-lg`}
                  onPress={() => setFilter(category)}
                >
                  <Text className="capitalize">{category}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
          {filterLoadings ? (
            <ActivityIndicator color="#FF8A65" size={"large"} />
          ) : (
            <View className="py-4">
              <FlatList
                data={filterExpenseData}
                keyExtractor={(expense) => expense._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 280 }}
                // initialNumToRender={10}
                // maxToRenderPerBatch={10}
                // windowSize={5}
                renderItem={({ item }) => (
                  <View className="w-full rounded-lg bg-mainBgColor p-4 mb-4">
                    <View className="flex flex-row justify-between">
                      <View className="flex flex-row items-center gap-6">
                        <Text className="text-secondaryText">
                          {dayjs(item?.date).format("DD/MM/YY")}
                        </Text>
                        <View
                          className={`px-3 rounded-md ${
                            item?.category === "need"
                              ? "bg-yellow-400"
                              : item?.category === "investment"
                              ? "bg-green-400"
                              : item?.category === "personal"
                              ? "bg-orange-400"
                              : item?.category === "emi"
                              ? "bg-red-400"
                              : "bg-secondaryText"
                          }`}
                        >
                          <Text className="text-black capitalize text-sm">
                            {item?.category}
                          </Text>
                        </View>
                      </View>

                      <View className="flex flex-row gap-3">
                        <TouchableOpacity>
                          <FontAwesome
                            name="pencil-square-o"
                            size={24}
                            color="#3b82f6"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setExpenseToDelete(item?._id);
                            setModalVisible(true);
                          }}
                        >
                          <MaterialIcons
                            name="delete"
                            size={24}
                            color="#ef4444"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text className="capitalize font-semibold text-lg text-secondaryText">
                      {item?.item}
                    </Text>

                    <Text className="capitalize text-primaryTextColor">
                      {item?.price !== undefined ? (
                        <Currency price={item.price} />
                      ) : (
                        "N/A"
                      )}
                    </Text>

                    <DeleteAlert
                      modalVisible={modalVisible}
                      setModalVisible={setModalVisible}
                      queryKey={`expense_${userId}`}
                      mutationFunction={() =>
                        deleteExpenseData(expenseToDelete, getToken)
                      }
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
                    No Data Available
                  </Text>
                }
              />
            </View>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default expenseDetails;
