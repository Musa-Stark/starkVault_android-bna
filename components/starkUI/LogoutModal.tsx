import { View, Modal, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import React from "react";
import { useColor } from "@/hooks/useColor";
import { X, LogOut } from "lucide-react-native";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { useApp } from "@/providers/app-context";

const LogoutModal = () => {
  const { logout } = useAuth();
  const { toast } = useToast();

  const [busy, setBusy] = useState(false);

  const { logoutModel, setLogoutModel } = useApp();

  const cardColor = useColor("card");
  const foreground = useColor("foreground");
  const background = useColor("background")
  const mutedForeground = useColor("mutedForeground");

  const onClose = () => {
    setLogoutModel(false)
  };

  const handleLogout = async () => {
    setBusy(true);

    try {
      const response = await logout();
      if (!response.success) {
        toast.error(response.message || "Failed to logout")
        return;
      }

      toast.success("logged out successfully!")

      onClose?.();
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      visible={logoutModel}
      transparent
      animationType="fade"
      onRequestClose={busy ? undefined : onClose}
    >
      <TouchableWithoutFeedback onPress={busy ? undefined : onClose}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 24,
                padding: 22,
                backgroundColor: cardColor,
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.25,
                shadowRadius: 20,
              }}
            >
              {/* Close */}

              <Button
                icon={X}
                size="icon"
                variant="outline"
                onPress={onClose}
                disabled={busy}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 34,
                  height: 34,
                }}
              />

              {/* Logout Icon */}

              <View
                style={{
                  width: 52,
                  height: 52,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  backgroundColor: "#ef444418",
                  marginBottom: 16,
                }}
              >
                <LogOut size={26} color="#ef4444" strokeWidth={2} />
              </View>

              {/* Title */}

              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "700",
                  color: foreground,
                }}
              >
                Logout?
              </Text>

              {/* Description */}

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  lineHeight: 20,
                  color: mutedForeground,
                }}
              >
                Are you sure you want to logout from your account?
              </Text>

              {/* Buttons */}

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 22,
                  justifyContent: "flex-end",
                }}
              >
                {/* Cancel */}

                <Button
                  size="sm"
                  variant="success"
                  onPress={onClose}
                  disabled={busy}
                  textStyle={{ color: background }}
                >
                  Cancel
                </Button>

                {/* Logout */}

                <Button
                  size="sm"
                  variant="destructive"
                  onPress={handleLogout}
                  disabled={busy}
                  loading={busy}
                  loadingVariant="default"
                  textStyle={{ color: "white" }}
                >
                  Logout
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LogoutModal;
