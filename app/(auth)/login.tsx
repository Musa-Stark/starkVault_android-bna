import { View, Text, Image, Pressable } from "react-native";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import { Eye, EyeOff } from "lucide-react-native";

const Login = () => {
  const foreground = useColor("foreground");
  const muted = useColor("textMuted");
  const background = useColor("background");

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const disabled = !email || !password;

  const handleSubmit = () => {
    console.log({ email, password });
    setEmail("");
    setPassword("");
    setIsLoading(true);
  };

  return (
    <View
      style={{
        backgroundColor: background,
        paddingHorizontal: "10%",
        paddingTop: "35%",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Logo */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 60, height: 60 }}
        />

        <Text style={{ color: foreground, fontSize: 25, fontWeight: "600" }}>
          Stark Vault
        </Text>
      </View>

      {/* Welcome */}
      <Text
        style={{
          color: foreground,
          fontSize: 33,
          fontWeight: "600",
          textAlign: "center",
          marginTop: 20,
        }}
      >
        Welcome back
      </Text>

      <Text
        style={{
          color: muted,
          fontSize: 18,
          marginTop: 5,
          textAlign: "center",
        }}
      >
        Enter your master credentials to unlock the vault.
      </Text>

      {/* Email */}
      <Text style={{ color: foreground, fontSize: 18, marginTop: 20 }}>
        Email
      </Text>

      <Input
        ref={emailRef}
        value={email}
        onChangeText={setEmail}
        inputMode="email"
        placeholder="you@example.com"
        containerStyle={{ marginTop: 3 }}
        // autoFocus
        enterKeyHint="next"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />

      {/* Password */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 15,
        }}
      >
        <Text style={{ color: foreground, fontSize: 18 }}>Password</Text>

        <Pressable onPress={() => console.log("Fogrot presssed")} hitSlop={10}>
          <Text
            style={{
              color: useColor("teal"),
              fontSize: 14,
            }}
          >
            Forgot Password?
          </Text>
        </Pressable>
      </View>

      <Input
        ref={passwordRef}
        inputMode="text"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        placeholder="••••••••••••"
        containerStyle={{ marginTop: 3 }}
        returnKeyType="done"
        rightComponent={
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
        }
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
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: muted,
          }}
        />

        <Text style={{ color: muted, fontSize: 14 }}>OR</Text>

        <View
          style={{
            flex: 1,
            height: 1,
            backgroundColor: muted,
          }}
        />
      </View>

      {/* Google sign in */}
      <Button variant="outline" style={{ marginTop: 20 }}>
        <Image
          source={require("@/assets/images/google.png")}
          style={{
            width: 25,
            aspectRatio: 1,
            marginRight: 10,
          }}
        />

        <Text style={{ color: foreground }}>Continue with Google</Text>
      </Button>

      {/* suggestion */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text
          style={{
            color: muted,
            fontSize: 14,
          }}
        >
          New to Stark Vault?{" "}
        </Text>

        <Pressable>
          <Text
            style={{
              color: foreground,
              fontSize: 14,
              fontWeight: "600",
            }}
          >
            Create an account
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Login;
