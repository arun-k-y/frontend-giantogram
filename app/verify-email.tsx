// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState, useEffect } from "react";
// import {
//   ActivityIndicator,
//   Keyboard,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import Toast from "react-native-toast-message";
// import BackButton from "./components/BackButton";
// import { useAuth } from "./components/auth-context";

// export default function Verify2FA() {
//   const { accessToken, email, mobile, isDeactivated } = useAuth();

//   const [otp, setOtp] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isResending, setIsResending] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [countdown, setCountdown] = useState(59);

//   const params = useLocalSearchParams();
//   const router = useRouter();

//   // Get parameters from navigation
//   const deliveryMethod = params.deliveryMethod || "email";
//   const maskedDestination = params.maskedDestination || "";
//   const identifier = params.identifier || "";

//   const baseUrl = "http://localhost:2001";

//   // const baseUrl = "http://localhost:2001";

//   // Countdown timer for resend button
//   useEffect(() => {
//     let timer: any = null;
//     if (countdown > 0) {
//       timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   const verify2FA = async () => {
//     Keyboard.dismiss();
//     setIsLoading(true);
//     setErrorMessage("");

//     if (!otp.trim()) {
//       setErrorMessage("Please enter the verification code");
//       setIsLoading(false);
//       return;
//     }

//     if (otp.trim().length !== 6) {
//       setErrorMessage("Please enter a valid 6-digit code");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(`${baseUrl}/api/auth/verify-email`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identifier,
//           code: otp.trim(),
//         }),
//       });

//       const result = await response.json();

//       if (response.ok && result?.token) {
//         // Store user data
//         // await AsyncStorage.setItem("userToken", result.token);
//         // await AsyncStorage.setItem(
//         //   "isDeactivated",
//         //   JSON.stringify(result?.user?.isDeactivated || false)
//         // );

//         // // Store email if available
//         // if (result.user?.email) {
//         //   await AsyncStorage.setItem("userEmail", result.user.email);
//         // }

//         // // Store mobile if available
//         // if (result.user?.mobile) {
//         //   await AsyncStorage.setItem("userMobile", result.user.mobile);
//         // }

//         Toast.show({
//           type: "success",
//           text1: "Login successful!",
//         });

//         // if (Platform.OS === "android" || Platform.OS === "ios") {
//         //   router.replace("/profile-pic");
//         //   // router.replace("/choose-recovery");
//         // } else {
//         //   router.replace("/home2");
//         // }

//         router.replace({
//           pathname: "/remember-me",
//           params: {
//             token: result.token,
//             email: result.user?.email || "",
//             mobile: result.user?.mobile || "",
//             isDeactivated: JSON.stringify(result.user?.isDeactivated || false),
//           },
//         });

//         // }
//       } else {
//         // Handle specific error codes
//         switch (result.code) {
//           case "MISSING_FIELDS":
//             setErrorMessage("Please enter the verification code");
//             break;
//           case "INVALID_CODE":
//           case 400: // Handle numeric code as well
//             setErrorMessage("Invalid verification code. Please try again.");
//             break;
//           case "CODE_EXPIRED":
//             setErrorMessage(
//               "Verification code has expired. Please request a new one."
//             );
//             break;
//           case "USER_NOT_FOUND":
//             setErrorMessage("Session expired. Please login again.");
//             break;
//           case "MAX_ATTEMPTS_EXCEEDED":
//             setErrorMessage("Too many incorrect attempts. Please login again.");
//             break;
//           default:
//             setErrorMessage(
//               result.message || "Invalid code. Please try again."
//             );
//         }
//       }
//     } catch (error) {
//       console.error("Verify error:", error);
//       if (
//         error instanceof TypeError &&
//         error.message.includes("Network request failed")
//       ) {
//         setErrorMessage("Network error. Please check your connection.");
//       } else {
//         setErrorMessage("Something went wrong. Please try again.");
//       }
//     }

//     setIsLoading(false);
//   };

//   const resendCode = async () => {
//     if (countdown > 0) return; // Prevent resend during countdown

//     setIsResending(true);
//     setErrorMessage("");

//     try {
//       const response = await fetch(`${baseUrl}/api/auth/resend-2fa`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           identifier,
//           preferredMethod: deliveryMethod,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         Toast.show({
//           type: "success",
//           text1: "Verification code sent!",
//           text2: `Sent to your ${
//             deliveryMethod === "email" ? "email" : "mobile"
//           }`,
//         });
//         setCountdown(60); // 60 second countdown
//         setOtp(""); // Clear existing OTP
//       } else {
//         // Handle specific error codes
//         switch (result.code) {
//           case "TOO_EARLY":
//             setErrorMessage("Please wait before requesting a new code");
//             break;
//           case "USER_NOT_FOUND":
//             setErrorMessage("Session expired. Please login again.");
//             break;
//           case "EMAIL_NOT_AVAILABLE":
//             setErrorMessage("Email not available for verification");
//             break;
//           case "MOBILE_NOT_AVAILABLE":
//             setErrorMessage("Mobile number not available for verification");
//             break;
//           case "DELIVERY_ERROR":
//             setErrorMessage("Failed to send code. Please try again.");
//             break;
//           default:
//             setErrorMessage(result.message || "Failed to resend code");
//         }
//       }
//     } catch (error) {
//       console.error("Resend error:", error);
//       if (
//         error instanceof TypeError &&
//         error.message.includes("Network request failed")
//       ) {
//         setErrorMessage("Network error. Please check your connection.");
//       } else {
//         setErrorMessage("Failed to resend code. Please try again.");
//       }
//     }

//     setIsResending(false);
//   };

//   const getVerificationMessage = () => {
//     const method = deliveryMethod === "email" ? "email" : "mobile number";
//     const destination =
//       maskedDestination ||
//       (deliveryMethod === "email" ? "your email" : "your mobile number");

//     return `We sent a verification code to your ${method} ${destination}`;
//   };

//   const getResendButtonText = () => {
//     if (countdown > 0) {
//       return `Resend OTP (${countdown}s)`;
//     }
//     return "Resend OTP";
//   };

//   const FormLayout = () => {
//     return (
//       <View className="flex-1 items-center justify-start p-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
//         {/* Message */}
//         <View className="mb-5 mt-10 w-full">
//           <Text className="text-white text-base leading-6 text-start">
//             {getVerificationMessage()}
//           </Text>
//         </View>

//         {/* OTP Input */}
//         <View className="w-full mb-8">
//           <TextInput
//             style={{ fontSize: 18 }}
//             className="w-full text-[#1F1E1E] bg-white border border-[#B2EBF2] rounded-[10px] py-5 px-5 text-start"
//             placeholder="Enter OTP"
//             value={otp}
//             onChangeText={(text) => {
//               // Only allow numbers and limit to 6 digits
//               const numericText = text.replace(/[^0-9]/g, "").slice(0, 6);
//               setOtp(numericText);
//               if (errorMessage) setErrorMessage(""); // Clear error when typing
//             }}
//             keyboardType="numeric"
//             maxLength={6}
//             placeholderTextColor="#555"
//             autoFocus={true}
//             editable={!isLoading}
//           />
//         </View>

//         {/* Verify Button */}
//         <TouchableOpacity
//           onPress={verify2FA}
//           disabled={isLoading || otp.length !== 6}
//           className={`w-[202px] bg-white rounded-[10px] py-5 px-8 mb-6 ${
//             isLoading || otp.length !== 6 ? "opacity-50" : ""
//           }`}
//         >
//           {isLoading ? (
//             <ActivityIndicator size={24} color="#000000" />
//           ) : (
//             <Text className="text-[#000000] text-center font-normal text-lg">
//               Verify
//             </Text>
//           )}
//         </TouchableOpacity>

//         {/* Resend Button */}
//         <TouchableOpacity
//           onPress={resendCode}
//           disabled={isResending || countdown > 0}
//           className={`w-[202px] border border-white rounded-[10px] py-5 px-8 ${
//             isResending || countdown > 0 ? "opacity-50" : ""
//           }`}
//         >
//           {isResending ? (
//             <ActivityIndicator size={20} color="#ffffff" />
//           ) : (
//             <Text className="text-white text-center font-normal text-lg">
//               {getResendButtonText()}
//             </Text>
//           )}
//         </TouchableOpacity>

//         {/* Help Text */}
//         <View className="mt-4 w-full">
//           <Text className="text-gray-400 text-sm text-center">
//             Didn&apos;t receive the code? Check your spam folder or try
//             resending.
//           </Text>
//         </View>

//         {/* Error Message */}
//         {errorMessage !== "" && (
//           <View className="absolute bottom-0 w-full">
//             <View className="py-5">
//               <Text className="text-[#F11111] text-xl px-2 text-center font-normal">
//                 {errorMessage}
//               </Text>
//             </View>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <>
//       {Platform.OS === "web" ? (
//         <>
//           <BackButton showTitle={false} />
//           <ScrollView
//             contentContainerStyle={{ flexGrow: 1 }}
//             keyboardShouldPersistTaps="handled"
//           >
//             {FormLayout()}
//           </ScrollView>
//         </>
//       ) : (
//         <>
//           <BackButton showTitle={false} />
//           <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={{ flex: 1 }}
//           >
//             <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//               <ScrollView
//                 contentContainerStyle={{ flexGrow: 1 }}
//                 keyboardShouldPersistTaps="handled"
//               >
//                 {FormLayout()}
//               </ScrollView>
//             </TouchableWithoutFeedback>
//           </KeyboardAvoidingView>
//         </>
//       )}
//     </>
//   );
// }

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
import DeactivatedAccountModal from "./components/DeactivatedAccountModal";
import { baseUrl } from "./config/config";
import { ErrorPopup } from "./components/ErrorPopup";
import useErrorMessage from "./hooks/useErrorMessage";

export default function Verify2FA() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(59);
  const { errorMessage, showError, dismissError, slideAnim } =
    useErrorMessage();

  // States for deactivated account modal
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [deactivatedUserData, setDeactivatedUserData] = useState<any>(null);

  const params = useLocalSearchParams();
  const router = useRouter();

  // Get parameters from navigation
  const deliveryMethod = params.deliveryMethod || "email";
  const maskedDestination = params.maskedDestination || "";
  const identifier = params.identifier || "";

  // const baseUrl = "http://localhost:2001";

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
    // setErrorMessage("");

    if (!otp.trim()) {
      showError("Please enter the verification code");
      setIsLoading(false);
      return;
    }

    if (otp.trim().length !== 6) {
      showError("Please enter a valid 6-digit code");
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
        // Check if account is deactivated
        if (result.user?.isDeactivated) {
          setDeactivatedUserData({
            token: result.token,
            user: result.user,
          });
          setShowDeactivatedModal(true);
          setIsLoading(false);
          return;
        }

        // Normal flow for active accounts
        Toast.show({
          type: "success",
          text1: "Login successful!",
        });

        router.replace({
          pathname: "/remember-me",
          params: {
            token: result.token,
            email: result.user?.email || "",
            mobile: result.user?.mobile || "",
            isDeactivated: JSON.stringify(result.user?.isDeactivated || false),
          },
        });
      } else {
        // Handle specific error codes
        switch (result.code) {
          case "MISSING_FIELDS":
            showError("Please enter the verification code");
            break;
          case "INVALID_CODE":
          case 400: // Handle numeric code as well
            showError("Invalid verification code. Please try again.");
            break;
          case "CODE_EXPIRED":
            showError(
              "Verification code has expired. Please request a new one."
            );
            break;
          case "USER_NOT_FOUND":
            showError("Session expired. Please login again.");
            break;
          case "MAX_ATTEMPTS_EXCEEDED":
            showError("Too many incorrect attempts. Please login again.");
            break;
          default:
            showError(result.message || "Invalid code. Please try again.");
        }
      }
    } catch (error) {
      console.error("Verify error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        showError("Network error. Please check your connection.");
      } else {
        showError("Something went wrong. Please try again.");
      }
    }

    setIsLoading(false);
  };

  const handleDeclineDeactivated = () => {
    setShowDeactivatedModal(false);
    setDeactivatedUserData(null);
    // Clear OTP and show message
    setOtp("");
    // Toast.show({
    //   type: "info",
    //   text1: "Login cancelled",
    //   text2: "Please contact support if you need help",
    // });

    router.replace("/login")
  };

  const handleReactivateAccount = async () => {
    try {
      if (!deactivatedUserData) return;

      const response = await fetch(`${baseUrl}/api/auth/reactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${deactivatedUserData.token}`,
        },
        body: JSON.stringify({
          identifier:
            deactivatedUserData.user.username || deactivatedUserData.user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Toast.show({
          type: "error",
          text1: "Reactivation failed",
          text2: errorData.message || "Failed to reactivate account",
        });
        return;
      }

      // Successfully reactivated - proceed with normal flow
      setShowDeactivatedModal(false);

      Toast.show({
        type: "success",
        text1: "Account reactivated!",
        text2: "Welcome back!",
      });

      // Continue to remember-me screen with updated data
      router.replace({
        pathname: "/remember-me",
        params: {
          token: deactivatedUserData.token,
          email: deactivatedUserData.user?.email || "",
          mobile: deactivatedUserData.user?.mobile || "",
          isDeactivated: "false", // Now reactivated
        },
      });

      setDeactivatedUserData(null);
    } catch (error) {
      console.error("Reactivation error:", error);
      Toast.show({
        type: "error",
        text1: "Network error",
        text2: "Failed to reactivate account. Please try again.",
      });
    }
  };

  const resendCode = async () => {
    if (countdown > 0) return; // Prevent resend during countdown

    setIsResending(true);
    // setErrorMessage("");

    try {
      const response = await fetch(`${baseUrl}/api/auth/resend-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        if (result?.code) {
          showError(result.message || "Failed to resend code");
        }
      }
    } catch (error) {
      console.error("Resend error:", error);
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
        showError("Network error. Please check your connection.");
      } else {
        showError("Failed to resend code. Please try again.");
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
              // if (errorMessage) setErrorMessage(""); // Clear error when typing
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
        {/* {errorMessage !== "" && (
          <View className="absolute bottom-0 w-full">
            <View className="py-5">
              <Text className="text-[#F11111] text-xl px-2 text-center font-normal">
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

      {/* Deactivated Account Modal */}
      <DeactivatedAccountModal
        isVisible={showDeactivatedModal}
        onDecline={handleDeclineDeactivated}
        onReactivate={handleReactivateAccount}
        username={
          deactivatedUserData?.user?.username ||
          deactivatedUserData?.user?.email
        }
      />

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
