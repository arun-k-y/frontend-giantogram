import React, { useCallback } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./components/auth-context";

export default function RememberMe() {
  const router = useRouter();
  const { token, email, mobile, isDeactivated } = useLocalSearchParams();
  const safeString = (value: string | string[] | undefined): string =>
    Array.isArray(value) ? value[0] : value || "";
  const { setAuthData } = useAuth();

  const handleNotNow = () => {
    setAuthData(
      {
        accessToken: String(token),
        email: String(email),
        mobile: String(mobile),
        isDeactivated: isDeactivated === "true",
      },
      false // 👈 DON'T REMEMBER, only in memory
    );

    if (Platform.OS === "android" || Platform.OS === "ios") {
      router.replace("/profile-pic");
      // router.replace("/choose-recovery");
    } else {
      router.replace("/home2");
    }
  };

  const handleRememberMe = () => {
    setAuthData(
      {
        accessToken: String(token),
        email: String(email),
        mobile: String(mobile),
        isDeactivated: isDeactivated === "true",
      },
      true // 👈 REMEMBER
    );

    if (Platform.OS === "android" || Platform.OS === "ios") {
      router.replace("/profile-pic");
      // router.replace("/choose-recovery");
    } else {
      router.replace("/home2");
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-[#0D0D0D]"
      edges={["bottom", "left", "right"]}
    >
      <ScrollView
        className="flex-1 "
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 32,
          //   paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="flex-1 items-center  mt-14"
          //   style={{ minHeight: Dimensions.get("window").height * 0.6 }}
        >
          <Text className="text-white font-normal text-2xl mb-6">
            Remember login info
          </Text>

          <View className="w-[200px] h-[200px] rounded-full bg-gray-700 mb-6 border border-gray-500 items-center justify-center overflow-hidden">
            <Image
              source={require("../assets/images/lock.png")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="items-center gap-8 w-full mt-10">
            <TouchableOpacity
              onPress={handleRememberMe}
              className="bg-white rounded-xl py-4 px-8 w-full max-w-[500px] min-h-[52px] items-center justify-center"
            >
              <Text className="text-black text-center font-normal text-base">
                Remember Me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-xl py-4 px-8 w-full max-w-[500px] min-h-[52px] items-center justify-center"
              onPress={handleNotNow}
            >
              <Text className="text-black text-center font-normal text-base">
                Not Now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
