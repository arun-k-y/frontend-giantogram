import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import EmailOrPhoneInput from "./components/EmailOrPhoneInput";
import BackButton from "./components/BackButton";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState(false); // Changed from hasEmailError to fieldError

  // Added missing state variables for country code functionality
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);

  const baseUrl = "http://localhost:2001";

  // Updated validation functions to handle both email and phone
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

  const getIdentifierType = (value: string) => {
    if (validateEmail(value)) return "email";
    if (validateMobile(value)) return "mobile";
    return null;
  };

  const handleForgotPassword = async () => {
    Keyboard.dismiss();

    setErrorMessage("");

    if (!identifier.trim()) {
      setErrorMessage("Email or phone number is required");
      setFieldError(true);
      return;
    }

    const identifierType = getIdentifierType(identifier.trim());

    if (!identifierType) {
      setErrorMessage(
        "Please enter a valid email address or 10-digit phone number"
      );
      setFieldError(true);
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting to send reset code to:", {
        identifier,
        type: identifierType,
      });

      // Prepare the request body based on identifier type
      const requestBody =
        identifierType === "email"
          ? { identifier: identifier.trim() }
          : { identifier: selectedCountryCode + identifier.trim() };

      const response = await fetch(`${baseUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: data?.message || "Reset code sent successfully",
        });

        router.push({
          pathname: "/reset-password",
          params: {
            identifier: identifier.trim(),
            identifierType,
          },
        });
      } else {
        setErrorMessage(data.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        console.log("Network error. Please check your internet connection.");
        setErrorMessage(
          "Network error. Please check your internet connection."
        );
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const FormLayout = () => {
    return (
      <View className="flex-1 items-center pt-32 p-4 bg-[#000000E3] w-full md:w-[500px] self-center">
        {/* <View className="mb-8 w-full">
          <Text className="text-[#170202] text-2xl font-medium text-center mb-2">
            Forgot Password?
          </Text>
          <Text className="text-[#555] text-base text-center px-4">
            Enter your email address or phone number and we&apos;ll send you a reset code
          </Text>
        </View> */}

        <EmailOrPhoneInput
          identifier={identifier}
          onChange={(value) => {
            setIdentifier(value);
            setFieldError(false);
            setErrorMessage("");
          }}
          fieldError={fieldError}
          selectedCountryCode={selectedCountryCode}
          setSelectedCountryCode={setSelectedCountryCode}
          showDropdown={showCountryCodeDropdown}
          setShowDropdown={setShowCountryCodeDropdown}
        />

        <TouchableOpacity
          className="w-[215px] bg-white rounded-[10px] py-5 px-8 mb-4"
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#000000" />
          ) : (
            <Text className="text-[#000000] text-center font-normal text-lg">
              Send Reset Code
            </Text>
          )}
        </TouchableOpacity>

        {/* <View className="mt-16 flex w-full flex-row justify-between">
          <TouchableOpacity onPress={() => router.push("/login" as never)}>
            <Text className="text-[#000000] font-normal">Back to Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/signup" as never)}>
            <Text className="text-[#000000] font-normal">Create Account</Text>
          </TouchableOpacity>
        </View> */}

        {errorMessage !== "" && (
          <View className="absolute bottom-0 w-full">
            <View className="py-5">
              <Text className="text-[#E12D39] text-2xl px-2 text-center font-normal">
                {errorMessage}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      {Platform.OS === "web" ? (
        <>
          <BackButton title="Forgot Password" />
          {/* <View style={{ height: 50, backgroundColor: "#000000E3" }} /> */}

          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {FormLayout()}
          </ScrollView>
        </>
      ) : (
        <>
          <BackButton title="Forgot Password" />
          {/* <View style={{ height: 50, backgroundColor: "#000000E3" }} /> */}

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
              >
                {FormLayout()}
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </>
      )}
    </>
  );
}
