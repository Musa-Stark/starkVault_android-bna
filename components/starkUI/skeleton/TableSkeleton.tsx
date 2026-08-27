import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useColor } from "@/hooks/useColor";
import { ViewStyle } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

type TableSkeletonProps = {
  rows?: number;
  columns?: number;
  style?: ViewStyle
};

const ShimmerBlock = ({
  width,
  height = 14,
  borderRadius = 6,
}: {
  width: number | `${number}%`;
  height?: number;
  borderRadius?: number;
}) => {
  const translateX = useRef(new Animated.Value(-120)).current;

  const baseColor = useColor("border");
  const highlightColor = useColor("background");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 180,
        duration: 1000,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [translateX]);

  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        overflow: "hidden",
        backgroundColor: baseColor,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: highlightColor,
          opacity: 0.7,
          transform: [
            {
              translateX,
            },
          ],
        }}
      />
    </View>
  );
};

const SkeletonCell = ({ columnIndex }: { columnIndex: number }) => {
  // Slightly different widths make the skeleton
  // look more natural instead of every cell being identical.
  const widths = ["72%", "58%", "64%", "45%"];

  return (
    <View
      style={{
        flex: 1,
        minWidth: 100,
        paddingHorizontal: 18,
        paddingVertical: 16,
        justifyContent: "center",
      }}
    >
      <ShimmerBlock
        width={widths[columnIndex % widths.length] as `${number}%`}
        height={14}
        borderRadius={6}
      />
    </View>
  );
};

export default function TableSkeleton({
  rows = 4,
  columns = 4,
  style,
}: TableSkeletonProps) {
  const borderColor = useColor("border");
  const cardColor = useColor("card");

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: cardColor,
        ...style
      }}
    >
      {/* Skeleton header */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: cardColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        {Array.from({ length: columns }).map((_, columnIndex) => (
          <View
            key={`header-${columnIndex}`}
            style={{
              flex: 1,
              minWidth: 100,
              paddingHorizontal: 18,
              paddingVertical: 16,
              justifyContent: "center",
            }}
          >
            <ShimmerBlock
              width={
                columnIndex === 0
                  ? "55%"
                  : columnIndex === columns - 1
                    ? "45%"
                    : "60%"
              }
              height={14}
              borderRadius={6}
            />
          </View>
        ))}
      </View>

      {/* Skeleton rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={{
            flexDirection: "row",
            backgroundColor: cardColor,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
            minHeight: 58,
          }}
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <SkeletonCell
              key={`cell-${rowIndex}-${columnIndex}`}
              columnIndex={columnIndex}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
