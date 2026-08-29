import React, { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

type VisaCardProps = {
  cardNumber?: string;
  cardHolder?: string;
  expiry?: Date | undefined;
  cvv?: string;
};

export default function VisaCard({
  cardNumber = "4242 4242 4242 4242",
  cardHolder = "JOHN DOE",
  expiry = undefined,
  cvv = "123",
}: VisaCardProps) {
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width - 32, 390);
  const cardHeight = cardWidth * 0.63;

  const [flipped, setFlipped] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const newValue = flipped ? 0 : 1;

    setFlipped(!flipped);

    Animated.timing(animation, {
      toValue: newValue,
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const frontRotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backRotate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: cardWidth,
          height: cardHeight,
        },
      ]}
    >
      {/* FRONT */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.card,
          {
            width: cardWidth,
            height: cardHeight,
            transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
          },
        ]}
      >
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        {/* Header */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.bankName}>PREMIUM</Text>
            <Text style={styles.bankSub}>PLATINUM CARD</Text>
          </View>

          <Text style={styles.visa}>VISA</Text>
        </View>

        {/* Chip */}
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <View style={styles.chipHorizontal} />
            <View style={styles.chipVertical} />
            <View style={styles.chipSmallVertical} />
          </View>

          <View style={styles.contactless}>
            <View style={styles.contactArcOne} />
            <View style={styles.contactArcTwo} />
            <View style={styles.contactArcThree} />
          </View>
        </View>

        {/* Number */}
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
        <View style={styles.bottomRow}>
          <View style={styles.holderContainer}>
            <Text style={styles.label}>CARD HOLDER</Text>
            <Text style={styles.value} numberOfLines={1}>
              {cardHolder.toUpperCase()}
            </Text>
          </View>

          <View style={styles.expiryContainer}>
            <Text style={styles.label}>EXPIRES</Text>
            {expiry && (
              <Text style={styles.value}>
                {new Date(expiry).toLocaleDateString("PK", {
                  dateStyle: "short",
                })}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.tapHint}>TAP TO FLIP</Text>
      </Animated.View>

      {/* BACK */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.card,
          styles.backCard,
          {
            width: cardWidth,
            height: cardHeight,
            transform: [{ perspective: 1000 }, { rotateY: backRotate }],
          },
        ]}
      >
        <View style={styles.backTop}>
          <Text style={styles.backTitle}>PREMIUM CARD</Text>
          <Text style={styles.visaSmall}>VISA</Text>
        </View>

        {/* Magnetic stripe */}
        <View style={styles.magneticStripe} />

        {/* CVV */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>{cardHolder.toUpperCase()}</Text>
          </View>

          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>CVV</Text>

            <View style={styles.cvvBox}>
              <Text style={styles.cvv}>{cvv}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.backDescription}>
          This card is issued by your bank. If found, please return to the
          issuing institution.
        </Text>

        <View style={styles.backBottom}>
          <Text style={styles.backNumber}>•••• {cardNumber.slice(-4)}</Text>

          <Text style={styles.visaBack}>VISA</Text>
        </View>

        <Text style={styles.tapHintBack}>TAP TO FLIP BACK</Text>
      </Animated.View>

      {/* IMPORTANT:
          This is the touch layer.
          It sits above both card faces.
      */}
      <Pressable onPress={flipCard} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },

  card: {
    position: "absolute",
    left: 0,
    top: 0,

    borderRadius: 22,
    padding: 24,

    overflow: "hidden",

    backgroundColor: "#101c3a",

    backfaceVisibility: "hidden",
  },

  backCard: {
    backgroundColor: "#0c1630",
  },

  /* FRONT */

  glowOne: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    right: -130,
    top: -130,
    backgroundColor: "rgba(70, 110, 255, 0.22)",
  },

  glowTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    left: -150,
    bottom: -150,
    backgroundColor: "rgba(0, 200, 255, 0.12)",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  bankName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  bankSub: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 7,
    fontWeight: "600",
    letterSpacing: 1.3,
    marginTop: 2,
  },

  visa: {
    color: "#fff",
    fontSize: 32,
    fontStyle: "italic",
    fontWeight: "900",
    letterSpacing: -2,
  },

  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  chip: {
    width: 48,
    height: 36,
    borderRadius: 7,
    backgroundColor: "#d6b86a",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  chipHorizontal: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 17,
    height: 1,
    backgroundColor: "#927b3e",
  },

  chipVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 23,
    width: 1,
    backgroundColor: "#927b3e",
  },

  chipSmallVertical: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 11,
    width: 1,
    backgroundColor: "#927b3e",
  },

  contactless: {
    width: 28,
    height: 28,
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-45deg" }],
  },

  contactArcOne: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(255,255,255,0.75)",
    borderRadius: 10,
  },

  contactArcTwo: {
    position: "absolute",
    width: 15,
    height: 15,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
    borderRadius: 12,
  },

  contactArcThree: {
    position: "absolute",
    width: 22,
    height: 22,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    borderRadius: 15,
  },

  cardNumber: {
    color: "#fff",
    fontWeight: "500",
    letterSpacing: 2,
    marginTop: 18,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 14,
  },

  holderContainer: {
    flex: 1,
    paddingRight: 12,
  },

  expiryContainer: {
    width: 55,
  },

  label: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 7,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 3,
  },

  value: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
  },

  tapHint: {
    position: "absolute",
    right: 24,
    bottom: 10,
    color: "rgba(255,255,255,0.28)",
    fontSize: 6,
    letterSpacing: 1,
  },

  /* BACK */

  backTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backTitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },

  visaSmall: {
    color: "#fff",
    fontSize: 24,
    fontStyle: "italic",
    fontWeight: "900",
  },

  magneticStripe: {
    height: 42,
    backgroundColor: "#050b19",
    position: "absolute",
    left: 0,
    right: 0,
    top: 58,
  },

  signatureSection: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 52,
  },

  signatureBox: {
    height: 36,
    flex: 1,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginRight: 8,
  },

  signatureText: {
    color: "#111827",
    fontSize: 9,
    fontStyle: "italic",
  },

  cvvContainer: {
    width: 55,
  },

  cvvLabel: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 7,
    marginBottom: 3,
  },

  cvvBox: {
    height: 36,
    backgroundColor: "#fff",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
  },

  cvv: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "700",
  },

  backDescription: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 7,
    lineHeight: 10,
    marginTop: 14,
    maxWidth: "85%",
  },

  backBottom: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  backNumber: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 9,
    letterSpacing: 2,
  },

  visaBack: {
    color: "#fff",
    fontSize: 18,
    fontStyle: "italic",
    fontWeight: "900",
  },

  tapHintBack: {
    position: "absolute",
    right: 24,
    bottom: 7,
    color: "rgba(255,255,255,0.25)",
    fontSize: 6,
    letterSpacing: 1,
  },
});
