

// import React, { useRef, useState } from "react";
// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import {
//   useCameraPermissions,
//   CameraType,
//   CameraView,
// } from "expo-camera";
// import Svg, { Defs, Mask, Rect, Circle } from "react-native-svg";

// const { width } = Dimensions.get("window");
// const CIRCLE_DIAMETER = width * 0.7;

// export default function CircularCameraScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const cameraRef = useRef(null);

//   // Dynamically measure camera container height
//   const [containerHeight, setContainerHeight] = useState(0);

//   if (!permission) return <View />;
//   if (!permission.granted)
//     return (
//       <View style={styles.container}>
//         <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
//           No access to camera
//         </Text>
//         <TouchableOpacity
//           style={styles.captureButton}
//           onPress={requestPermission}
//         >
//           <Text style={{ color: "#fff", fontSize: 16 }}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );

//   return (
//     <View
//       style={styles.container}
//       onLayout={(e) => {
//         setContainerHeight(e.nativeEvent.layout.height);
//       }}
//     >
//       <CameraView
//         ref={cameraRef}
//         style={StyleSheet.absoluteFill}
//         // facing={CameraType.back}
//       />

//       {/* Overlay with dynamic centered circular cutout */}
//       {containerHeight > 0 && (
//         <Svg height={containerHeight} width={width} style={StyleSheet.absoluteFill}>
//           <Defs>
//             <Mask id="mask">
//               {/* Full visible background */}
//               <Rect x="0" y="0" width={width} height={containerHeight} fill="white" />
//               {/* Transparent circle at center of the container */}
//               <Circle
//                 cx={width / 2}
//                 cy={containerHeight / 2}
//                 r={CIRCLE_DIAMETER / 2}
//                 fill="black"
//               />
//             </Mask>
//           </Defs>

//           <Rect
//             x="0"
//             y="0"
//             width={width}
//             height={containerHeight}
//             fill="black"
//             opacity={0.6}
//             mask="url(#mask)"
//           />
//         </Svg>
//       )}

//       {/* Capture Button */}
//       <TouchableOpacity style={styles.captureButton}>
//         <Text style={{ color: "#fff", fontSize: 16 }}>Capture</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   captureButton: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//     backgroundColor: "#000",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderColor: "#fff",
//     borderWidth: 1,
//   },
// });


// import React, { useRef, useState } from "react";
// import {
//   Dimensions,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Image,
//   Alert,
// } from "react-native";
// import {
//   useCameraPermissions,
//   CameraView,
// } from "expo-camera";
// import * as ImagePicker from "expo-image-picker";
// import Svg, { Defs, Mask, Rect, Circle } from "react-native-svg";

// const { width } = Dimensions.get("window");
// const CIRCLE_DIAMETER = width * 0.7;

// export default function CircularCameraScreen() {
//   const [permission, requestPermission] = useCameraPermissions();
//   const [containerHeight, setContainerHeight] = useState(0);
//   const [pickedImage, setPickedImage] = useState(null);

//   const cameraRef = useRef(null);

//   if (!permission) return <View />;
//   if (!permission.granted)
//     return (
//       <View style={styles.container}>
//         <Text style={styles.permissionText}>No access to camera</Text>
//         <TouchableOpacity
//           style={styles.captureButton}
//           onPress={requestPermission}
//         >
//           <Text style={styles.buttonText}>Grant Permission</Text>
//         </TouchableOpacity>
//       </View>
//     );

//   const pickImageFromLibrary = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission needed", "We need access to your photo library.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setPickedImage(result.assets[0].uri);
//     }
//   };

//   return (
//     <View
//       style={styles.container}
//       onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
//     >
//       <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

//       {containerHeight > 0 && (
//         <Svg height={containerHeight} width={width} style={StyleSheet.absoluteFill}>
//           <Defs>
//             <Mask id="mask">
//               <Rect width={width} height={containerHeight} fill="white" />
//               <Circle
//                 cx={width / 2}
//                 cy={containerHeight / 2}
//                 r={CIRCLE_DIAMETER / 2}
//                 fill="black"
//               />
//             </Mask>
//           </Defs>
//           <Rect
//             width={width}
//             height={containerHeight}
//             fill="black"
//             opacity={0.6}
//             mask="url(#mask)"
//           />
//         </Svg>
//       )}

//       {/* If image is picked, show preview */}
//       {pickedImage && (
//         <Image
//           source={{ uri: pickedImage }}
//           style={styles.previewImage}
//           resizeMode="cover"
//         />
//       )}

//       {

//       }

//       <View style={styles.buttonsContainer}>
//         <TouchableOpacity style={styles.captureButton}>
//           <Text style={styles.buttonText}>Capture</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.captureButton, { backgroundColor: "#222" }]}
//           onPress={pickImageFromLibrary}
//         >
//           <Text style={styles.buttonText}>Pick from Gallery</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "black",
//   },
//   permissionText: {
//     color: "#fff",
//     textAlign: "center",
//     marginTop: 40,
//   },
//   captureButton: {
//     backgroundColor: "#000",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderColor: "#fff",
//     borderWidth: 1,
//     marginBottom: 16,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//   },
//   buttonsContainer: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//     alignItems: "center",
//   },
//   previewImage: {
//     position: "absolute",
//     top: 100,
//     left: width / 4,
//     width: width / 2,
//     height: width / 2,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
// });



import React, { useRef, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import {
  useCameraPermissions,
  CameraView,
} from "expo-camera";
import Svg, { Defs, Mask, Rect, Circle } from "react-native-svg";
import CustomGalleryScreen from "./components/CustomGallery";

const { width } = Dimensions.get("window");
const CIRCLE_DIAMETER = width * 0.7;

export default function CircularCameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [containerHeight, setContainerHeight] = useState(0);
  const [pickedImage, setPickedImage] = useState(null);
  const [showGallery, setShowGallery] = useState(false); // ← toggle gallery

  const cameraRef = useRef(null);

  if (!permission) return <View />;
  if (!permission.granted)
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity
          style={styles.captureButton}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View
      style={styles.container}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

      {containerHeight > 0 && (
        <Svg height={containerHeight} width={width} style={StyleSheet.absoluteFill}>
          <Defs>
            <Mask id="mask">
              <Rect width={width} height={containerHeight} fill="white" />
              <Circle
                cx={width / 2}
                cy={containerHeight / 2}
                r={CIRCLE_DIAMETER / 2}
                fill="black"
              />
            </Mask>
          </Defs>
          <Rect
            width={width}
            height={containerHeight}
            fill="black"
            opacity={0.6}
            mask="url(#mask)"
          />
        </Svg>
      )}

      {pickedImage && (
        <Image
          source={{ uri: pickedImage }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      )}

      {showGallery && (
        <CustomGalleryScreen
          onSelect={(uri) => {
            setPickedImage(uri);
            setShowGallery(false);
          }}
          onClose={() => setShowGallery(false)}
        />
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.captureButton}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, { backgroundColor: "#222" }]}
          onPress={() => setShowGallery(true)}
        >
          <Text style={styles.buttonText}>Pick from Gallery</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 40,
  },
  captureButton: {
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
  },
  previewImage: {
    position: "absolute",
    top: 100,
    left: width / 4,
    width: width / 2,
    height: width / 2,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
  },
});

