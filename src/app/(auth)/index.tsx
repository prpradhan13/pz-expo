import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import Animated, { FadeInLeft } from "react-native-reanimated";

import Login from "@/src/components/register/Login";
import Signup from "@/src/components/register/Signup";

const Auth = () => {
  const [isSignupActive, setIsSignupActive] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(true);

  const [fontsLoaded] = useFonts({
    Pacifico: require("../../assets/fonts/Pacifico-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const clickOnSignupBtn = () => {
    setIsSignupActive(true);
    setIsLoginActive(false);
  };

  const clickOnLoginBtn = () => {
    setIsSignupActive(false);
    setIsLoginActive(true);
  };

  return (
    <SafeAreaView className="bg-mainBgColor flex-1 justify-center items-center w-full px-10">
      <View className="bg-cardBackground rounded-lg p-6 flex items-center w-full">
        <Text
          style={{ fontFamily: "Pacifico" }}
          className="font-pacifico text-borderColor text-3xl font-semibold py-3"
        >
          PZ
        </Text>
        <View className="w-[60vw] bg-mainBgColor uppercase font-bold text-sm rounded-3xl flex flex-row p-1 mb-8">
          <TouchableOpacity
            onPress={clickOnLoginBtn}
            className={`w-1/2 px-5 py-3 rounded-3xl ${
              isLoginActive ? "bg-cardBackground" : "bg-transparent"
            }`}
          >
            <Text
              className={`uppercase text-center font-semibold tracking-wider ${
                isLoginActive ? "text-borderColor" : "text-secondaryText"
              }`}
            >
              Log in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clickOnSignupBtn}
            className={`w-1/2 px-5 py-3 lg:p-2 rounded-3xl ${
              isSignupActive ? "bg-cardBackground" : "bg-transparent"
            }`}
          >
            <Text
              className={`uppercase text-center font-semibold tracking-wider ${
                isSignupActive ? "text-borderColor" : "text-secondaryText"
              }`}
            >
              sign up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full">
          {isSignupActive ? <Signup /> : <Login />}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
