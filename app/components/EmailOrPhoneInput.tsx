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
}) => {
  const trimmedIdentifier = identifier.trim();
  const identifierType = getIdentifierType(trimmedIdentifier);
  const isMobileInput =
    identifierType === "mobile" ||
    (/^\d+$/.test(trimmedIdentifier) && trimmedIdentifier !== "");

  return (
    <View className="flex-row w-full mb-12 relative">
      {isMobileInput && (
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          //   className={`h-[61px] px-3 rounded-l-[10px] border-r-0 flex-row items-center justify-center min-w-[80px] ${
          //     fieldError
          //       ? "bg-white border border-[#FF6B6B]"
          //       : "bg-white border border-[#B2EBF2]"
          //   }`}

          className={`h-[61px] px-3 rounded-l-[10px] border-r-0 flex-row items-center justify-center min-w-[80px] ${
            fieldError
              ? "bg-white border text-[#E12D39] border-[#FF6B6B]"
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
        // className={`flex-1 text-[#1F1E1E] h-[61px] text-lg py-5 px-5 ${
        //   fieldError
        //     ? "bg-white border border-[#FF6B6B] border-l-0"
        //     : "bg-white border border-[#B2EBF2] border-l-0"
        // } ${isMobileInput ? "rounded-r-[10px]" : "rounded-[10px]"}`}
        className={`flex-1  h-[61px] text-lg py-5 px-5 ${
          fieldError
            ? "bg-white border text-[#E12D39] border-[#FF6B6B] border-l-0"
            : "bg-white border text-[#1F1E1E] border-[#B2EBF2] border-l-0"
        } ${isMobileInput ? "rounded-r-[10px]" : "rounded-[10px]"}`}
        placeholder={placeholder}
        value={identifier}
        onChangeText={onChange}
        keyboardType="default"
        autoCapitalize="none"
        placeholderTextColor="#555"
      />

      {showDropdown && (
        <View className="absolute top-[65px] left-0 z-50">
          <CountryPickerModal
            visible={showDropdown}
            onClose={() => setShowDropdown(false)}
            onSelect={(code) => setSelectedCountryCode(code)}
            countryOptions={countryCodeOptions}
          />
        </View>
      )}
    </View>
  );
};

export default EmailOrPhoneInput;
