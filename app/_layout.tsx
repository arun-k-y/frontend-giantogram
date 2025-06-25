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

import { toastConfig } from "./utils/ToastDesign";
import "../global.css";
import { AuthProvider } from "./components/auth-context";

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  // const baseUrl = "http://localhost:2001";
  const baseUrl = "http://localhost:2001";

  const screenOptions = {
    headerTitle: () => <Text style={styles.headerTitle}>GIANTOGRAM</Text>,
    headerStyle: {
      backgroundColor: "#0D0D0D",
    },
    headerShadowVisible: false,
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          const isValid = await validateToken(token);
          if (isValid) {
            if (pathname !== "/home2") router.replace("/home2");
          } else {
            await AsyncStorage.removeItem("userToken");
            if (pathname !== "/login") router.replace("/login");
          }
        } else {
          if (pathname !== "/login") router.replace("/login");
        }
      } catch {
        if (pathname !== "/login") router.replace("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkToken();
  }, []);

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
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ marginTop: 15 }}>Loading...</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
     <AuthProvider>
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
    </SafeAreaProvider></AuthProvider>
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
