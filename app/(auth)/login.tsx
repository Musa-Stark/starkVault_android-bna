import { View, Text, Image, Pressable } from "react-native";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import { Eye, EyeOff } from "lucide-react-native";
import globalStyles from "@/starkwind/globalStyle";
import AuthLogo from "@/components/starkUI/AuthLogo";
import Banner from "@/components/starkUI/Banner";
import InputWithLabel from "@/components/starkUI/InputWithLabel";
import AuthPrompt from "@/components/starkUI/AuthPrompt";
import OAuthButton from "@/components/starkUI/OAuthButton";
import AuthDivider from "@/components/starkUI/AuthDivider";

const Login = () => {
  const background = useColor("background");

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const disabled = !email || !password;

  const handleSubmit = () => {
    console.log({ email, password });
    setEmail("");
    setPassword("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const handleOAuthPress = () => {
    console.log("OAuth button pressed");
    setIsOAuthLoading(true)
    setTimeout(() => {
      setIsOAuthLoading(false)
    }, 3000);
  };

  return (
    <View
      style={[globalStyles.globalContainer, { backgroundColor: background }]}
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
      />

      {/* Password */}
      <InputWithLabel
        label="Password"
        placeholderText="••••••••••••"
        setValue={setPassword}
        value={password}
        ref={passwordRef}
        isPassword={true}
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
        text="Continue with Github"
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
