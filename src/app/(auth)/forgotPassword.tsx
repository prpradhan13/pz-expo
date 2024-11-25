import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainButton } from "@/src/components/buttons/Buttons";
import { useSignIn } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useSignIn();

  const navigateToResetPassword = async () => {
    router.push("/(auth)/verifyCodeToForgot");
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter your email address.",
      });

      return;
    }

    try {
      setLoading(true);
      await signIn?.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
    } catch (error: any) {
      console.error(error.errors[0]);
      Toast.show({
        type: "error",
        text1: `${error.errors[0].longMessage}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-mainBgColor w-full h-full px-6 pt-20">
      <Text className="text-secondaryText">
        Enter your registerd email address, we send you a code in that email
        address.
      </Text>
      <View className="mt-8">
        <Text className="text-secondaryText text-lg font-medium">
          {" "}
          Enter your eamil*{" "}
        </Text>
        <TextInput
          value={email}
          onChangeText={(value) => setEmail(value)}
          className="bg-cardBackground text-primaryTextColor p-4 rounded-xl mt-2"
        />
      </View>

      <View className="flex items-center w-full mt-5">
        <TouchableOpacity
          onPress={navigateToResetPassword}
          className={`bg-accentColor w-[280px] p-3 rounded-full flex justify-center items-center`}
          disabled={loading}
        >
          <Text
            style={{ fontSize: 16 }}
            className="text-primaryTextColor font-bold uppercase tracking-widest"
          >
            {loading ? (
              <ActivityIndicator color="#F3ECEC" size={20} />
            ) : (
              "Submit"
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
