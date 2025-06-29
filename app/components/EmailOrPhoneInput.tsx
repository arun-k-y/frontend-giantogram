import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { CountryPickerModal } from "./CountryPickerModal";
import { countryCodeOptions } from "../constants/constants";

// Validation helpers
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

const getIdentifierType = (value: string) => {
  if (validateEmail(value)) return "email";
  if (validateMobile(value)) return "mobile";
  return null;
};

interface EmailOrPhoneInputProps {
  identifier: string;
  onChange: (value: string) => void;
  fieldError: boolean;
  selectedCountryCode: string;
  setSelectedCountryCode: (code: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  placeholder?: string;
  style?: string
}

const EmailOrPhoneInput: React.FC<EmailOrPhoneInputProps> = ({
  identifier,
  onChange,
  fieldError,
  selectedCountryCode,
  setSelectedCountryCode,
  showDropdown,
  setShowDropdown,
  placeholder = "Email or Phone Number",
  style="mb-12"
}) => {
  const trimmedIdentifier = identifier.trim();
  const identifierType = getIdentifierType(trimmedIdentifier);
  const isMobileInput =
    identifierType === "mobile" ||
    (/^\d+$/.test(trimmedIdentifier) && trimmedIdentifier !== "");

  return (
    <View className={`flex-row w-full mb-12 relative ${style}`}>
      {isMobileInput && (
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          className={` px-3 rounded-l-[10px] border-r-0 flex-row items-center justify-center min-w-[80px] ${
            fieldError
              ? "bg-white border text-[#F11111] border-[#FF6B6B]"
              : "bg-white border text-[#1F1E1E] border-[#B2EBF2]"
          }`}
        >
          <Text className="text-[#170202] text-lg mr-1">
            {selectedCountryCode}
          </Text>
          <Text className="text-[#170202] text-sm">
            {showDropdown ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
      )}

      <TextInput
        className={`flex-1 py-5 px-5 ${
          fieldError
            ? "bg-white border text-[#F11111] border-[#FF6B6B] border-l-0"
            : "bg-white border text-[#1F1E1E] border-[#B2EBF2] border-l-0"
        } ${isMobileInput ? "rounded-r-[10px]" : "rounded-[10px]"}`}
        placeholder={placeholder}
        value={identifier}
        // onChangeText={onChange}
        //      onChangeText={(text) => {
        //   const trimmedText = text.trim();

        //   if (trimmedText.startsWith("+")) {
        //     // Try to find the longest matching code
        //     const sortedOptions = [...countryCodeOptions].sort(
        //       (a, b) => b.code.length - a.code.length
        //     );
        //     const matched = sortedOptions.find((c) =>
        //       trimmedText.startsWith(c.code)
        //     );

        //     if (matched) {
        //       setSelectedCountryCode(matched.code);

        //       const mobileNumber = trimmedText.slice(matched.code.length);
        //       onChange(mobileNumber.replace(/\D/g, "")); // Strip non-numeric
        //       return;
        //     }
        //   }

        //   // Default
        //   onChange(trimmedText.replace(/\s/g, ""));
        // }}

        onChangeText={(text) => {
          const trimmedText = text.trim();

          if (trimmedText.startsWith("+")) {
            // Sort for longest match
            const sortedOptions = [...countryCodeOptions].sort(
              (a, b) => b.code.length - a.code.length
            );
            const matched = sortedOptions.find((c) =>
              trimmedText.startsWith(c.code)
            );

            if (matched) {
              const afterCode = trimmedText.slice(matched.code.length);

              // Only update if number is entered after code
              if (afterCode.length > 0) {
                setSelectedCountryCode(matched.code);
                onChange(afterCode.replace(/\D/g, ""));
                return;
              }

              // If just typing cod2e like "+91", preserve it
              onChange(trimmedText);
              return;
            }
          }

          onChange(trimmedText.replace(/\s/g, ""));
        }}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#555"
        style={{ fontSize: 18 }}
      />

      {showDropdown && (
        <CountryPickerModal
          visible={showDropdown}
          onClose={() => setShowDropdown(false)}
          onSelect={(code) => setSelectedCountryCode(code)}
          countryOptions={countryCodeOptions}
        />
      )}
    </View>
  );
};

export default EmailOrPhoneInput;
