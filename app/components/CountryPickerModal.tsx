// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
// } from "react-native";

// interface CountryOption {
//   name: string;
//   code: string;
//   count?: number;
// }

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   onSelect: (code: string) => void;
//   countryOptions: CountryOption[];
// }

// export const CountryPickerModal = ({
//   visible,
//   onClose,
//   onSelect,
//   countryOptions,
// }: Props) => {
//   const [searchTerm, setSearchTerm] = React.useState("");

//   const filteredOptions = countryOptions.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <Modal visible={visible} animationType="slide" transparent={false}>
//       <View className="flex-1 bg-black m-5 max-w-[500px]">
//         {/* Header */}
//         <View className="flex-row justify-between  items-center px-4 py-3 bg-white">
//           <Text className="text-black text-xl font-semibold">
//             Choose your Country
//           </Text>
//           <TouchableOpacity onPress={onClose}>
//             <Text className="text-red-600 text-2xl">×</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Search Bar */}
//         <TextInput
//           className="bg-white rounded-md mx-4 mt-4 px-4 py-3 text-black"
//           placeholder="Search country"
//           placeholderTextColor="#777"
//           value={searchTerm}
//           onChangeText={setSearchTerm}
//         />

//         {/* Country List */}
//         <ScrollView className="mt-4">
//           {filteredOptions.map((option, index) => (
//             <TouchableOpacity
//               key={index}
//               className="flex-row justify-between items-center px-5 py-4 border-b border-gray-700"
//               onPress={() => {
//                 onSelect(option.code);
//                 onClose();
//               }}
//             >
//               <Text className="text-white text-lg">{option.name}</Text>
//               <Text className="text-white text-base">
//                 {option.code}
//                 {option.count ? ` (${option.count})` : ""}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// import React from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   Platform,
// } from "react-native";

// interface CountryOption {
//   name: string;
//   code: string;
//   count?: number;
// }

// interface Props {
//   visible: boolean;
//   onClose: () => void;
//   onSelect: (code: string) => void;
//   countryOptions: CountryOption[];
// }

// export const CountryPickerModal = ({
//   visible,
//   onClose,
//   onSelect,
//   countryOptions,
// }: Props) => {
//   const [searchTerm, setSearchTerm] = React.useState("");

//   const filteredOptions = countryOptions.filter((option) =>
//     option.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleSelect = (code: string) => {
//     onSelect(code);
//     onClose(); // Ensure modal closes
//     setSearchTerm(""); // Reset search term
//   };

//   const handleClose = () => {
//     onClose();
//     setSearchTerm(""); // Reset search term when closing
//   };

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={false}
//       onRequestClose={handleClose} // Important for Android back button and iOS
//       presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'} // Better iOS presentation
//     >
//       <SafeAreaView className="flex-1 bg-black">
//         {/* Status bar handling for iOS */}
//         {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}

//         <View className="flex-1 bg-black mx-5 max-w-[500px] self-center w-full">
//           {/* Header */}
//           <View className="flex-row justify-between items-center px-4 py-4 bg-white rounded-t-lg">
//             <Text className="text-black text-xl font-semibold">
//               Choose your Country
//             </Text>
//             <TouchableOpacity
//               onPress={handleClose}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Larger touch area
//               activeOpacity={0.7}
//             >
//               <Text className="text-red-600 text-2xl font-bold">×</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Search Bar */}
//           <View className="bg-white px-4 pb-4">
//             <TextInput
//               className="bg-gray-100 rounded-md px-4 py-3 text-black border border-gray-300"
//               placeholder="Search country"
//               placeholderTextColor="#777"
//               value={searchTerm}
//               onChangeText={setSearchTerm}
//               autoCorrect={false}
//               clearButtonMode="while-editing" // iOS feature
//             />
//           </View>

//           {/* Country List */}
//           <ScrollView
//             className="flex-1 bg-white"
//             showsVerticalScrollIndicator={true}
//             keyboardShouldPersistTaps="handled" // Important for iOS
//             contentContainerStyle={{ paddingBottom: 20 }}
//           >
//             {filteredOptions.map((option, index) => (
//               <TouchableOpacity
//                 key={`${option.code}-${index}`} // Better key
//                 className="flex-row justify-between items-center px-5 py-4 border-b border-gray-200 active:bg-gray-100"
//                 onPress={() => handleSelect(option.code)}
//                 activeOpacity={0.7}
//               >
//                 <Text className="text-black text-lg flex-1 mr-4">
//                   {option.name}
//                 </Text>
//                 <Text className="text-gray-600 text-base font-medium">
//                   {option.code}
//                   {option.count ? ` (${option.count})` : ""}
//                 </Text>
//               </TouchableOpacity>
//             ))}

//             {/* Show message if no results */}
//             {filteredOptions.length === 0 && searchTerm.length > 0 && (
//               <View className="flex-1 justify-center items-center py-20">
//                 <Text className="text-gray-500 text-lg">
//                   No countries found for {searchTerm}
//                 </Text>
//               </View>
//             )}
//           </ScrollView>

//           {/* Bottom safe area for iOS */}
//           {Platform.OS === 'ios' && (
//             <View className="bg-white h-8" />
//           )}
//         </View>
//       </SafeAreaView>
//     </Modal>
//   );
// };

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
    <Modal visible={visible} animationType="fade" transparent={false}>
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
