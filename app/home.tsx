import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Toast from "react-native-toast-message";

const Home = () => {
  const router = useRouter();
  // const baseUrl = "https://next-node-auth.onrender.com";
  const baseUrl = "http://localhost:2001";

  // const baseUrl = 'http://localhost:2001'

  const [showModal, setShowModal] = useState(false);
  const [isDeactivated, setIsDeactivated] = useState<boolean | null>(null);
  const [modalType, setModalType] = useState<
    "deactivate" | "reactivate" | "logout" | null
  >(null);
  const [message, setMessage] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [username, setUserName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    fetchUserData();

    // Animate page entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
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
      const email = await AsyncStorage.getItem("userEmail");

      if (!token) {
        showToast("error", "No token found, please login.");
        router.replace("/login");
        return;
      }

      setUserEmail(email || "");

      const res = await fetch(`${baseUrl}/api/auth/protected`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        showToast("error", errorData.message || "Failed to fetch user data");
        return;
      }

      const data = await res.json();
      setMessage(data?.message);
      setUserName(data?.user?.username);
      setIsDeactivated(data.user?.isDeactivated ?? false);

      // Mock user stats - replace with actual API data

      await AsyncStorage.setItem(
        "isDeactivated",
        data.user?.isDeactivated ? "true" : "false"
      );
    } catch (error) {
      console.error("Error fetching user data:", error);
      showToast("error", "Server error while fetching user data");
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
    showToast("success", "Dashboard refreshed");
  }, []);

  const showToast = (type: any, text1: any, text2 = "") =>
    Toast.show({ type, text1, text2 });

  const logout = async () => {
    setModalType("logout");
    setShowModal(true);
  };

  const confirmLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "userToken",
        "isDeactivated",
        "userEmail",
      ]);
      showToast("success", "Logged out successfully");
      router.replace("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      showToast("error", "Failed to logout. Please try again.");
    }
  };

  const postToApi = async (endpoint: string, successMessage: string) => {
    try {
      const [token, email, mobile] = await Promise.all([
        AsyncStorage.getItem("userToken"),
        AsyncStorage.getItem("userEmail"),
        AsyncStorage.getItem("userMobile"),
      ]);

      const identifier = email || mobile;

      if (!token || !identifier) {
        showToast("error", "Missing token or identifier (email/mobile)");
        return;
      }

      const res = await fetch(`${baseUrl}/api/auth/${endpoint}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ identifier }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("success", successMessage);
        if (endpoint === "deactivate") {
          await AsyncStorage.setItem("isDeactivated", "true");
          setIsDeactivated(true);
        }
        if (endpoint === "reactivate") {
          await AsyncStorage.setItem("isDeactivated", "false");
          setIsDeactivated(false);
        }
        setShowModal(false);
      } else {
        console.warn(`API error:`, data);
        showToast("error", data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(`${endpoint} error:`, error);
      showToast("error", "Server error. Please try again.");
    }
  };

  const handleDeactivate = () => {
    setModalType("deactivate");
    setShowModal(true);
  };

  const handleActivate = () => {
    setModalType("reactivate");
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (modalType === "deactivate") {
      await postToApi("deactivate", "Account deactivated");
    } else if (modalType === "reactivate") {
      await postToApi("reactivate", "Account reactivated");
    } else if (modalType === "logout") {
      await confirmLogout();
    }
    setShowModal(false);
  };

  const getStatusBadge = () => {
    if (isDeactivated === null) return null;

    return (
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: isDeactivated ? "#FEE2E2" : "#D1FAE5",
          borderWidth: 1,
          borderColor: isDeactivated ? "#FECACA" : "#A7F3D0",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: isDeactivated ? "#DC2626" : "#059669",
          }}
        >
          {isDeactivated ? "🔴 Deactivated" : "🟢 Active"}
        </Text>
      </View>
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  return (
    <>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" /> */}
      <View
        style={{
          flex: 1,
          backgroundColor: "#F8FAFC",
        }}
      >
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: Platform.OS === "ios" ? 60 : 40,
            paddingHorizontal: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              width: "100%",
              maxWidth: 900,
              alignSelf: "center",
            }}
          >
            {/* Header Section */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 32,
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#6B7280",
                    marginBottom: 4,
                  }}
                >
                  {getGreeting()}
                </Text>
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {username
                    ? username.charAt(0).toUpperCase() +
                      username.slice(1).toLowerCase()
                    : "User"}
                </Text>
              </View>
              {getStatusBadge()}
            </View>

            {/* Profile Card */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 24,
                padding: 24,
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 16,
                    backgroundColor: "#667EEA",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 26,
                      fontWeight: "700",
                    }}
                  >
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: 4,
                    }}
                  >
                    {username
                      ? username.charAt(0).toUpperCase() +
                        username.slice(1).toLowerCase()
                      : "User"}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#6B7280",
                    }}
                  >
                    {userEmail}
                  </Text>
                </View>
              </View>

              {message && (
                <View
                  style={{
                    backgroundColor: "#F0F9FF",
                    borderRadius: 12,
                    padding: 16,
                    borderLeftWidth: 4,
                    borderLeftColor: "#3B82F6",
                  }}
                >
                  <Text
                    style={{
                      color: "#1E40AF",
                      fontSize: 14,
                      lineHeight: 20,
                    }}
                  >
                    {message}
                  </Text>
                </View>
              )}
            </View>

            {/* Stats Row */}

            {/* Quick Actions */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: 24,
                marginBottom: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 20,
                }}
              >
                Quick Actions
              </Text>

              <View style={{ gap: 12 }}>
                {/* Account Status Action */}
                {isDeactivated === false ? (
                  <TouchableOpacity
                    onPress={handleDeactivate}
                    style={{
                      backgroundColor: "#F59E0B",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#F59E0B",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text style={{ fontSize: 20, marginRight: 8 }}>⚠️</Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      Deactivate Account
                    </Text>
                  </TouchableOpacity>
                ) : isDeactivated === true ? (
                  <TouchableOpacity
                    onPress={handleActivate}
                    style={{
                      backgroundColor: "#10B981",
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      borderRadius: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      shadowColor: "#10B981",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    <Text style={{ fontSize: 20, marginRight: 8 }}>✅</Text>
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 16,
                      }}
                    >
                      Reactivate Account
                    </Text>
                  </TouchableOpacity>
                ) : null}

                {/* Settings Button */}
                <TouchableOpacity
                  onPress={() => showToast("info", "Settings coming soon!")}
                  style={{
                    backgroundColor: "#6366F1",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 8 }}>⚙️</Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Account Settings
                  </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                  onPress={logout}
                  style={{
                    backgroundColor: "#EF4444",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderRadius: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontSize: 20, marginRight: 8 }}>🚪</Text>
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Card */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                padding: 24,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                Need Help? 🤝
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 20,
                  marginBottom: 16,
                }}
              >
                If you have any questions or need assistance, feel free to
                contact our support team.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  showToast("info", "Support contact coming soon!")
                }
                style={{
                  backgroundColor: "#F3F4F6",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#374151",
                    fontWeight: "500",
                    fontSize: 14,
                  }}
                >
                  Contact Support
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>

      {/* Enhanced Modal */}
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
    </>
  );
};

export default Home;
