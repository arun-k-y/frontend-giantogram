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
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import CustomCamera from "./components/CustomCamera";
import BackButton from "./components/BackButton";
import * as FileSystem from "expo-file-system";

// Constants
const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=random";
const baseUrl = "http://localhost:2001";

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
  // const uploadImage = useCallback(
  //   async (isUpdate = false) => {
  //     if (!image?.uri) {
  //       Alert.alert("No Image", "Please select an image first.");
  //       return;
  //     }

  //     setUploading(true);
  //     setUploadError(null);
  //     clearUploadTimeout();

  //     // Set upload timeout
  //     uploadTimeoutRef.current = setTimeout(() => {
  //       setUploading(false);
  //       setUploadError("Upload timeout. Please try again.");
  //       Alert.alert(
  //         "Upload Timeout",
  //         "The upload is taking too long. Please check your connection and try again."
  //       );
  //     }, 30000); // 30 second timeout

  //     try {
  //       const formData = new FormData();

  //       // Extract filename and type
  //       const uriParts = image.uri.split("/");
  //       const filename =
  //         uriParts[uriParts.length - 1] || `profile_${Date.now()}.jpg`;
  //       const fileType = image.type || "image/jpeg";

  //       formData.append("profilePicture", {
  //         uri: image.uri,
  //         name: filename,
  //         type: fileType,
  //       } as any);

  //       if (isUpdate) {
  //         formData.append("isUpdate", "true");
  //       }

  //       const token = await AsyncStorage.getItem("userToken");
  //       if (!token) {
  //         throw new Error("Authentication required. Please log in again.");
  //       }

  //       const response = await fetch(`${baseUrl}/api/auth/upload-profile`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       });

  //       clearUploadTimeout();

  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({}));
  //         throw new Error(
  //           errorData.message || `Upload failed with status ${response.status}`
  //         );
  //       }

  //       const data = await response.json();
  //       const uploadedUrl = data?.url || data?.profilePicture || preview;

  //       // Success callbacks
  //       onUpload?.(uploadedUrl);
  //       setImage(null);
  //       setCurrentScreen(SCREENS.CONFIRMATION);
  //     } catch (error: any) {
  //       console.error("Upload error:", error);
  //       const errorMessage =
  //         error.message || "Upload failed. Please try again.";
  //       setUploadError(errorMessage);
  //       Alert.alert("Upload Failed", errorMessage);
  //     } finally {
  //       setUploading(false);
  //       clearUploadTimeout();
  //     }
  //   },
  //   [image, preview, onUpload, clearUploadTimeout, setUploading, setUploadError]
  // );

  // const uploadImage = useCallback(
  //   async (isUpdate = false) => {
  //     if (!image?.uri) {
  //       Alert.alert("No Image", "Please select an image first.");
  //       return;
  //     }

  //     console.log("📤 Starting image upload...");
  //     setUploading(true);
  //     setUploadError(null);
  //     clearUploadTimeout();

  //     // Set timeout fallback
  //     uploadTimeoutRef.current = setTimeout(() => {
  //       setUploading(false);
  //       setUploadError("Upload timeout. Please try again.");
  //       Alert.alert(
  //         "Upload Timeout",
  //         "The upload is taking too long. Please check your connection and try again."
  //       );
  //     }, 30000); // 30 seconds

  //     try {
  //       // Extract filename and MIME type
  //       const uriParts = image.uri.split("/");
  //       const filename =
  //         uriParts[uriParts.length - 1] || `profile_${Date.now()}.jpg`;
  //       const mimeType = image.mimeType || "image/jpeg";

  //       // Read file as base64
  //       const base64Image = await FileSystem.readAsStringAsync(image.uri, {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });

  //       console.log("📦 Read image as base64.");

  //       const formData = new FormData();
  //       formData.append("profilePicture", {
  //         uri: image.uri,
  //         name: filename,
  //         type: mimeType,
  //       } as any);

  //       if (isUpdate) {
  //         formData.append("isUpdate", "true");
  //       }

  //       const token = await AsyncStorage.getItem("userToken");
  //       if (!token) {
  //         throw new Error("Authentication required. Please log in again.");
  //       }

  //       console.log("🔑 Retrieved token:", token);
  //       console.log(
  //         "🌐 Sending request to:",
  //         `${baseUrl}/api/auth/upload-profile`
  //       );

  //       const response = await fetch(`${baseUrl}/api/auth/upload-profile`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           // ⚠️ Do NOT set Content-Type manually with FormData
  //         },
  //         body: formData,
  //       });

  //       const res = await response.json()

  //       if(res){
  //         console.log("result.....", res)
  //       }
  //       clearUploadTimeout();
  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({}));
  //         throw new Error(
  //           errorData.message || `Upload failed with status ${response.status}`
  //         );
  //       }

  //       const data = await response.json();
  //       const uploadedUrl = data?.url || data?.profilePicture || preview;

  //       console.log("✅ Upload success:", uploadedUrl);

  //       onUpload?.(uploadedUrl);
  //       setImage(null);
  //       setCurrentScreen(SCREENS.CONFIRMATION);
  //     } catch (error: any) {
  //       console.error("❌ Upload error:", error);
  //       const errorMessage =
  //         error.message || "Upload failed. Please try again.";
  //       setUploadError(errorMessage);
  //       Alert.alert("Upload Failed", errorMessage);
  //     } finally {
  //       setUploading(false);
  //       clearUploadTimeout();
  //     }
  //   },
  //   [image, preview, onUpload, clearUploadTimeout, setUploading, setUploadError]
  // );

  const uploadImage = useCallback(
    async (isUpdate = false) => {
      if (!image?.uri) {
        Alert.alert("No Image", "Please select an image first.");
        return;
      }

      try {
        console.log("🟡 Starting image upload...");
        setUploading(true);
        setUploadError(null);
        clearUploadTimeout();

        const token = await AsyncStorage.getItem("userToken");
        if (!token)
          throw new Error("Authentication required. Please log in again.");
        console.log("✅ Retrieved token:", token);

        // Convert local file URI to a Cloudinary-compatible file
        const fileUri = image.uri;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        if (!fileInfo.exists) throw new Error("File does not exist");

        const formData = new FormData();
        const filename =
          fileUri.split("/").pop() || `profile_${Date.now()}.jpg`;
        const fileType = "image/jpeg";

        formData.append("profilePicture", {
          uri: fileUri,
          name: filename,
          type: fileType,
        } as any);

        if (isUpdate) {
          formData.append("isUpdate", "true");
        }

        console.log(
          "📤 Sending request to:",
          `${baseUrl}/api/auth/upload-profile`
        );

        const response = await fetch(`${baseUrl}/api/auth/upload-profile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // Do not set Content-Type manually — let fetch set it for FormData
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Upload failed with status ${response.status}`
          );
        }

        const data = await response.json();
        console.log("✅ Upload result:", data);

        const uploadedUrl = data?.url || data?.profilePicture || preview;
        onUpload?.(uploadedUrl);
        setImage(null);
        setCurrentScreen(SCREENS.CONFIRMATION);
      } catch (error: any) {
        console.error("❌ Upload error:", error);
        setUploadError(error.message || "Upload failed. Please try again.");
        Alert.alert("Upload Failed", error.message || "Unknown error");
      } finally {
        setUploading(false);
        clearUploadTimeout();
      }
    },
    [image, preview, onUpload, clearUploadTimeout, setUploading, setUploadError]
  );

  //   const uploadImage = useCallback(
  //   async (isUpdate = false) => {
  //     if (!image?.uri) {
  //       Alert.alert("No Image", "Please select an image first.");
  //       console.log("Upload aborted: No image selected.");
  //       return;
  //     }

  //     setUploading(true);
  //     setUploadError(null);
  //     clearUploadTimeout();

  //     console.log("Starting image upload...");

  //     // Set upload timeout
  //     uploadTimeoutRef.current = setTimeout(() => {
  //       setUploading(false);
  //       setUploadError("Upload timeout. Please try again.");
  //       console.log("Upload timeout hit.");
  //       Alert.alert(
  //         "Upload Timeout",
  //         "The upload is taking too long. Please check your connection and try again."
  //       );
  //     }, 30000); // 30 seconds

  //     try {
  //       const formData = new FormData();

  //       // Extract filename and type
  //       const uriParts = image.uri.split("/");
  //       const filename =
  //         uriParts[uriParts.length - 1] || `profile_${Date.now()}.jpg`;
  //       const fileType = image.type || "image/jpeg";

  //       console.log("Image details:", {
  //         uri: image.uri,
  //         name: filename,
  //         type: fileType,
  //       });

  //       formData.append("profilePicture", {
  //         uri: image.uri,
  //         name: filename,
  //         type: fileType,
  //       } as any);

  //       if (isUpdate) {
  //         formData.append("isUpdate", "true");
  //         console.log("Appending isUpdate: true");
  //       }

  //       const token = await AsyncStorage.getItem("userToken");
  //       console.log("Retrieved token:", token);

  //       if (!token) {
  //         throw new Error("Authentication required. Please log in again.");
  //       }

  //       console.log("Sending request to:", `${baseUrl}/api/auth/upload-profile`);

  //       const response = await fetch(`${baseUrl}/api/auth/upload-profile`, {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: formData,
  //       });

  //       clearUploadTimeout();
  //       console.log("Response status:", response.status);

  //       if (!response.ok) {
  //         const errorData = await response.json().catch(() => ({}));
  //         console.log("Upload error response:", errorData);
  //         throw new Error(
  //           errorData.message || `Upload failed with status ${response.status}`
  //         );
  //       }

  //       const data = await response.json();
  //       const uploadedUrl = data?.url || data?.profilePicture || preview;

  //       console.log("Upload successful. Image URL:", uploadedUrl);

  //       onUpload?.(uploadedUrl);
  //       setImage(null);
  //       setCurrentScreen(SCREENS.CONFIRMATION);
  //     } catch (error: any) {
  //       console.error("Upload error:", error);
  //       const errorMessage =
  //         error.message || "Upload failed. Please try again.";
  //       setUploadError(errorMessage);
  //       Alert.alert("Upload Failed", errorMessage);
  //     } finally {
  //       setUploading(false);
  //       clearUploadTimeout();
  //     }
  //   },
  //   [image, preview, onUpload, clearUploadTimeout, setUploading, setUploadError]
  // );

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
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeContent}>
        {/* <Text style={styles.welcomeTitle}>Welcome to Giantogram</Text>
        <Text style={styles.welcomeSubtitle}>
          Platform that provides everything
        </Text> */}
        <Text className="text-white font-normal text-2xl">
          Welcome to Giantogram
        </Text>
        <Text className="text-white font-normal text-2xl mt-5 mb-6">
          Platform that provides everything
        </Text>

        <View style={styles.avatarContainer}>
          <Image
            source={require("../assets/images/profile-pic.jpg")}
            style={styles.avatar}
          />
        </View>

        {/* <Text style={styles.welcomeMessage}>
          You became the member of this network and you matter for us
        </Text> */}

        <Text className="text-white text-2xl font-normal mt-5">
          You became the member of this network and you matter for us
        </Text>
      </View>

      <View style={styles.buttonContainer}>
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
    </ScrollView>
  );

  const PreviewScreen = () => (
    <>
      <View style={styles.backButtonContainer}>
        <BackButton
          showTitle={false}
          onPress={() => setCurrentScreen("welcome")}
        />
      </View>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.previewContent}>
          <Text style={styles.title}>GIANTOGRAM</Text>

          <View style={styles.avatarContainer}>
            <Image source={{ uri: preview }} style={styles.avatar} />
          </View>

          {uploadState.error && (
            <Text style={styles.errorText}>{uploadState.error}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
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
        </View>
      </ScrollView>
    </>
  );

  const ConfirmationScreen = () => (
    <ScrollView
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.confirmationContent}>
        <Text style={styles.title}>GIANTOGRAM</Text>
        <Text style={styles.subtitle}>Welcome to Giantogram</Text>
        <Text style={styles.description}>
          Platform that provides everything
        </Text>

        <View style={styles.avatarContainer}>
          <Image source={{ uri: preview }} style={styles.avatar} />
        </View>

        <Text style={styles.confirmationMessage}>
          Profile picture updated successfully! You&apos;re all set to continue.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
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
    </ScrollView>
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
      {renderCurrentScreen()}

      {/* Navigation indicator - only show on certain screens */}
      {(currentScreen === SCREENS.WELCOME ||
        currentScreen === SCREENS.CONFIRMATION) && (
        <View style={styles.indicatorContainer}>
          <View style={styles.indicator} />
        </View>
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 100, // Extra space for indicator
  },
  welcomeContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Dimensions.get("window").height * 0.6,
  },
  previewContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Dimensions.get("window").height * 0.5,
  },
  confirmationContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: Dimensions.get("window").height * 0.6,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButtonContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: 999,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
    textAlign: "center",
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
  welcomeTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: 32,
  },
  avatarContainer: {
    width: 200, // Reduced from 255 for smaller screens
    height: 200, // Reduced from 255 for smaller screens
    borderRadius: 42,
    backgroundColor: "#374151",
    marginBottom: 24,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderColor: "#808080",
    borderWidth: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  welcomeMessage: {
    color: "white",
    fontSize: 24,
    fontWeight: "normal",
    textAlign: "center",
    lineHeight: 32,
    paddingHorizontal: 16,
  },
  confirmationMessage: {
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
    maxWidth: 500,
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
    maxWidth: 500,
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
    bottom: 30,
    left: "50%",
    transform: [{ translateX: -64 }],
  },
  indicator: {
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
});
