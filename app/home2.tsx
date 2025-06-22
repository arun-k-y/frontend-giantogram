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
  SendIcon,
  LogOutIcon,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function HomePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<
    "deactivate" | "logout" | "reactivate"
  >("logout");
  const router = useRouter();

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
  // const baseUrl = "http://localhost:2001";

  const baseUrl = "http://localhost:2001";

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.log("No token found, please login.");
        return;
      }

      const res = await fetch(`${baseUrl}/api/auth/protected`, {
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
        ? data?.user?.profilePicture
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

  const confirmLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userToken",
        "isDeactivated",
        "userEmail",
      ]);
      Alert.alert("Success", "Logged out successfully");
      router.replace("/login"); // or use navigation.replace("Login");
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  // Called when confirm button in modal is pressed
  const confirmAction = () => {
    setShowModal(false);
    if (modalType === "logout") {
      confirmLogout();
    }
    // You can extend this for other modalType actions like "deactivate" or "reactivate"
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIANTOGRAM</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Search color="#ffffff" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <SendIcon color="#ffffff" size={20} />
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
              // onPress={handleProfilePress}
              style={styles.profileImageContainer}
              disabled
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                // <View style={styles.profilePlaceholder}>
                //   <User color="#666666" size={40} />
                // </View>

                <Image
                  source={require("../assets/images/profile-pic.jpg")}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>

            <View style={styles.profileActions}>
              {/* <TouchableOpacity style={styles.actionButton}>
                <Camera color="#ffffff" size={18} />
              </TouchableOpacity> */}
              {/* <TouchableOpacity style={styles.actionButton}>
                <Search color="#ffffff" size={18} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Send color="#ffffff" size={18} />
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalType("logout");
                  setShowModal(true);
                  setShowProfileModal(false);
                }}
              >
                <LogOutIcon color="#FF9800" size={20} />
                <Text style={[styles.modalButtonText, { color: "#FF9800" }]}>
                  Sign Out
                </Text>
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

      <Modal visible={showModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 24,
              padding: 32,
              width: "100%",
              maxWidth: 400,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 25,
              elevation: 25,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                backgroundColor:
                  modalType === "deactivate"
                    ? "#FEE2E2"
                    : modalType === "logout"
                    ? "#FEF3C7"
                    : "#D1FAE5",
              }}
            >
              <Text style={{ fontSize: 36 }}>
                {modalType === "deactivate"
                  ? "⚠️"
                  : modalType === "logout"
                  ? "🚪"
                  : "✅"}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#111827",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {modalType === "deactivate"
                ? "Deactivate Account"
                : modalType === "logout"
                ? "Sign Out"
                : "Reactivate Account"}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: "#6B7280",
                textAlign: "center",
                marginBottom: 28,
                lineHeight: 24,
              }}
            >
              {modalType === "deactivate"
                ? "Your account will be temporarily deactivated. You can reactivate it anytime by signing in again."
                : modalType === "logout"
                ? "Are you sure you want to sign out of your account?"
                : "Your account will be reactivated and you'll regain full access to all features."}
            </Text>

            <View
              style={{
                flexDirection: "row",
                gap: 12,
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#F9FAFB",
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                }}
              >
                <Text
                  style={{
                    color: "#374151",
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmAction}
                style={{
                  flex: 1,
                  paddingVertical: 16,
                  borderRadius: 16,
                  alignItems: "center",
                  backgroundColor:
                    modalType === "deactivate"
                      ? "#F59E0B"
                      : modalType === "logout"
                      ? "#EF4444"
                      : "#10B981",
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  {modalType === "deactivate"
                    ? "Deactivate"
                    : modalType === "logout"
                    ? "Sign Out"
                    : "Reactivate"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#0D0D0D",
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
    backgroundColor: "#0D0D0D",
    paddingVertical: 15,
    paddingBottom: 15,
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
