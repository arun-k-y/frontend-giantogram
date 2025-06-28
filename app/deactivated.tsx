import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  SafeAreaView,
} from "react-native";

const DeactivateAccountPopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDecline = () => {
    setIsVisible(false);
    // Handle decline logic
  };

  const handleReactivate = () => {
    setIsVisible(false);
    // Handle reactivation logic
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-white text-xl font-medium">GIANTOGRAM</Text>
      </View>

      {/* Main Content Area */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Modal/Popup */}
        <Modal
          visible={isVisible}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <View className="bg-white rounded-2xl p-6 w-full max-w-sm ">
              {/* Popup Content */}
              <View className="items-center mb-8">
                <Text className="text-[#000000] font-normal text-base text-center leading-6">
                  Are you sure that you want to login to deactivated account
                </Text>
              </View>

              {/* Buttons */}
              <View className="flex-row justify-between gap-10">
                <TouchableOpacity
                  onPress={handleDecline}
                  className="flex-1 bg-[#000000] py-3 px-6 w-fit rounded-xl"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-normal text-center text-base">
                    Decline
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleReactivate}
                  className="flex-1 bg-[#000000]  py-3 px-6 w-fit rounded-xl"
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-normal text-center  text-base">
                    Reactivate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Trigger Button (for demo purposes) */}
        {!isVisible && (
          <TouchableOpacity
            onPress={() => setIsVisible(true)}
            className="bg-white rounded-full py-4 px-8"
          >
            <Text className="text-black text-center font-medium">
              Show Popup
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DeactivateAccountPopup;
