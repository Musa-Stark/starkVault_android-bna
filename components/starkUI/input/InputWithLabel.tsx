import React, { useEffect, useState, type RefObject } from "react";
import { EyeOff, Eye } from "lucide-react-native";
import { Checkbox } from "@/components/ui/checkbox";
import {
  EnterKeyHintType,
  ReturnKeyType,
  TextInputProps,
  View,
  Pressable,
  type TextInput,
  ViewStyle,
} from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Picker, PickerOption } from "@/components/ui/picker";

import { useColor } from "@/hooks/useColor";
import { Input } from "../../ui/input";
import { MediaAsset, MediaPicker } from "@/components/ui/media-picker";
import { DatePicker } from "@/components/ui/date-picker";

export interface InputWithLabel {
  label?: string;
  placeholderText?: string;
  value?: string | boolean | MediaAsset | Date | undefined;
  setStringValue?: (value: string) => void;
  setBooleanValue?: (value: boolean) => void;
  setDateValue?: (value: Date | undefined) => void;
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
  variant?: "filled" | "outline";
  containerStyle?: ViewStyle;
  pickerOptions?: PickerOption[];
  showError?: boolean;
  showErrorText?: boolean;
  inputType?: "picker" | "text" | "checkbox" | "mediaPicker" | "datePicker";
  checkboxAccessibilityLabel?: string;
  multiline?: boolean;
}

const InputWithLabel = ({
  value,
  setStringValue,
  setBooleanValue,
  setDateValue,
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
  variant,
  containerStyle,
  pickerOptions,
  showError,
  showErrorText,
  inputType = "text",
  checkboxAccessibilityLabel,
  multiline,
}: InputWithLabel) => {
  const foreground = useColor("foreground");
  const router = useRouter();
  const teal = useColor("teal");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pickerError, setPickerError] = useState("");

  const [assets, setAssets] = useState<MediaAsset[]>([]);

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
    if (typeof value === "string" && value?.length === 0) {
      setError(`${label} is required`);
      return;
    }

    // email validation
    const emailError = handleEmailValidation((value as string) ?? "");
    if (emailError) {
      setError("Invalid Email");
      return;
    }

    // password validation
    if (isPassword && value && typeof value === "string" && value.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
  };

  // typing validation
  const handleEditing = (text: string) => {
    if (!setStringValue) return;
    setStringValue(text);

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

  const inputTypes = {
    picker: (
      <Picker
        options={pickerOptions}
        style={{ marginTop: 3, ...containerStyle }}
        value={value as string}
        onValueChange={handleEditing}
        showErrorText={showErrorText}
        error={pickerError}
        disabled={disabled}
        onClose={() => {
          if (!value) setPickerError(`${label} is required`);
        }}
      />
    ),
    datePicker: (
      <DatePicker
        // label={"Select a date"}
        style={{ marginTop: 3, ...containerStyle }}
        placeholder={placeholderText}
        disabled={disabled}
        haptic={true}
        value={(value as Date) || (value as undefined)}
        onChange={setDateValue!}
      />
    ),
    text: (
      <Input
        variant={variant}
        ref={ref}
        value={value as string}
        onChangeText={handleEditing}
        multiline={multiline}
        inputMode={inputMode ?? "text"}
        error={error}
        showError={showError}
        showErrorText={showErrorText}
        placeholder={placeholderText}
        containerStyle={{ marginTop: 3, ...containerStyle }}
        onBlur={handleValidation}
        autoFocus={autoFocus}
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
    ),
    checkbox: (
      <Checkbox
        checked={value as boolean}
        onCheckedChange={setBooleanValue!}
        accessibilityLabel={checkboxAccessibilityLabel}
        disabled={disabled}
        haptic={true}
        label={checkboxAccessibilityLabel}
        error={error}
      />
    ),
    mediaPicker: (
      <MediaPicker
        mediaType="all"
        multiple={true}
        maxSelection={6}
        showPreview={true}
        previewSize={100}
        buttonText="Add Media"
        selectedAssets={assets}
        onSelectionChange={(newAssets) => {
          setAssets(newAssets);
          console.log("Assets with preview:", newAssets);
        }}
      />
    ),
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
        {label && (
          <Text style={{ color: foreground, fontSize: 18 }}>{label}</Text>
        )}

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
      {inputTypes[inputType]}

      {assets.length > 0 && (
        <View>
          <Text variant="caption">
            {assets.length} item{assets.length !== 1 ? "s" : ""} selected
          </Text>
          <Text variant="caption">
            Types: {assets.map((a) => a.type).join(", ")}
          </Text>
        </View>
      )}
    </>
  );
};

export default InputWithLabel;
