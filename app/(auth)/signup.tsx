import { View, Text, Image, Pressable } from "react-native";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/auth/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import InputWithLabel from "@/components/starkUI/auth/InputWithLabel";
import AuthPrompt from "@/components/starkUI/auth/AuthPrompt";
import OAuthButton from "@/components/starkUI/auth/OAuthButton";
import AuthDivider from "@/components/starkUI/auth/AuthDivider";
import Toast from "react-native-toast-message";
import authApiCall from "./authApiCall";

const Signup = () => {
  const background = useColor("background");
  const nameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const disabled = !fullName || !email || !password || hasError;

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password mismatch",
        text2: "Password must match confirm password",
        position: "bottom",
      });
      return;
    }
    setIsLoading(true);

    const response = await authApiCall({
      fullName,
      email,
      password,
      page: "signup",
    });

    setTimeout(() => {
      setIsLoading(false);
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
        { backgroundColor: background, paddingTop: "20%" },
      ]}
    >
      {/* Logo */}
      <AuthLogo />

      {/* Banner */}
      <Banner heading="Create your vault" />

      {/* fullName */}
      <InputWithLabel
        label="Full Name"
        placeholderText="e.g, Musa Stark"
        value={fullName}
        setValue={setFullName}
        ref={nameRef}
        entryKeyHint="next"
        autoFocus={true}
        returnKeyType="next"
        nextRef={emailRef}
        disabled={isLoading}
        hasError={setHasError}
      />

      {/* Email */}
      <InputWithLabel
        label="Email"
        placeholderText="you@example.com"
        value={email}
        setValue={setEmail}
        ref={emailRef}
        entryKeyHint="next"
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
        entryKeyHint="next"
        returnKeyType="next"
        nextRef={confirmPasswordRef}
        disabled={isLoading}
        hasError={setHasError}
      />
      <InputWithLabel
        label="Confirm Password"
        placeholderText="••••••••••••"
        setValue={setConfirmPassword}
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
          Create Vault
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
        prompt="Already have an account?"
        linkText="Login"
        route="/login"
      />
    </View>
  );
};

export default Signup;
