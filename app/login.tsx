// import { ClosedEyeSVG, EyeSVG } from "./svgs/SVG";
// import { router } from "expo-router";
// import React, { useEffect, useState } from "react";
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

// import EmailOrPhoneInput from "./components/EmailOrPhoneInput";

// export default function Login() {
//   const [identifier, setIdentifier] = useState(""); // Changed from email to identifier
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);
//   const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

//   const baseUrl = "http://localhost:2001";
//   // const baseUrl = 'http://localhost:2001'

//   const [fieldErrors, setFieldErrors] = useState({
//     identifier: false, // Changed from email to identifier
//     password: false,
//   });

//   useEffect(() => {
//     console.log("identifier.....", identifier);
//   }, [identifier]);

//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };

//   const validateMobile = (mobile: string) => {
//     // Basic mobile validation - adjust regex as needed
//     const mobileRegex = /^\d{10}$/;
//     return mobileRegex.test(mobile);
//   };

//   const getIdentifierType = (value: string) => {
//     if (validateEmail(value)) return "email";
//     if (validateMobile(value)) return "mobile";
//     return null;
//   };

//   const clearFieldError = (fieldName: string) => {
//     setFieldErrors((prev) => ({ ...prev, [fieldName]: false }));
//     setErrorMessage("");
//   };

//   const validateForm = () => {
//     const errors = {
//       identifier: !identifier.trim() || !getIdentifierType(identifier.trim()),
//       password: !password.trim(),
//     };

//     setFieldErrors(errors);

//     if (!identifier.trim()) {
//       setErrorMessage("Email or phone number is required");
//       return false;
//     }

//     const identifierType = getIdentifierType(identifier.trim());

//     if (!identifierType) {
//       setErrorMessage("Please enter a valid email address or phone number");
//       return false;
//     }

//     if (!password.trim()) {
//       setErrorMessage("Password is required");
//       return false;
//     }

//     return true;
//   };

//   const getInputStyle = (hasError: boolean) => {
//     const baseStyle = "border";
//     const errorStyle = "bg-white text-[#F11111] border-[#FF6B6B]";
//     const normalStyle = "bg-white text-[#1F1E1E] border-[#B2EBF2]";

//     // ? "bg-white border text-[#F11111] border-[#FF6B6B]"
//     // : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"

//     return `${baseStyle} ${hasError ? errorStyle : normalStyle}`;
//   };

//   const handleLogin = async () => {
//     Keyboard.dismiss();

//     setErrorMessage("");
//     if (!validateForm()) return;

//     setIsLoading(true);
//     try {
//       console.log("Attempting to login with:", { identifier });

//       let id = identifier.trim();
//       if (getIdentifierType(identifier.trim()) === "mobile") {
//         // If identifier is a mobile number, prepend the selected country code
//         id = `${selectedCountryCode}${identifier.trim()}`;
//       }

//       // Prepare the request body
//       const requestBody = {
//         identifier: id.trim(),
//         password: password.trim(),
//       };

//       const response = await fetch(`${baseUrl}/api/auth/signin`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       });

//       console.log("Response status:", response.status);
//       const data = await response.json();
//       console.log("Response data:", data);

//       if (response.ok) {
//         Toast.show({
//           type: "success",
//           text1: data?.message,
//         });

//         // Navigate to verification page with the delivery method info
//         router.push({
//           pathname: "/verify-email",
//           params: {
//             deliveryMethod: data.deliveryMethod,
//             maskedDestination: data.maskedDestination,
//             identifier: id.trim(),
//           },
//         });
//       } else {
//         // Handle specific error codes
//         switch (data.code) {
//           case "MISSING_FIELDS":
//             setErrorMessage("Please fill in all required fields");
//             break;
//           case "INVALID_IDENTIFIER":
//             setErrorMessage(
//               "Please enter a valid email address or phone number"
//             );
//             break;
//           case "USER_NOT_FOUND":
//             setErrorMessage(
//               "Account not found. Please check your credentials or sign up."
//             );
//             break;
//           case "INVALID_PASSWORD":
//             setErrorMessage("Incorrect password. Please try again.");
//             break;
//           case "EMAIL_NOT_AVAILABLE":
//             setErrorMessage(
//               "Email verification not available for this account"
//             );
//             break;
//           case "MOBILE_NOT_AVAILABLE":
//             setErrorMessage("SMS verification not available for this account");
//             break;
//           case "DELIVERY_ERROR":
//             setErrorMessage(
//               "Failed to send verification code. Please try again."
//             );
//             break;
//           default:
//             setErrorMessage(data.message || "Login failed");
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       if (
//         error instanceof TypeError &&
//         error.message.includes("Network request failed")
//       ) {
//         console.log("Network error. Please check your internet connection.");
//         setErrorMessage(
//           "Network error. Please check your internet connection."
//         );
//       } else {
//         setErrorMessage("An error occurred. Please try again.");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const FormLayout = () => {
//     return (
//       <View className="flex-1 items-center justify-center p-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
//         <EmailOrPhoneInput
//           identifier={identifier}
//           onChange={(value) => {
//             setIdentifier(value);
//             if (getIdentifierType(value.trim())) clearFieldError("identifier");
//           }}
//           fieldError={fieldErrors.identifier}
//           selectedCountryCode={selectedCountryCode}
//           setSelectedCountryCode={setSelectedCountryCode}
//           showDropdown={showCountryCodeDropdown}
//           setShowDropdown={setShowCountryCodeDropdown}
//           placeholder="NUMBER, EMAIL OR USERNAME"
//         />

//         <View className="w-full mb-12 relative">
//           <TextInput
//             className={`w-full   text-lg rounded-[10px] py-5 px-5 pr-14 ${getInputStyle(
//               fieldErrors.password
//             )}`}
//             placeholder="PASSWORD"
//             value={password}
//             onChangeText={(password) => {
//               setPassword(password);
//               clearFieldError("password");
//             }}
//             secureTextEntry={!isPasswordVisible}
//             textContentType="password"
//             placeholderTextColor="#555"
//           />
//           <TouchableOpacity
//             onPress={() => setIsPasswordVisible(!isPasswordVisible)}
//             className="absolute right-5 top-1/2 -translate-y-[50%]"
//           >
//             {isPasswordVisible ? (
//               <EyeSVG width={24} height={24} />
//             ) : (
//               <ClosedEyeSVG width={24} height={24} />
//             )}
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity
//           className="w-[202px] bg-white rounded-[10px] py-5 px-8 mb-4"
//           onPress={handleLogin}
//           disabled={isLoading}
//         >
//           {isLoading ? (
//             <ActivityIndicator size={24} color="#000000" />
//           ) : (
//             <Text className="text-[#000000] text-center font-normal text-lg">
//               Log Me In
//             </Text>
//           )}
//         </TouchableOpacity>

//         <View className="mt-40 flex w-full flex-row justify-between">
//           <TouchableOpacity
//             className="bg-white py-2 px-2 rounded-lg"
//             onPress={() => router.push("/signup")}
//           >
//             <Text className="text-[#332E2E] font-normal">
//               Create new account
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-white py-2 px-2 rounded-lg"
//             // onPress={() => router.push("/reset-password")}
//             onPress={() => router.push("/recovery-methods")}
//           >
//             <Text className="text-[#332E2E] font-normal">Forgot Password?</Text>
//           </TouchableOpacity>
//         </View>

//         {errorMessage !== "" && (
//           <View className="absolute bottom-0 w-full">
//             <View className="py-5">
//               <Text className="text-[#F11111] text-2xl px-2 text-center font-normal">
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
//         <ScrollView
//           contentContainerStyle={{
//             flexGrow: 1,
//           }}
//           keyboardShouldPersistTaps="handled"
//         >
//           {FormLayout()}
//         </ScrollView>
//       ) : (
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={{ flex: 1 }}
//         >
//           <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//             <ScrollView
//               contentContainerStyle={{
//                 flexGrow: 1,
//               }}
//               keyboardShouldPersistTaps="handled"
//             >
//               {FormLayout()}
//             </ScrollView>
//           </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//       )}
//     </>
//   );
// }

import { ClosedEyeSVG, EyeSVG } from "./svgs/SVG";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function Login() {
  const [identifier, setIdentifier] = useState(""); // Can be email, phone, or username
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");

  const baseUrl = "http://localhost:2001";
  // const baseUrl = 'http://localhost:2001'

  const [fieldErrors, setFieldErrors] = useState({
    identifier: false,
    password: false,
  });

  useEffect(() => {
    console.log("identifier.....", identifier);
  }, [identifier]);

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
    setErrorMessage("");
  };

  const validateForm = () => {
    const errors = {
      identifier: !identifier.trim() || !getIdentifierType(identifier.trim()),
      password: !password.trim(),
    };

    setFieldErrors(errors);

    if (!identifier.trim()) {
      setErrorMessage("Email, phone number, or username is required");
      return false;
    }

    const identifierType = getIdentifierType(identifier.trim());

    if (!identifierType) {
      setErrorMessage(
        "Please enter a valid email address, phone number, or username"
      );
      return false;
    }

    if (!password.trim()) {
      setErrorMessage("Password is required");
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

    setErrorMessage("");
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log("Attempting to login with:", { identifier });

      let id = identifier.trim();
      const identifierType = getIdentifierType(identifier.trim());

      // Only prepend country code for mobile numbers
      if (identifierType === "mobile") {
        id = `${selectedCountryCode}${identifier.trim()}`;
      }

      // Prepare the request body
      const requestBody = {
        identifier: id.trim(),
        password: password.trim(),
      };

      const response = await fetch(`${baseUrl}/api/auth/signin`, {
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
          text1: data?.message,
        });

        // Navigate to verification page with the delivery method info
        router.push({
          pathname: "/verify-email",
          params: {
            deliveryMethod: data.deliveryMethod,
            maskedDestination: data.maskedDestination,
            identifier: id.trim(),
          },
        });
      } else {
        // Handle specific error codes
        switch (data.code) {
          // case "MISSING_FIELDS":
          //   setErrorMessage("Please fill in all required fields");
          //   break;
          // case "INVALID_IDENTIFIER":
          //   setErrorMessage(
          //     "Please enter a valid email address, phone number, or username"
          //   );
          //   break;
          // case "USER_NOT_FOUND":
          //   setErrorMessage(
          //     "Account not found. Please check your credentials or sign up."
          //   );
          //   break;
          // case "INVALID_PASSWORD":
          //   setErrorMessage("Incorrect password. Please try again.");
          //   break;
          // case "EMAIL_NOT_AVAILABLE":
          //   setErrorMessage(
          //     "Email verification not available for this account"
          //   );
          //   break;
          // case "MOBILE_NOT_AVAILABLE":
          //   setErrorMessage("SMS verification not available for this account");
          //   break;
          // case "DELIVERY_ERROR":
          //   setErrorMessage(
          //     "Failed to send verification code. Please try again."
          //   );
          //   break;
          default:
            setErrorMessage(data.message || "Login failed");
        }
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
                        // onPress={() => router.push("/choose-recovery")}

          >
            <Text className="text-[#332E2E] font-normal">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {errorMessage !== "" && (
          <View className="absolute bottom-0 w-full">
            <View className="py-5">
              <Text className="text-[#F11111] text-2xl px-2 text-center font-normal">
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
    </>
  );
}
