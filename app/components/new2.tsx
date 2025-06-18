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

// const DEFAULT_AVATAR =
//   "https://ui-avatars.com/api/?name=User&background=random";

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
//   const [currentScreen, setCurrentScreen] = useState("welcome");

//   const pickImage = async (fromCamera = false) => {
//     let permissionStatus;
//     if (fromCamera) {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       permissionStatus = status;
//     } else {
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       permissionStatus = status;
//     }
//     if (permissionStatus !== "granted") {
//       Alert.alert(
//         "Permission required",
//         `Please allow access to your ${fromCamera ? "camera" : "photos"}.`
//       );
//       return;
//     }
//     let result = fromCamera
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
//           if (buttonIndex === 1) pickImage(true); // <-- opens camera
//           else if (buttonIndex === 2) pickImage(false); // <-- opens gallery
//         }
//       );
//     } else {
//       Alert.alert("Upload Photo", "Choose an option", [
//         { text: "Take Photo", onPress: () => pickImage(true) }, // <-- opens camera
//         { text: "Choose from Library", onPress: () => pickImage(false) },
//         { text: "Cancel", style: "cancel" },
//       ]);
//     }
//   };

//   const removeImage = () => {
//     setImage(null);
//     setPreview(DEFAULT_AVATAR);
//   };

//   const handleUpload = async () => {
//     setUploading(true);
//     try {
//       // TODO: Replace this with your API call
//       await new Promise((res) => setTimeout(res, 1500)); // Simulate upload
//       if (onUpload) onUpload(preview);
//       Alert.alert("Success", "Profile picture updated!");
//       setImage(null);
//     } catch (e) {
//       Alert.alert("Error", "Failed to upload image.");
//     }
//     setUploading(false);
//   };

//   const WelcomeScreen = ({ capturedPhoto }: any) => {
//     return (
//       <View className="flex-1 bg-black justify-center items-center px-8">
//         <Text className="text-white text-2xl font-bold mb-2">GIANTOGRAM</Text>

//         <Text className="text-gray-300 text-center mb-4">
//           Welcome to Giantogram
//         </Text>

//         <Text className="text-gray-400 text-center text-sm mb-8">
//           Platform that provides everything
//         </Text>

//         {/* Profile Avatar */}
//         <View className="w-32 h-32 rounded-full bg-gray-700 mb-6 justify-center items-center overflow-hidden relative">
//           {capturedPhoto ? (
//             <Image
//               source={{ uri: capturedPhoto.uri || capturedPhoto.path }}
//               className="w-full h-full rounded-full"
//               resizeMode="cover"
//             />
//           ) : (
//             <>
//               <View className="w-24 h-24 rounded-full bg-emerald-500 opacity-20" />
//               <View className="absolute w-16 h-16 rounded-full bg-green-400" />
//             </>
//           )}
//         </View>

//         <Text className="text-gray-400 text-center text-sm mb-8">
//           You became the member of this network{"\n"}and you matter for us
//         </Text>

//         <TouchableOpacity
//           className="bg-white rounded-lg py-3 px-8 mb-4 w-full max-w-[300px]"
//           onPress={() => setCurrentScreen("pop-up")}
//         >
//           <Text className="text-black text-center font-medium">
//             Add Picture
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           className="bg-white rounded-lg py-3 px-8 w-full max-w-[300px]"
//           onPress={() => setCurrentScreen("camera")}
//         >
//           <Text className="text-black text-center font-medium">Skip</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const CameraScreen = () => {
//     return (
//       <View style={styles.container}>
//         <View style={styles.avatarWrapper}>
//           <Image source={{ uri: preview }} style={styles.avatar} />
//           <TouchableOpacity
//             style={styles.uploadBtn}
//             onPress={showPickerOptions}
//           >
//             <Text style={styles.uploadBtnText}>Upload Photo</Text>
//           </TouchableOpacity>
//           {image && (
//             <TouchableOpacity style={styles.removeBtn} onPress={removeImage}>
//               <Text style={styles.removeBtnText}>Remove</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//         <TouchableOpacity
//           style={[
//             styles.saveBtn,
//             (!image || uploading) && styles.saveBtnDisabled,
//           ]}
//           onPress={handleUpload}
//           disabled={!image || uploading}
//         >
//           {uploading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.saveBtnText}>Save</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const Popup = ({ requestCameraPermission, openGallery }: any) => (
//     <View className="flex-1 justify-center bg-black">
//       {/* Camera Preview Area */}
//       {/* <View className="flex-1 bg-gray-900 justify-center items-center">
//       <Text className="text-gray-500 text-center mt-20">Camera Options</Text>
//     </View> */}

//       {/* Options Area */}
//       <View className="bg-black  px-6 pt-4 pb-8">
//         <View className="bg-white rounded-2xl p-6">
//           <TouchableOpacity
//             className="bg-black rounded-lg py-4 mb-4"
//             onPress={() => pickImage(true)}
//           >
//             <Text className="text-white text-center font-medium">
//               Take Photo
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-black rounded-lg py-4"
//             onPress={() => pickImage(false)}
//           >
//             <Text className="text-white text-center font-medium">Gallery</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView className="flex-1 bg-black">
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       {/* Screen Content */}
//       {currentScreen === "welcome" && <WelcomeScreen />}
//       {currentScreen === "camera" && <CameraScreen />}
//       {currentScreen === "pop-up" && <Popup />}

//       {/* Bottom Navigation Indicator */}
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

// // ...existing code...
// // import ProfilePicUploader from './components/ProfilePicUploader';

// // export default function ProfileScreen() {
// //   return (
// //     <ProfilePicUploader
// //       initialUrl="https://yourdomain.com/path/to/current/avatar.jpg"
// //       onUpload={(url) => { /* handle new avatar url */ }}
// //     />
// //   );
// // }
// // ...existing code...

// // import React, { useState } from "react";
// // import {
// //   View,
// //   Image,
// //   TouchableOpacity,
// //   Text,
// //   ActivityIndicator,
// //   StyleSheet,
// //   Alert,
// //   ActionSheetIOS,
// //   Platform,
// //   StatusBar,
// //   FlatList,
// //   Dimensions,
// // } from "react-native";
// // import * as ImagePicker from "expo-image-picker";
// // import { SafeAreaView } from "react-native-safe-area-context";

// // const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";
// // const MOCK_GALLERY = Array.from({ length: 12 }).map((_, i) => ({
// //   id: i + "",
// //   uri: `https://picsum.photos/seed/${i + 1}/200/200`,
// // }));

// // const SCREEN = {
// //   GALLERY: "gallery",
// //   PREVIEW: "preview",
// //   WELCOME: "welcome",
// // };

// // export default function Welcome() {
// //   const [currentScreen, setCurrentScreen] = useState(SCREEN.GALLERY);
// //   const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(null);
// //   const [uploading, setUploading] = useState(false);

// //   // Pick from camera or gallery
// //   const pickImage = async (fromCamera = false) => {
// //     let permissionStatus;
// //     if (fromCamera) {
// //       const { status } = await ImagePicker.requestCameraPermissionsAsync();
// //       permissionStatus = status;
// //     } else {
// //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //       permissionStatus = status;
// //     }
// //     if (permissionStatus !== "granted") {
// //       Alert.alert(
// //         "Permission required",
// //         `Please allow access to your ${fromCamera ? "camera" : "photos"}.`
// //       );
// //       return;
// //     }
// //     let result = fromCamera
// //       ? await ImagePicker.launchCameraAsync({
// //           allowsEditing: true,
// //           aspect: [1, 1],
// //           quality: 0.8,
// //         })
// //       : await ImagePicker.launchImageLibraryAsync({
// //           mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //           allowsEditing: true,
// //           aspect: [1, 1],
// //           quality: 0.8,
// //         });
// //     if (!result.canceled) {
// //       setSelectedImage({ uri: result.assets[0].uri });
// //       setCurrentScreen(SCREEN.PREVIEW);
// //     }
// //   };

// //   // Show action sheet for camera/gallery
// //   const showPickerOptions = () => {
// //     if (Platform.OS === "ios") {
// //       ActionSheetIOS.showActionSheetWithOptions(
// //         {
// //           options: ["Cancel", "Take Photo", "Choose from Library"],
// //           cancelButtonIndex: 0,
// //         },
// //         (buttonIndex) => {
// //           if (buttonIndex === 1) pickImage(true);
// //           else if (buttonIndex === 2) pickImage(false);
// //         }
// //       );
// //     } else {
// //       Alert.alert("Upload Photo", "Choose an option", [
// //         { text: "Take Photo", onPress: () => pickImage(true) },
// //         { text: "Choose from Library", onPress: () => pickImage(false) },
// //         { text: "Cancel", style: "cancel" },
// //       ]);
// //     }
// //   };

// //   // Simulate upload
// //   const handleConfirmProfile = async () => {
// //     setUploading(true);
// //     try {
// //       // TODO: Replace with your API call
// //       await new Promise((res) => setTimeout(res, 1200));
// //       setCurrentScreen(SCREEN.WELCOME);
// //     } catch (e) {
// //       Alert.alert("Error", "Failed to upload image.");
// //     }
// //     setUploading(false);
// //   };

// //   // Gallery Grid Screen
// //   const GalleryScreen = () => (
// //     <View style={{ flex: 1, backgroundColor: "#111" }}>
// //       <View style={{ padding: 16, backgroundColor: "#222" }}>
// //         <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, textAlign: "center" }}>
// //           GIANTOGRAM
// //         </Text>
// //         <TouchableOpacity
// //           style={{
// //             backgroundColor: "#fff",
// //             borderRadius: 8,
// //             paddingVertical: 10,
// //             marginTop: 16,
// //             marginBottom: 8,
// //             alignItems: "center",
// //           }}
// //           onPress={showPickerOptions}
// //         >
// //           <Text style={{ color: "#111", fontWeight: "600" }}>Gallery</Text>
// //         </TouchableOpacity>
// //       </View>
// //       <FlatList
// //         data={MOCK_GALLERY}
// //         numColumns={3}
// //         keyExtractor={(item) => item.id}
// //         contentContainerStyle={{ padding: 16 }}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity
// //             style={{
// //               flex: 1 / 3,
// //               aspectRatio: 1,
// //               margin: 6,
// //               borderRadius: 8,
// //               overflow: "hidden",
// //               borderWidth: selectedImage?.uri === item.uri ? 3 : 0,
// //               borderColor: "#00f2a9",
// //             }}
// //             onPress={() => {
// //               setSelectedImage({ uri: item.uri });
// //               setCurrentScreen(SCREEN.PREVIEW);
// //             }}
// //           >
// //             <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} />
// //           </TouchableOpacity>
// //         )}
// //       />
// //     </View>
// //   );

// //   // Preview/Camera Screen
// //   const PreviewScreen = () => (
// //     <View style={{ flex: 1, backgroundColor: "#111", justifyContent: "center", alignItems: "center" }}>
// //       <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, marginBottom: 16 }}>
// //         GIANTOGRAM
// //       </Text>
// //       <View
// //         style={{
// //           width: 220,
// //           height: 220,
// //           backgroundColor: "#222",
// //           borderRadius: 16,
// //           marginBottom: 32,
// //           justifyContent: "center",
// //           alignItems: "center",
// //           overflow: "hidden",
// //         }}
// //       >
// //         {selectedImage ? (
// //           <Image source={{ uri: selectedImage.uri }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
// //         ) : (
// //           <Image source={{ uri: DEFAULT_AVATAR }} style={{ width: 120, height: 120, borderRadius: 60 }} />
// //         )}
// //       </View>
// //       <TouchableOpacity
// //         style={{
// //           backgroundColor: "#fff",
// //           borderRadius: 8,
// //           paddingVertical: 14,
// //           paddingHorizontal: 32,
// //           marginBottom: 16,
// //           minWidth: 180,
// //         }}
// //         onPress={handleConfirmProfile}
// //         disabled={uploading}
// //       >
// //         {uploading ? (
// //           <ActivityIndicator color="#111" />
// //         ) : (
// //           <Text style={{ color: "#111", fontWeight: "600", textAlign: "center" }}>Confirm Profile</Text>
// //         )}
// //       </TouchableOpacity>
// //       <TouchableOpacity onPress={() => setCurrentScreen(SCREEN.GALLERY)}>
// //         <Text style={{ color: "#aaa", fontSize: 16 }}>Back to Gallery</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   // Welcome/After Selection Screen
// //   const WelcomeScreen = () => (
// //     <View style={{ flex: 1, backgroundColor: "#1a0a0a", justifyContent: "center", alignItems: "center", padding: 24 }}>
// //       <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20, marginBottom: 8 }}>
// //         GIANTOGRAM
// //       </Text>
// //       <Text style={{ color: "#fff", fontSize: 16, marginBottom: 8, textAlign: "center" }}>
// //         Welcome to Giantogram
// //       </Text>
// //       <Text style={{ color: "#fff", fontSize: 13, marginBottom: 18, textAlign: "center" }}>
// //         Platform that provides everything
// //       </Text>
// //       <View
// //         style={{
// //           width: 180,
// //           height: 180,
// //           borderRadius: 16,
// //           backgroundColor: "#222",
// //           marginBottom: 24,
// //           overflow: "hidden",
// //           justifyContent: "center",
// //           alignItems: "center",
// //         }}
// //       >
// //         <Image
// //           source={{ uri: selectedImage?.uri || DEFAULT_AVATAR }}
// //           style={{ width: "100%", height: "100%" }}
// //           resizeMode="cover"
// //         />
// //       </View>
// //       <Text style={{ color: "#fff", fontSize: 13, marginBottom: 24, textAlign: "center" }}>
// //         You became the member of this network and you matter for us
// //       </Text>
// //       <TouchableOpacity
// //         style={{
// //           backgroundColor: "#fff",
// //           borderRadius: 8,
// //           paddingVertical: 12,
// //           paddingHorizontal: 32,
// //           marginBottom: 16,
// //           minWidth: 180,
// //         }}
// //         onPress={() => setCurrentScreen(SCREEN.GALLERY)}
// //       >
// //         <Text style={{ color: "#111", fontWeight: "600", textAlign: "center" }}>Add New Picture</Text>
// //       </TouchableOpacity>
// //       <TouchableOpacity
// //         style={{
// //           backgroundColor: "#fff",
// //           borderRadius: 8,
// //           paddingVertical: 12,
// //           paddingHorizontal: 32,
// //           minWidth: 180,
// //         }}
// //         onPress={() => Alert.alert("Continue", "Go to home page!")}
// //       >
// //         <Text style={{ color: "#111", fontWeight: "600", textAlign: "center" }}>Continue</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
// //       <StatusBar barStyle="light-content" backgroundColor="#000" />
// //       {currentScreen === SCREEN.GALLERY && <GalleryScreen />}
// //       {currentScreen === SCREEN.PREVIEW && <PreviewScreen />}
// //       {currentScreen === SCREEN.WELCOME && <WelcomeScreen />}
// //     </SafeAreaView>
// //   );
// // }

// // import React, { useState } from "react";
// // import {
// //   View,
// //   Image,
// //   TouchableOpacity,
// //   Text,
// //   StyleSheet,
// //   FlatList,
// //   Alert,
// //   Platform,
// //   ActionSheetIOS,
// //   StatusBar,
// // } from "react-native";
// // import * as ImagePicker from "expo-image-picker";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { Ionicons } from "@expo/vector-icons";

// // const MOCK_GALLERY = Array.from({ length: 12 }).map((_, i) => ({
// //   id: i + "",
// //   uri: `https://picsum.photos/seed/${i + 1}/200/200`,
// // }));

// // const SCREEN = {
// //   GALLERY: "gallery",
// //   PREVIEW: "preview",
// // };

// // export default function Welcome() {
// //   const [currentScreen, setCurrentScreen] = useState(SCREEN.GALLERY);
// //   const [selectedImage, setSelectedImage] = useState<{ uri: string } | null>(null);

// //   // Pick from camera or gallery
// //   const pickImage = async (fromCamera = false) => {
// //     let permissionStatus;
// //     if (fromCamera) {
// //       const { status } = await ImagePicker.requestCameraPermissionsAsync();
// //       permissionStatus = status;
// //     } else {
// //       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //       permissionStatus = status;
// //     }
// //     if (permissionStatus !== "granted") {
// //       Alert.alert(
// //         "Permission required",
// //         `Please allow access to your ${fromCamera ? "camera" : "photos"}.`
// //       );
// //       return;
// //     }
// //     let result = fromCamera
// //       ? await ImagePicker.launchCameraAsync({
// //           allowsEditing: true,
// //           aspect: [1, 1],
// //           quality: 0.8,
// //         })
// //       : await ImagePicker.launchImageLibraryAsync({
// //           mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //           allowsEditing: true,
// //           aspect: [1, 1],
// //           quality: 0.8,
// //         });
// //     if (!result.canceled) {
// //       setSelectedImage({ uri: result.assets[0].uri });
// //       setCurrentScreen(SCREEN.PREVIEW);
// //     }
// //   };

// //   // Show action sheet for camera/gallery
// //   const showPickerOptions = () => {
// //     if (Platform.OS === "ios") {
// //       ActionSheetIOS.showActionSheetWithOptions(
// //         {
// //           options: ["Cancel", "Take Photo", "Choose from Library"],
// //           cancelButtonIndex: 0,
// //         },
// //         (buttonIndex) => {
// //           if (buttonIndex === 1) pickImage(true);
// //           else if (buttonIndex === 2) pickImage(false);
// //         }
// //       );
// //     } else {
// //       Alert.alert("Upload Photo", "Choose an option", [
// //         { text: "Take Photo", onPress: () => pickImage(true) },
// //         { text: "Choose from Library", onPress: () => pickImage(false) },
// //         { text: "Cancel", style: "cancel" },
// //       ]);
// //     }
// //   };

// //   // Gallery Screen
// //   const GalleryScreen = () => (
// //     <View style={styles.galleryContainer}>
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => { /* handle back if needed */ }}>
// //           <Ionicons name="arrow-back" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Gallery</Text>
// //         <View style={{ width: 24 }} /> {/* Placeholder for alignment */}
// //       </View>
// //       <View style={styles.galleryGridWrapper}>
// //         <FlatList
// //           data={MOCK_GALLERY}
// //           numColumns={3}
// //           keyExtractor={(item) => item.id}
// //           contentContainerStyle={styles.galleryGrid}
// //           renderItem={({ item }) => (
// //             <TouchableOpacity
// //               style={styles.galleryImageWrapper}
// //               onPress={() => {
// //                 setSelectedImage({ uri: item.uri });
// //                 setCurrentScreen(SCREEN.PREVIEW);
// //               }}
// //             >
// //               <Image source={{ uri: item.uri }} style={styles.galleryImage} />
// //             </TouchableOpacity>
// //           )}
// //           ListHeaderComponent={
// //             <TouchableOpacity
// //               style={[styles.galleryImageWrapper, { backgroundColor: "#eaeaea", justifyContent: "center", alignItems: "center" }]}
// //               onPress={showPickerOptions}
// //             >
// //               <Ionicons name="camera" size={32} color="#222" />
// //             </TouchableOpacity>
// //           }
// //         />
// //       </View>
// //     </View>
// //   );

// //   // Preview Screen
// //   const PreviewScreen = () => (
// //     <View style={styles.previewContainer}>
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => setCurrentScreen(SCREEN.GALLERY)}>
// //           <Ionicons name="arrow-back" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>GIANTOGRAM</Text>
// //         <View style={{ width: 24 }} />
// //       </View>
// //       <View style={styles.previewImageWrapper}>
// //         {selectedImage && (
// //           <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
// //         )}
// //       </View>
// //       <TouchableOpacity
// //         style={styles.confirmBtn}
// //         onPress={() => Alert.alert("Profile Set!", "Profile picture updated.")}
// //       >
// //         <Text style={styles.confirmBtnText}>Confirm Profile</Text>
// //       </TouchableOpacity>
// //     </View>
// //   );

// //   return (
// //     <SafeAreaView style={{ flex: 1, backgroundColor: "#111" }}>
// //       <StatusBar barStyle="light-content" backgroundColor="#000" />
// //       {currentScreen === SCREEN.GALLERY && <GalleryScreen />}
// //       {currentScreen === SCREEN.PREVIEW && <PreviewScreen />}
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   galleryContainer: { flex: 1, backgroundColor: "#111" },
// //   header: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     paddingHorizontal: 16,
// //     paddingTop: 16,
// //     paddingBottom: 12,
// //     backgroundColor: "#223032",
// //     justifyContent: "space-between",
// //   },
// //   headerTitle: {
// //     color: "#fff",
// //     fontWeight: "bold",
// //     fontSize: 18,
// //     textAlign: "center",
// //     flex: 1,
// //   },
// //   galleryGridWrapper: {
// //     flex: 1,
// //     backgroundColor: "#fff",
// //     borderTopLeftRadius: 18,
// //     borderTopRightRadius: 18,
// //     marginTop: 12,
// //     paddingTop: 8,
// //     paddingHorizontal: 8,
// //   },
// //   galleryGrid: {
// //     paddingBottom: 24,
// //   },
// //   galleryImageWrapper: {
// //     flex: 1 / 3,
// //     aspectRatio: 1,
// //     margin: 6,
// //     borderRadius: 10,
// //     overflow: "hidden",
// //     backgroundColor: "#ccc",
// //   },
// //   galleryImage: {
// //     width: "100%",
// //     height: "100%",
// //     resizeMode: "cover",
// //   },
// //   previewContainer: {
// //     flex: 1,
// //     backgroundColor: "#111",
// //     alignItems: "center",
// //     paddingTop: 32,
// //   },
// //   previewImageWrapper: {
// //     width: 220,
// //     height: 220,
// //     backgroundColor: "#fff",
// //     borderRadius: 12,
// //     marginTop: 48,
// //     marginBottom: 32,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     overflow: "hidden",
// //   },
// //   previewImage: {
// //     width: "100%",
// //     height: "100%",
// //     resizeMode: "cover",
// //   },
// //   confirmBtn: {
// //     backgroundColor: "#fff",
// //     borderRadius: 8,
// //     paddingVertical: 14,
// //     paddingHorizontal: 32,
// //     marginTop: 16,
// //     minWidth: 180,
// //     alignItems: "center",
// //   },
// //   confirmBtnText: {
// //  color: "#111",
// //     fontWeight: "600",
// //     fontSize: 16,
// //   },
// // });
