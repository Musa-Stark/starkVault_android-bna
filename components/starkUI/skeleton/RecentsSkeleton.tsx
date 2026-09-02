import React, { useEffect, useRef } from "react";
import { Animated, Easing, View, ViewStyle } from "react-native";
import { useColor } from "@/hooks/useColor";

type RecentActivitySkeletonProps = {
  count?: number;
  style?: ViewStyle;
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
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: foreground,
          opacity: 0.08,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
}

function RecentActivitySkeletonItem({
  shimmer,
}: {
  shimmer: Animated.Value;
}) {
  const borderColor = useColor("muted");

  return (
    <View
      style={{
        backgroundColor: borderColor,
        borderRadius: 20,
        paddingVertical: 12,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingLeft: 10,
      }}
    >
      {/* Icon */}
      <SkeletonBox
        width={56}
        height={56}
        borderRadius={18}
        shimmer={shimmer}
      />

      {/* Service + state + age */}
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          alignItems: "flex-start",
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
          width="30%"
          height={12}
          borderRadius={5}
          shimmer={shimmer}
        />
      </View>
    </View>
  );
}

export default function RecentActivitySkeleton({
  count = 3,
  style,
}: RecentActivitySkeletonProps) {
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
          gap: 10,
        },
        style,
      ]}
    >
      {Array.from({ length: count }).map((_, index) => (
        <RecentActivitySkeletonItem
          key={index}
          shimmer={shimmer}
        />
      ))}
    </View>
  );
}