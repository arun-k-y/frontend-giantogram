// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StatusBar,
//   SafeAreaView,
//   Alert,
//   Image,
//   StyleSheet,
// } from "react-native";
// import {
//   CameraView,
//   CameraType,
//   useCameraPermissions,
//   FlashMode,
// } from "expo-camera";
// import * as ImagePicker from "expo-image-picker";

// const GiantogramApp = () => {
//   const [currentScreen, setCurrentScreen] = useState("welcome");
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const [cameraType, setCameraType] = useState("back");
//   const [flashMode, setFlashMode] = useState("off");

//   const cameraRef = useRef(null);
//   const [permission, requestPermission] = useCameraPermissions();

//   const requestCameraPermission = async () => {
//     try {
//       if (!permission?.granted) {
//         const permissionResult = await requestPermission();
//         if (!permissionResult.granted) {
//           Alert.alert(
//             "Permission denied",
//             "Camera permission is required to take photos"
//           );
//           return;
//         }
//       }
//       setCurrentScreen("camera-capture");
//     } catch (error) {
//       console.log("Permission request failed:", error);
//       Alert.alert("Error", "Failed to request camera permission");
//     }
//   };

//   const takePhoto = async () => {
//     try {
//       if (!cameraRef.current) return;

//       const photo = await cameraRef.current.takePictureAsync({
//         quality: 0.8,
//         base64: false,
//         exif: false,
//       });

//       setCapturedPhoto(photo);
//       Alert.alert("Success", "Photo captured successfully!", [
//         { text: "OK", onPress: () => setCurrentScreen("welcome") },
//       ]);
//     } catch (error) {
//       console.log("Photo capture failed:", error);
//       Alert.alert("Error", "Failed to capture photo");
//     }
//   };

//   const openGallery = async () => {
//     try {
//       // Request media library permissions
//       const { status } =
//         await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert(
//           "Permission denied",
//           "Gallery access permission is required"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 0.8,
//       });

//       if (!result.canceled && result.assets[0]) {
//         setCapturedPhoto({ uri: result.assets[0].uri });
//         Alert.alert("Success", "Image selected successfully!");
//       }
//     } catch (error) {
//       console.log("Gallery picker error:", error);
//       Alert.alert("Error", "Failed to open gallery");
//     }
//   };

//   const switchCamera = () => {
//     setCameraType(cameraType === "back" ? "front" : "back");
//   };

//   const toggleFlash = () => {
//     setFlashMode(flashMode === "off" ? "on" : "off");
//   };

//   const WelcomeScreen = () => (
//     <View style={styles.welcomeContainer}>
//       <Text style={styles.title}>GIANTOGRAM</Text>

//       <Text style={styles.welcomeText}>Welcome to Giantogram</Text>

//       <Text style={styles.subtitleText}>Platform that provides everything</Text>

//       {/* Profile Avatar */}
//       <View style={styles.avatarContainer}>
//         {capturedPhoto ? (
//           <Image
//             source={{ uri: capturedPhoto.uri || capturedPhoto.path }}
//             style={styles.avatarImage}
//             resizeMode="cover"
//           />
//         ) : (
//           <>
//             <View style={styles.avatarPlaceholderOuter} />
//             <View style={styles.avatarPlaceholderInner} />
//           </>
//         )}
//       </View>

//       <Text style={styles.memberText}>
//         You became the member of this network{"\n"}
//         and you matter for us
//       </Text>

//       <TouchableOpacity
//         style={styles.primaryButton}
//         onPress={() => setCurrentScreen("camera")}
//       >
//         <Text style={styles.buttonText}>Add Picture</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.primaryButton}
//         onPress={() => setCurrentScreen("camera")}
//       >
//         <Text style={styles.buttonText}>Skip</Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const CameraScreen = () => (
//     <View style={styles.cameraScreenContainer}>
//       <View style={styles.cameraPreviewArea}>
//         <Text style={styles.cameraOptionsText}>Camera Options</Text>
//       </View>

//       <View style={styles.cameraOptionsContainer}>
//         <View style={styles.optionsCard}>
//           <TouchableOpacity
//             style={styles.cameraOptionButton}
//             onPress={requestCameraPermission}
//           >
//             <Text style={styles.cameraOptionText}>Take Photo</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.cameraOptionButton}
//             onPress={openGallery}
//           >
//             <Text style={styles.cameraOptionText}>Gallery</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );

//   const CameraCaptureScreen = () => {
//     if (!permission?.granted) {
//       return (
//         <View style={styles.permissionContainer}>
//           <Text style={styles.permissionText}>
//             No camera permission granted
//           </Text>
//           <TouchableOpacity
//             style={styles.primaryButton}
//             onPress={() => setCurrentScreen("camera")}
//           >
//             <Text style={styles.buttonText}>Go Back</Text>
//           </TouchableOpacity>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.cameraContainer}>
//         {/* Header */}
//         <View style={styles.cameraHeader}>
//           <TouchableOpacity onPress={() => setCurrentScreen("camera")}>
//             <Text style={styles.headerButton}>←</Text>
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Take Photo</Text>
//           <TouchableOpacity onPress={toggleFlash}>
//             <Text style={styles.headerButton}>
//               {flashMode === "on" ? "⚡" : "🔦"}
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Camera View */}
//         <CameraView
//           ref={cameraRef}
//           style={styles.camera}
//           facing={cameraType}
//           flash={flashMode}
//         >
//           {/* Camera Controls Overlay */}
//           <View style={styles.cameraControlsOverlay}>
//             {/* Main capture button */}
//             <View style={styles.captureButtonContainer}>
//               <TouchableOpacity
//                 style={styles.captureButtonOuter}
//                 onPress={takePhoto}
//               >
//                 <View style={styles.captureButtonInner} />
//               </TouchableOpacity>
//             </View>

//             {/* Bottom control buttons */}
//             <View style={styles.bottomControls}>
//               <TouchableOpacity
//                 style={styles.controlButton}
//                 onPress={openGallery}
//               >
//                 <View style={styles.galleryIcon} />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.alternativeCaptureButton}
//                 onPress={takePhoto}
//               >
//                 <View style={styles.alternativeCaptureButtonInner} />
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.controlButton}
//                 onPress={switchCamera}
//               >
//                 <Text style={styles.flipCameraText}>⟲</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </CameraView>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#000000" />

//       {/* Header */}
//       {/* <View style={styles.header}>
//         <Text style={styles.headerBrand}>GIANTOGRAM</Text>
//         <TouchableOpacity>
//           <Text style={styles.menuButton}>•••</Text>
//         </TouchableOpacity>
//       </View> */}

//       {/* Screen Content */}
//       {currentScreen === "welcome" && <WelcomeScreen />}
//       {currentScreen === "camera" && <CameraScreen />}
//       {currentScreen === "camera-capture" && <CameraCaptureScreen />}

//       {/* Bottom Navigation Indicator */}
//       <View style={styles.bottomIndicatorContainer}>
//         <View style={styles.bottomIndicator} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#374151",
//   },
//   headerBrand: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   menuButton: {
//     color: "#9CA3AF",
//   },
//   welcomeContainer: {
//     flex: 1,
//     backgroundColor: "#000000",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 32,
//   },
//   title: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 8,
//   },
//   welcomeText: {
//     color: "#D1D5DB",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   subtitleText: {
//     color: "#9CA3AF",
//     textAlign: "center",
//     fontSize: 14,
//     marginBottom: 32,
//   },
//   avatarContainer: {
//     width: 128,
//     height: 128,
//     borderRadius: 64,
//     backgroundColor: "#374151",
//     marginBottom: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     position: "relative",
//   },
//   avatarImage: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 64,
//   },
//   avatarPlaceholderOuter: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: "#10B981",
//     opacity: 0.2,
//   },
//   avatarPlaceholderInner: {
//     position: "absolute",
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: "#34D399",
//   },
//   memberText: {
//     color: "#9CA3AF",
//     textAlign: "center",
//     fontSize: 14,
//     marginBottom: 32,
//   },
//   primaryButton: {
//     backgroundColor: "white",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 32,
//     marginBottom: 16,
//     width: "100%",
//     maxWidth: 300,
//   },
//   buttonText: {
//     color: "black",
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   cameraScreenContainer: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },
//   cameraPreviewArea: {
//     flex: 1,
//     backgroundColor: "#111827",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraOptionsText: {
//     color: "#6B7280",
//     textAlign: "center",
//     marginTop: 80,
//   },
//   cameraOptionsContainer: {
//     backgroundColor: "#000000",
//     paddingHorizontal: 24,
//     paddingBottom: 32,
//     paddingTop: 16,
//   },
//   optionsCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 24,
//   },
//   cameraOptionButton: {
//     backgroundColor: "#000000",
//     borderRadius: 8,
//     paddingVertical: 16,
//     marginBottom: 16,
//   },
//   cameraOptionText: {
//     color: "white",
//     textAlign: "center",
//     fontWeight: "500",
//   },
//   permissionContainer: {
//     flex: 1,
//     backgroundColor: "#000000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   permissionText: {
//     color: "white",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   cameraContainer: {
//     flex: 1,
//     backgroundColor: "#000000",
//   },
//   cameraHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     paddingTop: 48,
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10,
//   },
//   headerButton: {
//     color: "white",
//     fontSize: 18,
//   },
//   headerTitle: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   camera: {
//     flex: 1,
//   },
//   cameraControlsOverlay: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     paddingBottom: 48,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   captureButtonContainer: {
//     alignItems: "center",
//     marginBottom: 32,
//   },
//   captureButtonOuter: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 4,
//     borderColor: "white",
//     backgroundColor: "transparent",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   captureButtonInner: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: "white",
//   },
//   bottomControls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingHorizontal: 48,
//   },
//   controlButton: {
//     width: 48,
//     height: 48,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   galleryIcon: {
//     width: 32,
//     height: 32,
//     backgroundColor: "#6B7280",
//     borderRadius: 4,
//   },
//   alternativeCaptureButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   alternativeCaptureButtonInner: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: "black",
//   },
//   flipCameraText: {
//     color: "white",
//     fontSize: 12,
//   },
//   bottomIndicatorContainer: {
//     position: "absolute",
//     bottom: 4,
//     left: "50%",
//     transform: [{ translateX: -64 }],
//   },
//   bottomIndicator: {
//     width: 128,
//     height: 4,
//     backgroundColor: "white",
//     borderRadius: 2,
//     opacity: 0.3,
//   },
// });

// export default GiantogramApp;

