import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ArrowLeft } from "lucide-react-native"; // or your icon source
import { useRouter } from "expo-router";

interface BackButtonProps {
  title?: string;
  onPress?: () => void;
  showTitle?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({
  title = "Creating New Account",
  onPress,
  showTitle = true,
}) => {
  const router = useRouter();

  return (
    <View className="w-full bg-[#000000E3] px-4 py-3 z-50 flex-row items-center ">
      <TouchableOpacity
        onPress={onPress || (() => router.back())}
        className="flex-row items-center"
      >
        <View className="flex-row items-center bg-white p-1 rounded-xl">
          <ArrowLeft color="black" size={24} />
        </View>
      </TouchableOpacity>
      {showTitle && <Text className="text-white text-2xl ml-3">{title}</Text>}
    </View>
  );
};

export default BackButton;
