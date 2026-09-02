// SadapayCard.tsx

import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

type SadapayCardProps = {
  cardNumber?: string;
  cardHolder?: string;
  expiry?: Date | undefined;
  cvv?: string;
  style?: ViewStyle;
};

export default function SadapayCard({
  cardNumber = "4242 4242 4242 4242",
  cardHolder = "MUHAMMAD AHMED",
  expiry = undefined,
  cvv = "123",
  style,
}: SadapayCardProps) {
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(
    style?.width ? (style?.width as number) : width - 32,
    400,
  );
  const cardHeight = style?.height || cardWidth * 0.63;

  const [flipped, setFlipped] = useState(false);

  const rotate = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const nextValue = flipped ? 0 : 1;

    setFlipped(!flipped);

    Animated.timing(rotate, {
      toValue: nextValue,
      duration: 650,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const frontRotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotation = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        alignSelf: "center",
        ...style,
      }}
    >
      {/* =====================================================
          FRONT
      ===================================================== */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.card,
          {
            width: cardWidth,
            height: cardHeight,
            transform: [{ perspective: 1400 }, { rotateY: frontRotation }],
          },
        ]}
      >
        {/* Decorative blobs */}

        <View style={styles.blueGlow} />
        <View style={styles.purpleGlow} />

        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />

        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>SADAPAY</Text>
          </View>

          <View style={styles.contactless}>
            <View style={styles.arcOne} />
            <View style={styles.arcTwo} />
            <View style={styles.arcThree} />
          </View>
        </View>

        {/* Chip */}

        <View style={styles.chip}>
          <View style={styles.chipHorizontal} />
          <View style={styles.chipVertical} />
          <View style={styles.chipInner} />
        </View>

        {/* Card number */}

        <Text
          style={[
            styles.cardNumber,
            {
              fontSize: cardWidth < 350 ? 17 : 20,
            },
          ]}
        >
          {cardNumber}
        </Text>

        {/* Bottom */}

        <View style={styles.bottom}>
          <View style={styles.holder}>
            <Text style={styles.label}>CARD HOLDER</Text>

            <Text style={styles.name}>{cardHolder.toUpperCase()}</Text>
          </View>

          <View>
            <Text style={styles.label}>EXPIRES</Text>

            {expiry && (
              <Text style={styles.expiry}>
                {new Date(expiry).toLocaleDateString("PK", {
                  dateStyle: "short",
                })}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>

      {/* =====================================================
          BACK
      ===================================================== */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.card,
          styles.backCard,
          {
            width: cardWidth,
            height: cardHeight,
            transform: [{ perspective: 1400 }, { rotateY: backRotation }],
          },
        ]}
      >
        {/* Header */}

        <View style={styles.backHeader}>
          <Text style={styles.backBrand}>SADAPAY</Text>
        </View>

        <View style={styles.cvvRow}>
          <View style={styles.signature}>
            <Text style={styles.signatureText}>{cardHolder.toUpperCase()}</Text>
          </View>

          {/* CVV */}
          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>CVV</Text>

            <View style={styles.cvvBox}>
              <Text style={styles.cvv}>{cvv}</Text>
            </View>
          </View>
        </View>

        {/* Bottom */}

        <View style={styles.backBottom}>
          <Text style={styles.lastFour}>•••• {cardNumber.slice(-4)}</Text>

          <Text style={styles.flipBack}>TAP TO FLIP BACK</Text>
        </View>
      </Animated.View>

      {/* Touch layer */}

      <Pressable onPress={flipCard} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  /* =====================================================
     CARD
  ===================================================== */

  card: {
    position: "absolute",

    top: 0,
    left: 0,

    padding: 22,

    borderRadius: 24,

    overflow: "hidden",

    backgroundColor: "#09090c",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.12)",

    backfaceVisibility: "hidden",
  },

  backCard: {
    backgroundColor: "#08080b",
  },

  /* =====================================================
     BACKGROUND
  ===================================================== */

  blueGlow: {
    position: "absolute",

    width: 250,
    height: 250,

    borderRadius: 125,

    right: -150,
    top: -150,

    backgroundColor: "#3867ff",

    opacity: 0.3,
  },

  purpleGlow: {
    position: "absolute",

    width: 220,
    height: 220,

    borderRadius: 110,

    left: -150,
    bottom: -150,

    backgroundColor: "#7a42ff",

    opacity: 0.18,
  },

  circleOne: {
    position: "absolute",

    width: 220,
    height: 220,

    borderRadius: 110,

    right: -120,
    top: -80,

    borderWidth: 1,

    borderColor: "rgba(100,130,255,0.15)",
  },

  circleTwo: {
    position: "absolute",

    width: 160,
    height: 160,

    borderRadius: 80,

    right: -90,
    top: -50,

    borderWidth: 1,

    borderColor: "rgba(140,110,255,0.1)",
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    flexDirection: "row",

    alignItems: "flex-start",

    justifyContent: "space-between",
  },

  brand: {
    color: "#fff",

    fontSize: 19,

    fontWeight: "900",

    letterSpacing: -0.5,
  },

  brandSub: {
    color: "rgba(255,255,255,0.35)",

    fontSize: 5.5,

    fontWeight: "700",

    letterSpacing: 1.3,

    marginTop: 1,
  },

  /* =====================================================
     CONTACTLESS
  ===================================================== */

  contactless: {
    width: 28,
    height: 28,

    justifyContent: "center",

    alignItems: "center",

    transform: [{ rotate: "-45deg" }],
  },

  arcOne: {
    position: "absolute",

    width: 8,
    height: 8,

    borderTopWidth: 2,

    borderRightWidth: 2,

    borderColor: "#fff",

    borderRadius: 10,
  },

  arcTwo: {
    position: "absolute",

    width: 15,
    height: 15,

    borderTopWidth: 2,

    borderRightWidth: 2,

    borderColor: "rgba(255,255,255,0.55)",

    borderRadius: 13,
  },

  arcThree: {
    position: "absolute",

    width: 22,
    height: 22,

    borderTopWidth: 2,

    borderRightWidth: 2,

    borderColor: "rgba(255,255,255,0.25)",

    borderRadius: 15,
  },

  /* =====================================================
     CHIP
  ===================================================== */

  chip: {
    width: 48,
    height: 35,

    marginTop: 18,

    borderRadius: 7,

    backgroundColor: "#b7b7ba",

    overflow: "hidden",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.4)",
  },

  chipHorizontal: {
    position: "absolute",

    left: 0,
    right: 0,

    top: 17,

    height: 1,

    backgroundColor: "#777",
  },

  chipVertical: {
    position: "absolute",

    top: 0,
    bottom: 0,

    left: 23,

    width: 1,

    backgroundColor: "#777",
  },

  chipInner: {
    position: "absolute",

    width: 17,
    height: 11,

    left: 15,
    top: 11,

    borderWidth: 1,

    borderColor: "#777",

    borderRadius: 4,
  },

  /* =====================================================
     NUMBER
  ===================================================== */

  cardNumber: {
    color: "#fff",

    fontWeight: "500",

    letterSpacing: 2,

    marginTop: 17,
  },

  /* =====================================================
     BOTTOM
  ===================================================== */

  bottom: {
    flexDirection: "row",

    alignItems: "flex-end",

    marginTop: 15,
  },

  holder: {
    flex: 1,

    paddingRight: 10,
  },

  label: {
    color: "rgba(255,255,255,0.3)",

    fontSize: 5.5,

    fontWeight: "600",

    letterSpacing: 1,

    marginBottom: 3,
  },

  name: {
    color: "#fff",

    fontSize: 10,

    fontWeight: "700",

    letterSpacing: 0.6,
  },

  expiry: {
    color: "#fff",

    fontSize: 11,

    fontWeight: "700",

    letterSpacing: 0.5,
  },

  /* =====================================================
     BADGE
  ===================================================== */

  demoBadge: {
    position: "absolute",

    right: 22,
    bottom: 22,

    paddingHorizontal: 7,

    paddingVertical: 4,

    borderRadius: 6,

    backgroundColor: "rgba(255,255,255,0.07)",

    borderWidth: 1,

    borderColor: "rgba(255,255,255,0.12)",
  },

  demoText: {
    color: "#9dafff",

    fontSize: 5.5,

    fontWeight: "900",

    letterSpacing: 1,
  },

  flipHint: {
    position: "absolute",

    right: 22,
    bottom: 9,

    color: "rgba(255,255,255,0.22)",

    fontSize: 5.5,

    letterSpacing: 0.8,
  },

  /* =====================================================
     BACK
  ===================================================== */

  backHeader: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  backBrand: {
    color: "#fff",

    fontSize: 17,

    fontWeight: "900",
  },

  backDemo: {
    color: "rgba(255,255,255,0.35)",

    fontSize: 6,

    letterSpacing: 1,
  },

  stripe: {
    position: "absolute",

    left: 0,
    right: 0,

    top: 58,

    height: 42,

    backgroundColor: "#000",
  },

  /* =====================================================
     CVV
  ===================================================== */

  cvvRow: {
    flexDirection: "row",

    alignItems: "flex-end",

    marginTop: 51,
  },

  signature: {
    flex: 1,

    height: 36,

    marginRight: 8,

    paddingHorizontal: 10,

    justifyContent: "center",

    backgroundColor: "#e5e5e7",

    borderRadius: 4,
  },

  signatureText: {
    color: "#17171a",

    fontSize: 8,

    fontStyle: "italic",
  },

  cvvContainer: {
    width: 55,
  },

  cvvLabel: {
    color: "rgba(255,255,255,0.3)",

    fontSize: 5.5,

    marginBottom: 3,

    letterSpacing: 0.8,
  },

  cvvBox: {
    height: 36,

    borderRadius: 4,

    backgroundColor: "#fff",

    justifyContent: "center",

    alignItems: "center",
  },

  cvv: {
    color: "#111",

    fontSize: 13,

    fontWeight: "800",

    letterSpacing: 1,
  },

  /* =====================================================
     INFO
  ===================================================== */

  info: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 14,

    padding: 9,

    borderRadius: 9,

    backgroundColor: "rgba(255,255,255,0.04)",
  },

  infoIcon: {
    width: 19,
    height: 19,

    borderRadius: 10,

    marginRight: 8,

    justifyContent: "center",

    alignItems: "center",

    backgroundColor: "rgba(100,125,255,0.15)",
  },

  infoIconText: {
    color: "#aab9ff",

    fontSize: 10,

    fontWeight: "800",
  },

  infoText: {
    flex: 1,

    color: "rgba(255,255,255,0.35)",

    fontSize: 6,

    lineHeight: 9,
  },

  /* =====================================================
     BACK BOTTOM
  ===================================================== */

  backBottom: {
    position: "absolute",

    left: 22,
    right: 22,

    bottom: 11,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  lastFour: {
    color: "rgba(255,255,255,0.35)",

    fontSize: 8,

    letterSpacing: 1.5,
  },

  flipBack: {
    color: "rgba(160,175,255,0.3)",

    fontSize: 5.5,

    letterSpacing: 0.8,
  },
});
