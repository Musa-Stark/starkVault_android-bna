import { View, Text, Image, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/auth/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import InputWithLabel from "@/components/starkUI/input/InputWithLabel";
import { useToast } from "@/providers/toast-provider";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { useLocalSearchParams } from "expo-router";

const ResetPassword = () => {
  const background = useColor("background");

  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const { email } = useLocalSearchParams<{ email: string }>();

  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const disabled = !password || password !== confirmPassword || hasError;

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await resetPassword(email, password);
    setIsLoading(false);
    if (!response.success) {
      toast.error(response.message!);
      return;
    }

    const successMessage = response?.message || response?.data?.message;

    if (successMessage) toast.success(successMessage);

    router.replace("/login");

    setTimeout(() => {
      setIsLoading(false);
      setPassword("");
      setConfirmPassword("");
    }, 3000);
  };

  return (
    <View
      style={[
        globalStyles.globalContainer,
        { backgroundColor: background, paddingTop: "30%" },
      ]}
    >
      {/* Logo */}
      <AuthLogo />

      {/* Banner */}
      <Banner heading="Reset Password" />

      {/* Password */}
      <InputWithLabel
        label="Password"
        placeholderText="••••••••••••"
        setStringValue={setPassword}
        value={password}
        ref={passwordRef}
        isPassword={true}
        entryKeyHint="next"
        returnKeyType="next"
        nextRef={confirmPasswordRef}
        disabled={isLoading}
        hasError={setHasError}
      />

      {/* confirmPassword */}
      <InputWithLabel
        label="Confirm Password"
        placeholderText="••••••••••••"
        setStringValue={setConfirmPassword}
        value={confirmPassword}
        ref={confirmPasswordRef}
        isPassword={true}
        disabled={isLoading}
        hasError={setHasError}
      />

      {/* Submit */}
      <Button
        style={{ marginTop: 20 }}
        disabled={disabled}
        onPress={handleSubmit}
        loading={isLoading}
      >
        <Text style={{ fontWeight: "500", color: background }}>
          Reset Password
        </Text>
      </Button>
    </View>
  );
};

export default ResetPassword;
