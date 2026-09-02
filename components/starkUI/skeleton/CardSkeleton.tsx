// SadapayCardSkeleton.tsx

import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

import { useColor } from "@/hooks/useColor";

type SadapayCardSkeletonProps = {
  style?: ViewStyle;
};

export default function SadapayCardSkeleton({
  style,
}: SadapayCardSkeletonProps) {
  const { width } = useWindowDimensions();

  const cardColor = useColor("card");
  const mutedForeground = useColor("mutedForeground");
  const muted = useColor("muted");

  // ---------------------------------------------------------
  // CARD SIZE
  // ---------------------------------------------------------

  // Gives the card a little space on both sides.
  const horizontalMargin = 24;

  const availableWidth = width - horizontalMargin * 2;

  const cardWidth = Math.min(
    typeof style?.width === "number"
      ? style.width
      : availableWidth,
    380,
  );

  const cardHeight =
    typeof style?.height === "number"
      ? style.height
      : cardWidth * 0.63;

  // ---------------------------------------------------------
  // SHIMMER
  // ---------------------------------------------------------

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shimmer.setValue(0);

    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  const shimmerTranslate = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [
      -(cardWidth + 140),
      cardWidth + 140,
    ],
  });

  // ---------------------------------------------------------
  // SKELETON BLOCK
  // ---------------------------------------------------------

  const SkeletonBlock = ({
    width,
    height,
    borderRadius = 6,
    style,
  }: {
    width: number | `${number}%`;
    height: number;
    borderRadius?: number;
    style?: ViewStyle;
  }) => {
    return (
      <View
        style={[
          {
            width,
            height,
            borderRadius,
            overflow: "hidden",
            position: "relative",
            backgroundColor: mutedForeground + "18",
          },
          style,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -20,
            bottom: -20,
            left: 0,
            width: 90,
            backgroundColor: "rgba(255,255,255,0.22)",
            transform: [
              {
                translateX: shimmerTranslate,
              },
              {
                skewX: "-18deg",
              },
            ],
          }}
        />
      </View>
    );
  };

  // ---------------------------------------------------------
  // CARD
  // ---------------------------------------------------------

  return (
    <View
      style={[
        {
          width: "100%",
          alignItems: "center",
        },
        {
          // Only allow non-size styles from the parent.
          // Width/height are controlled below.
          marginTop: style?.marginTop,
          marginBottom: style?.marginBottom,
        },
      ]}
    >
      <View
        style={{
          width: cardWidth - 30,
          height: cardHeight,
          padding: 22,
          overflow: "hidden",
          borderRadius: 24,
          backgroundColor: cardColor,
          borderWidth: 1,
          borderColor: muted,
        }}
      >
        {/* HEADER */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <SkeletonBlock
              width={42}
              height={13}
              borderRadius={4}
            />

            <SkeletonBlock
              width={32}
              height={5}
              borderRadius={3}
              style={{
                marginTop: 4,
              }}
            />
          </View>

          <SkeletonBlock
            width={28}
            height={28}
            borderRadius={999}
          />
        </View>

        {/* CHIP */}

        <SkeletonBlock
          width={41}
          height={35}
          borderRadius={7}
          style={{
            marginTop: 18,
          }}
        />

        {/* CARD NUMBER */}

        <SkeletonBlock
          width="82%"
          height={20}
          borderRadius={5}
          style={{
            marginTop: 17,
          }}
        />

        {/* BOTTOM */}

        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginTop: 15,
          }}
        >
          {/* CARD HOLDER */}

          <View
            style={{
              flex: 1,
              paddingRight: 10,
            }}
          >
            <SkeletonBlock
              width={50}
              height={5}
              borderRadius={3}
              style={{
                marginBottom: 3,
              }}
            />

            <SkeletonBlock
              width="75%"
              height={10}
              borderRadius={4}
            />
          </View>

          {/* EXPIRY */}

          <View
            style={{
              width: 55,
            }}
          >
            <SkeletonBlock
              width={45}
              height={5}
              borderRadius={3}
              style={{
                marginBottom: 3,
              }}
            />

            <SkeletonBlock
              width={40}
              height={11}
              borderRadius={4}
            />
          </View>
        </View>

        {/* DEMO BADGE */}

        <View
          style={{
            position: "absolute",
            right: 22,
            bottom: 22,
          }}
        >
          <SkeletonBlock
            width={42}
            height={17}
            borderRadius={6}
          />
        </View>

        {/* TAP TO FLIP */}

        <View
          style={{
            position: "absolute",
            right: 22,
            bottom: 9,
          }}
        >
          <SkeletonBlock
            width={48}
            height={5}
            borderRadius={3}
          />
        </View>
      </View>
    </View>
  );
}