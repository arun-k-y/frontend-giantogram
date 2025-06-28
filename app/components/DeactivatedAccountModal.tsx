import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";

const DeactivatedAccountModal = ({
  isVisible,
  onDecline,
  onReactivate,
  username = "",
}: any) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center bg-black px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Popup Content */}
          <View className="items-center mb-8">
            <Text className="text-[#000000] font-normal text-base text-center leading-6">
              Are you sure that you want to login to deactivated account
              {username ? ` (${username})` : ""}?
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              onPress={onDecline}
              className="flex-1 bg-[#000000] py-3 px-6 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-normal text-center text-base">
                Decline
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onReactivate}
              className="flex-1 bg-[#000000] py-3 px-6 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-white font-normal text-center text-base">
                Reactivate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeactivatedAccountModal;
