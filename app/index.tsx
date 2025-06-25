import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="flex-1 p-4">
        <Text className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome to My App
        </Text>

        <View className="bg-white rounded-lg shadow-md p-6 mb-6">
          <Text className="text-xl font-semibold mb-2">About This App</Text>
          <Text className="text-gray-700">
            This is a basic app built with Expo and styled using Tailwind CSS.
            It demonstrates how to use Tailwind classes in a React Native
            project.
          </Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-full py-3 px-6 mb-4"
          onPress={() => router.push("/login" as never)}
        >
          <Text className="text-white text-center font-semibold">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 rounded-full py-3 px-6 mb-6"
          onPress={() => router.push("/signup" as never)}
        >
          <Text className="text-white text-center font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-between">
          <View className="bg-green-200 rounded-lg p-4 flex-1 mr-2">
            <Text className="text-green-800 font-medium">Card 1</Text>
          </View>
          <View className="bg-purple-200 rounded-lg p-4 flex-1 ml-2">
            <Text className="text-purple-800 font-medium">Card 2</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

// // app/index.tsx
// import { Redirect } from "expo-router";

// export default function Index() {
//   return <Redirect href="/login" />;
// }
