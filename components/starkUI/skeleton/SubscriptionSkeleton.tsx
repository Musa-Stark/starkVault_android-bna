import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  View,
} from "react-native";
import { useColor } from "@/hooks/useColor";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

function ShimmerBlock({
  width,
  height,
  borderRadius = 8,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
}) {
  const translateX = useRef(
    new Animated.Value(-SCREEN_WIDTH),
  ).current;

  const background = useColor("background");
  const card = useColor("card");

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: SCREEN_WIDTH,
        duration: 1100,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [translateX]);

  return (
    <View
      style={{
        width: width as number,
        height,
        overflow: "hidden",
        borderRadius,
        backgroundColor: background,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: card,
          opacity: 0.45,
          transform: [{ translateX }],
        }}
      />
    </View>
  );
}

export function SubscriptionCardSkeleton({
  count = 4,
}: {
  count?: number;
}) {
  const cardColor = useColor("card");
  const background = useColor("background");

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 12 }}>
        {Array.from({ length: count }).map((_, index) => (
          <View
            key={index}
            style={{
              padding: 16,
              borderRadius: 16,
              backgroundColor: cardColor,
              elevation: 1,
            }}
          >
            {/* Top section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              {/* Identity */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: 1,
                  gap: 12,
                }}
              >
                {/* Avatar */}
                <ShimmerBlock
                  width={44}
                  height={44}
                  borderRadius={12}
                />

                {/* Name + category */}
                <View style={{ flex: 1 }}>
                  <ShimmerBlock
                    width="65%"
                    height={15}
                    borderRadius={6}
                  />

                  <View style={{ marginTop: 7 }}>
                    <ShimmerBlock
                      width={82}
                      height={20}
                      borderRadius={999}
                    />
                  </View>
                </View>
              </View>

              {/* Price */}
              <ShimmerBlock
                width={62}
                height={16}
                borderRadius={6}
              />
            </View>

            {/* Bottom section */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 18,
              }}
            >
              {/* Date + billing cycle */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                {/* Date */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <ShimmerBlock
                    width={14}
                    height={14}
                    borderRadius={4}
                  />

                  <ShimmerBlock
                    width={78}
                    height={12}
                    borderRadius={5}
                  />
                </View>

                {/* Billing cycle */}
                <ShimmerBlock
                  width={68}
                  height={23}
                  borderRadius={999}
                />
              </View>

              {/* Actions */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <ShimmerBlock
                  width={38}
                  height={38}
                  borderRadius={999}
                />

                <ShimmerBlock
                  width={38}
                  height={38}
                  borderRadius={999}
                />
              </View>
            </View>

            {/* Optional subtle overlay to preserve card background */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: background,
                opacity: 0.001,
                borderRadius: 16,
              }}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}