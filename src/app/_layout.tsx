import "../global.css";
import React, { useEffect } from "react";
import { Redirect, Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded, useUser, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

export default function RootNavigation() {

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
          <AppNavigation />
          <Toast />
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export const AppNavigation = () => {
  const { isSignedIn, isLoaded} = useUser()
  
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {!isSignedIn ? <Redirect href="/(auth)" /> : <Redirect href="/(main)" />}
    </>
  );
};
