import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { LogOutIcon, Edit3, UserX, UserCheck } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAuth } from "./providers/auth-context";
import ConfirmationModal from "./components/ConfirmationModal"; 
import { baseUrl } from "./config/config";
import { navigationIcons } from "./constants/constants";

export default function HomePage() {
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "",
    cancelText: "Cancel",
    confirmButtonStyle: "default",
    onConfirm: () => {},
  });
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isDeactivated, setIsDeactivated] = useState<boolean | null>(null);

  const router = useRouter();
  const { accessToken } = useAuth();

  useEffect(() => {
    fetchUserData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        setModalConfig({
          title: "Exit App",
          message: "Are you sure you want to exit?",
          confirmText: "Exit",
          cancelText: "Cancel",
          confirmButtonStyle: "danger",
          onConfirm: () => {
            setShowModal(false);
            BackHandler.exitApp();
          },
        });
        setShowModal(true);
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
      setIsProfileLoading(true);

      const token = accessToken;
      if (!token) return;

      const res = await fetch(`${baseUrl}/api/auth/protected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.warn("User fetch error:", errorData.message);
        return;
      }

      const data = await res.json();
      setUsername(data.user.username || "GIANTOGRAM");
      setProfileImage(data.user.profilePicture || null);
      setIsDeactivated(data.user?.isDeactivated ?? false);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userToken",
        "isDeactivated",
        "userEmail",
      ]);
      Alert.alert("Success", "Logged out successfully");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  const confirmDeactivate = async () => {
    try {
      const token = accessToken;
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      const res = await fetch(`${baseUrl}/api/auth/deactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ identifier: username }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        Alert.alert(
          "Error",
          errorData.message || "Failed to deactivate account"
        );
        return;
      }

      await AsyncStorage.setItem("isDeactivated", "true");

      Alert.alert(
        "Account Deactivated",
        "Your account has been temporarily deactivated. You can reactivate it anytime.",
        [
          {
            text: "OK",
            onPress: () => {
              setIsDeactivated(true);
              fetchUserData();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Deactivation error:", error);
      Alert.alert("Error", "Failed to deactivate account. Please try again.");
    }
  };

  const confirmReactivate = async () => {
    try {
      const token = accessToken;
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      const res = await fetch(`${baseUrl}/api/auth/reactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ identifier: username }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        Alert.alert(
          "Error",
          errorData.message || "Failed to reactivate account"
        );
        return;
      }

      await AsyncStorage.removeItem("isDeactivated");

      Alert.alert(
        "Account Reactivated",
        "Your account has been successfully reactivated. Welcome back!",
        [
          {
            text: "OK",
            onPress: () => {
              setIsDeactivated(false);
              fetchUserData();
            },
          },
        ]
      );
    } catch (error) {
      console.error("Reactivation error:", error);
      Alert.alert("Error", "Failed to reactivate account. Please try again.");
    }
  };

  const handleLogoutPress = () => {
    setModalConfig({
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      confirmText: "Sign Out",
      cancelText: "Cancel",
      confirmButtonStyle: "danger",
      onConfirm: () => {
        setShowModal(false);
        confirmLogout();
      },
    });
    setShowModal(true);
  };

  const handleDeactivatePress = () => {
    setModalConfig({
      title: "Deactivate Account",
      message:
        "Are you sure you want to temporarily deactivate your account? You can reactivate it anytime by logging back in.",
      confirmText: "Deactivate",
      cancelText: "Cancel",
      confirmButtonStyle: "warning",
      onConfirm: () => {
        setShowModal(false);
        confirmDeactivate();
      },
    });
    setShowModal(true);
  };

  const handleReactivatePress = () => {
    setModalConfig({
      title: "Reactivate Account",
      message:
        "Are you sure you want to reactivate your account? You'll regain full access to all features.",
      confirmText: "Reactivate",
      cancelText: "Cancel",
      confirmButtonStyle: "success",
      onConfirm: () => {
        setShowModal(false);
        confirmReactivate();
      },
    });
    setShowModal(true);
  };

  const handleRecoveryPress = () => {
    router.push("/recovery-methods" as any);
  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GIANTOGRAM</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/star.png")}
              className="w-9 h-9"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/search.png")}
              className="w-9 h-9"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/msg.png")}
              className="w-9 h-9"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Text style={styles.brandName}>{username}</Text>

          <View style={styles.profileImageContainer}>
            {isProfileLoading ? (
              <ActivityIndicator size="large" color="#10B981" />
            ) : profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require("../assets/images/profile-pic.jpg")}
                style={styles.profileImage}
              />
            )}
          </View>

          {/* Account Status Indicator */}
          {isDeactivated && (
            <View style={styles.statusIndicator}>
              <Text style={styles.statusText}>Account Deactivated</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleRecoveryPress}
            >
              <Edit3 color="#10B981" size={20} />
              <Text style={[styles.modalButtonText, { color: "#10B981" }]}>
                Recovery Methods
              </Text>
            </TouchableOpacity>

            {/* Show Reactivate or Deactivate button based on account status */}
            {isDeactivated ? (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleReactivatePress}
              >
                <UserCheck color="#10B981" size={20} />
                <Text style={[styles.modalButtonText, { color: "#10B981" }]}>
                  Reactivate Account
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDeactivatePress}
              >
                <UserX color="#F59E0B" size={20} />
                <Text style={[styles.modalButtonText, { color: "#F59E0B" }]}>
                  Deactivate Account
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleLogoutPress}
            >
              <LogOutIcon color="#F97316" size={20} />
              <Text style={[styles.modalButtonText, { color: "#F97316" }]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentSpace}>
          <Text style={styles.welcomeText}>Welcome to GIANTOGRAM</Text>
          <Text style={styles.subtitleText}>
            {isDeactivated
              ? "Your account is temporarily deactivated. Reactivate to resume your social media experience."
              : "Your social media experience starts here"}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        {navigationIcons.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.navItem}>
            <Image
              source={item.icon}
              className={`w-9 h-9 ${
                idx === navigationIcons.length - 1 ? "rounded-full" : ""
              }`}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Reusable Confirmation Modal */}
      <ConfirmationModal
        isVisible={showModal}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        confirmButtonStyle={modalConfig.confirmButtonStyle}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setShowModal(false)}
      />
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#0D0D0D",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "600" },
  headerIcons: { flexDirection: "row", gap: 15 },
  content: { paddingHorizontal: 20, paddingBottom: 100 },
  profileCard: {
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    marginTop: 40,
  },
  brandName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 30,
  },
  profileImageContainer: { marginBottom: 25 },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  statusIndicator: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  profileActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 120,
  },
  modalButtonText: { marginLeft: 6, fontSize: 13, fontWeight: "500" },
  contentSpace: { alignItems: "center", marginTop: 40 },
  welcomeText: { color: "#fff", fontSize: 24, fontWeight: "600" },
  subtitleText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0D0D0D",
    paddingVertical: 15,
  },
  navItem: { padding: 10 },
});
