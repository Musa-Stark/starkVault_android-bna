import React, { useState, type RefObject } from "react";
import { EyeOff, Eye } from "lucide-react-native";
import {
  EnterKeyHintType,
  ReturnKeyType,
  Text,
  TextInputProps,
  View,
  Pressable,
  type TextInput,
} from "react-native";

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
  autoFocus?: boolean;
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
  autoFocus,
}: InputWithLabelProps) => {
  const foreground = useColor("foreground");
  const [showPassword, setShowPassword] = useState(false);

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
        {isPassword && (
          <Pressable
            onPress={() => console.log("Fogrot presssed")}
            hitSlop={10}
          >
            <Text
              style={{
                color: useColor("teal"),
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
        onChangeText={setValue}
        inputMode={inputMode ?? "text"}
        placeholder={placeholderText}
        containerStyle={{ marginTop: 3 }}
        autoFocus={autoFocus}
        secureTextEntry={!showPassword}
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
