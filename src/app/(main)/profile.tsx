import { Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useUser } from "@clerk/clerk-expo";
import { router, useNavigation } from "expo-router";

type ProfileRouteParams = {
  userNameInitials: string;
};

const profile = () => {
  const { user } = useUser();

  const route = useRoute<RouteProp<{ params: ProfileRouteParams }, "params">>();
  const { userNameInitials } = route.params || {};

  // Extract user email
  const userEmail = user?.emailAddresses?.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  return (
    <View className="bg-mainBgColor w-full h-screen px-6 pt-8">
      <View className="flex justify-center items-center">
        <View className="w-[80px] h-[80px] bg-borderColor rounded-full flex justify-center items-center">
          <Text className="uppercase font-bold text-xl">
            {userNameInitials}
          </Text>
        </View>
      </View>
        <View className="text-center mt-10">
          <Text className="capitalize text-primaryTextColor text-xl font-medium">
            Fullname: {user?.fullName}
          </Text>
          <Text className="text-primaryTextColor text-xl font-medium">
            Email: {userEmail}
          </Text>
        </View>

      <View className="mt-10">
          <TouchableOpacity
            onPress={() => router.push("/(main)/changePassword")}
            className="bg-secondaryText w-[200px] rounded-lg flex justify-center items-center"
          >
            <Text className="text-black py-3 font-medium"> Change Password </Text>
          </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 w-[200px] rounded-lg flex justify-center items-center mt-4"
        >
          <Text className="text-black py-3"> Delete Account </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default profile;
