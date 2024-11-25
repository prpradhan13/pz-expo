import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { deleteTrainingData, getTraining } from "@/src/API/trainingAPI";
import dayjs from "dayjs";
import { router, useNavigation } from "expo-router";
import DeleteAlert from "@/src/components/modals/DeleteAlert";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { useAuth, useUser } from "@clerk/clerk-expo";

const training = () => {
  const [selectedTrainingToDelete, setSelectedTrainingToDelete] =
    useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const navigation = useNavigation();

  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const userIsAdmin = user?.publicMetadata.role === "admin";

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [`training_${userId}`],
    queryFn: () => getTraining(getToken),
  });

  const allTainingData = useMemo(
    () => data?.trainingData,
    [data?.trainingData]
  );

  const nonPublicData = useMemo(() => {
    return data?.trainingData?.filter((training: any) => !training.isPublic);
  }, [data?.trainingData]);

  const navigateTrainingDetails = (trainId: string) => {
    navigation.navigate("trainingDetails", { selectedData: trainId });
  };

  const snapPoints = useMemo(() => ["10%", "25%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView>
      <View className="bg-mainBgColor w-full h-screen p-6">
        <TouchableOpacity
          onPress={() => router.navigate("/(main)/publicTrainingDetails")}
          className="bg-secondaryText rounded-xl p-2 mb-5"
        >
          <Text className="text-center font-medium tracking-wide"> Explore Our Plans </Text>
        </TouchableOpacity>
        {userIsAdmin ? (
          <FlatList
            data={allTainingData}
            keyExtractor={(allData) => allData._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View className="flex">
                <TouchableOpacity
                  onPress={() => navigateTrainingDetails(item?._id)}
                  className="p-4 bg-cardBackground rounded-xl shadow-md mb-3"
                >
                  <View className="flex flex-row justify-between mb-3">
                    <Text
                      className={`${
                        item?.isPublic ? " bg-[#94ff96]" : "bg-[#84fdff]"
                      } p-1 text-xs font-semibold rounded-md w-[70px] text-center`}
                    >
                      {item?.isPublic ? "Public" : "Not Public"}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTrainingToDelete(item?._id);
                        setModalVisible(true);
                      }}
                    >
                      <MaterialIcons name="delete" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-lg font-bold text-borderColor capitalize">
                    {item?.trainingName}
                  </Text>
                  <Text className="font-medium text-secondaryText capitalize">
                    {item?.category} Workout
                  </Text>
                  <Text className="capitalize text-secondaryText">
                    created at: {dayjs(item?.createdAt).format("DD MMMM YYYY")}
                  </Text>

                  <DeleteAlert
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    mutationFunction={() =>
                      deleteTrainingData(selectedTrainingToDelete, getToken)
                    }
                    queryKey={`training_${userId}`}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
                No Data Available
              </Text>
            }
          />
        ) : (
          <FlatList
            data={nonPublicData}
            keyExtractor={(allData) => allData._id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View className="flex">
                <TouchableOpacity
                  onPress={() => navigateTrainingDetails(item?._id)}
                  className="p-4 bg-cardBackground rounded-xl shadow-md mb-3"
                >
                  <View className="flex flex-row justify-between mb-3">
                    <View>
                      <Text className="text-xl font-bold text-borderColor capitalize">
                        {item?.trainingName}
                      </Text>
                      <Text className="font-medium text-secondaryText capitalize">
                        {item?.category} Workout
                      </Text>
                      <Text className="capitalize text-secondaryText">
                        created at: {dayjs(item?.createdAt).format("DD MMMM YYYY")}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setModalVisible(true);
                      }}
                    >
                      <MaterialIcons name="delete" size={24} color="#ef4444" />
                    </TouchableOpacity>
                  </View>


                  <DeleteAlert
                    setModalVisible={setModalVisible}
                    modalVisible={modalVisible}
                    mutationFunction={() =>
                      deleteTrainingData(selectedTrainingToDelete, getToken)
                    }
                    queryKey={"training"}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-center text-lg font-semibold py-5 text-primaryTextColor">
                No Data Available
              </Text>
            }
          />
        )}
      </View>

      {/* <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>

      </BottomSheet> */}
    </GestureHandlerRootView>
  );
};

export default training;
