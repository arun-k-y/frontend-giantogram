// import React, { useCallback, useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Modal,
//   ScrollView,
//   BackHandler,
// } from "react-native";
// import {
//   Camera,
//   Search,
//   SendIcon,
//   Home,
//   Headphones,
//   Radio,
//   Youtube,
//   Triangle,
//   Target,
//   LogOutIcon,
//   Edit3,
// } from "lucide-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useFocusEffect } from "@react-navigation/native";
// import { useRouter } from "expo-router";

// export default function HomePage() {
//   const [profileImage, setProfileImage] = useState(null);
//   const [username, setUsername] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState<
//     "deactivate" | "logout" | "reactivate" | "recovery"
//   >("logout");

//   const router = useRouter();
//   const baseUrl = "http://localhost:2001";

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       const handleBackPress = () => {
//         Alert.alert("Exit App", "Are you sure you want to exit?", [
//           { text: "Cancel", onPress: () => null, style: "cancel" },
//           { text: "Exit", onPress: () => BackHandler.exitApp() },
//         ]);
//         return true;
//       };

//       const subscription = BackHandler.addEventListener(
//         "hardwareBackPress",
//         handleBackPress
//       );

//       return () => subscription.remove();
//     }, [])
//   );

//   const fetchUserData = async () => {
//     try {
//       const token = await AsyncStorage.getItem("userToken");
//       if (!token) return;

//       const res = await fetch(`${baseUrl}/api/auth/protected`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         console.warn("User fetch error:", errorData.message);
//         return;
//       }

//       const data = await res.json();
//       setUsername(data.user.username || "GIANTOGRAM");
//       setProfileImage(data.user.profilePicture || null);
//     } catch (error) {
//       console.error("Fetch error:", error);
//     }
//   };

//   const confirmLogout = async () => {
//     try {
//       await AsyncStorage.multiRemove([
//         "userToken",
//         "isDeactivated",
//         "userEmail",
//       ]);
//       Alert.alert("Success", "Logged out successfully");
//       router.replace("/login");
//     } catch (error) {
//       Alert.alert("Error", "Failed to logout. Please try again.");
//     }
//   };

//   const confirmAction = () => {
//     setShowModal(false);

//     if (modalType === "logout") confirmLogout();
//     else if (modalType === "recovery") router.push("/recovery-methods");
//     // Add handlers for deactivate/reactivate if needed
//   };

//   const navigationIcons = [
//     { icon: Home },
//     { icon: Headphones },
//     { icon: Radio },
//     { icon: Youtube },
//     { icon: Triangle },
//     { icon: Target },
//   ];

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>GIANTOGRAM</Text>
//         <View style={styles.headerIcons}>
//           <TouchableOpacity style={styles.iconButton}>
//             <Search color="#fff" size={20} />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.iconButton}>
//             <SendIcon color="#fff" size={20} />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Content */}
//       <ScrollView contentContainerStyle={styles.content}>
//         {/* Profile Card */}
//         <View style={styles.profileCard}>
//           <Text style={styles.brandName}>{username}</Text>

//           <View style={styles.profileImageContainer}>
//             {profileImage ? (
//               <Image source={{ uri: profileImage }} style={styles.profileImage} />
//             ) : (
//               <Image
//                 source={require("../assets/images/profile-pic.jpg")}
//                 style={styles.profileImage}
//               />
//             )}
//           </View>

//           {/* Action Buttons */}
//           <View style={styles.profileActions}>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 setModalType("recovery");
//                 setShowModal(true);
//               }}
//             >
//               <Edit3 color="#10B981" size={20} />
//               <Text style={[styles.modalButtonText, { color: "#10B981" }]}>
//                 Recovery Methods
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={() => {
//                 setModalType("logout");
//                 setShowModal(true);
//               }}
//             >
//               <LogOutIcon color="#F97316" size={20} />
//               <Text style={[styles.modalButtonText, { color: "#F97316" }]}>
//                 Sign Out
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         <View style={styles.contentSpace}>
//           <Text style={styles.welcomeText}>Welcome to GIANTOGRAM</Text>
//           <Text style={styles.subtitleText}>
//             Your social media experience starts here
//           </Text>
//         </View>
//       </ScrollView>

//       {/* Bottom Nav */}
//       <View style={styles.bottomNav}>
//         {navigationIcons.map((item, idx) => (
//           <TouchableOpacity key={idx} style={styles.navItem}>
//             <item.icon color="#fff" size={24} />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Modal */}
//       <Modal visible={showModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View
//               style={[
//                 styles.modalIconWrapper,
//                 {
//                   backgroundColor:
//                     modalType === "deactivate"
//                       ? "#FEE2E2"
//                       : modalType === "logout"
//                       ? "#FEF3C7"
//                       : modalType === "recovery"
//                       ? "#DCFCE7"
//                       : "#D1FAE5",
//                 },
//               ]}
//             >
//               <Text style={{ fontSize: 36 }}>
//                 {modalType === "deactivate"
//                   ? "⚠️"
//                   : modalType === "logout"
//                   ? "🚪"
//                   : modalType === "recovery"
//                   ? "🔐"
//                   : "✅"}
//               </Text>
//             </View>

//             <Text style={styles.modalTitle}>
//               {modalType === "deactivate"
//                 ? "Deactivate Account"
//                 : modalType === "logout"
//                 ? "Sign Out"
//                 : modalType === "recovery"
//                 ? "Recovery Methods"
//                 : "Reactivate Account"}
//             </Text>

//             <Text style={styles.modalDescription}>
//               {modalType === "deactivate"
//                 ? "Temporarily deactivate your account."
//                 : modalType === "logout"
//                 ? "Are you sure you want to sign out?"
//                 : modalType === "recovery"
//                 ? "Manage your backup email, phone number, or recovery options."
//                 : "Reactivate your account to resume access."}
//             </Text>

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 onPress={() => setShowModal(false)}
//                 style={styles.cancelButton}
//               >
//                 <Text style={styles.cancelText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={confirmAction}
//                 style={[
//                   styles.confirmButton,
//                   {
//                     backgroundColor:
//                       modalType === "deactivate"
//                         ? "#F59E0B"
//                         : modalType === "logout"
//                         ? "#EF4444"
//                         : "#10B981",
//                   },
//                 ]}
//               >
//                 <Text style={styles.confirmText}>
//                   {modalType === "logout"
//                     ? "Sign Out"
//                     : modalType === "recovery"
//                     ? "Manage"
//                     : modalType === "deactivate"
//                     ? "Deactivate"
//                     : "Reactivate"}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#1a1a1a" },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     backgroundColor: "#0D0D0D",
//     alignItems: "center",
//   },
//   headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
//   headerIcons: { flexDirection: "row", gap: 15 },
//   iconButton: { padding: 8 },
//   content: { paddingHorizontal: 20, paddingBottom: 100 },
//   profileCard: {
//     backgroundColor: "#000",
//     borderRadius: 20,
//     padding: 30,
//     alignItems: "center",
//     marginTop: 40,
//   },
//   brandName: { color: "#fff", fontSize: 18, fontWeight: "bold", marginBottom: 30 },
//   profileImageContainer: { marginBottom: 25 },
//   profileImage: { width: 80, height: 80, borderRadius: 40 },
//   profileActions: { flexDirection: "row", gap: 16 },
//   modalButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#333",
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 12,
//   },
//   modalButtonText: { marginLeft: 8, fontSize: 15, fontWeight: "500" },
//   contentSpace: { alignItems: "center", marginTop: 40 },
//   welcomeText: { color: "#fff", fontSize: 24, fontWeight: "600" },
//   subtitleText: { color: "#aaa", fontSize: 16, marginTop: 10, textAlign: "center" },
//   bottomNav: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "#0D0D0D",
//     paddingVertical: 15,
//   },
//   navItem: { padding: 10 },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     backgroundColor: "rgba(0,0,0,0.6)",
//     paddingHorizontal: 20,
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderRadius: 24,
//     padding: 32,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 20 },
//     shadowOpacity: 0.25,
//     shadowRadius: 25,
//     elevation: 25,
//   },
//   modalIconWrapper: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#111827",
//     textAlign: "center",
//     marginBottom: 12,
//   },
//   modalDescription: {
//     fontSize: 16,
//     color: "#6B7280",
//     textAlign: "center",
//     marginBottom: 28,
//     lineHeight: 24,
//   },
//   modalButtons: { flexDirection: "row", gap: 12 },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   cancelText: { color: "#374151", fontWeight: "600", fontSize: 16 },
//   confirmButton: {
//     flex: 1,
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//   },
//   confirmText: { color: "white", fontWeight: "600", fontSize: 16 },
// });
