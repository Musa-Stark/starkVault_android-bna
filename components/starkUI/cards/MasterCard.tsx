import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type MastercardProps = {
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
};

export default function Mastercard({
  cardNumber = '5555 5555 5555 4444',
  cardHolder = 'JOHN DOE',
  expiry = '12/28',
  cvv = '123',
}: MastercardProps) {
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width - 32, 390);
  const cardHeight = cardWidth * 0.63;

  const [flipped, setFlipped] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const next = flipped ? 0 : 1;

    setFlipped(!flipped);

    Animated.timing(rotation, {
      toValue: next,
      duration: 650,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const frontRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
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
            transform: [
              { perspective: 1200 },
              { rotateY: frontRotation },
            ],
          },
        ]}
      >
        {/* Decorative orange circle */}
        <View style={styles.largeCircle} />

        {/* Decorative rings */}
        <View style={styles.ringOne} />
        <View style={styles.ringTwo} />

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>NOVA</Text>
            <Text style={styles.cardType}>WORLD ELITE</Text>
          </View>

          <View style={styles.contactless}>
            <View style={styles.arc1} />
            <View style={styles.arc2} />
            <View style={styles.arc3} />
          </View>
        </View>

        {/* Chip */}
        <View style={styles.chip}>
          <View style={styles.chipLineHorizontal} />
          <View style={styles.chipLineVertical} />
          <View style={styles.chipLineSmall} />
        </View>

        {/* Mastercard logo */}
        <View style={styles.mastercard}>
          <View style={styles.mcRed} />
          <View style={styles.mcOrange} />

          <Text style={styles.mcText}>mastercard</Text>
        </View>

        {/* Card number */}
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{cardNumber}</Text>
        </View>

        {/* Bottom */}
        <View style={styles.bottom}>
          <View>
            <Text style={styles.smallLabel}>CARD HOLDER</Text>
            <Text style={styles.name}>{cardHolder.toUpperCase()}</Text>
          </View>

          <View>
            <Text style={styles.smallLabel}>VALID THRU</Text>
            <Text style={styles.name}>{expiry}</Text>
          </View>
        </View>

        <Text style={styles.flipText}>TAP TO VIEW CVV</Text>
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
            transform: [
              { perspective: 1200 },
              { rotateY: backRotation },
            ],
          },
        ]}
      >
        {/* Back header */}
        <View style={styles.backHeader}>
          <Text style={styles.backBrand}>NOVA</Text>

          <Text style={styles.backCardType}>WORLD ELITE</Text>
        </View>

        {/* Magnetic stripe */}
        <View style={styles.stripe} />

        {/* Signature */}
        <View style={styles.signatureRow}>
          <View style={styles.signature}>
            <Text style={styles.signatureName}>
              {cardHolder.toUpperCase()}
            </Text>
          </View>

          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>CVV</Text>

            <View style={styles.cvvBox}>
              <Text style={styles.cvv}>{cvv}</Text>
            </View>
          </View>
        </View>

        {/* Info */}
        <Text style={styles.info}>
          This card is issued by NOVA. Use of this card is subject to the
          terms and conditions of the issuing institution.
        </Text>

        {/* Bottom logo */}
        <View style={styles.backBottom}>
          <Text style={styles.lastFour}>
            •••• {cardNumber.slice(-4)}
          </Text>

          <View style={styles.smallLogo}>
            <View style={styles.smallRed} />
            <View style={styles.smallOrange} />
          </View>
        </View>

        <Text style={styles.flipBack}>TAP TO FLIP BACK</Text>
      </Animated.View>

      {/* =====================================================
          TOUCH LAYER
      ===================================================== */}

      <Pressable
        onPress={flipCard}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },

  card: {
    position: 'absolute',

    left: 0,
    top: 0,

    padding: 24,

    borderRadius: 24,

    overflow: 'hidden',

    backgroundColor: '#21140c',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowOpacity: 0.35,
    shadowRadius: 20,

    elevation: 12,

    backfaceVisibility: 'hidden',
  },

  backCard: {
    backgroundColor: '#160d08',
  },

  /* =========================
     FRONT DECORATION
  ========================== */

  largeCircle: {
    position: 'absolute',

    width: 260,
    height: 260,

    borderRadius: 130,

    right: -145,
    top: -115,

    backgroundColor: '#d65318',

    opacity: 0.2,
  },

  ringOne: {
    position: 'absolute',

    width: 210,
    height: 210,

    borderRadius: 105,

    right: -105,
    top: -80,

    borderWidth: 1,

    borderColor: 'rgba(255,170,90,0.18)',
  },

  ringTwo: {
    position: 'absolute',

    width: 170,
    height: 170,

    borderRadius: 85,

    right: -85,
    top: -60,

    borderWidth: 1,

    borderColor: 'rgba(255,170,90,0.12)',
  },

  /* =========================
     HEADER
  ========================== */

  header: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',
  },

  brand: {
    color: '#fff',

    fontSize: 15,

    fontWeight: '900',

    letterSpacing: 2,
  },

  cardType: {
    color: 'rgba(255,190,130,0.45)',

    fontSize: 7,

    fontWeight: '700',

    letterSpacing: 1.5,

    marginTop: 2,
  },

  /* =========================
     CONTACTLESS
  ========================== */

  contactless: {
    width: 28,
    height: 28,

    transform: [{ rotate: '-45deg' }],

    justifyContent: 'center',

    alignItems: 'center',
  },

  arc1: {
    position: 'absolute',

    width: 8,
    height: 8,

    borderTopWidth: 2,
    borderRightWidth: 2,

    borderColor: '#ffb36b',

    borderRadius: 8,
  },

  arc2: {
    position: 'absolute',

    width: 15,
    height: 15,

    borderTopWidth: 2,
    borderRightWidth: 2,

    borderColor: 'rgba(255,179,107,0.65)',

    borderRadius: 12,
  },

  arc3: {
    position: 'absolute',

    width: 22,
    height: 22,

    borderTopWidth: 2,
    borderRightWidth: 2,

    borderColor: 'rgba(255,179,107,0.35)',

    borderRadius: 15,
  },

  /* =========================
     CHIP
  ========================== */

  chip: {
    width: 47,
    height: 35,

    borderRadius: 7,

    backgroundColor: '#c89550',

    marginTop: 17,

    overflow: 'hidden',

    borderWidth: 1,

    borderColor: 'rgba(255,220,170,0.3)',
  },

  chipLineHorizontal: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 17,

    height: 1,

    backgroundColor: '#88652f',
  },

  chipLineVertical: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    left: 23,

    width: 1,

    backgroundColor: '#88652f',
  },

  chipLineSmall: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    left: 11,

    width: 1,

    backgroundColor: '#88652f',
  },

  /* =========================
     MASTERCARD LOGO
  ========================== */

  mastercard: {
    position: 'absolute',

    right: 24,
    top: 87,

    width: 70,
    height: 42,
  },

  mcRed: {
    position: 'absolute',

    width: 32,
    height: 32,

    borderRadius: 16,

    left: 7,

    backgroundColor: '#e53922',
  },

  mcOrange: {
    position: 'absolute',

    width: 32,
    height: 32,

    borderRadius: 16,

    right: 7,

    backgroundColor: '#ff9d28',
  },

  mcText: {
    position: 'absolute',

    bottom: 0,

    width: '100%',

    textAlign: 'center',

    color: '#fff',

    fontSize: 7,

    fontWeight: '700',
  },

  /* =========================
     NUMBER
  ========================== */

  numberContainer: {
    marginTop: 19,
  },

  number: {
    color: '#fff',

    fontSize: 20,

    fontWeight: '500',

    letterSpacing: 2,
  },

  /* =========================
     BOTTOM
  ========================== */

  bottom: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-end',

    marginTop: 14,
  },

  smallLabel: {
    color: 'rgba(255,190,130,0.4)',

    fontSize: 7,

    letterSpacing: 1,

    marginBottom: 3,
  },

  name: {
    color: '#fff',

    fontSize: 12,

    fontWeight: '600',

    letterSpacing: 0.8,
  },

  flipText: {
    position: 'absolute',

    right: 24,
    bottom: 9,

    color: 'rgba(255,190,130,0.28)',

    fontSize: 6,

    letterSpacing: 1,
  },

  /* =========================
     BACK
  ========================== */

  backHeader: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  backBrand: {
    color: '#fff',

    fontSize: 14,

    fontWeight: '900',

    letterSpacing: 2,
  },

  backCardType: {
    color: 'rgba(255,190,130,0.45)',

    fontSize: 7,

    letterSpacing: 1,
  },

  stripe: {
    position: 'absolute',

    top: 58,

    left: 0,
    right: 0,

    height: 43,

    backgroundColor: '#070504',
  },

  /* =========================
     CVV
  ========================== */

  signatureRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    marginTop: 52,
  },

  signature: {
    flex: 1,

    height: 36,

    marginRight: 8,

    paddingHorizontal: 10,

    justifyContent: 'center',

    backgroundColor: '#e9e5e1',
  },

  signatureName: {
    color: '#27211d',

    fontSize: 9,

    fontStyle: 'italic',
  },

  cvvContainer: {
    width: 55,
  },

  cvvLabel: {
    color: 'rgba(255,190,130,0.4)',

    fontSize: 7,

    marginBottom: 3,
  },

  cvvBox: {
    height: 36,

    backgroundColor: '#fff',

    borderRadius: 4,

    justifyContent: 'center',

    alignItems: 'center',
  },

  cvv: {
    color: '#20150e',

    fontSize: 13,

    fontWeight: '800',
  },

  /* =========================
     INFO
  ========================== */

  info: {
    color: 'rgba(255,190,130,0.38)',

    fontSize: 7,

    lineHeight: 10,

    marginTop: 14,

    maxWidth: '86%',
  },

  /* =========================
     BACK BOTTOM
  ========================== */

  backBottom: {
    position: 'absolute',

    left: 24,
    right: 24,

    bottom: 20,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',
  },

  lastFour: {
    color: 'rgba(255,190,130,0.5)',

    fontSize: 9,

    letterSpacing: 2,
  },

  smallLogo: {
    width: 36,
    height: 18,

    position: 'relative',
  },

  smallRed: {
    position: 'absolute',

    width: 18,
    height: 18,

    borderRadius: 9,

    left: 3,

    backgroundColor: '#e53922',
  },

  smallOrange: {
    position: 'absolute',

    width: 18,
    height: 18,

    borderRadius: 9,

    right: 3,

    backgroundColor: '#ff9d28',
  },

  flipBack: {
    position: 'absolute',

    right: 24,
    bottom: 7,

    color: 'rgba(255,190,130,0.25)',

    fontSize: 6,

    letterSpacing: 1,
  },
});