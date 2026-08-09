import { View, Text } from "react-native";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import AuthPrompt from "@/components/starkUI/AuthPrompt";
import { InputOTP } from "@/components/ui/input-otp";
import authApiCall from "./authApiCall";

const TwoFactorAuth = () => {
  const background = useColor("background");

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await authApiCall({
      code,
      email: "musa@gmail.com",
      page: "twoFactorAuth",
    });

    setTimeout(() => {
      setIsLoading(false);
      setCode("");
    }, 3000);
  };

  const handleResendOTP = () => {
    console.log("Resend OTP");
  };

  return (
    <View
      style={[
        globalStyles.globalContainer,
        { backgroundColor: background, paddingTop: "20%" },
      ]}
    >
      {/* Logo */}
      <AuthLogo />

      {/* Banner */}
      <Banner
        heading="Two-factor Verfication"
        messages={["Enter the 6-digit code we just sent to", "musa@gmail.com"]}
      />

      <View style={{ width: "100%", marginTop: 20 }}>
        <InputOTP
          autoFocus={true}
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="000000"
          cursorColor={"red"}
          disabled={isLoading}
        />
      </View>

      {/* Submit */}
      <Button
        style={{ marginTop: 20 }}
        disabled={code.length < 6}
        onPress={handleSubmit}
        loading={isLoading}
      >
        <Text style={{ fontWeight: "500", color: background }}>
          Verify and Continue
        </Text>
      </Button>

      {/* AuthPrompt */}
      <AuthPrompt
        prompt="Didn't received code?"
        linkText="Resend"
        onPress={handleResendOTP}
      />

      {/* didn't received code */}
      <AuthPrompt prompt="If you didn't received it, check your spam folder" />
    </View>
  );
};

export default TwoFactorAuth;
