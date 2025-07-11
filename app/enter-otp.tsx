import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
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
import { useAuth } from "./providers/auth-context";
import { baseUrl } from "./config/config";

export default function EnterOtp() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [countdown, setCountdown] = useState(59);
  const { accessToken } = useAuth();
  const { setAuthData } = useAuth();

  const params = useLocalSearchParams();
  const router = useRouter();

  // Get parameters from navigation
  const deliveryMethod = params.deliveryMethod || "email";
  const maskedDestination = params.maskedDestination || "";
  const identifier = params.identifier || "";

  // Countdown timer for resend button
  useEffect(() => {
    let timer: any = null;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const verify2FA = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMessage("");

    if (!otp.trim()) {
      setErrorMessage("Please enter the verification code");
      setIsLoading(false);
      return;
    }

    if (otp.trim().length !== 6) {
      setErrorMessage("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          code: otp.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result?.token) {
        setAuthData(
          {
            accessToken: String(result.token),
            email: String(result.user.email),
            mobile: String(result.user.mobile),
            isDeactivated: result?.user?.isDeactivated === true,
          },
          false // 👈 DON'T REMEMBER, only in memory
        );

      
        router.replace({
          pathname: "/set-password",
        });

      } else {
        // Handle specific error codes
        switch (result.code) {
          default:
            setErrorMessage(
              result.message || "Invalid code. Please try again."
            );
        }
      }
    } catch (error) {
      console.error("Verify error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }

    setIsLoading(false);
  };

  const resendCode = async () => {
    if (countdown > 0) return; // Prevent resend during countdown

    setIsResending(true);
    setErrorMessage("");

    try {
      // const token = await AsyncStorage.getItem("userToken");

      const token = accessToken;

      const response = await fetch(`${baseUrl}/api/auth/resend-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          identifier,
          preferredMethod: deliveryMethod,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Verification code sent!",
          text2: `Sent to your ${
            deliveryMethod === "email" ? "email" : "mobile"
          }`,
        });
        setCountdown(60); // 60 second countdown
        setOtp(""); // Clear existing OTP
      } else {
        // Handle specific error codes
        switch (result.code) {
          case "TOO_EARLY":
            setErrorMessage("Please wait before requesting a new code");
            break;
          case "USER_NOT_FOUND":
            setErrorMessage("Session expired. Please login again.");
            break;
          case "EMAIL_NOT_AVAILABLE":
            setErrorMessage("Email not available for verification");
            break;
          case "MOBILE_NOT_AVAILABLE":
            setErrorMessage("Mobile number not available for verification");
            break;
          case "DELIVERY_ERROR":
            setErrorMessage("Failed to send code. Please try again.");
            break;
          default:
            setErrorMessage(result.message || "Failed to resend code");
        }
      }
    } catch (error) {
      console.error("Resend error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        setErrorMessage("Network error. Please check your connection.");
      } else {
        setErrorMessage("Failed to resend code. Please try again.");
      }
    }

    setIsResending(false);
  };

  const getVerificationMessage = () => {
    const method = deliveryMethod === "email" ? "email" : "mobile number";
    const destination =
      maskedDestination ||
      (deliveryMethod === "email" ? "your email" : "your mobile number");

    return `We sent a verification code to your ${method} ${destination}`;
  };

  const getResendButtonText = () => {
    if (countdown > 0) {
      return `Resend OTP (${countdown}s)`;
    }
    return "Resend OTP";
  };

  const FormLayout = () => {
    return (
      <View className="flex-1 items-center justify-start p-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
        {/* Message */}
        <View className="mb-5 mt-10 w-full">
          <Text className="text-white text-base leading-6 text-start">
            {getVerificationMessage()}
          </Text>
        </View>

        {/* OTP Input */}
        <View className="w-full mb-8">
          <TextInput
            style={{ fontSize: 18 }}
            className="w-full text-[#1F1E1E] bg-white border border-[#B2EBF2] rounded-[10px] py-5 px-5 text-start"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={(text) => {
              // Only allow numbers and limit to 6 digits
              const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
              setOtp(numericText);
              if (errorMessage) setErrorMessage(""); // Clear error when typing
            }}
            keyboardType="numeric"
            maxLength={6}
            placeholderTextColor="#555"
            autoFocus={true}
            editable={!isLoading}
          />
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          onPress={verify2FA}
          disabled={isLoading || otp.length !== 6}
          className={`w-[202px] bg-white rounded-[10px] py-5 px-8 mb-6 ${
            isLoading || otp.length !== 6 ? "opacity-50" : ""
          }`}
        >
          {isLoading ? (
            <ActivityIndicator size={24} color="#000000" />
          ) : (
            <Text className="text-[#000000] text-center font-normal text-lg">
              Verify
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend Button */}
        <TouchableOpacity
          onPress={resendCode}
          disabled={isResending || countdown > 0}
          className={`w-[202px] border border-white rounded-[10px] py-5 px-8 ${
            isResending || countdown > 0 ? "opacity-50" : ""
          }`}
        >
          {isResending ? (
            <ActivityIndicator size={20} color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-normal text-lg">
              {getResendButtonText()}
            </Text>
          )}
        </TouchableOpacity>

        {/* Help Text */}
        <View className="mt-4 w-full">
          <Text className="text-gray-400 text-sm text-center">
            Didn&apos;t receive the code? Check your spam folder or try
            resending.
          </Text>
        </View>

        {/* Error Message */}
        {errorMessage !== "" && (
          <View className="absolute bottom-0 w-full">
            <View className="py-5">
              <Text className="text-[#F11111] text-xl px-2 text-center font-normal">
                {`[ ${errorMessage} ]`}
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
          <BackButton showTitle={false} />
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            {FormLayout()}
          </ScrollView>
        </>
      ) : (
        <>
          <BackButton showTitle={false} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
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
