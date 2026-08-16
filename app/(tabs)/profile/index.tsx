import { View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Edit3,
  Fingerprint,
  LogOut,
  LucideProps,
  ShieldCheck,
} from "lucide-react-native";
import InputWithLabel from "@/components/starkUI/auth/InputWithLabel";
import { ScrollView } from "react-native-gesture-handler";
import { Switch } from "@/components/ui/switch";

const SecurityControl = ({
  Icon,
  text,
}: {
  Icon: React.ComponentType<LucideProps>;
  text: string;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const foreground = useColor("foreground");
  const borderColor = useColor("muted");
  const cardColor = useColor("card");

  return (
    <View
      style={{
        backgroundColor: borderColor,
        borderRadius: 20,
        paddingVertical: 15,
        width: "100%",
        ...globalStyles.flexBoxHorizantal,
        justifyContent: "flex-start",
        paddingLeft: 10,
        position: "relative",
      }}
    >
      <View
        style={{
          backgroundColor: cardColor,
          padding: 15,
          borderRadius: 18,
          marginRight: 10,
        }}
      >
        <Icon color={foreground} />
      </View>
      <Text numberOfLines={2} style={{ maxWidth: "65%", fontSize: 16 }}>
        {text}
      </Text>
      <Switch
        value={isEnabled}
        style={{ position: "absolute", right: 5 }}
        onValueChange={setIsEnabled}
      />
    </View>
  );
};

const Profile = () => {
  const background = useColor("background");
  const green = useColor("green");

  const [userName, setUserName] = useState("Muhammad Musa");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("musa@gmail.com");

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="heading" style={{ marginBottom: 20 }}>
          Profile
        </Text>

        {/* avatar */}
        <Card>
          <View style={{ ...globalStyles.flexBoxHorizantal }}>
            <Avatar size={100}>
              <AvatarImage source={require("@/assets/images/google.png")} />
              <AvatarFallback
                style={{ backgroundColor: green }}
                textStyle={{ color: background, fontSize: 30 }}
              >
                MS
              </AvatarFallback>
            </Avatar>
          </View>

          <Button icon={Edit3} style={{ marginTop: 15 }}>
            Update Avatar
          </Button>
        </Card>

        {/* information */}
        <Card style={{ marginTop: 20 }}>
          <Text variant="title">Update Profile</Text>

          <InputWithLabel
            label="Username"
            placeholderText="e.g, Muhammad Musa"
            setValue={setUserName}
            value={userName}
            variant="outline"
          />
          <InputWithLabel
            label="New Password"
            placeholderText="Enter a new password"
            setValue={setNewPassword}
            value={newPassword}
            variant="outline"
            isPassword
          />
          <InputWithLabel
            label="Email"
            placeholderText="e.g, you@gmail.com"
            setValue={setEmail}
            value={email}
            variant="outline"
            disabled
          />

          <Button icon={Edit3} style={{ marginTop: 20 }}>
            Update Profile
          </Button>
        </Card>

        {/* security controls */}
        <Card
          style={{
            marginTop: 20,
            ...globalStyles.flexBox,
            gap: 10,
          }}
        >
          <Text
            variant="title"
            style={{ textAlign: "left", width: "100%", marginBottom: 10 }}
          >
            Security Controls
          </Text>
          <SecurityControl
            key={1}
            Icon={ShieldCheck}
            text={"Two-Factor Authentication"}
          />
          <SecurityControl
            key={2}
            Icon={Fingerprint}
            text={"Biometric Unlock"}
          />
        </Card>

        {/* logout */}
        <Button
          icon={LogOut}
          variant="destructive"
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
};

export default Profile;
