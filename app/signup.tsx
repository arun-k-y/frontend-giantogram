import { ClosedEyeSVG, EyeSVG } from "./svgs/SVG";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { CountryPickerModal } from "./components/CountryPickerModal";
import { Dropdown } from "react-native-element-dropdown";
import { countryCodeOptions, genderOptions } from "./constants/constants";
import BackButton from "./components/BackButton";

// Conditional import for native platforms only
let DateTimePicker: any = null;
if (Platform.OS !== "web") {
  DateTimePicker = require("@react-native-community/datetimepicker").default;
}

export default function SignUp() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [showCountryCodeDropdown, setShowCountryCodeDropdown] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [dobText, setDobText] = useState(""); // For web text input
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // State to track which fields have errors
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    emailOrMobile: false,
    password: false,
    confirmPassword: false,
    gender: false,
    dob: false,
  });

  const baseUrl = "http://localhost:2001";
  // const baseUrl = "http://localhost:2001";

  const detectInputType = (input: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[\d\s\-\(\)]{7,15}$/;

    if (emailRegex.test(input)) return "email";
    if (mobileRegex.test(input.replace(/\s/g, ""))) return "mobile";
    return "unknown";
  };

  const getFullMobileNumber = () => {
    const inputType = detectInputType(emailOrMobile.trim());
    if (inputType === "mobile") {
      return selectedCountryCode + emailOrMobile.trim();
    }
    return emailOrMobile.trim();
  };

  const validateDateOfBirth = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    // Adjust age if birth month/day hasn't occurred this year
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    return actualAge >= 13 && actualAge <= 150 && date <= today;
  };

  const validateDateString = (dateString: string) => {
    if (!dateString) return false;

    // Check format YYYY-MM-DD or MM/DD/YYYY or DD/MM/YYYY
    const patterns = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY or DD/MM/YYYY
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY or D/M/YYYY
    ];

    const isValidFormat = patterns.some((pattern) => pattern.test(dateString));
    if (!isValidFormat) return false;

    const date = new Date(dateString);
    return !isNaN(date.getTime()) && validateDateOfBirth(date);
  };

  const formatDateForDisplay = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateForAPI = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format
  };

  // Handle date input for web
  const handleWebDateInput = (text: string) => {
    setDobText(text);
    clearFieldError("dob");

    // Try to parse the date
    const date = new Date(text);
    if (!isNaN(date.getTime())) {
      setDob(date);
    } else {
      setDob(null);
    }
  };

  // Handle native date picker
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setDob(selectedDate);
      setDobText(formatDateForAPI(selectedDate));
      clearFieldError("dob");
    }
  };

  const validateForm = () => {
    const inputType = detectInputType(emailOrMobile.trim());

    const errors = {
      username: !username.trim(),
      emailOrMobile: !emailOrMobile.trim() || inputType === "unknown",
      password: !password.trim() || password.length < 8,
      confirmPassword: !confirmPassword.trim() || password !== confirmPassword,
      gender: false, // Gender is optional
      dob:
        Platform.OS === "web"
          ? !dobText.trim() || !validateDateString(dobText)
          : !dob || !validateDateOfBirth(dob),
    };

    setFieldErrors(errors);

    // Set specific error messages
    if (errors.username) {
      setErrorMessage("Username is required");
      return false;
    }
    if (!emailOrMobile.trim()) {
      setErrorMessage("Email or mobile number is required");
      return false;
    }
    if (inputType === "unknown") {
      setErrorMessage("Please enter a valid email address or mobile number");
      return false;
    }
    if (!password.trim()) {
      setErrorMessage("Password is required");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return false;
    }
    if (Platform.OS === "web" && !dobText.trim()) {
      setErrorMessage("Date of birth is required");
      return false;
    }
    if (Platform.OS !== "web" && !dob) {
      setErrorMessage("Date of birth is required");
      return false;
    }
    if (Platform.OS === "web" && !validateDateString(dobText)) {
      setErrorMessage(
        "Please enter a valid date of birth (age must be between 13-150)"
      );
      return false;
    }
    if (Platform.OS !== "web" && !validateDateOfBirth(dob)) {
      setErrorMessage(
        "Please enter a valid date of birth (age must be between 13-150)"
      );
      return false;
    }

    return true;
  };

  const clearFieldError = (fieldName: string) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: false }));
    setErrorMessage("");
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();
    setErrorMessage("");

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const inputType = detectInputType(emailOrMobile.trim());
      const requestBody: any = {
        username,
        password,
        dob:
          Platform.OS === "web"
            ? new Date(dobText).toISOString().split("T")[0]
            : formatDateForAPI(dob),
      };

      // Add email or mobile based on detected type
      if (inputType === "email") {
        requestBody.email = emailOrMobile.trim();
      } else if (inputType === "mobile") {
        requestBody.mobile = getFullMobileNumber();
      }

      // Only include gender if provided
      if (gender.trim()) {
        requestBody.gender = gender;
      }

      const response = await fetch(`${baseUrl}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (response.ok) {
        Toast.show({
          type: "success",
          text1: "Sign up successful!",
          text2: data.message,
        });

        const identifier =
          inputType === "email" ? emailOrMobile.trim() : getFullMobileNumber();

        router.push({
          pathname: "/verify-email",
          params: {
            deliveryMethod: data.deliveryMethod,
            maskedDestination: data.maskedDestination,
            identifier: identifier,
          },
        });
      } else {
        setErrorMessage(data.message || "Sign up failed");

        // Handle specific backend validation errors
        switch (data.code) {
          case "USERNAME_TAKEN":
            setFieldErrors((prev) => ({ ...prev, username: true }));
            break;
          case "EMAIL_TAKEN":
          case "MOBILE_TAKEN":
            setFieldErrors((prev) => ({ ...prev, emailOrMobile: true }));
            break;
          case "INVALID_EMAIL":
          case "INVALID_MOBILE":
            setFieldErrors((prev) => ({ ...prev, emailOrMobile: true }));
            break;
          case "WEAK_PASSWORD":
            setFieldErrors((prev) => ({ ...prev, password: true }));
            break;
          case "INVALID_AGE":
            setFieldErrors((prev) => ({ ...prev, dob: true }));
            break;
        }
      }
    } catch (error) {
      if (
        error instanceof TypeError &&
        error.message.includes("Network request failed")
      ) {
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

  const getInputStyle = (hasError: boolean) => {
    return `w-full   text-lg rounded-[10px] py-5 px-5 ${
      hasError
        ? "bg-white border text-[#E12D39] border-[#FF6B6B]"
        : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
    }`;
  };

  const getPasswordInputStyle = (hasError: boolean) => {
    return `w-full h-[61px] text-lg rounded-[10px] py-5 px-5 pr-14 ${
      hasError
        ? "bg-white border text-[#E12D39] border-[#FF6B6B]"
        : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
    }`;
  };

  const getDatePickerStyle = (hasError: boolean) => {
    return `w-full h-[61px] rounded-[10px] py-5 px-5 flex-row items-center justify-between ${
      hasError
        ? "bg-white border text-[#E12D39] border-[#FF6B6B]"
        : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
    }`;
  };

  const isMobileInput = /^\d+$/.test(emailOrMobile) && emailOrMobile !== "";

  // Calculate maximum date (today) and minimum date (150 years ago)
  const today = new Date();
  const maxDate = new Date(today);
  const minDate = new Date(
    today.getFullYear() - 150,
    today.getMonth(),
    today.getDate()
  );

  // Format dates for HTML input
  const maxDateString = maxDate.toISOString().split("T")[0];
  const minDateString = minDate.toISOString().split("T")[0];

  const FormLayout = () => (
    <View className="flex-1 justify-center items-center p-4 bg-[#0D0D0D] w-full md:w-[500px] self-center">
      <TextInput
        className={getInputStyle(fieldErrors.username) + " mb-4"}
        placeholder="Username"
        value={username}
        onChangeText={(val) => {
          setUsername(val);
          clearFieldError("username");
        }}
        autoCapitalize="none"
        placeholderTextColor="#555"
      />

      <View className="w-full mb-4 relative">
        <View className="flex-row">
          {isMobileInput && (
            <TouchableOpacity
              onPress={() =>
                setShowCountryCodeDropdown(!showCountryCodeDropdown)
              }
              className={`h-[61px] px-3 rounded-l-[10px] border-r-0 flex-row items-center justify-center min-w-[80px] ${
                fieldErrors.emailOrMobile
                  ? "bg-white border text-[#E12D39] border-[#FF6B6B]"
                  : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
              }`}
            >
              <Text className="text-[#170202] text-lg mr-1">
                {selectedCountryCode}
              </Text>
              <Text className="text-[#170202] text-sm">
                {showCountryCodeDropdown ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
          )}

          <TextInput
            className={`flex-1 text-[#170202] h-[61px] text-lg py-5 px-5 ${
              fieldErrors.emailOrMobile
                ? "bg-white border text-[#E12D39] border-[#FF6B6B]"
                : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
            } ${
              isMobileInput ? "rounded-r-[10px] border-l-0" : "rounded-[10px]"
            }`}
            placeholder="Email or Mobile Number"
            value={emailOrMobile}
            onChangeText={(val) => {
              setEmailOrMobile(val);
              clearFieldError("emailOrMobile");
            }}
            keyboardType="default"
            autoCapitalize="none"
            placeholderTextColor="#555"
          />
        </View>

        {showCountryCodeDropdown && (
          <View className="absolute w-20 z-10">
            <CountryPickerModal
              visible={showCountryCodeDropdown}
              onClose={() => setShowCountryCodeDropdown(false)}
              onSelect={(code) => {
                setSelectedCountryCode(code);
                setShowCountryCodeDropdown(false);
              }}
              countryOptions={countryCodeOptions}
            />
          </View>
        )}
      </View>

      <View className="w-full mb-4 relative">
        <TextInput
          className={getPasswordInputStyle(fieldErrors.password)}
          placeholder="Create Password"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            clearFieldError("password");
            if (confirmPassword && val === confirmPassword) {
              clearFieldError("confirmPassword");
            }
          }}
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor="#555"
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

      <View className="w-full mb-4 relative">
        <TextInput
          className={getPasswordInputStyle(fieldErrors.confirmPassword)}
          placeholder="Re - Enter New Password"
          value={confirmPassword}
          onChangeText={(val) => {
            setConfirmPassword(val);
            clearFieldError("confirmPassword");
            if (password && val === password) {
              clearFieldError("confirmPassword");
            }
          }}
          secureTextEntry={!isConfirmPasswordVisible}
          placeholderTextColor="#555"
        />
        <TouchableOpacity
          onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
          className="absolute right-5 top-1/2 -translate-y-[50%]"
        >
          {isConfirmPasswordVisible ? (
            <EyeSVG width={24} height={24} />
          ) : (
            <ClosedEyeSVG width={24} height={24} />
          )}
        </TouchableOpacity>
      </View>

      <View className="w-full mb-4">
        <Dropdown
          data={genderOptions}
          labelField="label"
          valueField="value"
          placeholder="Gender (optional)"
          value={gender}
          onChange={(item) => {
            setGender(item.value);
            clearFieldError("gender");
          }}
          style={{
            borderWidth: 1,
            borderColor: fieldErrors.gender ? "#FF6B6B" : "#B2EBF2",
            borderRadius: 10,
            paddingHorizontal: 20,
            paddingVertical: 20,
            backgroundColor: fieldErrors.gender ? "#FFE5E5" : "white",
            height: 61,
          }}
          placeholderStyle={{
            color: "#555",
            fontSize: 16,
          }}
          selectedTextStyle={{
            color: "#170202",
            fontSize: 16,
          }}
          itemTextStyle={{
            color: "#170202",
            fontSize: 16,
          }}
          containerStyle={{
            borderRadius: 10,
          }}
          itemContainerStyle={{
            borderBottomWidth: 1,
            borderBottomColor: "#E0E0E0",
          }}
        />
      </View>

      {/* Cross-Platform Date Picker */}
      <View className="w-full mb-8">
        {Platform.OS === "web" ? (
          // Web: Use HTML date input with fallback to text input
          <TextInput
            className={getInputStyle(fieldErrors.dob)}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={dobText}
            onChangeText={handleWebDateInput}
            placeholderTextColor="#555"
            // For web, we can use HTML5 date input type
            {...(Platform.OS === "web" && {
              // @ts-ignore - web-specific props
              type: "date",
              max: maxDateString,
              min: minDateString,
              style: {
                // Override default styles for web date picker
                fontSize: 18,
                fontFamily: "inherit",
              },
            })}
          />
        ) : (
          // Native: Use platform-specific date picker
          <>
            <TouchableOpacity
              className={getDatePickerStyle(fieldErrors.dob)}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                className={`text-lg ${dob ? "text-[#170202]" : "text-[#555]"}`}
              >
                {dob ? formatDateForDisplay(dob) : "Date of Birth"}
              </Text>
              <Text className="text-[#170202] text-sm">📅</Text>
            </TouchableOpacity>

            {showDatePicker && DateTimePicker && (
              <DateTimePicker
                value={dob || new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
                maximumDate={maxDate}
                minimumDate={minDate}
                style={{
                  backgroundColor: "white",
                }}
                {...(Platform.OS === "ios" && {
                  onTouchCancel: () => setShowDatePicker(false),
                })}
              />
            )}

            {/* iOS Done button */}
            {showDatePicker && Platform.OS === "ios" && (
              <View className="flex-row justify-end mt-2">
                <TouchableOpacity
                  className="bg-[#007AFF] px-4 py-2 rounded-lg"
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text className="text-white font-medium">Done</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>

      <Text className="text-white mb-10 text-sm">
        By creating new account you agree to our policy, terms and conditions.
      </Text>

      <TouchableOpacity
        className="w-[202px] z-0 relative bg-white rounded-[10px] py-5 px-8 mb-4"
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size={24} color="#000000" />
        ) : (
          <Text className="text-[#000000] text-center font-normal text-lg">
            Continue
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login" as never)}>
        <Text className="text-white font-normal">
          Already have an account? Log in
        </Text>
      </TouchableOpacity>

      {errorMessage !== "" && (
        <View className="py-5 w-full mt-6 absolute bottom-0">
          <Text className="text-[#E12D39] text-2xl px-2 text-center font-normal">
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );

  return Platform.OS === "web" ? (
    <>
      <BackButton title="Creating New Account" onPress={() => router.back()} />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {FormLayout()}
      </ScrollView>
    </>
  ) : (
    <>
      <BackButton title="Creating New Account" onPress={() => router.back()} />
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

      {/* <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <BackButton title="Creating New Account" onPress={() => router.back()} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ 
              flexGrow: 1,
              paddingBottom: Platform.OS === 'ios' ? 0 : 20 // Extra padding for Android
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {FormLayout()}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView> */}
    </>
  );
}
