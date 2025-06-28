import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";

interface ConfirmationModalProps {
  isVisible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonStyle?: 'default' | 'danger' | 'warning' | 'success' | any;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isVisible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonStyle = 'default'
}) => {
  const getButtonStyle = () => {
    switch (confirmButtonStyle) {
      case 'danger':
        return 'bg-red-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'success':
        return 'bg-green-600';
      default:
        return 'bg-black';
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Title (optional) */}
          {title && (
            <View className="mb-4">
              <Text className="text-black font-semibold text-lg text-center">
                {title}
              </Text>
            </View>
          )}

          {/* Message */}
          <View className="items-center mb-8">
            <Text className="text-black font-normal text-base text-center leading-6">
              {message}
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between gap-4">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 bg-gray-200 py-3 px-6 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-black font-normal text-center text-base">
                {cancelText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 ${getButtonStyle()} py-3 px-6 rounded-xl`}
              activeOpacity={0.8}
            >
              <Text className="text-white font-normal text-center text-base">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;