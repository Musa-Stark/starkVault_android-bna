import React, { useEffect, useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Download, Eye, Trash2, Pen, CheckCircle2 } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";

import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";

export type DocumentFile = {
  _id: string;
  documentTitle: string;
  documentCategory: string;
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

  const [status, setStatus] = useState(docFile.uploadStatus || "");

  const [progress, setProgress] = useState(docFile.progress || 0);

  const Icon = "image";

//   /*
//    * Simulated upload.
//    *
//    * Replace this with your real upload progress later.
//    */
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

  return (
    <View
      style={{
        overflow: "hidden",
        borderRadius: 16,
        backgroundColor: cardColor,
        elevation: 1,
        borderWidth: 1,
        borderColor: cardColor
      }}
    >
      {/* Preview */}
      <View
        style={{
          height: 190,
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: background,
          opacity: isUploading ? 0.4 : 1,
        }}
      >
        {/* File icon */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Icon}
        </View>

        {/* Format badge */}
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

        {/* Preview actions */}
        {!isBusy && (
          <View
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              right: 12,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Pressable
              onPress={() => onView(docFile)}
              style={{
                width: 42,
                height: 42,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                backgroundColor: cardColor,
              }}
            >
              <Eye size={18} color={foreground} />
            </Pressable>

            <Pressable
              onPress={() => onDownload(docFile)}
              style={{
                width: 42,
                height: 42,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                backgroundColor: cardColor,
              }}
            >
              <Download size={18} color={foreground} />
            </Pressable>
          </View>
        )}

        {/* Upload / Processing overlay */}
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
              backgroundColor: "rgba(0, 0, 0, 0.35)",
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
                <Circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="3"
                  fill="none"
                />

                {/* Progress circle */}
                <Circle
                  cx="30"
                  cy="30"
                  r={radius}
                  stroke="#ffffff"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                />
              </Svg>

              <ActivityIndicator size="small" color="#ffffff" />
            </View>

            <Text
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: "500",
                color: "#ffffff",
              }}
            >
              {isProcessing
                ? "Processing..."
                : `Uploading ${displayProgress < 100 ? displayProgress : 100}%`}
            </Text>
          </View>
        )}

        {/* Success */}
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

      {/* Details */}
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

          {/* Edit / Delete */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
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
        <View
          style={{
            alignSelf: "flex-start",
            marginTop: 10,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: category?.color ?? background,
            opacity: isUploading ? 0 : 1,
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
      </View>
    </View>
  );
}
