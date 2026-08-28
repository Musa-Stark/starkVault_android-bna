import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  View,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useColor } from "@/hooks/useColor";

type Props = {
  /**
   * Optional: render multiple skeleton cards.
   * Defaults to 1.
   */
  count?: number;
};

function SkeletonBox({
  style,
  shimmer,
}: {
  style?: any;
  shimmer: Animated.Value;
}) {
  const { width } = useWindowDimensions();

  const translateX = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[styles.skeleton, style]}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.shimmerHighlight} />
      </Animated.View>
    </View>
  );
}

function SavingsGoalCardSkeletonItem() {
  const background = useColor("background");
  const cardColor = useColor("card");
  const borderColor = useColor("border");

  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [shimmer]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardColor,
        },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.goalInfo}>
          {/* Goal name */}
          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: "65%",
              height: 18,
              borderRadius: 5,
            }}
          />

          {/* Category */}
          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 78,
              height: 24,
              marginTop: 6,
              borderRadius: 999,
            }}
          />
        </View>

        {/* Percentage */}
        <SkeletonBox
          shimmer={shimmer}
          style={{
            width: 52,
            height: 29,
            borderRadius: 5,
          }}
        />
      </View>

      {/* Progress bar */}
      <SkeletonBox
        shimmer={shimmer}
        style={{
          width: "100%",
          height: 8,
          marginTop: 16,
          borderRadius: 999,
        }}
      />

      {/* Current / target + deadline */}
      <View style={styles.amountRow}>
        <SkeletonBox
          shimmer={shimmer}
          style={{
            width: 150,
            height: 17,
            borderRadius: 5,
          }}
        />

        <View style={styles.deadline}>
          {/* Calendar icon placeholder */}
          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
            }}
          />

          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 82,
              height: 15,
              borderRadius: 4,
            }}
          />
        </View>
      </View>

      {/* Bottom information + actions */}
      <View
        style={[
          styles.bottomRow,
          {
            borderTopColor: borderColor,
          },
        ]}
      >
        {/* Remaining */}
        <View>
          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 70,
              height: 14,
              borderRadius: 4,
            }}
          />

          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 105,
              height: 17,
              marginTop: 5,
              borderRadius: 4,
            }}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
            }}
          />

          <SkeletonBox
            shimmer={shimmer}
            style={{
              width: 38,
              height: 38,
              marginLeft: 4,
              borderRadius: 999,
            }}
          />
        </View>
      </View>

      {/* Contribute */}
      <SkeletonBox
        shimmer={shimmer}
        style={{
          width: "100%",
          height: 46,
          marginTop: 16,
          borderRadius: 10,
        }}
      />
    </View>
  );
}

export default function SavingsGoalCardSkeleton({ count = 1 }: Props) {
  return (
    <View style={{ gap: 12, marginTop: 15 }}>
      {Array.from({ length: count }).map((_, index) => (
        <SavingsGoalCardSkeletonItem key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 18,
    borderRadius: 16,
    elevation: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },

  goalInfo: {
    flex: 1,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },

  deadline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
  },

  skeleton: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "rgba(128, 128, 128, 0.15)",
  },

  shimmerHighlight: {
    width: 100,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.30)",
    transform: [{ skewX: "-20deg" }],
  },
});