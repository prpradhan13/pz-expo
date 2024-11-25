import {
  StyleSheet,
  Text,
  View,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { Fragment, useState } from "react";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const verificationScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();

  const CELL_COUNT = 6;

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  const onPressVerify = async () => {
    setIsLoading(true);
    if (!isLoaded || !signUp) {
      console.log("Please enter a valid 6-digit code");
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(main)");
        Toast.show({
          type: "success",
          text1: "Welcome to PZero",
        });
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Toast.show({
        type: "error",
        text1: "Something went wrong while verifying your email address",
        text2: `Error: ${err.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-mainBgColor flex-1 h-full px-6 pt-32">
      <View className="w-full">
        <View>
          <Text className="text-4xl font-bold text-primaryTextColor">
            6-digit code
          </Text>
          <Text className="text-secondaryText tracking-wider mt-4">
            A verification code sent to {signUp?.emailAddress} unless you
            already have an account
          </Text>
        </View>

        <View className="mt-5">
          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={setCode}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.select({
              android: "sms-otp",
              default: "one-time-code",
            })}
            testID="my-code-input"
            renderCell={({ index, symbol, isFocused }) => (
              <Fragment key={index}>
                <View
                  onLayout={getCellOnLayoutHandler(index)}
                  key={index}
                  style={[styles.cellRoot, isFocused && styles.focusCell]}
                >
                  <Text style={styles.cellText}> {symbol || (isFocused ? <Cursor /> : null)} </Text>
                </View>
                {index === 2 ? <View key={`separator-${index}`} style={styles.separator} /> : null}
              </Fragment>
            )}
          />
        </View>

        <View className="flex items-center w-full mt-5">
          <TouchableOpacity
            onPress={onPressVerify}
            className={`bg-accentColor w-[280px] p-3 rounded-full flex justify-center items-center`}
            disabled={isLoading}
          >
            <Text
              style={{ fontSize: 16 }}
              className="text-primaryTextColor font-bold uppercase tracking-widest"
            >
              {isLoading ? (
                <ActivityIndicator color="#F3ECEC" size={20} />
              ) : (
                "Verify"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default verificationScreen;

const styles = StyleSheet.create({
  codeFieldRoot: {
    marginVertical: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    gap: 12
  },
  cellRoot: {
    width: 45,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: "#CFCFCF",
    borderRadius: 8
  },
  cellText: {
    color: '#F3ECEC',
    fontSize: 36,
    textAlign: 'center',
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#CFCFCF',
    textAlign: 'center',
  },
  focusCell: {
    paddingBottom: 8,
  },
  separator: {
    height: 2,
    width: 10,
    backgroundColor: '#CFCFCF',
    alignSelf: 'center',
  },
});
