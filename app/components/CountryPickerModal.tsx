import { ArrowLeft, SearchIcon } from "lucide-react-native";
import React from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
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
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredOptions = countryOptions.filter((option) =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="none" transparent={false}>
      <SafeAreaView className="flex-1 bg-black ">
        {/* Optional StatusBar for Android */}
        {Platform.OS === "android" && (
          <StatusBar barStyle="light-content" backgroundColor="#000" />
        )}

        <View className="flex-1 bg-black m-5 w-full self-center max-w-[500px]">
          {/* Header */}
          <View className="flex-row justify-between items-center px-4 py-3 bg-white">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-red-600 text-2xl">
                <ArrowLeft size={24} color={"black"} />
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          {/* <View className="w-full relative">
            <SearchIcon className="absolute top-[50%] left-5 -translate-y-[50%]" size={24} color={'black'}/>
          <TextInput
            className="bg-white rounded-md mx-4 mt-4 px-4 py-3 text-black"
            placeholder="Search country"
            placeholderTextColor="#777"
            value={searchTerm}
            onChangeText={setSearchTerm}
          /></View> */}

          <View className="w-full relative mt-4">
            <TextInput
              className="bg-white rounded-md mx-4 pl-10 pr-4 py-3 text-black"
              placeholder="Search country"
              placeholderTextColor="#777"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <View className="absolute left-6 top-[50%] -translate-y-[12px]">
              <SearchIcon size={20} color="black" />
            </View>
          </View>

          {/* Country List */}
          <ScrollView className="mt-4">
            {filteredOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row justify-between items-center px-5 py-4 border-b border-gray-700"
                onPress={() => {
                  onSelect(option.code);
                  onClose();
                }}
              >
                <Text className="text-white text-lg">{option.name}</Text>
                <Text className="text-white text-base">
                  {option.code}
                  {option.count ? ` (${option.count})` : ""}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
