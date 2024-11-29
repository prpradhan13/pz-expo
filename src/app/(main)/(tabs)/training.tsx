import {
  ActivityIndicator,
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
import Dropdown from "@/src/components/Dropdown";
import ChangesAlert from "@/src/components/modals/ChangesAlert";

const training = () => {
  const [selectedTrainingToDelete, setSelectedTrainingToDelete] =
    useState<string>("");
  const [trainingToMakePublicUpdate, setTrainingToMakePublicUpdate] =
    useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [visibleCardId, setVisibleCardId] = useState<string | null>(null);

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

  // Function to open modal for a specific card
  const openModal = (id: string) => setVisibleCardId(id);

  // Function to close modal
  const closeModal = () => setVisibleCardId(null);

  const snapPoints = useMemo(() => ["10%", "25%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

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
      <View className="bg-mainBgColor w-full h-screen p-6">
        <TouchableOpacity
          onPress={() => router.navigate("/(main)/publicTrainingDetails")}
          className="bg-secondaryText rounded-xl p-2 mb-5"
        >
          <Text className="text-center font-medium tracking-wide">
            {" "}
            Explore Our Plans{" "}
          </Text>
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
                    <Dropdown
                      onDelete={() => {
                        setSelectedTrainingToDelete(item?._id);
                        setModalVisible(true);
                      }}
                      onTogglePublic={() => {
                        setTrainingToMakePublicUpdate(item?._id);
                        openModal(item?._id);
                      }}
                      isPublic={item?.isPublic}
                    />
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

                  {modalVisible && (
                    <DeleteAlert
                      setModalVisible={setModalVisible}
                      modalVisible={modalVisible}
                      mutationFunction={() =>
                        deleteTrainingData(selectedTrainingToDelete, getToken)
                      }
                      queryKey={`training_${userId}`}
                    />
                  )}

                  {visibleCardId === item?._id && (
                    <ChangesAlert
                      updatePublicModalVisible={visibleCardId === item._id}
                      setUpdatePublicModalVisible={closeModal}
                      trainingToMakePublicUpdate={trainingToMakePublicUpdate}
                      isPublic={item?.isPublic}
                    />
                  )}
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
                        created at:{" "}
                        {dayjs(item?.createdAt).format("DD MMMM YYYY")}
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
