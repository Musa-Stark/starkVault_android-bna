import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/auth/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import AuthPrompt from "@/components/starkUI/auth/AuthPrompt";
import { InputOTP } from "@/components/ui/input-otp";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

const RESEND_TIMEOUT = 30; // seconds

const TwoFactorAuth = () => {
  const background = useColor("background");
  const { twoFactorAuth, resendOTP } = useAuth();
  const { toast } = useToast();

  const { email, purpose } = useLocalSearchParams<{
    email: string;
    purpose: string;
  }>();

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (resendTimer <= 0) return;

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email not found");
      return;
    }

    if (!purpose) {
      toast.error("Purpose not found");
      return;
    }

    setIsLoading(true);

    const response = await twoFactorAuth(email, code, purpose);

    setIsLoading(false);

    if (!response.success) {
      toast.error(response.message!);
      return;
    }

    const successMessage = response?.message || response?.data?.message;

    if (successMessage) {
      toast.success(successMessage);
    }

    setCode("");

    if (response.purpose === "password_reset") {
      router.replace({
        pathname: "/resetPassword",
        params: { email },
      });
    } else {
      router.replace({
        pathname: "/dashboard",
      });
    }
  };

  const handleResendOTP = async () => {
    if (!email || resendTimer > 0 || isResending) {
      return;
    }

    try {
      setIsResending(true);

      // Replace this with your actual resend OTP API/function.
      // Example:
      const response = await resendOTP(email);
      if (!response.success) throw new Error(response.message!);

      toast.success("A new verification code has been sent.");

      // Restart countdown
      setResendTimer(RESEND_TIMEOUT);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <View
      style={[
        globalStyles.globalContainer,
        {
          backgroundColor: background,
          paddingTop: "20%",
        },
      ]}
    >
      {/* Logo */}
      <AuthLogo />

      {/* Banner */}
      <Banner
        heading="Two-factor Verfication"
        messages={["Enter the 6-digit code we just sent to", email]}
      />

      <View style={{ width: "100%", marginTop: 20 }}>
        <InputOTP
          autoFocus={true}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="000000"
          cursorColor="red"
          disabled={isLoading}
        />
      </View>

      {/* Submit */}
      <Button
        style={{ marginTop: 20 }}
        disabled={code.length < 6 || isLoading}
        onPress={handleSubmit}
        loading={isLoading}
      >
        <Text style={{ fontWeight: "500", color: background }}>
          Verify and Continue
        </Text>
      </Button>

      {/* Resend */}
      {resendTimer > 0 ? (
        <AuthPrompt prompt={`Didn't receive code? Resend in ${resendTimer}s`} />
      ) : (
        <AuthPrompt
          prompt="Didn't receive code?"
          linkText={isResending ? "Sending..." : "Resend"}
          onPress={handleResendOTP}
        />
      )}

      {/* Spam message */}
      <AuthPrompt prompt="If you didn't receive it, check your spam folder" />
    </View>
  );
};

export default TwoFactorAuth;
