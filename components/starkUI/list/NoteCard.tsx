import React, { useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import {
  Copy,
  Pin,
  PinOff,
  Pen,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { Button } from "@/components/ui/button";

export type Note = {
  _id: string;
  title: string;
  content: string;
  category?: string;
  pin: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type NoteCardProps = {
  note: Note;

  onView?: (note: Note) => void;
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onTogglePin?: (note: Note) => void;
  isDeleting?: boolean;
};

const formatDate = (date?: string) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function NoteCard({
  note,
  onView,
  onEdit,
  onDelete,
  onTogglePin,
  isDeleting
}: NoteCardProps) {
  const foreground = useColor("foreground");
  const background = useColor("background");
  const cardColor = useColor("card");
  const borderColor = useColor("border");
  const mutedForeground = useColor("mutedForeground");
  const green = useColor("green");

  const [showCopied, setShowCopied] = useState(false);

  // Hide note content by default
  const [showContent, setShowContent] = useState(false);

  /*
   * Copy
   */
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(note.content);

      setShowCopied(true);
    } catch (error) {
      console.error("Failed to copy note:", error);
    }
  };

  /*
   * Hide copied notification
   */
  useEffect(() => {
    if (!showCopied) return;

    const timeout = setTimeout(() => {
      setShowCopied(false);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [showCopied]);

  /*
   * Toggle content visibility
   */
  const handleToggleContent = () => {
    setShowContent((current) => !current);
  };

  /*
   * Delete
   */
  const handleDeletePress = () => {
      onDelete?.(note);
  };

  console.log(isDeleting)

  return (
    <>
      {/* ====================================================== */}
      {/* Card                                                   */}
      {/* ====================================================== */}

      <View
        style={{
          overflow: "hidden",
          borderRadius: 16,
          backgroundColor: cardColor,
          borderWidth: 1,
          borderColor: note.pin ? green : borderColor,
          elevation: 1,
        }}
      >
        {/* Header */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingTop: 16,
          }}
        >
          {/* Title */}

          <Pressable
            onPress={() => onView?.(note)}
            style={{
              flex: 1,
              paddingRight: 12,
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
              {note.title}
            </Text>

            {note.updatedAt && (
              <Text
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  color: mutedForeground,
                }}
              >
                {formatDate(note.updatedAt)}
              </Text>
            )}
          </Pressable>

          {/* Pin */}

          <Pressable
            onPress={() => onTogglePin?.(note)}
            hitSlop={8}
            style={{
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              backgroundColor: note.pin ? `${green}18` : "transparent",
            }}
          >
            {note.pin ? (
              <Pin size={21} color={green} fill={green} strokeWidth={2} />
            ) : (
              <PinOff size={21} color={mutedForeground} strokeWidth={2} />
            )}
          </Pressable>
        </View>

        {/* Category */}

        {note.category ? (
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 10,
              marginHorizontal: 16,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 999,
              backgroundColor: `${green}15`,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: green,
              }}
            >
              {note.category}
            </Text>
          </View>
        ) : null}

        {/* Content */}

        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 18,
          }}
        >
          <Text
            style={{
              fontSize: showContent ? 13 : 25,
              lineHeight: 20,
              color: mutedForeground,
            }}
          >
            {showContent
              ? note.content
              : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
          </Text>
        </View>

        {/* Actions */}

        <View
          style={{
            minHeight: 54,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 4,
            paddingHorizontal: 10,
            borderTopWidth: 1,
            borderTopColor: background,
          }}
        >
          {/* Copy */}

          <Button
            size="icon"
            variant="ghost"
            onPress={handleCopy}
            icon={Copy}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
            }}
          />

          {/* Show / Hide */}

          <Button
            size="icon"
            variant="ghost"
            onPress={handleToggleContent}
            icon={showContent ? EyeOff : Eye}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
            }}
          />

          {/* Edit */}

          {onEdit && (
            <Button
              size="icon"
              variant="ghost"
              onPress={() => onEdit(note)}
              icon={Pen}
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
              }}
            />
          )}

          {/* Delete */}

          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              onPress={handleDeletePress}
              style={{
                width: 44,
                height: 44,
                borderRadius: 999,
              }}
              loading={isDeleting}
              disabled={isDeleting}
            >
              <Trash2 size={20} color={"red"} />
            </Button>
          )}
        </View>
      </View>

      {/* ====================================================== */}
      {/* Delete Modal                                            */}
      {/* ====================================================== */}
    </>
  );
}
