import { View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useState, useEffect } from "react";
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
import InputWithLabel from "@/components/starkUI/input/InputWithLabel";
import { ScrollView } from "react-native-gesture-handler";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/providers/auth-provider";
import { MediaAsset, MediaPicker } from "@/components/ui/media-picker";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";

const SecurityControl = ({
  Icon,
  text,
}: {
  Icon: React.ComponentType<LucideProps>;
  text: string;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const green = useColor("green");
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
        <Icon color={green} />
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
  const { user } = useAuth();
  const apiCall = useAPICall();
  const { toast } = useToast();

  const [userName, setUserName] = useState(
    `${user?.firstName} ${user?.lastName}`,
  );
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState(user?.email);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const avatarArray = user?.profileImage;
  const [avatar, setAvatar] = useState(
    avatarArray?.[avatarArray.length - 1]?.url,
  );

  const handleUpdateProfile = async (assets: MediaAsset[]) => {
    setUpdatingAvatar(true);
    if (!user?._id) {
      toast.error("user.id not found");
      return;
    }

    try {
      const response = await apiCall({
        page: "users",
        method: "POST",
        data: { avatar: assets },
        itemId: user?._id,
        option: "addFile",
        bodyType: "multipart",
      });
      if (!response.success)
        toast.error(response.message || "Failed to upload Avatar");

      const arr = response.data.profileImage;

      setAvatar(arr[arr.length - 1].url);
    } finally {
      setUpdatingAvatar(false);
    }
  };

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
              <AvatarImage
                source={
                  avatar || require("@/assets/images/avatar-fallback.png")
                }
              />
            </Avatar>
          </View>
          {updatingAvatar ? (
            <Button style={{ marginTop: 15 }} disabled loading>
              upading profile...
            </Button>
          ) : (
            <MediaPicker
              buttonText="Update Avatar"
              style={{ marginTop: 15 }}
              icon={Edit3}
              onSelectionChange={handleUpdateProfile}
              mediaType="image"
              disabled={updatingAvatar}
            />
          )}
        </Card>

        {/* information */}
        <Card style={{ marginTop: 20 }}>
          <Text variant="title">Update Profile</Text>

          <InputWithLabel
            label="Username"
            placeholderText="e.g, Muhammad Musa"
            setStringValue={setUserName}
            value={userName}
            variant="outline"
          />
          <InputWithLabel
            label="New Password"
            placeholderText="Enter a new password"
            setStringValue={setNewPassword}
            value={newPassword}
            variant="outline"
            isPassword
          />
          <InputWithLabel
            label="Email"
            placeholderText="e.g, you@gmail.com"
            setStringValue={setEmail}
            value={email}
            variant="outline"
            disabled
          />

          <Button icon={Edit3} style={{ marginTop: 20 }}>
            Update Profile
          </Button>
        </Card>

        {/* security controls */}
        {/* <Card
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
        </Card> */}

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
