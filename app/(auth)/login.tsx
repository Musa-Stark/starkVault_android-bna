import { View, Text } from "react-native";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/auth/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import InputWithLabel from "@/components/starkUI/input/InputWithLabel";
import AuthPrompt from "@/components/starkUI/auth/AuthPrompt";
import OAuthButton from "@/components/starkUI/auth/OAuthButton";
import AuthDivider from "@/components/starkUI/auth/AuthDivider";
import authApiCall from "./authApiCall";

const Login = () => {
  const background = useColor("background");

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const disabled = !email || !password || hasError;

  const handleSubmit = async () => {
    setIsLoading(true);

    const response = await authApiCall({ email, password, page: "login" });

    setTimeout(() => {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }, 3000);
  };

  const handleOAuthPress = () => {
    console.log("OAuth button pressed");
    setIsOAuthLoading(true);
    setTimeout(() => {
      setIsOAuthLoading(false);
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
        heading="Welcome back"
        message="Enter your master credentials to unlock the vault."
      />

      {/* Email */}
      <InputWithLabel
        label="Email"
        placeholderText="you@example.com"
        value={email}
        setValue={setEmail}
        ref={emailRef}
        entryKeyHint="next"
        autoFocus={true}
        inputMode="email"
        returnKeyType="next"
        nextRef={passwordRef}
        disabled={isLoading}
        hasError={setHasError}
      />

      {/* Password */}
      <InputWithLabel
        label="Password"
        placeholderText="••••••••••••"
        setValue={setPassword}
        value={password}
        ref={passwordRef}
        isPassword={true}
        disabled={isLoading}
        hasError={setHasError}
        hasForgot={true}
      />

      {/* Submit */}
      <Button
        style={{ marginTop: 20 }}
        disabled={disabled}
        onPress={handleSubmit}
        loading={isLoading}
      >
        <Text style={{ fontWeight: "500", color: background }}>
          Unlock Vault
        </Text>
      </Button>

      {/* Divider */}
      <AuthDivider />

      {/* Google sign in */}
      <OAuthButton
        text="Continue with Google"
        imgSource={require("@/assets/images/google.png")}
        variant="outline"
        onPress={handleOAuthPress}
        loading={isOAuthLoading}
      />

      {/* AuthPrompt */}
      <AuthPrompt
        linkText="Create an account"
        prompt="New to Stark Vault?"
        route="/signup"
      />
    </View>
  );
};

export default Login;
