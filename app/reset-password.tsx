import { ClosedEyeSVG, EyeSVG } from "./svgs/SVG";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
import BackButton from "./components/BackButton";
import { baseUrl } from "./config/config";
import { ErrorPopup } from "./components/ErrorPopup";
import useErrorMessage from "./hooks/useErrorMessage";

export default function ResetPassword() {
  const { identifier, username } = useLocalSearchParams();
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const { errorMessage, showError, dismissError, slideAnim } =
    useErrorMessage();
  // State to track which fields have errors
  const [fieldErrors, setFieldErrors] = useState({
    resetCode: false,
    newPassword: false,
    confirmPassword: false,
  });

  const validateInputs = () => {
    const errors = {
      resetCode: !resetCode.trim() || resetCode.length !== 6,
      newPassword: !newPassword.trim() || newPassword.length < 6,
      confirmPassword:
        !confirmPassword.trim() || newPassword !== confirmPassword,
    };

    setFieldErrors(errors);

    if (errors.resetCode) {
      if (!resetCode.trim()) {
        showError("Enter OTP");
      } else {
        showError("Enter Valid OTP");
      }
      return false;
    }

    if (errors.newPassword) {
      if (!newPassword.trim()) {
        showError("Enter Password");
      } else if (newPassword.length < 8) {
        showError("Password must be at least 8 characters");
      }
      return false;
    }

    if (errors.confirmPassword) {
      // if (!confirmPassword.trim()) {
      //   showError("Please confirm your password");
      // } else {
      showError("Password Doesn't Match");
      // }
      return false;
    }

    return true;
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: false }));
    // setErrorMessage("");
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();

    // setErrorMessage("");

    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      console.log("Attempting to reset password for:", { identifier });

      const response = await fetch(`${baseUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          resetCode,
          newPassword,
        }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: data?.message || "Password reset successful",
        });

        // Navigate back to login
        router.replace("/login");
      } else {
        showError(data.message || "Failed to reset password");
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
        <View className="mb-8 w-full">
          <Text className="text-white text-5xl font-medium text-center mb-2">
            Set New Password
          </Text>
        </View>

        <TextInput
          style={{ fontSize: 18 }}
          className={`w-full rounded-[10px] py-5 px-5 mb-6 text-start ${
            fieldErrors.resetCode
              ? "bg-white border text-[#F11111] border-[#FF6B6B]"
              : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
          }`}
          placeholder="Enter OTP"
          value={resetCode}
          onChangeText={(code) => {
            // Only allow numbers and limit to 6 digits
            const numericCode = code.replace(/[^0-9]/g, "").slice(0, 6);
            setResetCode(numericCode);
            clearFieldError("resetCode");
          }}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor="#555"
        />

        <View className="w-full mb-6 relative">
          <TextInput
            style={{ fontSize: 18 }}
            className={`w-full  rounded-[10px] py-5 px-5 pr-14 ${
              fieldErrors.newPassword || fieldErrors.confirmPassword
                ? "bg-white border text-[#F11111] border-[#FF6B6B]"
                : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
            }`}
            placeholder="Create Password"
            value={newPassword}
            onChangeText={(password) => {
              setNewPassword(password);
              clearFieldError("newPassword");
              clearFieldError("confirmPassword");
              // Clear confirm password error if passwords now match
              // if (confirmPassword && password === confirmPassword) {
              //   clearFieldError("confirmPassword");
              // }
            }}
            secureTextEntry={!isPasswordVisible}
            textContentType="newPassword"
            placeholderTextColor="#555"
          />
          {newPassword && (
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

        <View className="w-full mb-12 relative">
          <TextInput
            style={{ fontSize: 18 }}
            className={`w-full   rounded-[10px] py-5 px-5 pr-14 ${
              fieldErrors.newPassword || fieldErrors.confirmPassword
                ? "bg-white border text-[#F11111] border-[#FF6B6B]"
                : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
            }`}
            placeholder="Re - Enter New Password"
            value={confirmPassword}
            onChangeText={(password) => {
              setConfirmPassword(password);
              clearFieldError("newPassword");
              clearFieldError("confirmPassword");
              // Clear error if passwords now match
              // if (newPassword && password === newPassword) {
              //   clearFieldError("confirmPassword");
              // }
            }}
            secureTextEntry={!isConfirmPasswordVisible}
            textContentType="newPassword"
            placeholderTextColor="#555"
          />
          {confirmPassword && (
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }
              className="absolute right-5 top-1/2 -translate-y-[50%]"
            >
              {isConfirmPasswordVisible ? (
                <EyeSVG width={24} height={24} />
              ) : (
                <ClosedEyeSVG width={24} height={24} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          className="w-[202px] bg-white rounded-[10px] py-5 px-8 mb-4"
          onPress={handleResetPassword}
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

        {/* <View className="mt-16 flex w-full flex-row justify-between">
          <TouchableOpacity onPress={() => router.push("/login" as never)}>
            <Text className="text-[#000000] font-normal">
              Back to Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/forgot-password" as never)}>
            <Text className="text-[#000000] font-normal">
              Resend Code
            </Text>
          </TouchableOpacity>
        </View> */}

        {/* {errorMessage !== "" && (
          <View className="absolute bottom-0 w-full">
            <View className=" py-5">
              <Text className="text-[#F11111] text-2xl px-2 text-center font-normal">
                {`[ ${errorMessage} ]`}
              </Text>
            </View>
          </View>
        )} */}
      </View>
    );
  };

  return (
    <>
      {Platform.OS === "web" ? (
        <>
          <BackButton title="Reset Password" />
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
          <BackButton title="Reset Password" />
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
