// import React, { useState } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   ActionSheetIOS,
//   Platform,
//   StatusBar,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";

// const DEFAULT_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=random";

// const SCREEN = {
//   WELCOME: "welcome",
//   CAMERA: "camera",
//   POPUP: "pop-up",
//   PREVIEW: "preview",
// };

// type ProfilePicUploaderProps = {
//   initialUrl?: string;
//   onUpload?: (url: string) => void;
// };

// export default function ProfilePicUploader({
//   initialUrl = DEFAULT_AVATAR,
//   onUpload,
// }: ProfilePicUploaderProps) {
//   const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [preview, setPreview] = useState(initialUrl);
//   const [currentScreen, setCurrentScreen] = useState(SCREEN.WELCOME);
//   const router = useRouter();

//   const pickImage = async (fromCamera = false) => {
//     const { status } = fromCamera
//       ? await ImagePicker.requestCameraPermissionsAsync()
//       : await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== "granted") {
//       Alert.alert(
//         "Permission required",
//         `Please allow access to your ${fromCamera ? "camera" : "photos"}.`
//       );
//       return;
//     }

//     const result = fromCamera
//       ? await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         })
//       : await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         });

//     if (!result.canceled) {
//       setImage(result.assets[0]);
//       setPreview(result.assets[0].uri);
//       setCurrentScreen(SCREEN.PREVIEW);
//     }
//   };

//   const showPickerOptions = () => {
//     if (Platform.OS === "ios") {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ["Cancel", "Take Photo", "Choose from Library"],
//           cancelButtonIndex: 0,
//         },
//         (buttonIndex) => {
//           if (buttonIndex === 1) pickImage(true);
//           else if (buttonIndex === 2) pickImage(false);
//         }
//       );
//     } else {
//       Alert.alert("Upload Photo", "Choose an option", [
//         { text: "Take Photo", onPress: () => pickImage(true) },
//         { text: "Choose from Library", onPress: () => pickImage(false) },
//         { text: "Cancel", style: "cancel" },
//       ]);
//     }
//   };

//   // const handleUpload = async () => {
//   //   setUploading(true);
//   //   try {
//   //     await new Promise((res) => setTimeout(res, 1500));
//   //     if (onUpload) onUpload(preview);
//   //     Alert.alert("Success", "Profile picture updated!");
//   //     setImage(null);
//   //   } catch (e) {
//   //     Alert.alert("Error", "Failed to upload image.");
//   //   }
//   //   setUploading(false);
//   // };

//   const handleUpload = async () => {
//     if (!image?.uri) return;

//     setUploading(true);
//     try {
//       const formData = new FormData();

//       // Extract filename and type from the URI
//       const uriParts = image.uri.split("/");
//       const filename = uriParts[uriParts.length - 1];
//       const fileType = image.type ?? "image/jpeg";

//       formData.append("profilePicture", {
//         uri: image.uri,
//         name: filename,
//         type: fileType,
//       } as any);
//       const token = await AsyncStorage.getItem("userToken");

//       const response = await fetch(
//         "http://localhost:2001/api/auth/upload-profile",
//         {
//           method: "POST",
//           headers: {
//             Accept: "*/*",
//             Authorization: `Bearer ${token}`, // Replace with actual token or pull from secure store
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const error = await response.text();
//         throw new Error(error || "Upload failed");
//       }

//       const data = await response.json();
//       console.log("Upload response:", data);
//       const uploadedUrl = data?.url || preview; // adjust if your API returns uploaded URL

//       if (onUpload) onUpload(uploadedUrl);
//       Alert.alert("Success", "Profile picture uploaded successfully.");
//       setImage(null);
//     } catch (err: any) {
//       Alert.alert("Upload Failed", err.message || "Something went wrong.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleConfirmProfile = async () => {
//     await handleUpload();
//     // setCurrentScreen(SCREEN.CAMERA);
//   };

//   const removeImage = () => {
//     setImage(null);
//     setPreview(DEFAULT_AVATAR);
//   };

//   const WelcomeScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-8">
//       <Text className="text-white text-2xl font-bold mb-2">GIANTOGRAM</Text>
//       <Text className="text-gray-300 text-center mb-4">
//         Welcome to Giantogram
//       </Text>
//       <Text className="text-gray-400 text-center text-sm mb-8">
//         Platform that provides everything
//       </Text>

//       <View className="w-32 h-32 rounded-full bg-gray-700 mb-6 justify-center items-center overflow-hidden relative">
//         <Image source={{ uri: preview }} className="w-full h-full" />
//       </View>

//       <Text className="text-gray-400 text-center text-sm mb-8">
//         You became the member of this network{"\n"}and you matter for us
//       </Text>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={() => setCurrentScreen(SCREEN.POPUP)}
//       >
//         <Text className="text-black text-center font-medium">Add Picture</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 w-full max-w-[300px]"
//         onPress={() => setCurrentScreen(SCREEN.CAMERA)}
//       >
//         <Text className="text-black text-center font-medium">Skip</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const PreviewScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-6">
//       <Text className="text-white text-xl font-bold mb-4">GIANTOGRAM</Text>
//       <View className="w-56 h-56 bg-gray-800 rounded-xl overflow-hidden mb-6">
//         <Image source={{ uri: preview }} className="w-full h-full" />
//       </View>
//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={handleConfirmProfile}
//         disabled={uploading}
//       >
//         {uploading ? (
//           <ActivityIndicator color="#000" />
//         ) : (
//           <Text className="text-black text-center font-medium">
//             Confirm Profile
//           </Text>
//         )}
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => setCurrentScreen(SCREEN.CAMERA)}>
//         <Text className="text-gray-400 text-sm">Back to Gallery</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const CameraScreen = () => (
//     <View style={styles.container}>
//       <View style={styles.avatarWrapper}>
//         <Image source={{ uri: preview }} style={styles.avatar} />
//         <TouchableOpacity style={styles.uploadBtn} onPress={showPickerOptions}>
//           <Text style={styles.uploadBtnText}>Upload Photo</Text>
//         </TouchableOpacity>
//         {image && (
//           <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
//             <Text style={styles.removeBtnText}>Remove</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//       <TouchableOpacity
//         style={[
//           styles.saveBtn,
//           (!image || uploading) && styles.saveBtnDisabled,
//         ]}
//         onPress={handleUpload}
//         disabled={!image || uploading}
//       >
//         {uploading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.saveBtnText}>Save</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );

//   const Popup = () => (
//     <View className="flex-1 justify-center bg-black px-6">
//       <View className="bg-white rounded-2xl p-6">
//         <TouchableOpacity
//           className="bg-black rounded-lg py-4 mb-4"
//           onPress={() => pickImage(true)}
//         >
//           <Text className="text-white text-center font-medium">Take Photo</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="bg-black rounded-lg py-4"
//           onPress={() => pickImage(false)}
//         >
//           <Text className="text-white text-center font-medium">Gallery</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-black">
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       {currentScreen === SCREEN.WELCOME && <WelcomeScreen />}
//       {currentScreen === SCREEN.CAMERA && <CameraScreen />}
//       {currentScreen === SCREEN.POPUP && <Popup />}
//       {currentScreen === SCREEN.PREVIEW && <PreviewScreen />}
//       <View className="absolute bottom-1 left-1/2 -translate-x-16">
//         <View className="w-32 h-1 rounded bg-white opacity-30" />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { alignItems: "center", padding: 32 },
//   avatarWrapper: { alignItems: "center", marginBottom: 24 },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: "#fff",
//     backgroundColor: "#eee",
//     marginBottom: 16,
//   },
//   uploadBtn: {
//     backgroundColor: "#222",
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 24,
//     marginBottom: 8,
//   },
//   uploadBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
//   removeBtn: {
//     backgroundColor: "#fff",
//     borderColor: "#e33",
//     borderWidth: 1,
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   removeBtnText: { color: "#e33", fontWeight: "500" },
//   saveBtn: {
//     backgroundColor: "#007aff",
//     paddingHorizontal: 40,
//     paddingVertical: 14,
//     borderRadius: 28,
//     alignItems: "center",
//     width: 200,
//   },
//   saveBtnDisabled: { backgroundColor: "#aaa" },
//   saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
// });

// import React, { useState } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   ActionSheetIOS,
//   Platform,
//   StatusBar,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import CustomCamera from "./components/CustomCamera";

// const DEFAULT_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=random";

// const SCREEN = {
//   WELCOME: "welcome",
//   CAMERA: "camera",
//   POPUP: "pop-up",
//   PREVIEW: "preview",
//   CONFIRMATION: "confirmation",
// };

// type ProfilePicUploaderProps = {
//   initialUrl?: string;
//   onUpload?: (url: string) => void;
//   onContinue?: () => void; // New prop for navigation to home
// };

// export default function ProfilePicUploader({
//   initialUrl = DEFAULT_AVATAR,
//   onUpload,
//   onContinue,
// }: ProfilePicUploaderProps) {
//   const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [preview, setPreview] = useState(initialUrl);
//   const [currentScreen, setCurrentScreen] = useState(SCREEN.WELCOME);
//   const router = useRouter();

//   const pickImage = async (fromCamera = false) => {
//     const { status } = fromCamera
//       ? await ImagePicker.requestCameraPermissionsAsync()
//       : await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== "granted") {
//       Alert.alert(
//         "Permission required",
//         `Please allow access to your ${fromCamera ? "camera" : "photos"}.`
//       );
//       return;
//     }

//     const result = fromCamera
//       ? await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         })
//       : await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//         });

//     if (!result.canceled) {
//       setImage(result.assets[0]);
//       setPreview(result.assets[0].uri);
//       setCurrentScreen(SCREEN.PREVIEW);
//     }
//   };

//   const CameraScreen = () => (
//   <CustomCamera
//     onPhotoTaken={(uri) => {
//       setImage({ uri } as ImagePicker.ImagePickerAsset);
//       setPreview(uri);
//       setCurrentScreen(SCREEN.PREVIEW);
//     }}
//     onClose={() => setCurrentScreen(SCREEN.WELCOME)}
//   />
// );

//   const showPickerOptions = () => {
//     if (Platform.OS === "ios") {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ["Cancel", "Take Photo", "Choose from Library"],
//           cancelButtonIndex: 0,
//         },
//         (buttonIndex) => {
//           if (buttonIndex === 1) pickImage(true);
//           else if (buttonIndex === 2) pickImage(false);
//         }
//       );
//     } else {
//       Alert.alert("Upload Photo", "Choose an option", [
//         { text: "Take Photo", onPress: () => pickImage(true) },
//         { text: "Choose from Library", onPress: () => pickImage(false) },
//         { text: "Cancel", style: "cancel" },
//       ]);
//     }
//   };

//   const handleUpload = async (isUpdate = false) => {
//     if (!image?.uri) return;

//     setUploading(true);
//     try {
//       const formData = new FormData();

//       // Extract filename and type from the URI
//       const uriParts = image.uri.split("/");
//       const filename = uriParts[uriParts.length - 1];
//       const fileType = image.type ?? "image/jpeg";

//       formData.append("profilePicture", {
//         uri: image.uri,
//         name: filename,
//         type: fileType,
//       } as any);

//       // Add update flag to form data
//       if (isUpdate) {
//         formData.append("isUpdate", "true");
//       }

//       const token = await AsyncStorage.getItem("userToken");

//       const response = await fetch(
//         "http://localhost:2001/api/auth/upload-profile",
//         {
//           method: "POST",
//           headers: {
//             Accept: "*/*",
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Upload failed");
//       }

//       const data = await response.json();
//       console.log("Upload response:", data);
//       const uploadedUrl = data?.url || data?.profilePicture || preview;

//       if (onUpload) onUpload(uploadedUrl);
//       setImage(null);

//       // Navigate to confirmation screen instead of showing alert
//       setCurrentScreen(SCREEN.CONFIRMATION);
//     } catch (err: any) {
//       Alert.alert("Upload Failed", err.message || "Something went wrong.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleConfirmProfile = async () => {
//     await handleUpload();
//   };

//   const handleContinue = () => {
//     if (onContinue) {
//       onContinue();
//     } else {
//       // Default navigation if no onContinue prop provided
//       router.push("/home");
//     }
//   };

//   const handleAddNewPicture = () => {
//     setCurrentScreen(SCREEN.POPUP);
//   };

//   const handleUpdateProfile = async () => {
//     await handleUpload(true); // Pass true to indicate this is an update
//   };

//   const removeImage = () => {
//     setImage(null);
//     setPreview(DEFAULT_AVATAR);
//   };

//   const WelcomeScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-8">
//       <Text className="text-white text-2xl font-bold mb-2">GIANTOGRAM</Text>
//       <Text className="text-gray-300 text-center mb-4">
//         Welcome to Giantogram
//       </Text>
//       <Text className="text-gray-400 text-center text-sm mb-8">
//         Platform that provides everything
//       </Text>

//       <View className="w-32 h-32 rounded-full bg-gray-700 mb-6 justify-center items-center overflow-hidden relative">
//         <Image source={{ uri: preview }} className="w-full h-full" />
//       </View>

//       <Text className="text-gray-400 text-center text-sm mb-8">
//         You became the member of this network{"\n"}and you matter for us
//       </Text>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={() => setCurrentScreen(SCREEN.POPUP)}
//       >
//         <Text className="text-black text-center font-medium">Add Picture</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 w-full max-w-[300px]"
//         onPress={() => setCurrentScreen(SCREEN.CAMERA)}
//       >
//         <Text className="text-black text-center font-medium">Skip</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const PreviewScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-6">
//       <Text className="text-white text-xl font-bold mb-4">GIANTOGRAM</Text>
//       <View className="w-56 h-56 bg-gray-800 rounded-xl overflow-hidden mb-6">
//         <Image source={{ uri: preview }} className="w-full h-full" />
//       </View>
//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={handleConfirmProfile}
//         disabled={uploading}
//       >
//         {uploading ? (
//           <ActivityIndicator color="#000" />
//         ) : (
//           <Text className="text-black text-center font-medium">
//             Confirm Profile
//           </Text>
//         )}
//       </TouchableOpacity>
//       {/* <TouchableOpacity onPress={() => setCurrentScreen(SCREEN.CAMERA)}>
//         <Text className="text-gray-400 text-sm">Back to Gallery</Text>
//       </TouchableOpacity> */}
//     </View>
//   );

//   const ConfirmationScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-8">
//       <Text className="text-white text-2xl font-bold mb-2">GIANTOGRAM</Text>
//       <Text className="text-gray-300 text-center mb-4">
//         Welcome to Giantogram
//       </Text>
//       <Text className="text-gray-400 text-center text-sm mb-8">
//         platform that provides everything
//       </Text>

//       <View className="w-32 h-32 rounded-full bg-gray-700 mb-6 justify-center items-center overflow-hidden relative">
//         <Image source={{ uri: preview }} className="w-full h-full" />
//       </View>

//       <Text className="text-gray-400 text-center text-sm mb-8">
//         You became the member of this network{"\n"}and you matter for us
//       </Text>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={handleAddNewPicture}
//       >
//         <Text className="text-black text-center font-medium">Add New Picture</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 w-full max-w-[300px]"
//         onPress={handleContinue}
//       >
//         <Text className="text-black text-center font-medium">Continue</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   // const CameraScreen = () => (
//   //   <View style={styles.container}>
//   //     <View style={styles.avatarWrapper}>
//   //       <Image source={{ uri: preview }} style={styles.avatar} />
//   //       <TouchableOpacity style={styles.uploadBtn} onPress={showPickerOptions}>
//   //         <Text style={styles.uploadBtnText}>Upload Photo</Text>
//   //       </TouchableOpacity>
//   //       {image && (
//   //         <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
//   //           <Text style={styles.removeBtnText}>Remove</Text>
//   //         </TouchableOpacity>
//   //       )}
//   //     </View>
//   //     <TouchableOpacity
//   //       style={[
//   //         styles.saveBtn,
//   //         (!image || uploading) && styles.saveBtnDisabled,
//   //       ]}
//   //       onPress={() => handleUpload(true)} // This is an update from camera screen
//   //       disabled={!image || uploading}
//   //     >
//   //       {uploading ? (
//   //         <ActivityIndicator color="#fff" />
//   //       ) : (
//   //         <Text style={styles.saveBtnText}>Save</Text>
//   //       )}
//   //     </TouchableOpacity>
//   //   </View>
//   // );

//   const Popup = () => (
//     <View className="flex-1 justify-center bg-black px-6">
//       <View className="bg-white rounded-2xl p-6">
//         <TouchableOpacity
//           className="bg-black rounded-lg py-4 mb-4"
//           onPress={() => pickImage(true)}
//         >
//           <Text className="text-white text-center font-medium">Take Photo</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="bg-black rounded-lg py-4"
//           onPress={() => pickImage(false)}
//         >
//           <Text className="text-white text-center font-medium">Gallery</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-black">
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       {currentScreen === SCREEN.WELCOME && <WelcomeScreen />}
//       {/* {currentScreen === SCREEN.CAMERA && <CameraScreen />} */}
//       {currentScreen === SCREEN.POPUP && <Popup />}
//       {currentScreen === SCREEN.PREVIEW && <PreviewScreen />}
//       {currentScreen === SCREEN.CONFIRMATION && <ConfirmationScreen />}
//       <View className="absolute bottom-1 left-1/2 -translate-x-16">
//         <View className="w-32 h-1 rounded bg-white opacity-30" />

//       </View>

//     </SafeAreaView>
//   );
// }

import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ActionSheetIOS,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import CustomCamera from "./components/CustomCamera";
import { Ionicons } from "@expo/vector-icons";
import { BackBtn } from "./svgs/SVG";
import BackButton from "./components/BackButton";

// Constants
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=random";
const API_BASE_URL = "http://localhost:2001/api";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Screen constants
const SCREENS = {
  WELCOME: "welcome",
  CAMERA: "camera",
  POPUP: "popup",
  PREVIEW: "preview",
  CONFIRMATION: "confirmation",
} as const;

type Screen = (typeof SCREENS)[keyof typeof SCREENS];

// Types
interface ProfilePicUploaderProps {
  initialUrl?: string;
  onUpload?: (url: string) => void;
  onContinue?: () => void;
}

interface UploadState {
  isUploading: boolean;
  error: string | null;
}

// Main Component
export default function ProfilePicUploader({
  initialUrl = DEFAULT_AVATAR,
  onUpload,
  onContinue,
}: ProfilePicUploaderProps) {
  // State
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [preview, setPreview] = useState(initialUrl);
  const [currentScreen, setCurrentScreen] = useState<Screen>(SCREENS.WELCOME);
  const [uploadState, setUploadState] = useState<UploadState>({
    isUploading: false,
    error: null,
  });

  // Refs and hooks
  const router = useRouter();
  const uploadTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Utility functions
  const clearUploadTimeout = useCallback(() => {
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
      uploadTimeoutRef.current = undefined;
    }
  }, []);

  const setUploadError = useCallback((error: string | null) => {
    setUploadState((prev) => ({ ...prev, error }));
  }, []);

  const setUploading = useCallback((isUploading: boolean) => {
    setUploadState((prev) => ({ ...prev, isUploading }));
  }, []);

  // Image picker functions
  const requestPermissions = useCallback(async (type: "camera" | "library") => {
    const { status } =
      type === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        `Please allow access to your ${
          type === "camera" ? "camera" : "photos"
        } to continue.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Settings",
            onPress: () => {
              // Could add deep link to settings here
            },
          },
        ]
      );
      return false;
    }
    return true;
  }, []);

  const pickImageFromSource = useCallback(
    async (fromCamera: boolean) => {
      const permissionGranted = await requestPermissions(
        fromCamera ? "camera" : "library"
      );
      if (!permissionGranted) return;

      try {
        const options = {
          allowsEditing: true,
          aspect: [1, 1] as [number, number],
          quality: 0.8,
        };

        const result = fromCamera
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync({
              ...options,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });

        if (!result.canceled && result.assets[0]) {
          const selectedImage = result.assets[0];
          setImage(selectedImage);
          setPreview(selectedImage.uri);
          setCurrentScreen(SCREENS.PREVIEW);
        }
      } catch (error) {
        console.error("Image picker error:", error);
        Alert.alert("Error", "Failed to select image. Please try again.");
      }
    },
    [requestPermissions]
  );

  // Platform-specific picker
  const showImagePickerOptions = useCallback(() => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Take Photo", "Choose from Library"],
          cancelButtonIndex: 0,
          title: "Select Profile Picture",
        },
        (buttonIndex) => {
          if (buttonIndex === 1) pickImageFromSource(true);
          else if (buttonIndex === 2) pickImageFromSource(false);
        }
      );
    } else {
      Alert.alert(
        "Select Profile Picture",
        "Choose how you'd like to add your photo:",
        [
          { text: "Take Photo", onPress: () => pickImageFromSource(true) },
          {
            text: "Choose from Library",
            onPress: () => pickImageFromSource(false),
          },
          { text: "Cancel", style: "cancel" },
        ]
      );
    }
  }, [pickImageFromSource]);

  // Upload function
  const uploadImage = useCallback(
    async (isUpdate = false) => {
      if (!image?.uri) {
        Alert.alert("No Image", "Please select an image first.");
        return;
      }

      setUploading(true);
      setUploadError(null);
      clearUploadTimeout();

      // Set upload timeout
      uploadTimeoutRef.current = setTimeout(() => {
        setUploading(false);
        setUploadError("Upload timeout. Please try again.");
        Alert.alert(
          "Upload Timeout",
          "The upload is taking too long. Please check your connection and try again."
        );
      }, 30000); // 30 second timeout

      try {
        const formData = new FormData();

        // Extract filename and type
        const uriParts = image.uri.split("/");
        const filename =
          uriParts[uriParts.length - 1] || `profile_${Date.now()}.jpg`;
        const fileType = image.type || "image/jpeg";

        formData.append("profilePicture", {
          uri: image.uri,
          name: filename,
          type: fileType,
        } as any);

        if (isUpdate) {
          formData.append("isUpdate", "true");
        }

        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("Authentication required. Please log in again.");
        }

        const response = await fetch(`${API_BASE_URL}/auth/upload-profile`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        });

        clearUploadTimeout();

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Upload failed with status ${response.status}`
          );
        }

        const data = await response.json();
        const uploadedUrl = data?.url || data?.profilePicture || preview;

        // Success callbacks
        onUpload?.(uploadedUrl);
        setImage(null);
        setCurrentScreen(SCREENS.CONFIRMATION);
      } catch (error: any) {
        console.error("Upload error:", error);
        const errorMessage =
          error.message || "Upload failed. Please try again.";
        setUploadError(errorMessage);
        Alert.alert("Upload Failed", errorMessage);
      } finally {
        setUploading(false);
        clearUploadTimeout();
      }
    },
    [image, preview, onUpload, clearUploadTimeout, setUploading, setUploadError]
  );

  // Navigation handlers
  const handleContinue = useCallback(() => {
    if (onContinue) {
      onContinue();
    } else {
      router.push("/home2");
    }
  }, [onContinue, router]);

  const handleScreenChange = useCallback((screen: Screen) => {
    setCurrentScreen(screen);
  }, []);

  // Camera handlers
  const handleCameraPhoto = useCallback((uri: string) => {
    // Create a mock ImagePickerAsset for consistency
    const cameraImage: ImagePicker.ImagePickerAsset = {
      uri,
      width: 0,
      height: 0,
      assetId: null,
      fileName: `camera_${Date.now()}.jpg`,
      fileSize: 0,
      type: "image",
      mimeType: "image/jpeg",
    };

    setImage(cameraImage);
    setPreview(uri);
    setCurrentScreen(SCREENS.PREVIEW);
  }, []);

  const removeImage = useCallback(() => {
    setImage(null);
    setPreview(DEFAULT_AVATAR);
    setUploadError(null);
  }, []);

  // Screen Components
  const WelcomeScreen = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>GIANTOGRAM</Text>
      <Text style={styles.subtitle}>Welcome to Giantogram</Text>
      <Text style={styles.description}>Platform that provides everything</Text>

      <View style={styles.avatarContainer}>
        <Image source={{ uri: preview }} style={styles.avatar} />
      </View>

      <Text style={styles.welcomeMessage}>
        You became the member of this network{"\n"}and you matter for us
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => handleScreenChange(SCREENS.POPUP)}
        accessibilityLabel="Add profile picture"
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Add Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleContinue}
        accessibilityLabel="Skip adding picture"
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );

  const PreviewScreen = () => (
    <>
      <View className="absolute left-0 top-0">
        <BackButton
          showTitle={false}
          onPress={() => setCurrentScreen("welcome")}
        />
      </View>
      <View style={styles.screenContainer}>
        <Text style={styles.title}>GIANTOGRAM</Text>
        <View style={styles.previewContainer}>
          <Image source={{ uri: preview }} style={styles.previewImage} />
        </View>

        {uploadState.error && (
          <Text style={styles.errorText}>{uploadState.error}</Text>
        )}

        <TouchableOpacity
          style={[
            styles.primaryButton,
            uploadState.isUploading && styles.buttonDisabled,
          ]}
          onPress={() => uploadImage()}
          disabled={uploadState.isUploading}
          accessibilityLabel="Confirm profile picture"
          accessibilityRole="button"
        >
          {uploadState.isUploading ? (
            <ActivityIndicator color="#000" size="small" />
          ) : (
            <Text style={styles.primaryButtonText}>Confirm Profile</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textButton}
          onPress={() => handleScreenChange(SCREENS.POPUP)}
          disabled={uploadState.isUploading}
          accessibilityLabel="Choose different picture"
          accessibilityRole="button"
        >
          <Text style={styles.textButtonText}>Choose Different Picture</Text>
        </TouchableOpacity>
      </View>{" "}
    </>
  );

  const ConfirmationScreen = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.title}>GIANTOGRAM</Text>
      <Text style={styles.subtitle}>Welcome to Giantogram</Text>
      <Text style={styles.description}>Platform that provides everything</Text>

      <View style={styles.avatarContainer}>
        <Image source={{ uri: preview }} style={styles.avatar} />
      </View>

      <Text style={styles.welcomeMessage}>
        Profile picture updated successfully!{"\n"}You&apos;re all set to
        continue.
      </Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => handleScreenChange(SCREENS.POPUP)}
        accessibilityLabel="Add new picture"
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Add New Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleContinue}
        accessibilityLabel="Continue to app"
        accessibilityRole="button"
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );

  const PopupScreen = () => (
    <View style={styles.popupContainer}>
      <View style={styles.popupContent}>
        <Text style={styles.popupTitle}>Select Photo Source</Text>

        <TouchableOpacity
          style={styles.popupButton}
          onPress={() => handleScreenChange(SCREENS.CAMERA)}
          accessibilityLabel="Open camera"
          accessibilityRole="button"
        >
          <Text style={styles.popupButtonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.popupButton}
          onPress={() => pickImageFromSource(false)}
          accessibilityLabel="Choose from gallery"
          accessibilityRole="button"
        >
          <Text style={styles.popupButtonText}>Choose from Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.popupCancelButton}
          onPress={() => handleScreenChange(SCREENS.WELCOME)}
          accessibilityLabel="Cancel"
          accessibilityRole="button"
        >
          <Text style={styles.popupCancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case SCREENS.WELCOME:
        return <WelcomeScreen />;
      case SCREENS.CAMERA:
        return (
          <CustomCamera
            onPhotoTaken={handleCameraPhoto}
            onClose={() => handleScreenChange(SCREENS.WELCOME)}
          />
        );
      case SCREENS.POPUP:
        return <PopupScreen />;
      case SCREENS.PREVIEW:
        return <PreviewScreen />;
      case SCREENS.CONFIRMATION:
        return <ConfirmationScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {renderCurrentScreen()}

      {/* Navigation indicator */}
      <View style={styles.indicatorContainer}>
        <View style={styles.indicator} />
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 16,
  },
  description: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: "#374151",
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  welcomeMessage: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: "100%",
    maxWidth: 300,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: "100%",
    maxWidth: 300,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  textButtonText: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
  previewContainer: {
    width: 224,
    height: 224,
    backgroundColor: "#374151",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  popupContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 24,
  },
  popupContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "#000",
  },
  popupButton: {
    backgroundColor: "black",
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  popupButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  popupCancelButton: {
    paddingVertical: 12,
    marginTop: 8,
  },
  popupCancelText: {
    color: "#6b7280",
    textAlign: "center",
    fontSize: 16,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 4,
    left: "50%",
    transform: [{ translateX: -64 }],
  },
  indicator: {
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  backButton: {
    position: "absolute",
    top: 16, // can change based on device
    left: 16,
    zIndex: 999,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 6,
  },
});

// import React, { useState } from "react";
// import {
//   View,
//   Image,
//   TouchableOpacity,
//   Text,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   ActionSheetIOS,
//   Platform,
//   StatusBar,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";

// const DEFAULT_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=random";

// const SCREEN = {
//   WELCOME: "welcome",
//   CAMERA: "camera",
//   POPUP: "pop-up",
//   PREVIEW: "preview",
// };

// type ProfilePicUploaderProps = {
//   initialUrl?: string;
//   onUpload?: (url: string) => void;
// };

// export default function ProfilePicUploader({
//   initialUrl = DEFAULT_AVATAR,
//   onUpload,
// }: ProfilePicUploaderProps) {
//   const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [preview, setPreview] = useState(initialUrl);
//   const [currentScreen, setCurrentScreen] = useState(SCREEN.WELCOME);
//   const router = useRouter();

//   const pickImage = async (fromCamera = false) => {
//     const { status } = fromCamera
//       ? await ImagePicker.requestCameraPermissionsAsync()
//       : await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (status !== "granted") {
//       Alert.alert(
//         "Permission required",
//         `Please allow access to your ${fromCamera ? "camera" : "photos"}.`
//       );
//       return;
//     }

//     const result = fromCamera
//       ? await ImagePicker.launchCameraAsync({
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//           base64: false, // Don't include base64 to reduce memory usage
//         })
//       : await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.Images,
//           allowsEditing: true,
//           aspect: [1, 1],
//           quality: 0.8,
//           base64: false, // Don't include base64 to reduce memory usage
//         });

//     if (!result.canceled) {
//       setImage(result.assets[0]);
//       setPreview(result.assets[0].uri);
//       setCurrentScreen(SCREEN.PREVIEW);
//     }
//   };

//   const showPickerOptions = () => {
//     if (Platform.OS === "ios") {
//       ActionSheetIOS.showActionSheetWithOptions(
//         {
//           options: ["Cancel", "Take Photo", "Choose from Library"],
//           cancelButtonIndex: 0,
//         },
//         (buttonIndex) => {
//           if (buttonIndex === 1) pickImage(true);
//           else if (buttonIndex === 2) pickImage(false);
//         }
//       );
//     } else {
//       Alert.alert("Upload Photo", "Choose an option", [
//         { text: "Take Photo", onPress: () => pickImage(true) },
//         { text: "Choose from Library", onPress: () => pickImage(false) },
//         { text: "Cancel", style: "cancel" },
//       ]);
//     }
//   };

//   const handleUpload = async () => {
//     if (!image?.uri) {
//       Alert.alert("Error", "No image selected");
//       return;
//     }

//     setUploading(true);
//     try {
//       const token = await AsyncStorage.getItem("userToken");

//       if (!token) {
//         throw new Error("No authentication token found");
//       }

//       // Create proper filename with timestamp
//       const timestamp = Date.now();
//       const fileExtension = image.uri.split('.').pop()?.toLowerCase() || 'jpg';
//       const filename = `profile_${timestamp}.${fileExtension}`;

//       // Determine MIME type based on file extension
//       let mimeType: string;
//       switch (fileExtension) {
//         case 'png':
//           mimeType = 'image/png';
//           break;
//         case 'jpg':
//         case 'jpeg':
//           mimeType = 'image/jpeg';
//           break;
//         case 'gif':
//           mimeType = 'image/gif';
//           break;
//         case 'webp':
//           mimeType = 'image/webp';
//           break;
//         default:
//           mimeType = 'image/jpeg';
//       }

//       console.log("Starting upload with:", {
//         uri: image.uri,
//         filename,
//         mimeType,
//         platform: Platform.OS
//       });

//       // For React Native Web, we need to convert the blob URI to actual file
//       let fileToUpload: File | Blob;

//       if (Platform.OS === 'web') {
//         // In web environment, fetch the blob from the URI
//         const response = await fetch(image.uri);
//         const blob = await response.blob();

//         // Create a File object from the blob
//         fileToUpload = new File([blob], filename, { type: mimeType });

//         console.log('File created for web:', {
//           name: fileToUpload.name,
//           type: fileToUpload.type,
//           size: fileToUpload.size
//         });
//       } else {
//         // For native platforms, create the standard object
//         fileToUpload = {
//           uri: image.uri,
//           type: mimeType,
//           name: filename,
//         } as any;
//       }

//       // Create FormData
//       const formData = new FormData();

//       // Append the file
//       formData.append('profilePicture', fileToUpload);
//       formData.append('userId', 'current-user');

//       // Debug: Log FormData contents (only works in some environments)
//       if (Platform.OS === 'web') {
//         console.log('FormData entries:');
//         for (let [key, value] of formData.entries()) {
//           if (value instanceof File) {
//             console.log(key, ':', {
//               name: value.name,
//               type: value.type,
//               size: value.size
//             });
//           } else {
//             console.log(key, ':', value);
//           }
//         }
//       }

//       // Use fetch WITHOUT Content-Type header (let fetch set it automatically)
//       const response = await fetch('http://localhost:2001/api/auth/upload-profile', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           // DO NOT set Content-Type for FormData - let fetch handle it
//         },
//         body: formData,
//       });

//       console.log("Response status:", response.status);
//       console.log("Response headers:", response.headers);

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Upload failed:", errorText);

//         let errorMessage = `Upload failed: ${response.status}`;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || errorMessage;
//         } catch (e) {
//           // If not JSON, use the text as error message
//           errorMessage = errorText || errorMessage;
//         }

//         throw new Error(errorMessage);
//       }

//       const responseData = await response.json();
//       console.log("Upload successful:", responseData);

//       const uploadedUrl = responseData?.profilePicture || responseData?.url || responseData?.data?.url;

//       if (!uploadedUrl) {
//         console.warn("No URL returned from server:", responseData);
//         // Still consider it successful if the server responded with 200
//       }

//       if (onUpload && uploadedUrl) {
//         onUpload(uploadedUrl);
//       }

//       Alert.alert("Success", "Profile picture uploaded successfully!");
//       setImage(null);
//       setCurrentScreen(SCREEN.WELCOME);

//     } catch (error: any) {
//       console.error("Upload error:", error);

//       let errorMessage = "Upload failed. Please try again.";

//       if (error.message) {
//         errorMessage = error.message;
//       } else if (error.toString().includes('Network request failed')) {
//         errorMessage = "Network error. Please check your connection and server.";
//       } else if (error.toString().includes('timeout')) {
//         errorMessage = "Upload timeout. Please try again.";
//       }

//       Alert.alert("Upload Failed", errorMessage);
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleConfirmProfile = async () => {
//     await handleUpload();
//   };

//   const removeImage = () => {
//     setImage(null);
//     setPreview(DEFAULT_AVATAR);
//     setCurrentScreen(SCREEN.WELCOME);
//   };

//   const WelcomeScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-8">
//       <Text className="text-white text-2xl font-bold mb-2">GIANTOGRAM</Text>
//       <Text className="text-gray-300 text-center mb-4">
//         Welcome to Giantogram
//       </Text>
//       <Text className="text-gray-400 text-center text-sm mb-8">
//         Platform that provides everything
//       </Text>

//       <View className="w-32 h-32 rounded-full bg-gray-700 mb-6 justify-center items-center overflow-hidden relative">
//         <Image
//           source={{ uri: preview }}
//           className="w-full h-full"
//           onError={(e) => {
//             console.log("Image load error:", e.nativeEvent.error);
//             setPreview(DEFAULT_AVATAR);
//           }}
//         />
//       </View>

//       <Text className="text-gray-400 text-center text-sm mb-8">
//         You became the member of this network{"\n"}and you matter for us
//       </Text>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={() => setCurrentScreen(SCREEN.POPUP)}
//       >
//         <Text className="text-black text-center font-medium">Add Picture</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 w-full max-w-[300px]"
//         onPress={() => setCurrentScreen(SCREEN.CAMERA)}
//       >
//         <Text className="text-black text-center font-medium">Skip</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const PreviewScreen = () => (
//     <View className="flex-1 bg-black justify-center items-center px-6">
//       <Text className="text-white text-xl font-bold mb-4">GIANTOGRAM</Text>
//       <View className="w-56 h-56 bg-gray-800 rounded-xl overflow-hidden mb-6">
//         <Image
//           source={{ uri: preview }}
//           className="w-full h-full"
//           resizeMode="cover"
//         />
//       </View>
//       <TouchableOpacity
//         className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//         onPress={handleConfirmProfile}
//         disabled={uploading}
//       >
//         {uploading ? (
//           <ActivityIndicator color="#000" />
//         ) : (
//           <Text className="text-black text-center font-medium">
//             Confirm Profile
//           </Text>
//         )}
//       </TouchableOpacity>
//       <TouchableOpacity onPress={() => setCurrentScreen(SCREEN.WELCOME)}>
//         <Text className="text-gray-400 text-sm">Back</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const CameraScreen = () => (
//     <View style={styles.container}>
//       <View style={styles.avatarWrapper}>
//         <Image source={{ uri: preview }} style={styles.avatar} />
//         <TouchableOpacity style={styles.uploadBtn} onPress={showPickerOptions}>
//           <Text style={styles.uploadBtnText}>Upload Photo</Text>
//         </TouchableOpacity>
//         {image && (
//           <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
//             <Text style={styles.removeBtnText}>Remove</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//       <TouchableOpacity
//         style={[
//           styles.saveBtn,
//           (!image || uploading) && styles.saveBtnDisabled,
//         ]}
//         onPress={handleUpload}
//         disabled={!image || uploading}
//       >
//         {uploading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.saveBtnText}>Save</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );

//   const Popup = () => (
//     <View className="flex-1 justify-center bg-black px-6">
//       <View className="bg-white rounded-2xl p-6">
//         <TouchableOpacity
//           className="bg-black rounded-lg py-4 mb-4"
//           onPress={() => pickImage(true)}
//         >
//           <Text className="text-white text-center font-medium">Take Photo</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="bg-black rounded-lg py-4 mb-4"
//           onPress={() => pickImage(false)}
//         >
//           <Text className="text-white text-center font-medium">Gallery</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           className="bg-gray-300 rounded-lg py-4"
//           onPress={() => setCurrentScreen(SCREEN.WELCOME)}
//         >
//           <Text className="text-black text-center font-medium">Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-black">
//       <StatusBar barStyle="light-content" backgroundColor="#000" />
//       {currentScreen === SCREEN.WELCOME && <WelcomeScreen />}
//       {currentScreen === SCREEN.CAMERA && <CameraScreen />}
//       {currentScreen === SCREEN.POPUP && <Popup />}
//       {currentScreen === SCREEN.PREVIEW && <PreviewScreen />}
//       <View className="absolute bottom-1 left-1/2 -translate-x-16">
//         <View className="w-32 h-1 rounded bg-white opacity-30" />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { alignItems: "center", padding: 32 },
//   avatarWrapper: { alignItems: "center", marginBottom: 24 },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     borderWidth: 3,
//     borderColor: "#fff",
//     backgroundColor: "#eee",
//     marginBottom: 16,
//   },
//   uploadBtn: {
//     backgroundColor: "#222",
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 24,
//     marginBottom: 8,
//   },
//   uploadBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
//   removeBtn: {
//     backgroundColor: "#fff",
//     borderColor: "#e33",
//     borderWidth: 1,
//     paddingHorizontal: 18,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   removeBtnText: { color: "#e33", fontWeight: "500" },
//   saveBtn: {
//     backgroundColor: "#007aff",
//     paddingHorizontal: 40,
//     paddingVertical: 14,
//     borderRadius: 28,
//     alignItems: "center",
//     width: 200,
//   },
//   saveBtnDisabled: { backgroundColor: "#aaa" },
//   saveBtnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
// });
