import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
  BackHandler,
} from "react-native";
import {
  Camera,
  Search,
  Send,
  Home,
  Headphones,
  Radio,
  Youtube,
  Triangle,
  Target,
  User,
  Edit3,
  Trash2,
  Upload,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function HomePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState("");
  const handleProfilePress = () => {
    setShowProfileModal(true);
  };

  const handleUpdateProfile = () => {
    // Simulate image picker
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => simulateImageUpdate("camera") },
      { text: "Gallery", onPress: () => simulateImageUpdate("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
    setShowProfileModal(false);
  };

  const simulateImageUpdate = (source: any) => {
    // Simulate image selection
    const mockImageUrl =
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
    setProfileImage(mockImageUrl);
    Alert.alert("Success", `Profile picture updated from ${source}`);
  };

  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile Picture",
      "Are you sure you want to delete your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setProfileImage(null);
            Alert.alert("Deleted", "Profile picture has been removed");
          },
        },
      ]
    );
    setShowProfileModal(false);
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
          {
            text: "Cancel",

            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Exit",
            onPress: () => BackHandler.exitApp(),
            style: "default",
          },
        ]);

        return true;
      };
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress
      );

      return () => subscription.remove();
    }, [])
  );

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log("No token found, please login.");
        return;
      }

      const res = await fetch(`http://localhost:2001/api/auth/protected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error:", errorData.message || "Failed to fetch user data");
        return;
      }

      const data = await res.json();
      console.log("Fetched User:", data);
      setUsername(data.user.username);

      const imageUrl = data?.user?.profilePicture
        ? `http://localhost:2001${data.user.profilePicture}`
        : null;

      setProfileImage(imageUrl);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const navigationIcons = [
    { icon: Home, label: "Home" },
    { icon: Headphones, label: "Audio" },
    { icon: Radio, label: "Radio" },
    { icon: Youtube, label: "Video" },
    { icon: Triangle, label: "Play" },
    { icon: Target, label: "Target" },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Giantogram</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Target color="#ffffff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Camera color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <Text style={styles.brandName}>{username || "GIANTOGRAM"}</Text>

            <TouchableOpacity
              onPress={handleProfilePress}
              style={styles.profileImageContainer}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <User color="#666666" size={40} />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Camera color="#ffffff" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Search color="#ffffff" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Send color="#ffffff" size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Additional Content Space */}
        <View style={styles.contentSpace}>
          <Text style={styles.welcomeText}>Welcome to GIANTOGRAM</Text>
          <Text style={styles.subtitleText}>
            Your social media experience starts here
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {navigationIcons.map((item, index) => (
          <TouchableOpacity key={index} style={styles.navItem}>
            <item.icon color="#ffffff" size={24} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile Options</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateProfile}
            >
              <Upload color="#4CAF50" size={20} />
              <Text style={[styles.modalButtonText, { color: "#4CAF50" }]}>
                Update Picture
              </Text>
            </TouchableOpacity>

            {profileImage && (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDeleteProfile}
              >
                <Trash2 color="#F44336" size={20} />
                <Text style={[styles.modalButtonText, { color: "#F44336" }]}>
                  Delete Picture
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Modal,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import {
//   Camera,
//   Search,
//   Send,
//   Home,
//   Headphones,
//   Radio,
//   Youtube,
//   Triangle,
//   Target,
//   User,
//   Trash2,
//   Upload,
// } from "lucide-react-native";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function HomePage() {
//   const [profileImage, setProfileImage] = useState(null);
//   const [showProfileModal, setShowProfileModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     loadUserProfile();
//     requestPermissions();
//   }, []);

//   const requestPermissions = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission denied", "We need access to your gallery.");
//     }
//   };

//   const loadUserProfile = async () => {
//     try {
//       const token = await AsyncStorage.getItem("authToken");
//       if (!token) return;

//       const response = await fetch("/api/user/profile", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (response.ok && data.profilePicture) {
//         setProfileImage(data.profilePicture);
//       }
//     } catch (error) {
//       console.error("Profile fetch error:", error);
//     }
//   };

//   const handleProfilePress = () => {
//     setShowProfileModal(true);
//   };

//   const handleUpdateProfile = () => {
//     Alert.alert("Select Image", "Choose source", [
//       { text: "Camera", onPress: pickImageFromCamera },
//       { text: "Gallery", onPress: pickImageFromGallery },
//       { text: "Cancel", style: "cancel" },
//     ]);
//     setShowProfileModal(false);
//   };

//   const pickImageFromCamera = async () => {
//     const { status } = await ImagePicker.requestCameraPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission denied", "Camera access is required.");
//       return;
//     }
//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       uploadProfilePicture(result.assets[0]);
//     }
//   };

//   const pickImageFromGallery = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.8,
//     });

//     if (!result.canceled) {
//       uploadProfilePicture(result.assets[0]);
//     }
//   };

//   const uploadProfilePicture = async (imageAsset) => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("authToken");
//       if (!token) throw new Error("Missing auth token");

//       const formData = new FormData();
//       formData.append("profilePicture", {
//         uri: imageAsset.uri,
//         name: "profile.jpg",
//         type: "image/jpeg",
//       });

//       const response = await fetch("/api/upload-profile", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setProfileImage(data.profilePicture);
//         Alert.alert("Success", "Profile picture updated");
//       } else {
//         throw new Error(data.message || "Upload failed");
//       }
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteProfile = () => {
//     Alert.alert("Delete Picture?", "Confirm delete", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: deleteProfilePicture },
//     ]);
//     setShowProfileModal(false);
//   };

//   const deleteProfilePicture = async () => {
//     setLoading(true);
//     try {
//       const token = await AsyncStorage.getItem("authToken");
//       if (!token) throw new Error("Missing auth token");

//       const response = await fetch("/api/delete-profile-picture", {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setProfileImage(null);
//         Alert.alert("Deleted", "Profile picture removed");
//       } else {
//         throw new Error(data.message || "Delete failed");
//       }
//     } catch (err) {
//       Alert.alert("Error", err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navigationIcons = [
//     { icon: Home, label: "Home" },
//     { icon: Headphones, label: "Audio" },
//     { icon: Radio, label: "Radio" },
//     { icon: Youtube, label: "Video" },
//     { icon: Triangle, label: "Play" },
//     { icon: Target, label: "Target" },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>HomePage</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Target color="#ffffff" size={20} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <Camera color="#ffffff" size={20} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Scroll content */}
//       <ScrollView style={styles.content}>
//         <View style={styles.profileCard}>
//           <Text style={styles.brandName}>GIANTOGRAM</Text>
//           <TouchableOpacity
//             onPress={handleProfilePress}
//             style={styles.profileImageContainer}
//             disabled={loading}
//           >
//             {profileImage ? (
//               <Image
//                 source={{ uri: profileImage }}
//                 style={styles.profileImage}
//               />
//             ) : (
//               <View style={styles.profilePlaceholder}>
//                 <User color="#666666" size={40} />
//               </View>
//             )}
//             {loading && (
//               <ActivityIndicator
//                 style={styles.loadingOverlay}
//                 size="small"
//                 color="#fff"
//               />
//             )}
//           </TouchableOpacity>
//           <View style={styles.profileActions}>
//             <TouchableOpacity style={styles.actionButton}>
//               <Camera color="#ffffff" size={18} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Search color="#ffffff" size={18} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.actionButton}>
//               <Send color="#ffffff" size={18} />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Intro Text */}
//         <View style={styles.contentSpace}>
//           <Text style={styles.welcomeText}>Welcome to GIANTOGRAM</Text>
//           <Text style={styles.subtitleText}>
//             Your social media experience starts here
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom nav */}
//       <View style={styles.bottomNav}>
//         {navigationIcons.map((item, index) => (
//           <TouchableOpacity key={index} style={styles.navItem}>
//             <item.icon color="#ffffff" size={24} />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Modal */}
//       <Modal
//         visible={showProfileModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowProfileModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Profile Options</Text>

//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={handleUpdateProfile}
//               disabled={loading}
//             >
//               <Upload color="#4CAF50" size={20} />
//               <Text style={[styles.modalButtonText, { color: "#4CAF50" }]}>
//                 {loading ? "Uploading..." : "Update Picture"}
//               </Text>
//             </TouchableOpacity>

//             {profileImage && (
//               <TouchableOpacity
//                 style={styles.modalButton}
//                 onPress={handleDeleteProfile}
//                 disabled={loading}
//               >
//                 <Trash2 color="#F44336" size={20} />
//                 <Text style={[styles.modalButtonText, { color: "#F44336" }]}>
//                   {loading ? "Deleting..." : "Delete Picture"}
//                 </Text>
//               </TouchableOpacity>
//             )}

//             <TouchableOpacity
//               style={[styles.modalButton, styles.cancelButton]}
//               onPress={() => setShowProfileModal(false)}
//               disabled={loading}
//             >
//               <Text style={styles.modalButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#2a2a2a",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    marginTop: 40,
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "#000000",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
  },
  brandName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
    letterSpacing: 2,
  },
  profileImageContainer: {
    marginBottom: 25,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profilePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#444444",
  },
  profileActions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333333",
    justifyContent: "center",
    alignItems: "center",
  },
  contentSpace: {
    marginTop: 40,
    alignItems: "center",
    paddingBottom: 100,
  },
  welcomeText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleText: {
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingVertical: 15,
    paddingBottom: 30,
  },
  navItem: {
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 20,
    padding: 30,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#333333",
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  cancelButton: {
    backgroundColor: "#444444",
    marginTop: 10,
  },
});
