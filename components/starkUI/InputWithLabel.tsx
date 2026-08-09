import React, { useEffect, useState, type RefObject } from "react";
import { EyeOff, Eye, HandMetal } from "lucide-react-native";
import {
  EnterKeyHintType,
  ReturnKeyType,
  Text,
  TextInputProps,
  View,
  Pressable,
  type TextInput,
} from "react-native";
import { useRouter } from "expo-router";

import { useColor } from "@/hooks/useColor";
import { Input } from "../ui/input";

type InputWithLabelProps = {
  value: string;
  setValue: (value: string) => void;
  label: string;
  placeholderText: string;
  inputMode?: TextInputProps["inputMode"];
  entryKeyHint?: EnterKeyHintType;
  returnKeyType?: ReturnKeyType;
  ref?: RefObject<TextInput | null>;
  nextRef?: RefObject<TextInput | null>;
  isPassword?: boolean;
  hasForgot?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  hasError?: (hasError: boolean) => void;
};

const InputWithLabel = ({
  value,
  setValue,
  label,
  placeholderText,
  inputMode,
  entryKeyHint,
  returnKeyType,
  ref,
  nextRef,
  isPassword,
  hasForgot,
  autoFocus,
  disabled,
  hasError,
}: InputWithLabelProps) => {
  const foreground = useColor("foreground");
  const router = useRouter()
  const teal = useColor("teal");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // show to parent if error exists
  useEffect(() => {
    hasError?.(!!error);
  }, [error, hasError]);

  // email validation
  const handleEmailValidation = (text: string) => {
    const emailRegex = RegExp(
      `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`,
    );

    return inputMode === "email" && !emailRegex.test(text);
  };

  // on blur validation
  const handleValidation = () => {
    if (value.length === 0) {
      setError(`${label} is required`);
      return;
    }

    // email validation
    const emailError = handleEmailValidation(value);
    if (emailError) {
      setError("Invalid Email");
      return;
    }

    // password validation
    if (isPassword && value.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
  };

  // typing validation
  const handleEditing = (text: string) => {
    setValue(text);

    // password validation
    if (isPassword) {
      if (text.length >= 6) {
        setError("");
        return;
      }
      return;
    }

    // email validation
    const emailError = handleEmailValidation(text);
    if (!emailError) {
      setError("");
      return;
    }
  };

  return (
    <>
      {/* container */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        {/* label */}
        <Text style={{ color: foreground, fontSize: 18 }}>{label}</Text>

        {/* forgot password */}
        {hasForgot && (
          <Pressable
            onPress={() => router.push("/forgotPassword")}
            hitSlop={10}
          >
            <Text
              style={{
                color: teal,
                fontSize: 14,
              }}
            >
              Forgot Password?
            </Text>
          </Pressable>
        )}
      </View>

      {/* inputField */}
      <Input
        ref={ref}
        value={value}
        onChangeText={handleEditing}
        inputMode={inputMode ?? "text"}
        error={error}
        placeholder={placeholderText}
        containerStyle={{ marginTop: 3 }}
        onBlur={handleValidation}
        // autoFocus={autoFocus}
        secureTextEntry={!showPassword && isPassword}
        disabled={disabled}
        enterKeyHint={entryKeyHint ?? "done"}
        returnKeyType={returnKeyType ?? "default"}
        onSubmitEditing={() => nextRef?.current?.focus()}
        rightComponent={
          // eye - show password
          isPassword && (
            <Pressable
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={10}
            >
              {showPassword ? (
                <EyeOff size={20} color={foreground} />
              ) : (
                <Eye size={20} color={foreground} />
              )}
            </Pressable>
          )
        }
      />
    </>
  );
};

export default InputWithLabel;
