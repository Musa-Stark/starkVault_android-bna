import { useColor } from "@/hooks/useColor";
import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";

const loadingMessages = [
  "Getting things ready",
  "Organizing your finances",
  "Preparing your savings",
  "Securing your passwords",
  "Loading your notes",
  "Getting your cards ready",
  "Checking your subscriptions",
  "Organizing your expenses",
  "Preparing your income",
  "Gathering your documents",
  "Securing your digital vault",
  "Keeping everything in one place",
  "Organizing your essentials",
  "Getting your records ready",
  "Preparing your personal vault",
  "Bringing everything together",
  "Setting up your financial overview",
  "Sorting your subscriptions",
  "Protecting your private information",
  "Getting your documents in order",
  "Preparing your personal space",
  "Almost everything is ready",
  "Putting the finishing touches on",
  "Making your vault ready",
  "Almost there...",
];

export default function LoadingScreen() {
  const rotation = useRef(new Animated.Value(0)).current;
  const reverseRotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const scan = useRef(new Animated.Value(0)).current;

  // Google-style progress
  const progressPosition = useRef(new Animated.Value(-1)).current;
  const progressScale = useRef(new Animated.Value(0.12)).current;

  const fade = useRef(new Animated.Value(0)).current;

  const messageTranslateY = useRef(new Animated.Value(0)).current;
  const messageOpacity = useRef(new Animated.Value(1)).current;

  const [messageIndex, setMessageIndex] = React.useState(0);

  // --------------------------------
  // Main animations
  // --------------------------------

  useEffect(() => {
    const rotationAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    rotationAnimation.start();

    const reverseRotationAnimation = Animated.loop(
      Animated.timing(reverseRotation, {
        toValue: 1,
        duration: 7500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    reverseRotationAnimation.start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    const glowAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    glowAnimation.start();

    const scanAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scan, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(300),
        Animated.timing(scan, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    scanAnimation.start();

    // Initial fade
    Animated.timing(fade, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      rotationAnimation.stop();
      reverseRotationAnimation.stop();
      pulseAnimation.stop();
      glowAnimation.stop();
      scanAnimation.stop();
    };
  }, []);

  // --------------------------------
  // Google-style indeterminate loader
  // --------------------------------

  useEffect(() => {
    let cancelled = false;

    const animateProgress = () => {
      if (cancelled) return;

      // Start from the left
      progressPosition.setValue(-1);
      progressScale.setValue(0.12);

      Animated.parallel([
        // Move the bar from left → right
        Animated.timing(progressPosition, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),

        // Expand → contract
        Animated.sequence([
          // Small at the beginning
          Animated.timing(progressScale, {
            toValue: 0.18,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          // Expand toward the middle
          Animated.timing(progressScale, {
            toValue: 1,
            duration: 650,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          // Contract toward the end
          Animated.timing(progressScale, {
            toValue: 0.12,
            duration: 850,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]).start(({ finished }) => {
        if (finished && !cancelled) {
          animateProgress();
        }
      });
    };

    animateProgress();

    return () => {
      cancelled = true;

      progressPosition.stopAnimation();
      progressScale.stopAnimation();
    };
  }, []);

  // --------------------------------
  // Rotating loading messages
  // --------------------------------

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.parallel([
        Animated.timing(messageTranslateY, {
          toValue: -12,
          duration: 350,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(messageOpacity, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMessageIndex((current) => (current + 1) % loadingMessages.length);

        messageTranslateY.setValue(12);

        Animated.parallel([
          Animated.timing(messageTranslateY, {
            toValue: 0,
            duration: 450,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),

          Animated.timing(messageOpacity, {
            toValue: 1,
            duration: 400,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 1900);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------
  // Progress position
  // --------------------------------

  const progressTranslate = progressPosition.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [-340, 0, 340],
  });

  // --------------------------------
  // Colors
  // --------------------------------

  const foreground = useColor("foreground");
  const background = useColor("background");
  const mutedForeground = useColor("mutedForeground");

  // --------------------------------
  // Render
  // --------------------------------

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: background,
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 32,
          opacity: fade,
        }}
      >
        {/* =========================
            LOGO
        ========================== */}

        <Image
          style={{
            width: 180,
            aspectRatio: 1 / 1,
          }}
          source={require("@/assets/images/icon.png")}
        />

        {/* =========================
            TITLE
        ========================== */}

        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            letterSpacing: -0.8,
            color: foreground,
            marginBottom: 9,
          }}
        >
          Stark Vaults
        </Text>

        {/* =========================
            PROGRESS
        ========================== */}

        <View
          style={{
            width: "80%",
            height: 4,
            backgroundColor: "#E8EAED",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              position: "absolute",

              // Start with a reasonably sized base
              width: 220,
              height: 4,

              left: "50%",
              top: 0,

              backgroundColor: "#4285F4",
              borderRadius: 4,

              // Move left → right
              transform: [
                {
                  translateX: progressTranslate,
                },
                {
                  // Expand/contract from the center
                  scaleX: progressScale,
                },
              ],

              shadowColor: "#4285F4",
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 0.4,
              shadowRadius: 5,

              elevation: 2,
            }}
          />
        </View>

        {/* =========================
            ANIMATED MESSAGE
        ========================== */}

        <View
          style={{
            height: 22,
            width: 260,
            overflow: "hidden",
            alignItems: "center",
            marginTop: 5,
          }}
        >
          <Animated.Text
            style={{
              fontSize: 14,
              color: mutedForeground,
              letterSpacing: 0.15,
              textAlign: "center",

              opacity: messageOpacity,

              transform: [
                {
                  translateY: messageTranslateY,
                },
              ],
            }}
          >
            {loadingMessages[messageIndex]}
          </Animated.Text>
        </View>

        {/* =========================
            SIGNATURE
        ========================== */}

        <Text
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 2,
            fontWeight: "600",
            letterSpacing: 2.8,
            color: "#B0B5BA",
          }}
        >
          v 1.0
        </Text>
      </Animated.View>
    </View>
  );
}
