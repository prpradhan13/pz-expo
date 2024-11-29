import { SplashScreen, Stack, router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useFonts } from "expo-font";
import { Pacifico_400Regular } from "@expo-google-fonts/pacifico";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useUser } from "@clerk/clerk-expo";
import LogoutAlert from "@/src/components/modals/LogoutAlert";

// Create a QueryClient instance
const queryClient = new QueryClient();

export const Layout = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const { user } = useUser();

  let [fontsLoaded, error] = useFonts({
    Pacifico_400Regular,
  });

  const getInitialLetter = (fullName: any) => {
    if (!fullName) return "";
    // const nameParts = fullname[0];
    // return nameParts // If incase change of mind and i want to show the fullname's 1st letter
    const nameParts = fullName.split(" ");
    return nameParts.length === 1
      ? fullName.slice(0, 2).toUpperCase()
      : nameParts
          .map((name: any) => name[0])
          .join("")
          .toUpperCase();
  };

  const userNameInitials = useMemo(
    () => getInitialLetter(user?.fullName),
    [user?.fullName]
  );

  const navigateToProfile = () => {
    router.navigate({
      pathname: "/(main)/profile",
      params: { userNameInitials },
    });
  };

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "#242424" },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerLeft: () => (
              <View className="w-[40px] h-[40px] bg-mainBgColor rounded-full flex justify-center items-center">
                <TouchableOpacity
                  onPress={navigateToProfile}
                  className="text-primaryTextColor font-semibold uppercase"
                >
                  <Text className="text-primaryTextColor font-bold">
                    {userNameInitials}
                  </Text>
                </TouchableOpacity>
              </View>
            ),
            headerRight: () => (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialIcons name="logout" size={26} color={"#ef4444"} />
              </TouchableOpacity>
            ),
            headerTitle: () => (
              <Text
                style={{ fontFamily: "Pacifico_400Regular" }}
                className="text-borderColor text-2xl"
              >
                PZ
              </Text>
            ),
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerTitle: "Profile",
            headerTitleStyle: { color: "#F3ECEC" },
            headerTintColor: "#F3ECEC",
            headerBackVisible: true,
            animation: "ios",
          }}
        />
        <Stack.Screen
          name="expenseDetails"
          options={{
            headerTitle: "Expenses",
            headerTitleStyle: { color: "#F3ECEC" },
            headerTintColor: "#F3ECEC",
            headerBackVisible: true,
            animation: "ios",
          }}
        />
        <Stack.Screen
          name="trainingDetails"
          options={{
            headerTitle: "Workout",
            headerTitleStyle: { color: "#F3ECEC" },
            headerTintColor: "#F3ECEC",
            headerBackVisible: true,
            animation: "ios",
            headerLargeTitle: true,
          }}
        />
        <Stack.Screen
          name="weeklyPlan"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="weeklyPlanDetails"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="changePassword"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="publicTrainingDetails"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="dayTrainingDetails"
          options={{
            headerTitle: "Workout",
            headerTitleStyle: { color: "#F3ECEC" },
            headerTintColor: "#F3ECEC",
            headerBackVisible: true,
            animation: "ios",
            headerLargeTitle: true,
          }}
        />
      </Stack>

      {modalVisible && (
        <LogoutAlert
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </>
  );
};

export default function MainLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
      <Toast />
    </QueryClientProvider>
  );
}
