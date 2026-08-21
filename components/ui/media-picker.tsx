import { Button, ButtonSize, ButtonVariant } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useColor } from "@/hooks/useColor";
import { CORNERS, FONT_SIZE } from "@/theme/globals";
import { Image as ExpoImage } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { Check, LucideProps, Video, X } from "lucide-react-native";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View as RNView,
  ViewStyle,
} from "react-native";

export type MediaType = "image" | "video" | "all";

export type MediaQuality = "low" | "medium" | "high";

export interface MediaAsset {
  id: string;
  uri: string;
  type: "image" | "video";
  width?: number;
  height?: number;
  duration?: number;
  filename?: string;
  fileSize?: number;
}

export interface MediaPickerProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  size?: ButtonSize;
  variant?: ButtonVariant;
  icon?: React.ComponentType<LucideProps>;
  disabled?: boolean;
  mediaType?: MediaType;
  multiple?: boolean;
  maxSelection?: number;
  quality?: MediaQuality;
  buttonText?: string;
  placeholder?: string;
  gallery?: boolean;
  showPreview?: boolean;
  previewSize?: number;
  selectedAssets?: MediaAsset[];

  /*
   * Upload state
   *
   * Example:
   * {
   *   "picker_123_0": 45,
   *   "picker_123_1": 78
   * }
   */
  uploadProgress?: Record<string, number>;

  /*
   * Global upload state.
   *
   * When true, selected previews remain blurred
   * until their individual progress reaches 100.
   */
  uploading?: boolean;

  onSelectionChange?: (assets: MediaAsset[]) => void;

  onError?: (error: string) => void;
}

const { width: screenWidth } = Dimensions.get("window");

const arraysEqual = (a: MediaAsset[], b: MediaAsset[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((item, index) => {
    const bItem = b[index];

    return (
      item.id === bItem.id && item.uri === bItem.uri && item.type === bItem.type
    );
  });
};

/*
 * Animated upload overlay.
 *
 * The image/video stays blurred underneath.
 * This component handles:
 *
 * - percentage
 * - rotating progress indicator
 * - completion check
 * - overlay fade out
 */
const AnimatedUploadOverlay = ({
  progress,
  primaryColor,
  secondary,
  onComplete,
}: {
  progress: number;
  primaryColor: string;
  secondary: string;
  onComplete?: () => void;
}) => {
  const overlayOpacity = useRef(new Animated.Value(1)).current;

  const scale = useRef(new Animated.Value(0.85)).current;

  const progressAnimation = useRef(new Animated.Value(0)).current;

  const checkScale = useRef(new Animated.Value(0)).current;

  const [completed, setCompleted] = useState(false);

  const safeProgress = Math.min(Math.max(progress, 0), 100);

  useEffect(() => {
    /*
     * Smooth percentage animation.
     */
    Animated.timing(progressAnimation, {
      toValue: safeProgress,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    /*
     * Entrance animation.
     */
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();

    /*
     * Upload completed.
     */
    if (safeProgress >= 100 && !completed) {
      setCompleted(true);

      /*
       * Show checkmark.
       */
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }).start(() => {
        /*
         * Keep the check visible briefly,
         * then reveal the sharp preview.
         */
        setTimeout(() => {
          Animated.timing(overlayOpacity, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => {
            onComplete?.();
          });
        }, 500);
      });
    }
  }, [safeProgress, completed, onComplete]);

  const progressRotation = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ["0deg", "360deg"],
  });

  const percentage = progressAnimation.interpolate({
    inputRange: [0, 100],
    outputRange: ["0", "100"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.uploadOverlay,
        {
          opacity: overlayOpacity,
        },
      ]}
    >
      {!completed ? (
        <Animated.View
          style={{
            transform: [
              {
                scale,
              },
            ],
            alignItems: "center",
          }}
        >
          <View
            style={[
              styles.progressCircle,
              {
                borderColor: "rgba(255,255,255,0.25)",
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressArc,
                {
                  borderColor: primaryColor,
                  transform: [
                    {
                      rotate: progressRotation,
                    },
                  ],
                },
              ]}
            />

            <View
              style={[
                styles.progressCenter,
                {
                  backgroundColor: primaryColor,
                },
              ]}
            >
              <Animated.Text style={styles.progressText}>
                {percentage}%
              </Animated.Text>
            </View>
          </View>

          <Text style={styles.uploadingText}>Uploading...</Text>
        </Animated.View>
      ) : (
        <Animated.View
          style={[
            styles.successCircle,
            {
              backgroundColor: primaryColor,
              transform: [
                {
                  scale: checkScale,
                },
              ],
            },
          ]}
        >
          <Check size={28} color={secondary} strokeWidth={3} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export const MediaPicker = forwardRef<RNView, MediaPickerProps>(
  (
    {
      children,
      mediaType = "all",
      multiple = false,
      gallery = false,
      maxSelection = 10,
      quality = "high",
      onSelectionChange,
      onError,
      buttonText,
      showPreview = true,
      previewSize = 80,
      style,
      variant,
      size,
      icon,
      disabled = false,
      selectedAssets = [],

      /*
       * Upload props
       */
      uploadProgress = {},
      uploading = false,
    },
    ref,
  ) => {
    const [assets, setAssets] = useState<MediaAsset[]>(selectedAssets);

    const [isGalleryVisible, setIsGalleryVisible] = useState(false);

    const [galleryAssets, setGalleryAssets] = useState<
      MediaLibrary.AssetInfo[]
    >([]);

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    const [canAskAgain, setCanAskAgain] = useState(true);

    /*
     * Tracks previews that have completed
     * their reveal animation.
     */
    const [revealedAssets, setRevealedAssets] = useState<
      Record<string, boolean>
    >({});

    const prevSelectedAssetsRef = useRef<MediaAsset[]>(selectedAssets);

    /*
     * Theme
     */
    const cardColor = useColor("card");

    const borderColor = useColor("border");

    const mutedColor = useColor("mutedForeground");

    const primaryColor = useColor("primary");

    const secondary = useColor("secondary");

    /*
     * Sync selectedAssets.
     */
    useEffect(() => {
      if (!arraysEqual(prevSelectedAssetsRef.current, selectedAssets)) {
        setAssets(selectedAssets);

        prevSelectedAssetsRef.current = selectedAssets;

        /*
         * Keep new external assets
         * unrevealed when uploading.
         */
        if (uploading) {
          setRevealedAssets((prev) => {
            const next = {
              ...prev,
            };

            selectedAssets.forEach((asset) => {
              const progress = uploadProgress[asset.id] ?? 0;

              if (progress < 100) {
                next[asset.id] = false;
              }
            });

            return next;
          });
        }
      }
    }, [selectedAssets, uploading, uploadProgress]);

    /*
     * Request custom gallery permission.
     */
    const requestGalleryPermissions = async (): Promise<{
      granted: boolean;
      canAskAgain: boolean;
    }> => {
      try {
        const { status, canAskAgain: canAsk } =
          await MediaLibrary.requestPermissionsAsync();

        const granted = status === "granted";

        setHasPermission(granted);

        setCanAskAgain(canAsk);

        if (!granted) {
          onError?.(
            canAsk
              ? "Media library permission is required to access photos and videos"
              : "Media library permission was denied. Enable it in Settings to continue.",
          );
        }

        return {
          granted,
          canAskAgain: canAsk,
        };
      } catch (error) {
        console.error("MediaLibrary permission error:", error);

        setHasPermission(false);

        setCanAskAgain(true);

        onError?.("Failed to request media library permission");

        return {
          granted: false,
          canAskAgain: true,
        };
      }
    };

    /*
     * Load custom gallery.
     */
    const loadGalleryAssets = async () => {
      try {
        const query = new MediaLibrary.Query();

        if (mediaType === "image") {
          query.eq(
            MediaLibrary.AssetField.MEDIA_TYPE,
            MediaLibrary.MediaType.IMAGE,
          );
        } else if (mediaType === "video") {
          query.eq(
            MediaLibrary.AssetField.MEDIA_TYPE,
            MediaLibrary.MediaType.video,
          );
        } else {
          query.within(MediaLibrary.AssetField.MEDIA_TYPE, [
            MediaLibrary.MediaType.IMAGE,
            MediaLibrary.MediaType.video,
          ]);
        }

        const found = await query
          .orderBy({
            key: MediaLibrary.AssetField.CREATION_TIME,
            ascending: false,
          })
          .limit(100)
          .exe();

        const resolved = await Promise.all(
          found.map((asset) => asset.getInfo()),
        );

        setGalleryAssets(resolved);
      } catch (error) {
        console.error("Failed to load gallery assets:", error);

        onError?.("Failed to load gallery assets");
      }
    };

    /*
     * Native Expo picker.
     */
    const pickWithImagePicker = async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          onError?.(
            permission.canAskAgain
              ? "Photo library permission is required to select media"
              : "Photo library permission was denied. Enable it in Settings.",
          );

          if (!permission.canAskAgain) {
            await Linking.openSettings();
          }

          return;
        }

        let pickerMediaTypes: ["images"] | ["videos"] | ["images", "videos"];

        if (mediaType === "image") {
          pickerMediaTypes = ["images"];
        } else if (mediaType === "video") {
          pickerMediaTypes = ["videos"];
        } else {
          pickerMediaTypes = ["images", "videos"];
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: pickerMediaTypes,

          allowsMultipleSelection: multiple,

          selectionLimit: multiple ? maxSelection : 1,

          quality: quality === "high" ? 1 : quality === "medium" ? 0.7 : 0.3,
        });

        if (result.canceled || !result.assets?.length) {
          return;
        }

        const newAssets = result.assets.map((asset, index) => ({
          id: `picker_${Date.now()}_${index}`,
          uri: asset.uri,
          type: asset.type === "video" ? "video" : "image",
          width: asset.width,
          height: asset.height,
          duration: asset.duration || undefined,
          filename: asset.fileName || undefined,
          fileSize: asset.fileSize || undefined,
        }));

        /*
         * New previews start blurred
         * when upload mode is active.
         */
        if (uploading) {
          setRevealedAssets((prev) => {
            const next = {
              ...prev,
            };

            newAssets.forEach((asset) => {
              next[asset.id] = false;
            });

            return next;
          });
        }

        handleAssetSelection(newAssets);
      } catch (error) {
        console.error("ImagePicker error:", error);

        onError?.("Failed to pick media from gallery");
      }
    };

    /*
     * Open gallery.
     */
    const pickFromGallery = async () => {
      if (!gallery) {
        await pickWithImagePicker();
        return;
      }

      try {
        const permission = await requestGalleryPermissions();

        if (!permission.granted) {
          if (!permission.canAskAgain) {
            await Linking.openSettings();
          }

          return;
        }

        await loadGalleryAssets();

        setIsGalleryVisible(true);
      } catch (error) {
        console.error("Custom gallery error:", error);

        onError?.("Failed to open media gallery");
      }
    };

    /*
     * Add assets.
     */
    const handleAssetSelection = (newAssets: MediaAsset[]) => {
      let updatedAssets: MediaAsset[];

      if (multiple) {
        updatedAssets = [...assets, ...newAssets].slice(0, maxSelection);
      } else {
        updatedAssets = newAssets;
      }

      setAssets(updatedAssets);

      prevSelectedAssetsRef.current = updatedAssets;

      onSelectionChange?.(updatedAssets);
    };

    /*
     * Custom gallery selection.
     */
    const handleGalleryAssetSelect = async (
      galleryAsset: MediaLibrary.AssetInfo,
    ) => {
      try {
        const newAsset: MediaAsset = {
          id: galleryAsset.id,
          uri: galleryAsset.uri,
          type:
            galleryAsset.mediaType === MediaLibrary.MediaType.video
              ? "video"
              : "image",
          width: galleryAsset.width,
          height: galleryAsset.height,
          duration: galleryAsset.duration || undefined,
          filename: galleryAsset.filename,
        };

        if (multiple) {
          const alreadySelected = assets.some(
            (asset) => asset.id === newAsset.id,
          );

          if (alreadySelected) {
            const filtered = assets.filter((asset) => asset.id !== newAsset.id);

            setAssets(filtered);

            prevSelectedAssetsRef.current = filtered;

            onSelectionChange?.(filtered);

            return;
          }

          if (assets.length >= maxSelection) {
            return;
          }

          const updated = [...assets, newAsset];

          setAssets(updated);

          prevSelectedAssetsRef.current = updated;

          onSelectionChange?.(updated);

          return;
        }

        const newAssets = [newAsset];

        setAssets(newAssets);

        prevSelectedAssetsRef.current = newAssets;

        onSelectionChange?.(newAssets);

        setIsGalleryVisible(false);
      } catch (error) {
        console.error("Failed to select asset:", error);

        onError?.("Failed to select asset");
      }
    };

    /*
     * Remove asset.
     */
    const removeAsset = (assetId: string) => {
      const filtered = assets.filter((asset) => asset.id !== assetId);

      setAssets(filtered);

      prevSelectedAssetsRef.current = filtered;

      setRevealedAssets((prev) => {
        const next = {
          ...prev,
        };

        delete next[assetId];

        return next;
      });

      onSelectionChange?.(filtered);
    };

    /*
     * Called when upload animation
     * has finished.
     */
    const handleUploadComplete = (assetId: string) => {
      setRevealedAssets((prev) => ({
        ...prev,
        [assetId]: true,
      }));
    };

    /*
     * Preview item.
     */
    const renderPreviewItem = ({ item }: { item: MediaAsset }) => {
      const progress = uploadProgress[item.id] ?? 0;

      /*
       * An item is considered revealed
       * when its animation has completed.
       */
      const isRevealed =
        !uploading || revealedAssets[item.id] === true || progress >= 100;

      const isUploading = uploading && !isRevealed;

      return (
        <View
          style={[
            styles.previewItem,
            {
              width: previewSize,
              height: previewSize,
              borderColor,
            },
          ]}
        >
          {/*
           * BLURRED BACKGROUND
           *
           * The image/video is always rendered.
           * While uploading, blurRadius makes
           * the preview visually hidden behind
           * the animation.
           */}
          <ExpoImage
            source={{
              uri: item.uri,
            }}
            style={[
              styles.previewImage,
              {
                width: previewSize,
                height: previewSize,
              },
            ]}
            contentFit="cover"
            blurRadius={isUploading ? 18 : 0}
          />

          {/*
           * Video icon.
           */}
          {item.type === "video" && (
            <View style={styles.videoIndicator}>
              <Video size={16} color="white" />
            </View>
          )}

          {/*
           * Upload animation.
           */}
          {isUploading && (
            <AnimatedUploadOverlay
              progress={progress}
              primaryColor={primaryColor}
              secondary={secondary}
              onComplete={() => handleUploadComplete(item.id)}
            />
          )}

          {/*
           * Remove button only after
           * upload has completed.
           */}
          {isRevealed && (
            <TouchableOpacity
              style={[
                styles.removeButton,
                {
                  backgroundColor: primaryColor,
                },
              ]}
              onPress={() => removeAsset(item.id)}
            >
              <X size={12} color={secondary} />
            </TouchableOpacity>
          )}
        </View>
      );
    };

    /*
     * Custom gallery item.
     */
    const renderGalleryItem = ({ item }: { item: MediaLibrary.AssetInfo }) => {
      const isSelected = assets.some((asset) => asset.id === item.id);

      const itemWidth = screenWidth / 3 - 4;

      return (
        <Pressable
          style={[
            styles.galleryItem,
            {
              width: itemWidth,
              height: itemWidth,
            },
            isSelected && {
              borderColor: primaryColor,
              borderWidth: 3,
            },
          ]}
          onPress={() => handleGalleryAssetSelect(item)}
        >
          <ExpoImage
            source={{
              uri: item.uri,
            }}
            style={styles.galleryImage}
            contentFit="cover"
          />

          {item.mediaType === MediaLibrary.MediaType.video && (
            <View style={styles.videoIndicator}>
              <Video size={20} color="white" />
            </View>
          )}

          {multiple && isSelected && (
            <View
              style={[
                styles.selectedIndicator,
                {
                  backgroundColor: primaryColor,
                },
              ]}
            >
              <Text
                style={{
                  color: secondary,
                  fontSize: 12,
                  fontWeight: "bold",
                }}
              >
                {assets.findIndex((asset) => asset.id === item.id) + 1}
              </Text>
            </View>
          )}
        </Pressable>
      );
    };

    return (
      <View ref={ref} style={style}>
        {children ? (
          children
        ) : (
          <Button
            onPress={pickFromGallery}
            disabled={disabled}
            variant={variant}
            size={size}
            icon={icon}
          >
            {buttonText ||
              `Select ${
                mediaType === "all"
                  ? "Media"
                  : mediaType === "image"
                    ? "Images"
                    : "Videos"
              }`}
          </Button>
        )}

        {showPreview && assets.length > 0 && (
          <FlatList
            data={assets}
            renderItem={renderPreviewItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.previewContainer}
            contentContainerStyle={styles.previewContent}
          />
        )}

        {gallery && (
          <Modal
            visible={isGalleryVisible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={() => setIsGalleryVisible(false)}
          >
            <View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: cardColor,
                },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  {
                    borderBottomColor: borderColor,
                  },
                ]}
              >
                <Text variant="title">
                  {buttonText ||
                    `Select ${
                      mediaType === "all"
                        ? "Media"
                        : mediaType === "image"
                          ? "Images"
                          : "Videos"
                    }`}
                </Text>

                <View style={styles.modalActions}>
                  {multiple && (
                    <Text
                      style={[
                        styles.selectionCount,
                        {
                          color: mutedColor,
                        },
                      ]}
                    >
                      {assets.length}/{maxSelection}
                    </Text>
                  )}

                  <Button
                    size="sm"
                    variant="success"
                    onPress={() => setIsGalleryVisible(false)}
                  >
                    Done
                  </Button>
                </View>
              </View>

              <FlatList
                data={galleryAssets}
                renderItem={renderGalleryItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                contentContainerStyle={styles.galleryContent}
              />
            </View>
          </Modal>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  compactButton: {
    width: 60,
    height: 60,
    borderRadius: CORNERS,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },

  disabled: {
    opacity: 0.5,
  },

  /*
   * Preview
   */
  previewContainer: {
    marginTop: 12,
  },

  previewContent: {
    paddingHorizontal: 4,
  },

  previewItem: {
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },

  previewImage: {
    borderRadius: 9,
  },

  /*
   * Upload overlay
   */
  uploadOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9,
    backgroundColor: "rgba(0,0,0,0.58)",
    alignItems: "center",
    justifyContent: "center",
  },

  progressCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  progressArc: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
  },

  progressCenter: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  progressText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "800",
  },

  uploadingText: {
    marginTop: 7,
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
  },

  successCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Video indicator
   */
  videoIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 12,
    padding: 4,
  },

  /*
   * Remove button
   */
  removeButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  /*
   * Modal
   */
  modalContainer: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  modalActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  selectionCount: {
    fontSize: FONT_SIZE,
    fontWeight: "500",
  },

  galleryContent: {
    padding: 2,
  },

  galleryItem: {
    margin: 1,
    borderRadius: 4,
    overflow: "hidden",
    position: "relative",
  },

  galleryImage: {
    width: "100%",
    height: "100%",
  },

  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

MediaPicker.displayName = "MediaPicker";
