import { TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { MainButton } from "../buttons/Buttons";
import Feather from "@expo/vector-icons/Feather";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import Animated, { FadeInRight } from "react-native-reanimated";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordShow, setIsPasswordShow] = useState(false);

  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const onSignUpPress = async () => {
    setIsLoading(true);
    if (!isLoaded) {
      return;
    }

    try {
      if (!firstName || !lastName || !emailAddress || !password) {
        Toast.show({
          type: "error",
          text1: `All Fields are required`
        })

        return;
      }

      await signUp.create({
        firstName,
        lastName,
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.replace("/(auth)/verificationScreen");
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
      Toast.show({
        type: "error",
        text1: "Something went wrong while Sign up 🤔",
        text2: `Error: ${error.errors[0].message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View entering={FadeInRight} className="w-full">
      <View className="flex items-center gap-8">
        <View className="w-full flex gap-4">
          <TextInput
            className="p-3 bg-mainBgColor outline-none rounded-md text-base text-primaryTextColor"
            placeholder="First Name"
            placeholderTextColor="#CFCFCF"
            value={firstName}
            onChangeText={(firstName) => setFirstName(firstName)}
          />
          <TextInput
            className="p-3 bg-mainBgColor outline-none rounded-md text-base text-primaryTextColor"
            placeholder="Last Name"
            placeholderTextColor="#CFCFCF"
            value={lastName}
            onChangeText={(lastName) => setLastName(lastName)}
          />
          <TextInput
            className="p-3 bg-mainBgColor outline-none rounded-md text-base text-primaryTextColor"
            placeholder="Email"
            placeholderTextColor="#CFCFCF"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
          />

          <View className="flex justify-between items-center relative">
            <TextInput
              className="w-full p-3 bg-mainBgColor outline-none rounded-md text-base text-primaryTextColor"
              placeholder="Enter password"
              secureTextEntry={!isPasswordShow}
              value={password}
              onChangeText={(password) => setPassword(password)}
              placeholderTextColor="#CFCFCF"
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShow((prev) => !prev)}
              className="bg-cardBackground p-2 rounded-md text-primaryTextColor absolute right-1 top-2 cursor-pointer hover:text-borderColor"
            >
              <Feather
                name={isPasswordShow ? "eye-off" : "eye"}
                size={20}
                color="#CFCFCF"
              />
            </TouchableOpacity>
          </View>

          <View className="flex items-center">
            <MainButton
              isLoading={isLoading}
              btnName={"sign up"}
              btnColor="mainBgColor"
              btnWidth={'60vw'}
              onPress={onSignUpPress}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default Signup;
