import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Eye, EyeOff, Copy, Pen, Trash2 } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";

type PasswordItem = {
  _id: string;
  serviceName: string;
  username: string;
  password: string;
};

type Props = {
  item: PasswordItem;

  onEdit: (item: PasswordItem) => void;
  onDelete: (item: PasswordItem) => void;
  onCopy: (item: PasswordItem) => void;
};

export default function PasswordCard({
  item,
  onEdit,
  onDelete,
  onCopy,
}: Props) {
  const foreground = useColor("foreground");
  const background = useColor("background");
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const mutedForeground = useColor("mutedForeground");

  const [showPassword, setShowPassword] = useState(false);

  return (
    <View
      style={{
        padding: 16,
        borderRadius: 16,
        backgroundColor: cardColor,
        borderWidth: 1,
        borderColor,
        elevation: 1,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Service */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: background,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: foreground,
              }}
            >
              {item.serviceName?.slice(0, 2).toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: foreground,
              }}
            >
              {item.serviceName}
            </Text>

            <Text
              numberOfLines={1}
              variant="caption"
              style={{
                marginTop: 3,
              }}
            >
              {item.username}
            </Text>
          </View>
        </View>

        {/* Copy */}
        <Pressable
          onPress={() => onCopy(item)}
          hitSlop={8}
          style={{
            width: 38,
            height: 38,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
          }}
        >
          <Copy size={18} color={mutedForeground} />
        </Pressable>
      </View>

      {/* Credentials */}
      <View
        style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 10,
          backgroundColor: background,
          borderWidth: 1,
          borderColor,
        }}
      >
        {/* Username */}
        <View
          style={{
            marginBottom: 10,
          }}
        >
          <Text
            variant="caption"
            style={{
              fontSize: 11,
            }}
          >
            Username
          </Text>

          <Text
            numberOfLines={1}
            style={{
              marginTop: 3,
              fontSize: 14,
              color: foreground,
            }}
          >
            {item.username}
          </Text>
        </View>

        {/* Password */}
        <View>
          <Text
            variant="caption"
            style={{
              fontSize: 11,
            }}
          >
            Password
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 3,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                fontSize: 15,
                letterSpacing: showPassword ? 0 : 2,
                color: foreground,
              }}
            >
              {showPassword ? item.password : "••••••••••••"}
            </Text>

            <Pressable
              onPress={() => setShowPassword((previous) => !previous)}
              hitSlop={8}
              style={{
                width: 34,
                height: 34,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? (
                <EyeOff size={17} color={mutedForeground} />
              ) : (
                <Eye size={17} color={mutedForeground} />
              )}
            </Pressable>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
          marginTop: 12,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        <Pressable
          onPress={() => onEdit(item)}
          hitSlop={8}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
          }}
        >
          <Pen size={18} color={mutedForeground} />
        </Pressable>

        <Pressable
          onPress={() => onDelete(item)}
          hitSlop={8}
          style={{
            width: 40,
            height: 40,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
          }}
        >
          <Trash2 size={18} color="#ef4444" />
        </Pressable>
      </View>
    </View>
  );
}
