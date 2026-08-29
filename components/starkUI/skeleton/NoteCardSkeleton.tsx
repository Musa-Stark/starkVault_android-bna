import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, StyleSheet, ViewStyle } from "react-native";

import { useColor } from "@/hooks/useColor";

type NoteCardSkeletonProps = {
  style?: ViewStyle;
};

export default function NoteCardSkeleton({ style }: NoteCardSkeletonProps) {
  const background = useColor("background");
  const cardColor = useColor("card");
  const mutedForeground = useColor("mutedForeground");

  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  /*
   * Move the shimmer highlight from left -> right.
   *
   * The animated layer is intentionally wider than the card so
   * the highlight can smoothly enter and leave both sides.
   */
  const shimmerTranslate = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-420, 420],
  });

  const SkeletonLine = ({
    width,
    height = 12,
    borderRadius = 6,
    style,
  }: {
    width: number | `${number}%`;
    height?: number;
    borderRadius?: number;
    style?: ViewStyle;
  }) => {
    return (
      <View
        style={[
          styles.skeletonBase,
          {
            width,
            height,
            borderRadius,
            backgroundColor: mutedForeground + "18",
          },
          style,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.shimmerOverlay,
            {
              transform: [
                {
                  translateX: shimmerTranslate,
                },
              ],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardColor,
          borderColor: background,
        },
        style,
      ]}
    >
      {/* ====================================================== */}
      {/* Header                                                   */}
      {/* ====================================================== */}

      <View style={styles.header}>
        {/* Title + Date */}

        <View style={styles.headerText}>
          <SkeletonLine width="72%" height={16} borderRadius={7} />

          <SkeletonLine
            width={85}
            height={10}
            borderRadius={5}
            style={{
              marginTop: 8,
            }}
          />
        </View>

        {/* Pin button */}

        <SkeletonLine width={38} height={38} borderRadius={999} />
      </View>

      {/* ====================================================== */}
      {/* Category                                                 */}
      {/* ====================================================== */}

      <SkeletonLine
        width={82}
        height={25}
        borderRadius={999}
        style={{
          marginTop: 12,
          marginLeft: 16,
        }}
      />

      {/* ====================================================== */}
      {/* Content                                                  */}
      {/* ====================================================== */}

      <View style={styles.content}>
        <SkeletonLine width="96%" height={12} borderRadius={6} />

        <SkeletonLine
          width="88%"
          height={12}
          borderRadius={6}
          style={{
            marginTop: 9,
          }}
        />

        <SkeletonLine
          width="65%"
          height={12}
          borderRadius={6}
          style={{
            marginTop: 9,
          }}
        />
      </View>

      {/* ====================================================== */}
      {/* Actions                                                  */}
      {/* ====================================================== */}

      <View
        style={[
          styles.actions,
          {
            borderTopColor: background,
          },
        ]}
      >
        <SkeletonLine width={44} height={44} borderRadius={999} />

        <SkeletonLine width={44} height={44} borderRadius={999} />

        <SkeletonLine width={44} height={44} borderRadius={999} />

        <SkeletonLine width={44} height={44} borderRadius={999} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    elevation: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  headerText: {
    flex: 1,
    paddingRight: 12,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
  },

  actions: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    paddingHorizontal: 10,
    borderTopWidth: 1,
  },

  skeletonBase: {
    overflow: "hidden",
    position: "relative",
  },

  shimmerOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,

    /*
     * Wide enough to create a soft diagonal/gradient-like
     * highlight while moving across the skeleton.
     */
    width: 180,

    /*
     * A semi-transparent white highlight works well on
     * both light and dark skeleton backgrounds.
     */
    backgroundColor: "rgba(255, 255, 255, 0.28)",

    transform: [
      {
        skewX: "-18deg",
      },
    ],
  },
});
