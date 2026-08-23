import React, { useEffect, useState } from "react";
import {
  View,
  Pressable,
  ActivityIndicator,
  Image as RNImage,
} from "react-native";
import {
  DownloadIcon,
  Trash2,
  Pen,
  CheckCircle2,
  Image as ImageIcon,
} from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { BlurView } from "expo-blur";

import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";

export type DocumentFile = {
  _id: string;
  documentTitle: string;
  documentCategory?: string;
  documentCategories?: string;
  format: string;
  size: string;
  date: string;
  uploadStatus?: "uploading" | "processing" | "done" | "";
  progress?: number;
  secure_url?: string;
};

type DocumentCategory = {
  name: string;
  color: string;
};

type Props = {
  document: DocumentFile;
  categories: DocumentCategory[];

  onEdit: () => void;
  onDelete: (document: DocumentFile) => void;
  onView: (document: DocumentFile) => void;
  onDownload: (document: DocumentFile) => void;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function DocumentCard({
  document: docFile,
  categories,
  onEdit,
  onDelete,
  onView,
  onDownload,
}: Props) {
  const foreground = useColor("foreground");
  const background = useColor("background");
  const cardColor = useColor("card");
  const mutedForeground = useColor("mutedForeground");
  const blue = useColor("blue");

  const [status, setStatus] = useState(docFile.uploadStatus || "");
  const [progress, setProgress] = useState(docFile.progress || 0);

  /*
   * Simulated upload.
   *
   * Replace this with your real upload progress later.
   */
  useEffect(() => {
    if (status !== "uploading") return;

    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval);
          setStatus("processing");
          return 100;
        }

        return Math.min(
          100,
          currentProgress + [20, 25][Math.floor(Math.random() * 2)],
        );
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [status]);

  const displayStatus = docFile.uploadStatus === "done" ? "done" : status;

  const displayProgress = docFile.uploadStatus === "done" ? 100 : progress;

  const category = categories.find(
    (item) =>
      item.name === (docFile.documentCategories || docFile.documentCategory),
  );

  const isUploading = displayStatus === "uploading";
  const isProcessing = displayStatus === "processing";
  const isBusy = isUploading || isProcessing;

  /*
   * SVG circle values
   */
  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  const progressOffset =
    circumference - (circumference * displayProgress) / 100;

  /*
   * Only show the image if we have a valid secure_url.
   * Otherwise, show the Image icon as the fallback.
   */
  const hasPreviewImage =
    typeof docFile.secure_url === "string" &&
    docFile.secure_url.trim().length > 0;

  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: cardColor,
        elevation: 1,
        borderWidth: 1,
        borderColor: cardColor,
      }}
    >
      {/* ========================================================= */}
      {/* Preview                                                   */}
      {/* ========================================================= */}

      <View
        style={{
          height: 190,
          position: "relative",
          overflow: "hidden",
          backgroundColor: background,
        }}
      >
        {/* ------------------------------------------------------- */}
        {/* Actual Preview                                          */}
        {/* ------------------------------------------------------- */}

        <Pressable
          onPress={() => onView(docFile)}
          disabled={isBusy}
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hasPreviewImage ? (
            <RNImage
              source={{
                uri: docFile.secure_url,
              }}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: background,
              }}
            >
              <ImageIcon size={56} strokeWidth={1.4} color={mutedForeground} />
            </View>
          )}
        </Pressable>

        {/* ------------------------------------------------------- */}
        {/* Blur when busy                                          */}
        {/* ------------------------------------------------------- */}

        {isBusy && (
          <BlurView
            intensity={20}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
        )}

        {/* ------------------------------------------------------- */}
        {/* Format badge                                            */}
        {/* ------------------------------------------------------- */}

        <View
          style={{
            position: "absolute",
            left: 12,
            top: 12,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            backgroundColor: foreground,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: "700",
              textTransform: "uppercase",
              color: background,
            }}
          >
            {docFile.format}
          </Text>
        </View>

        {/* ------------------------------------------------------- */}
        {/* Busy Overlay                                            */}
        {/* ------------------------------------------------------- */}

        {isBusy && (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 8,
            }}
          >
            {/* Circular progress */}

            <View
              style={{
                width: 60,
                height: 60,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Svg
                width={60}
                height={60}
                style={{
                  position: "absolute",
                  transform: [
                    {
                      rotate: "-90deg",
                    },
                  ],
                }}
              >
                {/* Background circle */}

                <Circle cx="30" cy="30" r={radius} fill="none" />

                {/* Progress circle */}

                <Circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke={foreground}
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                />
              </Svg>

              <ActivityIndicator size="small" color={foreground} />
            </View>

            <Text
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: "600",
                color: foreground,
              }}
            >
              {isProcessing
                ? "Processing..."
                : `Uploading ${displayProgress < 100 ? displayProgress : 100}%`}
            </Text>
          </View>
        )}

        {/* ------------------------------------------------------- */}
        {/* Success                                                */}
        {/* ------------------------------------------------------- */}

        {displayStatus === "done" && (
          <View
            style={{
              position: "absolute",
              right: 12,
              top: 12,
            }}
          >
            <CheckCircle2 size={21} color="#22c55e" fill={cardColor} />
          </View>
        )}
      </View>

      {/* ========================================================= */}
      {/* Details                                                   */}
      {/* ========================================================= */}

      <View
        style={{
          padding: 16,
        }}
      >
        {/* Title + Actions */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          {/* Title */}

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 14,
                fontWeight: "600",
                color: foreground,
              }}
            >
              {docFile.documentTitle}
            </Text>

            <Text
              variant="caption"
              style={{
                marginTop: 3,
                fontSize: 12,
              }}
            >
              {docFile.size} · {formatDate(docFile.date)}
            </Text>
          </View>

          {/* Download / Edit / Delete */}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Pressable
              onPress={() => onDownload(docFile)}
              hitSlop={8}
              style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
              }}
            >
              <DownloadIcon size={18} color={mutedForeground} />
            </Pressable>

            <Pressable
              onPress={onEdit}
              hitSlop={8}
              style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
              }}
            >
              <Pen size={18} color={mutedForeground} />
            </Pressable>

            <Pressable
              onPress={() => onDelete(docFile)}
              hitSlop={8}
              style={{
                width: 36,
                height: 36,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
              }}
            >
              <Trash2 size={18} color="#ef4444" />
            </Pressable>
          </View>
        </View>

        {/* Category */}

        {docFile.documentCategory && (
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 10,
              paddingHorizontal: 9,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: category?.color ?? background,
              opacity: isBusy ? 0.5 : 1,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: foreground,
              }}
            >
              {docFile.documentCategory}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
