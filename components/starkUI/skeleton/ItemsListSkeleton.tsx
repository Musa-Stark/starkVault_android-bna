import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  ViewStyle,
} from "react-native";
import { useColor } from "@/hooks/useColor";
import { BORDER_RADIUS } from "@/theme/globals";
import { Separator } from "@/components/ui/separator";

type ViewAllSkeletonProps = {
  rows?: number;
  style?: ViewStyle;
  header?: boolean;
};

type SkeletonBoxProps = {
  width: number | string;
  height: number;
  borderRadius?: number;
  shimmer: Animated.Value;
};

function SkeletonBox({
  width,
  height,
  borderRadius = 6,
  shimmer,
}: SkeletonBoxProps) {
  const background = useColor("muted");
  const foreground = useColor("foreground");

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  return (
    <View
      style={{
        width: width as number,
        height,
        borderRadius,
        backgroundColor: background,
        overflow: "hidden",
        opacity: 0.5,
      }}
    >
      {/* Shimmer */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: foreground,
          opacity: 0.08,
          transform: [
            {
              translateX,
            },
          ],
        }}
      />
    </View>
  );
}

function SkeletonItem({
  shimmer,
}: {
  shimmer: Animated.Value;
}) {
  const cardColor = useColor("card");

  return (
    <View
      style={{
        minHeight: 65,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Icon skeleton */}
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 18,
          marginRight: 10,
          backgroundColor: cardColor,
          overflow: "hidden",
        }}
      >
        <SkeletonBox
          width={52}
          height={52}
          borderRadius={18}
          shimmer={shimmer}
        />
      </View>

      {/* Title + caption */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          gap: 8,
        }}
      >
        <SkeletonBox
          width="65%"
          height={15}
          borderRadius={5}
          shimmer={shimmer}
        />

        <SkeletonBox
          width="40%"
          height={12}
          borderRadius={5}
          shimmer={shimmer}
        />
      </View>

      {/* Right content */}
      <View
        style={{
          marginLeft: 12,
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <SkeletonBox
          width={45}
          height={14}
          borderRadius={5}
          shimmer={shimmer}
        />

        <SkeletonBox
          width={22}
          height={22}
          borderRadius={11}
          shimmer={shimmer}
        />
      </View>
    </View>
  );
}

export function ItemsListSkeleton({
  rows = 4,
  style,
  header = true,
}: ViewAllSkeletonProps) {
  const cardColor = useColor("card");
  const foregroundColor = useColor("foreground");

  const shimmer = useRef(new Animated.Value(0)).current;

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

  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor: cardColor,
          borderRadius: BORDER_RADIUS,
          padding: 18,
          paddingBottom: 0,
          shadowColor: foregroundColor,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        },
        style,
      ]}
    >
      {/* Header */}
      {header && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <SkeletonBox
            width={130}
            height={22}
            borderRadius={6}
            shimmer={shimmer}
          />

          <View
            style={{
              flexDirection: "row",
              gap: 8,
            }}
          >
            <SkeletonBox
              width={32}
              height={32}
              borderRadius={8}
              shimmer={shimmer}
            />

            <SkeletonBox
              width={32}
              height={32}
              borderRadius={8}
              shimmer={shimmer}
            />
          </View>
        </View>
      )}

      {/* List */}
      <View
        style={{
          paddingBottom: 15,
          marginTop: 10,
        }}
      >
        {Array.from({ length: rows }).map((_, index) => (
          <React.Fragment key={index}>
            <SkeletonItem shimmer={shimmer} />

            {index !== rows - 1 && <Separator />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}