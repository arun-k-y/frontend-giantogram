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
import { baseUrl } from "./config/config";
import { ErrorPopup } from "./components/ErrorPopup";
import useErrorMessage from "./hooks/useErrorMessage";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState(false); // Changed from hasEmailError to fieldError
  const { errorMessage, showError, dismissError, slideAnim } =
    useErrorMessage();

  // Added missing state variables for country code functionality
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);

  // Updated validation functions to handle both email and phone
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);
  const validateUsername = (username: string) => {
    // Username validation: 3-30 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,25}$/;
    return usernameRegex.test(username);
  };

  const getIdentifierType = (value: string) => {
    if (validateEmail(value)) return "email";
    if (validateMobile(value)) return "mobile";
    if (validateUsername(value)) return "username";
    return null;
  };

  const handleForgotPassword = async () => {
    Keyboard.dismiss();
    const trimmedIdentifier = identifier.trim();

    // setErrorMessage("");

    if (!trimmedIdentifier) {
      showError("Enter Username, Email or Number");
      setFieldError(true);
      return;
    }

    const identifierType = getIdentifierType(trimmedIdentifier);

    if (!identifierType) {
      let message = "Enter a Valid Username, Email or Number";
      if (trimmedIdentifier.includes("@")) {
        message = "Enter a Valid Gmail";
      } else if (/^\d+$/.test(trimmedIdentifier)) {
        message = "Enter a Valid Number";
      }
      showError(message);

      setFieldError(true);
      return;
    }

    setIsLoading(true);
    try {
      let id = identifier.trim();
      if (identifierType === "mobile") {
        id = `${selectedCountryCode}${identifier.trim()}`;
      }

      const requestBody = { identifier: id };

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

        if (data.code === "MULTIPLE_USERS_FOUND") {
          // Redirect to username selection screen
          router.push({
            pathname: "/choose-account",
            params: {
              identifier: id, // pass the email or mobile
              usernames: JSON.stringify(data.usernames), // ⬅️ Pass encoded array
            },
          });
        } else if (
          data.redirect === true ||
          data.code === "CHOOSE_RECOVERY_METHOD"
        ) {
          // Original flow for recovery options from username
          router.push({
            pathname: "/choose-recovery",
            params: {
              identifier: data.identifier,
            },
          });
        } else {
          // Continue to reset-password directly
          router.push({
            pathname: "/reset-password",
            params: {
              identifier: id,
              identifierType,
            },
          });
        }
      } else {
        showError(data.message || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        console.log("Network error. Please check your internet connection.");
        showError("Network error. Please check your internet connection.");
      } else {
        showError("An error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const FormLayout = () => {
    return (
      <View className="flex-1 items-center pt-32 p-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
        <EmailOrPhoneInput
          identifier={identifier}
          onChange={(value) => {
            setIdentifier(value);
            setFieldError(false);
            // setErrorMessage("");
          }}
          fieldError={fieldError}
          selectedCountryCode={selectedCountryCode}
          setSelectedCountryCode={setSelectedCountryCode}
          showDropdown={showCountryCodeDropdown}
          setShowDropdown={setShowCountryCodeDropdown}
          placeholder="NUMBER, USERNAME OR EMAIL"
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
              Confirm
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      {Platform.OS === "web" ? (
        <>
          <BackButton title="Forgot Password" />

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
          {/* <View style={{ height: 50, backgroundColor: "#0D0D0D" }} /> */}

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
      {errorMessage && (
        <>
          <ErrorPopup
            errorMessage={errorMessage}
            slideAnim={slideAnim}
            onDismiss={dismissError}
          />
        </>
      )}
    </>
  );
}
