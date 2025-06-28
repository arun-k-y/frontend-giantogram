import { ArrowLeft, SearchIcon, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";

interface CountryOption {
  name: string;
  code: string;
  count?: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  countryOptions: CountryOption[];
}

export const CountryPickerModal = ({
  visible,
  onClose,
  onSelect,
  countryOptions,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!visible) {
      setSearchTerm("");
    }
  }, [visible]);

  const filteredOptions = countryOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <SafeAreaView className="flex-1 bg-black/50 pt-28">
        {Platform.OS === "android" && (
          <StatusBar barStyle="light-content" backgroundColor="#000" />
        )}

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1"
          >
            <View className="flex-1 bg-gray-100 rounded-xl px-6 py-4 mx-4">
              <TouchableOpacity
                onPress={onClose}
                accessibilityLabel="Close country picker"
                accessibilityRole="button"
                className=" mb-3 ml-[-10]"
              >
                <ArrowLeft size={18} color="#000" />
              </TouchableOpacity>

              <View className="relative mb-6">
                <View className="bg-[#000000E3] rounded-2xl flex-row items-center px-3 py-1">
                  <View className="bg-white px-0.5 py-1 rounded-lg">
                    <SearchIcon size={20} color="black" className="mr-3" />
                  </View>
                  <TextInput
                    className="flex-1 text-white text-2xl ml-10"
                    placeholder="Choose your Country"
                    placeholderTextColor="white"
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    accessibilityLabel="Search country"
                  />
                  {searchTerm && (
                    <TouchableOpacity
                      onPress={() => setSearchTerm("")}
                      accessibilityLabel="Clear search input"
                      className="bg-white p-0.5 rounded-full "
                    >
                      <View className="bg-white border-2 rounded-full p-1">
                        <X size={16} color="black" className="mr-3 " />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View className="flex-1 bg-[#000000E3] rounded-2xl">
                <FlatList
                  data={filteredOptions}
                  keyExtractor={(item, index) => `${item.code}-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="flex-row justify-between items-center px-4 py-3"
                      onPress={() => {
                        onSelect(item.code);
                        onClose();
                      }}
                    >
                      <Text
                        className="text-white text-base flex-1"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-white text-base ml-2">
                        {item.count ? `${item.count}` : item.code}
                        {item.code.includes("(") && item.code.includes(")")
                          ? ""
                          : item.count && item.code
                          ? ` (${item.code})`
                          : ""}
                      </Text>
                    </TouchableOpacity>
                  )}
                  initialNumToRender={20}
                  maxToRenderPerBatch={25}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};
