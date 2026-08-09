import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import InputWithLabel from "@/components/starkUI/InputWithLabel";
import AuthPrompt from "@/components/starkUI/AuthPrompt";

const ForgotPassword = () => {
  const background = useColor("background");

  const emailRef = useRef<any>(null);

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const disabled = !email || hasError;

  const handleSubmit = () => {
    console.log({ email });
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
    }, 3000);
  };

  return (
    <View
      style={[
        globalStyles.globalContainer,
        { backgroundColor: background, paddingTop: "35%" },
      ]}
    >
      {/* Logo */}
      <AuthLogo />

      {/* Banner */}
      <Banner
        heading="Email verification"
        message="We’ll send an OTP to your email to confirm it’s you."
      />

      {/* Email */}
      <InputWithLabel
        label="Email"
        placeholderText="you@example.com"
        value={email}
        setValue={setEmail}
        ref={emailRef}
        autoFocus={true}
        inputMode="email"
        entryKeyHint="done"
        returnKeyType="done"
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
        <Text style={{ fontWeight: "500", color: background }}>Send OTP</Text>
      </Button>

      {/* AuthPrompt */}
      <AuthPrompt prompt="Remembered?" linkText="log in" route="/login" />
    </View>
  );
};

export default ForgotPassword;
