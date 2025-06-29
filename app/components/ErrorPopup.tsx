import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { ErrorMessage } from "../hooks/useErrorMessage";

type Props = {
  errorMessage: ErrorMessage | null;
  slideAnim: Animated.Value;
  onDismiss: () => void;
};

export const ErrorPopup: React.FC<Props> = ({
  errorMessage,
  slideAnim,
  onDismiss,
}) => {
  if (!errorMessage) return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
      }}
    >
      <TouchableOpacity onPress={onDismiss} activeOpacity={0.9}>
        <View className="py-5 bg-[#0D0D0D]">
          <Text className="text-[#F11111] text-2xl px-2 text-center font-normal">
            {`[ ${errorMessage.message} ]`}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
