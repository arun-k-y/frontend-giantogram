// // import React, { useState, useRef } from "react";
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Dimensions,
// //   Alert,
// // } from "react-native";
// // import { CameraView, useCameraPermissions } from "expo-camera";
// // import * as MediaLibrary from "expo-media-library";
// // import { Ionicons } from "@expo/vector-icons";

// // const { width, height } = Dimensions.get("window");

// // interface CustomCameraProps {
// //   onPhotoTaken?: (uri: string) => void;
// //   onClose?: () => void;
// // }

// // type CameraTypeString = "front" | "back";
// // type FlashModeString = "off" | "on";

// // export default function CustomCamera({
// //   onPhotoTaken,
// //   onClose,
// // }: CustomCameraProps) {
// //   const [type, setType] = useState<CameraTypeString>("back");
// //   const [flashMode, setFlashMode] = useState<FlashModeString>("off");
// //   const [permission, requestPermission] = useCameraPermissions();
// //   const cameraRef = useRef<CameraView>(null);

// //   if (!permission) return <View />;

// //   if (!permission.granted) {
// //     return (
// //       <View style={styles.container}>
// //         <Text style={styles.message}>
// //           We need your permission to show the camera
// //         </Text>
// //         <TouchableOpacity
// //           onPress={requestPermission}
// //           style={styles.permissionButton}
// //         >
// //           <Text style={styles.permissionButtonText}>Grant Permission</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   const takePicture = async () => {
// //     if (cameraRef.current) {
// //       try {
// //         const photo = await cameraRef.current.takePictureAsync({
// //           quality: 0.8,
// //           base64: false,
// //         });

// //         // Save to media library
// //         await MediaLibrary.saveToLibraryAsync(photo.uri);

// //         if (onPhotoTaken) {
// //           onPhotoTaken(photo.uri);
// //         }
// //       } catch (error) {
// //         Alert.alert("Error", "Failed to take picture");
// //         console.error("Camera error:", error);
// //       }
// //     }
// //   };

// //   const toggleCameraType = () => setType(type === "back" ? "front" : "back");
// //   const toggleFlash = () => setFlashMode(flashMode === "off" ? "on" : "off");

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={onClose} style={styles.backButton}>
// //           <Ionicons name="arrow-back" size={24} color="white" />
// //         </TouchableOpacity>
// //         <Text style={styles.title}>GIANTOGRAM</Text>
// //         <View style={styles.placeholder} />
// //       </View>

// //       {/* Camera View */}
// //       <CameraView
// //         style={styles.camera}
// //         facing={type}
// //         flash={flashMode}
// //         ref={cameraRef}
// //       >
// //         {/* Camera Controls Overlay */}
// //         <View style={styles.overlay}>
// //           {/* Top Controls */}
// //           <View style={styles.topControls}></View>

// //           {/* Center - Camera Viewfinder */}
// //           {/* <View style={styles.viewfinder}>
// //             <View style={styles.viewfinderFrame} />
// //           </View> */}

// //           <View style={styles.viewfinder}>
// //             <View style={styles.maskRow} />
// //             <View style={styles.maskCenterRow}>
// //               <View style={styles.maskSide} />
// //               <View style={styles.viewfinderFrame} />
// //               <View style={styles.maskSide} />
// //             </View>
// //             <View style={styles.maskRow} />
// //           </View>

// //           {/* Bottom Controls */}
// //           <View style={styles.bottomControls}>
// //             {/* Flash Toggle Button (replacing gallery) */}
// //             <TouchableOpacity
// //               onPress={toggleFlash}
// //               style={styles.galleryButton}
// //             >
// //               <Ionicons
// //                 name={flashMode === "off" ? "flash-off" : "flash"}
// //                 size={24}
// //                 color="white"
// //               />
// //             </TouchableOpacity>

// //             {/* Capture Button */}
// //             <TouchableOpacity
// //               onPress={takePicture}
// //               style={styles.captureButton}
// //             >
// //               <View style={styles.captureButtonInner} />
// //             </TouchableOpacity>

// //             {/* Flip Camera Button */}
// //             <TouchableOpacity
// //               onPress={toggleCameraType}
// //               style={styles.flipButton}
// //             >
// //               <Ionicons name="camera-reverse-outline" size={24} color="white" />
// //             </TouchableOpacity>
// //           </View>
// //         </View>
// //       </CameraView>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "black",
// //   },
// //   message: {
// //     textAlign: "center",
// //     paddingBottom: 10,
// //     color: "white",
// //   },
// //   permissionButton: {
// //     backgroundColor: "white",
// //     padding: 15,
// //     borderRadius: 8,
// //     margin: 20,
// //   },
// //   permissionButtonText: {
// //     color: "black",
// //     textAlign: "center",
// //     fontWeight: "bold",
// //   },
// //   header: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingHorizontal: 20,
// //     paddingTop: 50,
// //     paddingBottom: 20,
// //     backgroundColor: "black",
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   title: {
// //     color: "white",
// //     fontSize: 18,
// //     fontWeight: "bold",
// //   },
// //   placeholder: {
// //     width: 40,
// //   },
// //   camera: {
// //     flex: 1,
// //   },
// //   overlay: {
// //     flex: 1,
// //     backgroundColor: "transparent",
// //     flexDirection: "column",
// //     justifyContent: "space-between",
// //   },
// //   topControls: {
// //     flexDirection: "row",
// //     justifyContent: "flex-end",
// //     paddingHorizontal: 20,
// //     paddingTop: 20,
// //   },
// //   controlButton: {
// //     backgroundColor: "rgba(0, 0, 0, 0.5)",
// //     borderRadius: 25,
// //     padding: 12,
// //     marginLeft: 10,
// //   },
// //   viewfinder: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   viewfinderFrame: {
// //     width: width * 0.8,
// //     height: width * 0.8,
// //     borderRadius: (width * 0.8) / 2,
// //     borderWidth: 2,
// //     borderColor: "white",
// //     backgroundColor: "transparent",
// //   },
// //   bottomControls: {
// //     flexDirection: "row",
// //     justifyContent: "space-around",
// //     alignItems: "center",
// //     paddingBottom: 40,
// //     paddingHorizontal: 40,
// //   },
// //   galleryButton: {
// //     backgroundColor: "rgba(0, 0, 0, 0.6)",
// //     borderRadius: 30,
// //     padding: 15,
// //   },
// //   captureButton: {
// //     width: 80,
// //     height: 80,
// //     borderRadius: 40,
// //     backgroundColor: "white",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     borderWidth: 4,
// //     borderColor: "rgba(255, 255, 255, 0.8)",
// //   },
// //   captureButtonInner: {
// //     width: 60,
// //     height: 60,
// //     borderRadius: 30,
// //     backgroundColor: "white",
// //     borderWidth: 2,
// //     borderColor: "#ddd",
// //   },
// //   flipButton: {
// //     backgroundColor: "rgba(0, 0, 0, 0.6)",
// //     borderRadius: 30,
// //     padding: 15,
// //   },
// //   maskRow: {
// //     width: "100%",
// //     height: (height - width * 0.8) / 2,
// //     backgroundColor: "rgba(0, 0, 0, 1)",
// //   },

// //   maskCenterRow: {
// //     flexDirection: "row",
// //   },

// //   maskSide: {
// //     flex: 1,
// //     backgroundColor: "rgba(0, 0, 0, 1)",
// //   },
// // });

// // Usage example in your ProfilePicUploader component:
// /*
// import CustomCamera from './CustomCamera';

// // Add this to your SCREEN enum:
// const SCREEN = {
//   WELCOME: "welcome",
//   CAMERA: "camera", // Now this will show the custom camera
//   POPUP: "pop-up",
//   PREVIEW: "preview",
//   CONFIRMATION: "confirmation",
// };

// // Replace your CameraScreen with:
// const CameraScreen = () => (
//   <CustomCamera
//     onPhotoTaken={(uri) => {
//       setImage({ uri } as ImagePicker.ImagePickerAsset);
//       setPreview(uri);
//       setCurrentScreen(SCREEN.PREVIEW);
//     }}
//     onClose={() => setCurrentScreen(SCREEN.WELCOME)}
//   />
// );
// */

// import React, { useState, useRef } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Alert,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as MediaLibrary from "expo-media-library";
// import { Ionicons } from "@expo/vector-icons";

// const { width, height } = Dimensions.get("window");

// interface CustomCameraProps {
//   onPhotoTaken?: (uri: string) => void;
//   onClose?: () => void;
// }

// type CameraTypeString = "front" | "back";
// type FlashModeString = "off" | "on";

// export default function CustomCamera({
//   onPhotoTaken,
//   onClose,
// }: CustomCameraProps) {
//   const [type, setType] = useState<CameraTypeString>("back");
//   const [flashMode, setFlashMode] = useState<FlashModeString>("off");
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef<CameraView>(null);

//   if (!permission) return <View />;

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <TouchableOpacity
//           onPress={requestPermission}
//           style={styles.permissionButton}
//         >
//           <Text style={styles.permissionButtonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync({
//           quality: 0.8,
//           base64: false,
//         });

//         // Save to media library
//         await MediaLibrary.saveToLibraryAsync(photo.uri);

//         if (onPhotoTaken) {
//           onPhotoTaken(photo.uri);
//         }
//       } catch (error) {
//         Alert.alert("Error", "Failed to take picture");
//         console.error("Camera error:", error);
//       }
//     }
//   };

//   const toggleCameraType = () => setType(type === "back" ? "front" : "back");
//   const toggleFlash = () => setFlashMode(flashMode === "off" ? "on" : "off");

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={onClose} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="white" />
//         </TouchableOpacity>
//         <Text style={styles.title}>GIANTOGRAM</Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Camera View */}
//       <CameraView
//         style={styles.camera}
//         facing={type}
//         flash={flashMode}
//         ref={cameraRef}
//       >
//         {/* Camera Controls Overlay */}
//         <View style={styles.overlay}>
//           {/* Top Controls */}
//           <View style={styles.topControls}></View>

//           {/* Center - Camera Viewfinder with Mask */}
//           <View style={styles.viewfinder}>
//             <View style={styles.maskRow} />
//             <View style={styles.maskCenterRow}>
//               <View style={styles.maskSide} />
//               <View style={styles.viewfinderFrame} />
//               <View style={styles.maskSide} />
//             </View>
//             <View style={styles.maskRow} />
//           </View>

//           {/* Bottom Controls */}
//           <View style={styles.bottomControls}>
//             {/* Flash Toggle Button (replacing gallery) */}
//             <TouchableOpacity
//               onPress={toggleFlash}
//               style={styles.galleryButton}
//             >
//               <Ionicons
//                 name={flashMode === "off" ? "flash-off" : "flash"}
//                 size={24}
//                 color="white"
//               />
//             </TouchableOpacity>

//             {/* Capture Button */}
//             <TouchableOpacity
//               onPress={takePicture}
//               style={styles.captureButton}
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>

//             {/* Flip Camera Button */}
//             <TouchableOpacity
//               onPress={toggleCameraType}
//               style={styles.flipButton}
//             >
//               <Ionicons name="camera-reverse-outline" size={24} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </CameraView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//     color: "white",
//   },
//   permissionButton: {
//     backgroundColor: "white",
//     padding: 15,
//     borderRadius: 8,
//     margin: 20,
//   },
//   permissionButtonText: {
//     color: "black",
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 50,
//     paddingBottom: 20,
//     backgroundColor: "black",
//   },
//   backButton: {
//     padding: 8,
//   },
//   title: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   placeholder: {
//     width: 40,
//   },
//   camera: {
//     flex: 1,
//   },
//   overlay: {
//     flex: 1,
//     backgroundColor: "transparent",
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   topControls: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   controlButton: {
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     borderRadius: 25,
//     padding: 12,
//     marginLeft: 10,
//   },
//   viewfinder: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   viewfinderFrame: {
//     width: width * 0.8,
//     height: width * 0.8,
//     borderRadius: (width * 0.8) / 2,
//     borderWidth: 3,
//     borderColor: "white",
//     backgroundColor: "transparent",
//   },
//   bottomControls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingBottom: 40,
//     paddingHorizontal: 40,
//   },
//   galleryButton: {
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     borderRadius: 30,
//     padding: 15,
//   },
//   captureButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 4,
//     borderColor: "rgba(255, 255, 255, 0.8)",
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "white",
//     borderWidth: 2,
//     borderColor: "#ddd",
//   },
//   flipButton: {
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     borderRadius: 30,
//     padding: 15,
//   },
//   maskRow: {
//     width: "100%",
//     height: (height - width * 0.8) / 2,
//     backgroundColor: "rgba(0, 0, 0, 0.6)", // Changed from 1.0 to 0.6 opacity
//   },
//   maskCenterRow: {
//     flexDirection: "row",
//   },
//   maskSide: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.6)", // Changed from 1.0 to 0.6 opacity
//   },
// });

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect, Circle } from "react-native-svg";

// Constants
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CIRCLE_RATIO = 0.8;
const CAPTURE_QUALITY = 0.8;

// Types
interface CustomCameraProps {
  onPhotoTaken?: (uri: string) => void;
  onClose?: () => void;
}

type CameraFacing = "front" | "back";
type FlashMode = "off" | "on";

interface CameraState {
  facing: CameraFacing;
  flashMode: FlashMode;
  isCapturing: boolean;
}

// Component
const CustomCamera: React.FC<CustomCameraProps> = ({
  onPhotoTaken,
  onClose,
}) => {
  // State
  const [cameraState, setCameraState] = useState<CameraState>({
    facing: "back",
    flashMode: "off",
    isCapturing: false,
  });

  // Refs
  const cameraRef = useRef<CameraView>(null);

  // Hooks
  const [permission, requestPermission] = useCameraPermissions();

  // Memoized values
  const circleViewport = useMemo(() => {
    const diameter = SCREEN_WIDTH * CIRCLE_RATIO;
    const x = SCREEN_WIDTH / 2;
    const y = SCREEN_HEIGHT / 2.5;

    return {
      diameter,
      x,
      y,
      radius: diameter / 2,
      top: y - diameter / 2,
      left: x - diameter / 2,
    };
  }, []);

  // Callbacks
  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || cameraState.isCapturing) return;

    setCameraState((prev) => ({ ...prev, isCapturing: true }));

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: CAPTURE_QUALITY,
      });

      // Save to library
      await MediaLibrary.saveToLibraryAsync(photo.uri);

      // Notify parent component
      onPhotoTaken?.(photo.uri);
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setCameraState((prev) => ({ ...prev, isCapturing: false }));
    }
  }, [cameraState.isCapturing, onPhotoTaken]);

  const handleToggleCameraFacing = useCallback(() => {
    setCameraState((prev) => ({
      ...prev,
      facing: prev.facing === "back" ? "front" : "back",
    }));
  }, []);

  const handleToggleFlash = useCallback(() => {
    setCameraState((prev) => ({
      ...prev,
      flashMode: prev.flashMode === "off" ? "on" : "off",
    }));
  }, []);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleRequestPermission = useCallback(async () => {
    try {
      await requestPermission();
    } catch (error) {
      console.error("Permission request error:", error);
      Alert.alert(
        "Permission Error",
        "Unable to request camera permission. Please check your settings.",
        [{ text: "OK" }]
      );
    }
  }, [requestPermission]);

  // Render permission screen
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <View style={styles.permissionContainer}>
          <Ionicons
            name="camera-outline"
            size={64}
            color="white"
            style={styles.permissionIcon}
          />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need camera permission to take photos
          </Text>
          <TouchableOpacity
            onPress={handleRequestPermission}
            style={styles.permissionButton}
            accessibilityLabel="Grant camera permission"
            accessibilityRole="button"
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main camera view
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* Header */}
      <SafeAreaView>
        {/* <View style={styles.header} >
          <TouchableOpacity 
            onPress={handleClose} 
            style={styles.backButton}
            accessibilityLabel="Close camera"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          
          <Text style={styles.title} className="text-black">Take Photo</Text>
          
          <View style={styles.headerSpacer} />
        </View> */}

        <View className="mx-4 flex-row items-center justify-between bg-white rounded-md h-12 px-2">
          <TouchableOpacity
            onPress={handleClose}
            className="w-10 h-10 justify-center items-center"
            accessibilityLabel="Close camera"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <View className="absolute left-0 right-0 items-center">
            <Text className="text-black text-base font-semibold">
              Take Photo
            </Text>
          </View>
          <View className="w-10" /> {/* spacer same size as back button */}
        </View>
      </SafeAreaView>

      {/* Masked overlay with circle cutout */}
      <MaskedView
        style={styles.maskedView}
        maskElement={
          <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
            <Rect
              x="0"
              y="0"
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              fill="white"
            />
            <Circle
              cx={circleViewport.x}
              cy={circleViewport.y}
              r={circleViewport.radius}
              fill="black"
            />
          </Svg>
        }
      >
        <View style={styles.maskOverlay} />
      </MaskedView>

      {/* Camera viewport */}
      <View
        style={[
          styles.cameraViewport,
          {
            top: circleViewport.top,
            left: circleViewport.left,
            width: circleViewport.diameter,
            height: circleViewport.diameter,
            borderRadius: circleViewport.radius,
          },
        ]}
      >
        <CameraView
          style={styles.camera}
          facing={cameraState.facing}
          flash={cameraState.flashMode}
          ref={cameraRef}
        />
      </View>

      {/* Circle border */}
      <View
        pointerEvents="none"
        style={[
          styles.circleBorder,
          {
            top: circleViewport.top,
            left: circleViewport.left,
            width: circleViewport.diameter,
            height: circleViewport.diameter,
            borderRadius: circleViewport.radius,
          },
        ]}
      />

      {/* Controls overlay */}
      <View style={styles.controlsOverlay} pointerEvents="box-none">
        <View style={styles.topControls} />

        <View style={styles.spacer} />

        <SafeAreaView>
          <View style={styles.bottomControls}>
            {/* Flash toggle */}
            <TouchableOpacity
              onPress={handleToggleFlash}
              style={styles.controlButton}
              accessibilityLabel={`Flash ${
                cameraState.flashMode === "off" ? "off" : "on"
              }`}
              accessibilityRole="button"
            >
              <Ionicons
                name={cameraState.flashMode === "off" ? "flash-off" : "flash"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            {/* Capture button */}
            <TouchableOpacity
              onPress={handleTakePicture}
              style={[
                styles.captureButton,
                cameraState.isCapturing && styles.captureButtonDisabled,
              ]}
              disabled={cameraState.isCapturing}
              accessibilityLabel="Take photo"
              accessibilityRole="button"
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            {/* Camera flip */}
            <TouchableOpacity
              onPress={handleToggleCameraFacing}
              style={styles.controlButton}
              accessibilityLabel={`Switch to ${
                cameraState.facing === "back" ? "front" : "back"
              } camera`}
              accessibilityRole="button"
            >
              <Ionicons name="camera-reverse-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  permissionIcon: {
    marginBottom: 24,
  },
  permissionTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  permissionMessage: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "white",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
  },
  permissionButtonText: {
    color: "black",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headerSpacer: {
    width: 40,
  },
  maskedView: {
    flex: 1,
  },
  maskOverlay: {
    flex: 1,
    backgroundColor: "black",
  },
  cameraViewport: {
    position: "absolute",
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  circleBorder: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
  },
  controlsOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topControls: {
    height: 60,
  },
  spacer: {
    flex: 1,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  controlButton: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    padding: 12,
    minWidth: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#ddd",
  },
});

export default CustomCamera;
