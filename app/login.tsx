import { ClosedEyeSVG, EyeSVG } from "./svgs/SVG";
import { router } from "expo-router";
import React, { useState } from "react";
import { baseUrl } from "./config/config";

import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import EmailOrPhoneInput from "./components/EmailOrPhoneInput";
import useErrorMessage from "./hooks/useErrorMessage";
import { ErrorPopup } from "./components/ErrorPopup";

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

  // const baseUrl = 'http://localhost:2001'
  const { errorMessage, showError, dismissError, slideAnim } =
    useErrorMessage();

  const [fieldErrors, setFieldErrors] = useState({
    identifier: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile: string) => {
    // Basic mobile validation - adjust regex as needed
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateUsername = (username: string) => {
    // Username validation: 3-30 characters, alphanumeric and underscores only
    // Adjust this regex based on your username requirements
    const usernameRegex = /^[a-zA-Z0-9_]{3,25}$/;
    return usernameRegex.test(username);
  };

  const getIdentifierType = (value: string) => {
    if (validateEmail(value)) return "email";
    if (validateMobile(value)) return "mobile";
    if (validateUsername(value)) return "username";
    return null;
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: false }));
    // addErrorMessage("");
  };

  const validateForm = () => {
    const trimmedIdentifier = identifier.trim();
    const trimmedPassword = password.trim();
    const errors = {
      identifier: !trimmedIdentifier || !getIdentifierType(trimmedIdentifier),
      password: !trimmedPassword,
    };

    setFieldErrors(errors);

    // Show error message and vibrate
    if (!trimmedIdentifier && !trimmedPassword) {
      showError("Enters Details to Login");
      // Vibration.vibrate(100);
      return false;
    }

    const identifierType = getIdentifierType(trimmedIdentifier);

    if (!identifierType) {
      let message = "Enter a valid email address, phone number, or username";

      if (trimmedIdentifier.includes("@")) {
        message = "Enter a Valid Gmail";
      } else if (/^\d+$/.test(trimmedIdentifier)) {
        message = "Enter a Valid Number";
      }

      showError(message);
      // Vibration.vibrate(100);
      return false;
    }

    if (!trimmedPassword) {
      showError("Enter Password");
      // Vibration.vibrate(100);
      return false;
    }

    return true;
  };

  const getInputStyle = (hasError: boolean) => {
    const baseStyle = "border";
    const errorStyle = "bg-white text-[#F11111] border-[#FF6B6B]";
    const normalStyle = "bg-white text-[#1F1E1E] border-[#B2EBF2]";

    return `${baseStyle} ${hasError ? errorStyle : normalStyle}`;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();
    // addErrorMessage("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      let id = identifier.trim();
      const identifierType = getIdentifierType(id);

      if (identifierType === "mobile") {
        id = `${selectedCountryCode}${id}`;
      }

      const requestBody = {
        identifier: id,
        password: password.trim(),
      };

      const response = await fetch(`${baseUrl}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("datadata.....", data)
      if (response.ok) {
        Toast.show({
          type: "success",
          text1: data?.message,
        });

        router.push({
          pathname: "/verify-email",
          params: {
            deliveryMethod: data.deliveryMethod,
            maskedDestination: data.maskedDestination,
            identifier: id,
          },
        });
      } else {
        let message = data.message || "Login failed";

        switch (data.code) {
          case "USER_NOT_FOUND":
            message = "No account found";
            break;
          case "INVALID_IDENTIFIER":
            if (identifier.includes("@")) {
              message = "Enter a Valid Gmail";
            } else if (/^\d+$/.test(identifier)) {
              message = "Enter a Valid Number";
            } else {
              message = "Invalid username";
            }
            break;
          case "INVALID_PASSWORD":
            message = "Incorrect Password";
            break;
          case "EMAIL_NOT_AVAILABLE":
            message = "Email verification not available for this account";
            break;
          case "MOBILE_NOT_AVAILABLE":
            message = "SMS verification not available for this account";
            break;
          case "DELIVERY_ERROR":
            message = "Failed to send verification code. Please try again.";
            break;
          default:
            message = data.message || "Login failed";
        }

        showError(message);
        // Vibration.vibrate(100); // Notify user with haptic feedback
      }
    } catch (error) {
      console.error("Error:", error);

      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        showError("Network error. Please check your internet connection.");
      } else {
        showError("An error occurred. Please try again.");
      }

      // Vibration.vibrate(100);
    } finally {
      setIsLoading(false);
    }
  };

  const FormLayout = () => {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
        <EmailOrPhoneInput
          identifier={identifier}
          onChange={(value) => {
            setIdentifier(value);
            if (getIdentifierType(value.trim())) clearFieldError("identifier");
          }}
          fieldError={fieldErrors.identifier}
          selectedCountryCode={selectedCountryCode}
          setSelectedCountryCode={setSelectedCountryCode}
          showDropdown={showCountryCodeDropdown}
          setShowDropdown={setShowCountryCodeDropdown}
          placeholder="NUMBER, USERNAME OR EMAIL"
        />

        <View className="w-full mb-12 relative">
          <TextInput
            className={`w-full rounded-[10px] py-5 px-5 pr-14 ${getInputStyle(
              fieldErrors.password
            )}`}
            placeholder="PASSWORD"
            value={password}
            onChangeText={(password) => {
              setPassword(password);
              clearFieldError("password");
            }}
            secureTextEntry={!isPasswordVisible}
            textContentType="password"
            placeholderTextColor="#555"
            style={{ fontSize: 18 }}
          />
          {password && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute right-5 top-1/2 -translate-y-[50%]"
            >
              {isPasswordVisible ? (
                <EyeSVG width={24} height={24} />
              ) : (
                <ClosedEyeSVG width={24} height={24} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="w-[202px] bg-white rounded-[10px] py-5 px-8 mb-4"
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#000000" />
          ) : (
            <Text className="text-[#000000] text-center font-normal text-lg">
              Log Me In
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-40 flex w-full flex-row justify-between">
          <TouchableOpacity
            className="bg-white py-2 px-2 rounded-lg"
            onPress={() => router.push("/signup")}
          >
            <Text className="text-[#332E2E] font-normal">
              Create new account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white py-2 px-2 rounded-lg"
            onPress={() => router.push("/forgot-password")}
          >
            <Text className="text-[#332E2E] font-normal">Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      {Platform.OS === "web" ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {FormLayout()}
        </ScrollView>
      ) : (
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
