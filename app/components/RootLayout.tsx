import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { toastConfig } from "../utils/ToastDesign";
import "../../global.css";
import { useAuth } from "./auth-context";
import { baseUrl } from "../config/config";

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, isReady } = useAuth();

  const screenOptions = {
    headerTitle: () => <Text style={styles.headerTitle}>GIANTOGRAM</Text>,
    headerStyle: {
      backgroundColor: "#0D0D0D",
    },
    headerShadowVisible: false,
  };

  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("userToken");
  //       if (token) {
  //         const isValid = await validateToken(token);
  //         if (isValid) {
  //           if (pathname !== "/home2") router.replace("/home2");
  //         } else {
  //           await AsyncStorage.removeItem("userToken");
  //           if (pathname !== "/login") router.replace("/login");
  //         }
  //       } else {
  //         if (pathname !== "/login") router.replace("/login");
  //       }
  //     } catch {
  //       if (pathname !== "/login") router.replace("/login");
  //     } finally {
  //       setIsChecking(false);
  //     }
  //   };

  //   checkToken();
  // }, []);

  useEffect(() => {
    if (!isReady) return;
    const checkToken = async () => {
      console.log("🔁 Checking for userToken in AsyncStorage...");
      try {
        const token = accessToken;
        console.log("🔐 Retrieved token:", token);

        if (token) {
          const isValid = await validateToken(token);
          console.log("✅ Token validity:", isValid);

          if (isValid) {
            if (pathname !== "/home2") {
              console.log("➡️ Redirecting to /home2...");
              router.replace("/home2");
            }
          } else {
            console.log("🚫 Invalid token. Removing from AsyncStorage...");
            // await AsyncStorage.removeItem("userToken");
            if (pathname !== "/login") {
              console.log("➡️ Redirecting to /login...");
              router.replace("/login");
            }
          }
        } else {
          console.log("❌ No token found. Redirecting to /login if needed...");
          if (pathname !== "/login") {
            router.replace("/login");
          }
        }
      } catch (error) {
        console.error("💥 Error during token check:", error);
        if (pathname !== "/login") {
          console.log("➡️ Redirecting to /login due to error...");
          router.replace("/login");
        }
      } finally {
        console.log("✅ Finished auth check. Stopping loader...");
        setIsChecking(false);
      }
    };

    checkToken();
  }, [isReady]);

  // useEffect(() => {
  //   if (!isReady) return;

  //   if (accessToken) {
  //     validateToken(accessToken).then((valid) => {
  //       if (!valid) {
  //         AsyncStorage.removeItem("userToken");
  //         if (pathname !== "/login") router.replace("/login");
  //       } else {
  //         if (pathname !== "/home2") router.replace("/home2");
  //       }
  //     });
  //   } else {
  //     if (pathname !== "/login") router.replace("/login");
  //   }
  // }, []);

  // useEffect(() => {
  //   const proceed = async () => {
  //     console.log("🔁 Checking auth status...");

  //     try {
  //       if (accessToken) {
  //         console.log("🔐 Found access token:", accessToken);

  //         const valid = await validateToken(accessToken);
  //         console.log("✅ Token validity:", valid);

  //         if (!valid) {
  //           console.log("🚫 Invalid token. Removing from AsyncStorage...");
  //           await AsyncStorage.removeItem("userToken");

  //           if (pathname !== "/login") {
  //             console.log("🔁 Redirecting to /login...");
  //             router.replace("/login");
  //           }
  //         } else {
  //           if (pathname !== "/home2") {
  //             console.log("✅ Valid token. Redirecting to /home2...");
  //             router.replace("/home2");
  //           }
  //         }
  //       } else {
  //         console.log("❌ No access token found.");
  //         if (pathname !== "/login") {
  //           console.log("🔁 Redirecting to /login...");
  //           router.replace("/login");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("💥 Error during token validation:", error);
  //       if (pathname !== "/login") {
  //         console.log("🔁 Redirecting to /login due to error...");
  //         router.replace("/login");
  //       }
  //     } finally {
  //       console.log("✅ Finished auth check. Stopping loader...");
  //       setIsChecking(false);
  //     }
  //   };

  //   proceed();
  // }, [isReady]);

  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch(`${baseUrl}/api/auth/protected`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  if (isChecking) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          edges={["top", "left", "right", "bottom"]}
          style={styles.safeArea}
        >
          <StatusBar style="light" />
          <View style={styles.centeredView}>
            <ActivityIndicator size="large" color="white" />
            <Text style={{ marginTop: 15, color: "white" }}>Loading...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        style={styles.safeArea}
      >
        <StatusBar style="light" backgroundColor="#000" />
        <View style={styles.flex}>
          <Stack>
            {[
              "login",
              "signup",
              "forgot-password",
              "reset-password",
              "verify-email",
              "profile-pic",
              "enter-otp",
              "set-password",
              "recovery-methods",
              "choose-recovery",
              "remember-me",
              "choose-account",
            ].map((name) => (
              <Stack.Screen
                key={name}
                name={name}
                options={{
                  ...screenOptions,
                  headerLeft: () => null,
                  headerBackVisible: false,
                }}
              />
            ))}

            <Stack.Screen
              name="home"
              options={{
                headerTitle: "",
                headerStyle: { backgroundColor: "transparent" },
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="home2"
              options={{
                ...screenOptions,
                headerLeft: () => null,
                headerBackVisible: false,
                header: () => null,
              }}
            />
          </Stack>
          <Toast
            config={toastConfig}
            position="top"
            visibilityTime={5000}
            autoHide
            bottomOffset={Platform.OS === "android" ? 60 : 40}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  flex: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "500",
    color: "white",
    fontFamily: "Inter, sans-serif",
    letterSpacing: 0,
  },
});
