// import React, { useState, useRef, useCallback, useMemo } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Alert,
//   SafeAreaView,
//   Image,
// } from "react-native";
// import { CameraView, useCameraPermissions } from "expo-camera";
// import * as MediaLibrary from "expo-media-library";
// import MaskedView from "@react-native-masked-view/masked-view";
// import Svg, { Rect, Circle } from "react-native-svg";
// import { ArrowLeft, Camera } from "lucide-react-native";

// // Constants
// const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// const CIRCLE_RATIO = 0.8;
// const CAPTURE_QUALITY = 0.8;

// // Types
// interface CustomCameraProps {
//   onPhotoTaken?: (uri: string) => void;
//   onClose?: () => void;
// }

// type CameraFacing = "front" | "back";
// type FlashMode = "off" | "on";

// interface CameraState {
//   facing: CameraFacing;
//   flashMode: FlashMode;
//   isCapturing: boolean;
// }

// // Component
// const CustomCamera: React.FC<CustomCameraProps> = ({
//   onPhotoTaken,
//   onClose,
// }) => {
//   // State
//   const [cameraState, setCameraState] = useState<CameraState>({
//     facing: "back",
//     flashMode: "off",
//     isCapturing: false,
//   });

//   // Refs
//   const cameraRef = useRef<CameraView>(null);

//   // Hooks
//   const [permission, requestPermission] = useCameraPermissions();

//   // Memoized values
//   const [layoutHeight, setLayoutHeight] = useState(SCREEN_HEIGHT); // fallback if layout not measured yet

//   const circleViewport = useMemo(() => {
//     const diameter = SCREEN_WIDTH * CIRCLE_RATIO;
//     const x = SCREEN_WIDTH / 2;
//     const y = layoutHeight / 2.3;

//     return {
//       diameter,
//       x,
//       y,
//       radius: diameter / 2,
//       top: y - diameter / 2,
//       left: x - diameter / 2,
//     };
//   }, [layoutHeight]);

//   // Callbacks
//   const handleTakePicture = useCallback(async () => {
//     if (!cameraRef.current || cameraState.isCapturing) return;

//     setCameraState((prev) => ({ ...prev, isCapturing: true }));

//     try {
//       const photo = await cameraRef.current.takePictureAsync({
//         quality: CAPTURE_QUALITY,
//       });

//       // Save to library
//       await MediaLibrary.saveToLibraryAsync(photo.uri);

//       // Notify parent component
//       onPhotoTaken?.(photo.uri);
//     } catch (error) {
//       console.error("Camera error:", error);
//       Alert.alert("Error", "Failed to take picture. Please try again.", [
//         { text: "OK" },
//       ]);
//     } finally {
//       setCameraState((prev) => ({ ...prev, isCapturing: false }));
//     }
//   }, [cameraState.isCapturing, onPhotoTaken]);

//   const handleToggleCameraFacing = useCallback(() => {
//     setCameraState((prev) => ({
//       ...prev,
//       facing: prev.facing === "back" ? "front" : "back",
//     }));
//   }, []);

//   const handleToggleFlash = useCallback(() => {
//     setCameraState((prev) => ({
//       ...prev,
//       flashMode: prev.flashMode === "off" ? "on" : "off",
//     }));
//   }, []);

//   const handleClose = useCallback(() => {
//     onClose?.();
//   }, [onClose]);

//   const handleRequestPermission = useCallback(async () => {
//     try {
//       await requestPermission();
//     } catch (error) {
//       console.error("Permission request error:", error);
//       Alert.alert(
//         "Permission Error",
//         "Unable to request camera permission. Please check your settings.",
//         [{ text: "OK" }]
//       );
//     }
//   }, [requestPermission]);

//   // Render permission screen
//   if (!permission) {
//     return (
//       <SafeAreaView style={styles.container}>
//         {/* <StatusBar barStyle="light-content" backgroundColor="black" /> */}
//         <View style={styles.loadingContainer}>
//           <Text style={styles.loadingText}>Loading camera...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!permission.granted) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.permissionContainer}>
//           <Camera size={64} color="white" style={styles.permissionIcon} />
//           <Text style={styles.permissionTitle}>Camera Access Required</Text>
//           <Text style={styles.permissionMessage}>
//             We need camera permission to take photos
//           </Text>
//           <TouchableOpacity
//             onPress={handleRequestPermission}
//             style={styles.permissionButton}
//             accessibilityLabel="Grant camera permission"
//             accessibilityRole="button"
//           >
//             <Text style={styles.permissionButtonText}>Grant Permission</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // Main camera view
//   return (
//     <View
//       onLayout={(e) => {
//         setLayoutHeight(e.nativeEvent.layout.height);
//       }}
//       style={styles.container}
//     >
//       {/* <StatusBar barStyle="light-content" backgroundColor="black" /> */}

//       {/* Header */}
//       <View className="mx-4 mt-5 flex-row items-center justify-between bg-white rounded-lg h-14 px-2">
//         <TouchableOpacity
//           onPress={handleClose}
//           className="w-10 h-10 justify-center items-center"
//           accessibilityLabel="Close camera"
//           accessibilityRole="button"
//         >
//           <ArrowLeft size={20} color={"black"} />
//         </TouchableOpacity>
//         <View className="absolute left-0 right-0 items-center">
//           <Text className="text-black text-base font-semibold">Take Photo</Text>
//         </View>
//         <View className="w-10" />
//       </View>

//       {/* Masked overlay with circle cutout */}
//       <MaskedView
//         style={styles.maskedView}
//         maskElement={
//           <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT}>
//             <Rect
//               x="0"
//               y="0"
//               width={SCREEN_WIDTH}
//               height={SCREEN_HEIGHT}
//               fill="white"
//             />
//             <Circle
//               cx={circleViewport.x}
//               cy={circleViewport.y}
//               r={circleViewport.radius}
//               fill="black"
//             />
//           </Svg>
//         }
//       >
//         <View style={styles.maskOverlay} />
//       </MaskedView>

//       {/* Camera viewport */}
//       <View
//         style={[
//           styles.cameraViewport,
//           {
//             top: circleViewport.top,
//             left: circleViewport.left,
//             width: circleViewport.diameter,
//             height: circleViewport.diameter,
//             borderRadius: circleViewport.radius,
//           },
//         ]}
//       >
//         <CameraView
//           style={styles.camera}
//           facing={cameraState.facing}
//           flash={cameraState.flashMode}
//           ref={cameraRef}
//         />
//       </View>

//       {/* Circle border */}
//       <View
//         pointerEvents="none"
//         style={[
//           styles.circleBorder,
//           {
//             top: circleViewport.top,
//             left: circleViewport.left,
//             width: circleViewport.diameter,
//             height: circleViewport.diameter,
//             borderRadius: circleViewport.radius,
//           },
//         ]}
//       />

//       {/* Controls overlay */}
//       <View style={styles.controlsOverlay} pointerEvents="box-none">
//         <View style={styles.topControls} />

//         <View style={styles.spacer} />

//         <SafeAreaView>
//           <View style={styles.bottomControls}>
//             {/* Camera flip */}
//             <TouchableOpacity
//               onPress={handleToggleCameraFacing}
//               style={styles.controlButton}
//               accessibilityLabel={`Flash ${
//                 cameraState.flashMode === "off" ? "off" : "on"
//               }`}
//               accessibilityRole="button"
//             >
//               <Image
//                 className="w-10 h-10"
//                 source={require("../../assets/images/camera-switch.png")}
//               />
//             </TouchableOpacity>

//             {/* Capture button */}
//             <TouchableOpacity
//               onPress={handleTakePicture}
//               style={[
//                 styles.captureButton,
//                 cameraState.isCapturing && styles.captureButtonDisabled,
//               ]}
//               disabled={cameraState.isCapturing}
//               accessibilityLabel="Take photo"
//               accessibilityRole="button"
//             >
//               <View style={styles.captureButtonInner} />
//             </TouchableOpacity>

//             {/* Flash toggle */}
//             <TouchableOpacity
//               onPress={handleToggleFlash}
//               style={styles.controlButton}
//               accessibilityLabel={`Switch to ${
//                 cameraState.facing === "back" ? "front" : "back"
//               } camera`}
//               accessibilityRole="button"
//             >
//               {cameraState.flashMode === "off" ? (
//                 <Image
//                   className="w-10 h-10"
//                   source={require("../../assets/images/no-flash.png")}
//                 />
//               ) : (
//                 <Image
//                   className="w-10 h-10"
//                   source={require("../../assets/images/flash.png")}
//                 />
//               )}
//             </TouchableOpacity>
//           </View>
//         </SafeAreaView>
//       </View>
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     color: "white",
//     fontSize: 16,
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 40,
//   },
//   permissionIcon: {
//     marginBottom: 24,
//   },
//   permissionTitle: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 16,
//   },
//   permissionMessage: {
//     color: "rgba(255, 255, 255, 0.8)",
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 32,
//     lineHeight: 24,
//   },
//   permissionButton: {
//     backgroundColor: "white",
//     paddingHorizontal: 32,
//     paddingVertical: 16,
//     borderRadius: 12,
//     minWidth: 200,
//   },
//   permissionButtonText: {
//     color: "black",
//     textAlign: "center",
//     fontWeight: "600",
//     fontSize: 16,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   backButton: {
//     padding: 8,
//     borderRadius: 20,
//   },
//   title: {
//     color: "white",
//     fontSize: 18,
//     fontWeight: "bold",
//     letterSpacing: 1,
//   },
//   headerSpacer: {
//     width: 40,
//   },
//   maskedView: {
//     flex: 1,
//   },
//   maskOverlay: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   cameraViewport: {
//     position: "absolute",
//     overflow: "hidden",
//   },
//   camera: {
//     width: "100%",
//     height: "100%",
//   },
//   circleBorder: {
//     position: "absolute",
//     borderWidth: 12,
//     borderColor: "white",
//   },
//   controlsOverlay: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     top: 0,
//     flexDirection: "column",
//     justifyContent: "space-between",
//   },
//   topControls: {
//     height: 60,
//   },
//   spacer: {
//     flex: 1,
//   },
//   bottomControls: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     paddingHorizontal: 40,
//     paddingVertical: 24,
//   },
//   controlButton: {
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     borderRadius: 25,
//     padding: 12,
//     minWidth: 50,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   captureButton: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "white",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   captureButtonDisabled: {
//     opacity: 0.6,
//   },
//   captureButtonInner: {
//     width: 50,
//     height: 50,
//     borderRadius: 30,
//     backgroundColor: "black",
//     borderWidth: 2,
//   },
// });

// export default CustomCamera;

import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Rect, Circle } from "react-native-svg";
import { ArrowLeft, Camera } from "lucide-react-native";

// Constants
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CIRCLE_RATIO = 0.8;
const CAPTURE_QUALITY = 0.8;

// Types
interface CustomCameraProps {
  uploadState?: any;
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

const CustomCamera: React.FC<CustomCameraProps> = ({
  uploadState,
  onPhotoTaken,
  onClose,
}) => {
  const [cameraState, setCameraState] = useState<CameraState>({
    facing: "back",
    flashMode: "off",
    isCapturing: false,
  });

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [layoutHeight, setLayoutHeight] = useState(SCREEN_HEIGHT);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const circleViewport = useMemo(() => {
    const diameter = SCREEN_WIDTH * CIRCLE_RATIO;
    const x = SCREEN_WIDTH / 2;
    const y = layoutHeight / 2.3;
    return {
      diameter,
      x,
      y,
      radius: diameter / 2,
      top: y - diameter / 2,
      left: x - diameter / 2,
    };
  }, [layoutHeight]);

  const renderHeader = () => (
    <View className="mx-4 mt-5 flex-row items-center justify-between bg-white rounded-lg h-14 px-2">
      <TouchableOpacity
        onPress={handleClose}
        className="w-10 h-10 justify-center items-center"
      >
        <ArrowLeft size={20} color={"black"} />
      </TouchableOpacity>
      <View className="absolute left-0 right-0 items-center">
        <Text className="text-black text-base font-semibold">Take Photo</Text>
      </View>
    </View>
  );

  const handleTakePicture = useCallback(async () => {
    if (!cameraRef.current || cameraState.isCapturing) return;

    setCameraState((prev) => ({ ...prev, isCapturing: true }));

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: CAPTURE_QUALITY,
      });

      await MediaLibrary.saveToLibraryAsync(photo.uri);
      setPhotoUri(photo.uri); // set preview photo
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    } finally {
      setCameraState((prev) => ({ ...prev, isCapturing: false }));
    }
  }, [cameraState.isCapturing]);

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

  const handleRequestPermission = useCallback(async () => {
    try {
      await requestPermission();
    } catch (error) {
      console.error("Permission error:", error);
    }
  }, [requestPermission]);

  const handleClose = () => onClose?.();

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Camera size={64} color="white" style={styles.permissionIcon} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            We need camera permission to take photos
          </Text>
          <TouchableOpacity
            onPress={handleRequestPermission}
            style={styles.permissionButton}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ===============================
  // ========= PREVIEW UI =========
  // ===============================
  if (photoUri) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}

        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => {
                onPhotoTaken?.(photoUri);
              }}
              disabled={uploadState?.isUploading}
            >
              {uploadState?.isUploading ? (
                <ActivityIndicator size={24} color="#000000" />
              ) : (
                <Text style={styles.previewButtonText}>Set as Profile</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.previewButtonText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ===============================
  // ========= CAMERA UI ==========
  // ===============================
  return (
    <View
      onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
      style={styles.container}
    >
      {renderHeader()}

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

      <View style={styles.controlsOverlay}>
        <View style={styles.topControls} />
        <View style={styles.spacer} />
        <SafeAreaView>
          <View style={styles.bottomControls}>
            <TouchableOpacity
              onPress={handleToggleCameraFacing}
              style={styles.controlButton}
            >
              <Image
                source={require("../../assets/images/camera-switch.png")}
                style={{ width: 40, height: 40 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleTakePicture}
              disabled={cameraState.isCapturing}
              style={[
                styles.captureButton,
                cameraState.isCapturing && styles.captureButtonDisabled,
              ]}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleFlash}
              style={styles.controlButton}
            >
              <Image
                source={
                  cameraState.flashMode === "off"
                    ? require("../../assets/images/no-flash.png")
                    : require("../../assets/images/flash.png")
                }
                style={{ width: 40, height: 40 }}
              />
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
    borderWidth: 12,
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
    paddingHorizontal: 20,
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
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: "black",
    borderWidth: 2,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  previewImage: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    borderRadius: (SCREEN_WIDTH * 0.8) / 2,
    borderWidth: 12,
    borderColor: "white",
  },
  previewActions: {
    marginTop: 40,
    width: "80%",
    gap: 16,
  },
  previewButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  previewButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomCamera;
