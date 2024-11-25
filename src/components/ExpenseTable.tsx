import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Currency from "../utils/Currency";
import AntDesign from "@expo/vector-icons/AntDesign";
import { deleteExpenseData } from "../API/expenseAPI";

const ITEMS_PER_PAGE = 10;

const ExpenseTable = ({ expensesByMonth, selectedMonth }: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [updateForm, setUpdateForm] = useState(false);
  const [selectedUpdateData, setSelectedUpdateData] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const queryClient = useQueryClient();

  // Memoize the expenses array to avoid unnecessary recalculations
  const expenses = useMemo(() => {
    return expensesByMonth[selectedMonth]?.expenses || [];
  }, [expensesByMonth, selectedMonth]);

  const totalExpense = useMemo(() => {
    return expensesByMonth[selectedMonth]?.totalSpent;
  }, [expensesByMonth, selectedMonth]);

  // Filter expenses based on the selected date range
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense: any) => {
      const expenseDate = dayjs(expense.date);
      const isAfterStartDate = startDate
        ? expenseDate.isAfter(dayjs(startDate).subtract(1, "day"))
        : true;
      const isBeforeEndDate = endDate
        ? expenseDate.isBefore(dayjs(endDate).add(1, "day"))
        : true;
      return isAfterStartDate && isBeforeEndDate;
    });
  }, [expenses, startDate, endDate]);

  //   console.log(filteredExpenses);

  // Calculate the total number of pages
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

  // Get the current page's expenses
  const currentExpenses = filteredExpenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle going to the next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle going to the previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (expenseId) => deleteExpenseData(expenseId),
    onSuccess: (data, expenseId) => {
      queryClient.setQueryData(["expense"], (oldData: any) => {
        if (!oldData) return oldData;
        const updatedExpenses = oldData.expenseData.filter(
          (item: any) => item._id !== expenseId
        );

        return {
          ...oldData,
          expenseData: updatedExpenses,
        };
      });
    },
  });

  const handleDelete = (expenseId: any) => {
    deleteMutation.mutate(expenseId);
    setModalVisible(false);
  };

  //   const clickOnUpdateIcon = (expense) => {
  //     // setSelectedUpdateData(expense);
  //     // setUpdateForm(true);
  //   };

  // Handle resetting pagination when date filter changes
  const handleDateChange = () => {
    // setCurrentPage(1);
  };

  return (
    <>
      <FlatList
        data={filteredExpenses}
        keyExtractor={(expense) => expense._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 150 }}
        renderItem={({ item }) => (
          <View className="w-full rounded-lg bg-cardBackground p-4 mb-4">
            <View className="flex flex-row justify-between">
              <View className="flex flex-row items-center gap-6">
                <Text className="text-secondaryText">
                  {dayjs(item?.date).format("DD/MM/YY")}
                </Text>
                <View className="px-3 rounded-md bg-green-500">
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
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <MaterialIcons name="delete" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="capitalize font-semibold text-lg text-secondaryText my-2">
              {item?.item}
            </Text>

            <Text className="capitalize text-lg text-secondaryText">
              {item?.price !== undefined ? (
                <Currency price={item.price} />
              ) : (
                "N/A"
              )}
            </Text>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
            >
              <View className="bg-[rgba(0_0_0_0.5)] flex-1 justify-center items-center p-6">
                <View className="bg-cardBackground w-[400px] h-[200px] rounded-lg flex justify-center items-center gap-6">
                  <Text className="text-primaryTextColor text-lg font-semibold">
                    Are you sure to delete this?
                  </Text>
                  <View className="flex flex-row justify-center items-center gap-6">
                    <TouchableOpacity
                      onPress={() => handleDelete(item?._id)}
                      className="bg-mainBgColor p-2 rounded-lg"
                    >
                      <AntDesign name="check" size={24} color="#22c55e" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      className="bg-mainBgColor p-2 rounded-lg"
                    >
                      <AntDesign name="close" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
            No Data Available
          </Text>
        }
      />
    </>
  );
};

export default ExpenseTable;
