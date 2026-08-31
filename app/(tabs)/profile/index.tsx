import { View } from "react-native";
import { Text } from "@/components/ui/text";
import React, { useState, useEffect } from "react";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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

const COOLDOWN_SECONDS = 60;

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
  const [updatingProfile, setUpdatingProfile] = useState(false);

  const [avatarCooldown, setAvatarCooldown] = useState(0);
  const [profileCooldown, setProfileCooldown] = useState(0);

  const avatarArray = user?.profileImage;

  const [avatar, setAvatar] = useState(
    avatarArray?.[avatarArray.length - 1]?.url,
  );

  /*
   * Avatar cooldown
   */
  useEffect(() => {
    if (avatarCooldown <= 0) return;

    const timer = setInterval(() => {
      setAvatarCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [avatarCooldown]);

  /*
   * Profile cooldown
   */
  useEffect(() => {
    if (profileCooldown <= 0) return;

    const timer = setInterval(() => {
      setProfileCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [profileCooldown]);

  // update avatar
  const handleUpdateAvatar = async (assets: MediaAsset[]) => {
    if (avatarCooldown > 0 || updatingAvatar) return;

    if (!user?._id) {
      toast.error("user.id not found");
      return;
    }

    setUpdatingAvatar(true);

    try {
      const response = await apiCall({
        page: "account",
        method: "POST",
        data: { avatar: assets },
        itemId: user._id,
        option: "addFile",
        bodyType: "multipart",
      });

      if (!response.success) {
        toast.error(response.message || "Failed to update avatar");
        return;
      }

      const arr = response.data.profileImage;

      setAvatar(arr[arr.length - 1].url);

      // Start cooldown ONLY after successful API call
      setAvatarCooldown(COOLDOWN_SECONDS);
    } finally {
      setUpdatingAvatar(false);
    }
  };

  // update profile
  const handleUpdateProfile = async () => {
    if (profileCooldown > 0 || updatingProfile) return;

    setUpdatingProfile(true);

    try {
      const names = userName.split(" ");

      const response = await apiCall({
        page: "account",
        method: "PATCH",
        data: {
          firstName: names[0] ?? "",
          lastName: names[1] ?? "",
          password: newPassword ? newPassword : undefined,
        },
        option: "me",
      });

      if (!response.success) {
        toast.error(response.message || "Failed to update profile");
        return;
      }

      toast.success(response.message || "Profile updated successfully!");

      // Start cooldown ONLY after successful API call
      setProfileCooldown(COOLDOWN_SECONDS);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const avatarDisabled = updatingAvatar || avatarCooldown > 0;
  const profileDisabled = updatingProfile || profileCooldown > 0;

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
              Updating avatar...
            </Button>
          ) : (
            <MediaPicker
              buttonText={
                avatarCooldown > 0
                  ? `Update Avatar (${avatarCooldown}s)`
                  : "Update Avatar"
              }
              style={{ marginTop: 15 }}
              icon={Edit3}
              onSelectionChange={handleUpdateAvatar}
              mediaType="image"
              disabled={avatarDisabled}
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
            showError={false}
            showErrorText={false}
          />

          <InputWithLabel
            label="Email"
            placeholderText="e.g, you@gmail.com"
            setStringValue={setEmail}
            value={email}
            variant="outline"
            disabled
          />

          <Button
            icon={Edit3}
            style={{ marginTop: 20 }}
            onPress={handleUpdateProfile}
            loading={updatingProfile}
            disabled={profileDisabled}
          >
            {profileCooldown > 0
              ? `Update Profile (${profileCooldown}s)`
              : "Update Profile"}
          </Button>
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