import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import EmailOrPhoneInput from "./components/EmailOrPhoneInput";
import { ErrorPopup } from "./components/ErrorPopup";
import { baseUrl } from "./config/config";
import useErrorMessage from "./hooks/useErrorMessage";

export default function LoginOTP() {
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showDropdown, setShowDropdown] = useState(false);
  const { errorMessage, showError, dismissError, slideAnim } =
    useErrorMessage();
  const [fieldError, setFieldError] = useState(false);

//   useEffect(() => {
//     RNOtpVerify.getHash()
//       .then((hashArray) => {
//         console.log("APP HASH:", hashArray);
//       })
//       .catch(console.error);
//   }, []);

  const validateMobile = (value: string) => /^\d{10}$/.test(value);

  const handleSendOtp = async () => {
    Keyboard.dismiss();
    const trimmed = mobile.trim();
    if (!validateMobile(trimmed)) {
      setFieldError(true);
      showError("Enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const fullMobile = `${selectedCountryCode}${trimmed}`;
      const response = await fetch(`${baseUrl}/api/auth/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: fullMobile }),
      });

      const data = await response.json();
      if (response.ok) {
        Toast.show({ type: "success", text1: data.message });
        // router.push({
        //   pathname: "/verify-otp" as any,
        //   params: {
        //     mobile: fullMobile,
        //     deliveryMethod: "sms",
        //   },
        // });
        console.log("data......", data);
        router.push({
          pathname: "/verify-email" as any,
          params: {
            deliveryMethod: data.deliveryMethod,
            identifier: fullMobile,
          },
        });
      } else {
        showError(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      showError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const FormLayout = () => {
    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 items-center justify-center px-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
          <Text className="text-white text-2xl font-bold mb-6">
            Login with OTP
          </Text>

          <EmailOrPhoneInput
            identifier={mobile}
            onChange={(value) => {
              setMobile(value);
              setFieldError(false);
            }}
            fieldError={fieldError}
            selectedCountryCode={selectedCountryCode}
            setSelectedCountryCode={setSelectedCountryCode}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            placeholder="Enter mobile number"
          />

          <TouchableOpacity
            className="w-[202px] mt-6 bg-white py-4 rounded-lg"
            onPress={handleSendOtp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text className="text-black text-center text-lg">Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {Platform.OS === "web" ? (
        <>{FormLayout()}</>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          {FormLayout()}
        </TouchableWithoutFeedback>
      )}

      {errorMessage && (
        <ErrorPopup
          errorMessage={errorMessage}
          slideAnim={slideAnim}
          onDismiss={dismissError}
        />
      )}
    </KeyboardAvoidingView>
  );
}
