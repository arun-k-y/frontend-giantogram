import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackButton from "./components/BackButton";
import { baseUrl } from "./config/config";
import Toast from "react-native-toast-message";

export default function ChooseUsernameScreen() {
  const router = useRouter();

  const [usernames, setUsernames] = useState<any>([]);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { identifier, usernames: usernamesParam } = useLocalSearchParams();

  useEffect(() => {
    try {
      if (usernamesParam) {
        const parsed = JSON.parse(usernamesParam as string); // decode JSON string
        if (Array.isArray(parsed)) {
          setUsernames(parsed); // example: [{ id: "xxx", username: "arun" }]
        }
      }
    } catch (e) {
      setError("Failed to parse usernames from URL");
    }
  }, [usernamesParam]);

  const handleConfirm = async () => {
    if (!selectedUsername) {
      setError("Please select a username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${baseUrl}/api/auth/send-reset-after-username-selection`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: identifier, // from query param
            username: selectedUsername,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        Toast.show({
          type: "success",
          text1: data?.message || "Reset code sent successfully",
        });
        router.push({
          pathname: "/reset-password",
          params: { identifier: selectedUsername },
        });
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BackButton showTitle={true} title="Forgot Password?" />
      <ScrollView className="flex-1 bg-black px-5 pt-5">
        <Text className="text-white font-semibold text-base mb-3">
          Choose an account to log in
        </Text>
        <View className="bg-white p-5 rounded-2xl">
          {usernames.map((user: any, index: number) => (
            <TouchableOpacity
              key={index}
              className="flex-row justify-between items-center py-2"
              onPress={() => setSelectedUsername(user.username)}
            >
              <Text className="text-black text-base">{user.username}</Text>
              <Text className="text-black text-lg">
                {selectedUsername === user.username ? "●" : "○"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          className="bg-white py-4 rounded-xl mt-10 w-[315px] self-center"
          onPress={handleConfirm}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={24} color="#000" />
          ) : (
            <Text className="text-black text-center text-lg font-medium">
              Confirm
            </Text>
          )}
        </TouchableOpacity>

        {error !== "" && (
          <Text className="text-red-500 text-center mt-4 text-sm">{error}</Text>
        )}
      </ScrollView>
    </>
  );
}
