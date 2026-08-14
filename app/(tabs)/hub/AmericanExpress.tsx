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

type AmericanExpressProps = {
  cardNumber?: string;
  cardHolder?: string;
  expiry?: string;
  cvv?: string;
};

export default function AmericanExpress({
  cardNumber = '3782 822463 10005',
  cardHolder = 'JOHN DOE',
  expiry = '12/28',
  cvv = '1234',
}: AmericanExpressProps) {
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width - 32, 390);
  const cardHeight = cardWidth * 0.63;

  const [flipped, setFlipped] = useState(false);

  const animation = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const nextValue = flipped ? 0 : 1;

    setFlipped(!flipped);

    Animated.timing(animation, {
      toValue: nextValue,
      duration: 650,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const frontRotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = animation.interpolate({
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
        {/* Matte background decorations */}

        <View style={styles.topGlow} />
        <View style={styles.bottomGlow} />

        <View style={styles.gridLineOne} />
        <View style={styles.gridLineTwo} />
        <View style={styles.gridLineThree} />

        {/* Top header */}

        <View style={styles.topRow}>
          <View>
            <Text style={styles.memberSince}>MEMBER SINCE</Text>
            <Text style={styles.year}>24</Text>
          </View>

          <View style={styles.contactless}>
            <View style={styles.arcOne} />
            <View style={styles.arcTwo} />
            <View style={styles.arcThree} />
          </View>
        </View>

        {/* AMEX logo */}

        <View style={styles.amexLogo}>
          <Text style={styles.amexSmall}>AMERICAN</Text>
          <Text style={styles.amexMain}>EXPRESS</Text>
        </View>

        {/* Chip */}

        <View style={styles.chip}>
          <View style={styles.chipHorizontal} />
          <View style={styles.chipVertical} />
          <View style={styles.chipSmallVertical} />
          <View style={styles.chipInner} />
        </View>

        {/* Card number */}

        <Text
          style={[
            styles.cardNumber,
            {
              fontSize: cardWidth < 350 ? 16 : 19,
            },
          ]}
        >
          {cardNumber}
        </Text>

        {/* Bottom */}

        <View style={styles.bottomRow}>
          <View style={styles.holder}>
            <Text style={styles.label}>CARD MEMBER</Text>

            <Text style={styles.value} numberOfLines={1}>
              {cardHolder.toUpperCase()}
            </Text>
          </View>

          <View style={styles.expiry}>
            <Text style={styles.label}>GOOD THRU</Text>

            <Text style={styles.value}>{expiry}</Text>
          </View>
        </View>

        <Text style={styles.tapText}>TAP TO VIEW CARD</Text>
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
        {/* Back logo */}

        <View style={styles.backLogo}>
          <Text style={styles.backLogoSmall}>AMERICAN</Text>
          <Text style={styles.backLogoMain}>EXPRESS</Text>
        </View>

        {/* Stripe */}

        <View style={styles.blackStripe} />

        {/* Signature */}

        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>
              {cardHolder.toUpperCase()}
            </Text>
          </View>

          <View style={styles.cvvContainer}>
            <Text style={styles.cvvLabel}>SECURITY CODE</Text>

            <View style={styles.cvvBox}>
              <Text style={styles.cvv}>{cvv}</Text>
            </View>
          </View>
        </View>

        {/* Back information */}

        <Text style={styles.backInfo}>
          Use of this card is subject to the Card Member Agreement. If found,
          please return to the issuing institution.
        </Text>

        {/* Bottom */}

        <View style={styles.backBottom}>
          <View>
            <Text style={styles.backLabel}>CARD MEMBER</Text>
            <Text style={styles.backName}>
              {cardHolder.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.amexBack}>AMEX</Text>
        </View>

        <Text style={styles.flipBack}>TAP TO FLIP BACK</Text>
      </Animated.View>

      {/* Touch layer */}

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

  /* =====================================================
     CARD
  ===================================================== */

  card: {
    position: 'absolute',

    left: 0,
    top: 0,

    padding: 24,

    borderRadius: 22,

    overflow: 'hidden',

    backgroundColor: '#080808',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.14)',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 16,
    },

    shadowOpacity: 0.45,

    shadowRadius: 22,

    elevation: 14,

    backfaceVisibility: 'hidden',
  },

  backCard: {
    backgroundColor: '#0b0b0b',
  },

  /* =====================================================
     BLACK THEME DECORATION
  ===================================================== */

  topGlow: {
    position: 'absolute',

    width: 280,
    height: 280,

    borderRadius: 140,

    right: -170,
    top: -160,

    backgroundColor: '#242424',

    opacity: 0.65,
  },

  bottomGlow: {
    position: 'absolute',

    width: 220,
    height: 220,

    borderRadius: 110,

    left: -150,
    bottom: -160,

    backgroundColor: '#181818',
  },

  gridLineOne: {
    position: 'absolute',

    width: 500,
    height: 1,

    backgroundColor: 'rgba(255,255,255,0.04)',

    transform: [{ rotate: '-32deg' }],

    left: -90,
    top: 80,
  },

  gridLineTwo: {
    position: 'absolute',

    width: 500,
    height: 1,

    backgroundColor: 'rgba(255,255,255,0.035)',

    transform: [{ rotate: '-32deg' }],

    left: -90,
    top: 95,
  },

  gridLineThree: {
    position: 'absolute',

    width: 500,
    height: 1,

    backgroundColor: 'rgba(255,255,255,0.025)',

    transform: [{ rotate: '-32deg' }],

    left: -90,
    top: 110,
  },

  /* =====================================================
     TOP
  ===================================================== */

  topRow: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',
  },

  memberSince: {
    color: 'rgba(255,255,255,0.35)',

    fontSize: 6,

    letterSpacing: 1.2,
  },

  year: {
    color: '#d7d7d7',

    fontSize: 14,

    fontWeight: '700',

    marginTop: 2,
  },

  /* =====================================================
     CONTACTLESS
  ===================================================== */

  contactless: {
    width: 27,
    height: 27,

    justifyContent: 'center',

    alignItems: 'center',

    transform: [{ rotate: '-45deg' }],
  },

  arcOne: {
    position: 'absolute',

    width: 8,
    height: 8,

    borderTopWidth: 1.5,
    borderRightWidth: 1.5,

    borderColor: 'rgba(255,255,255,0.8)',

    borderRadius: 10,
  },

  arcTwo: {
    position: 'absolute',

    width: 15,
    height: 15,

    borderTopWidth: 1.5,
    borderRightWidth: 1.5,

    borderColor: 'rgba(255,255,255,0.5)',

    borderRadius: 12,
  },

  arcThree: {
    position: 'absolute',

    width: 22,
    height: 22,

    borderTopWidth: 1.5,
    borderRightWidth: 1.5,

    borderColor: 'rgba(255,255,255,0.25)',

    borderRadius: 15,
  },

  /* =====================================================
     AMEX LOGO
  ===================================================== */

  amexLogo: {
    position: 'absolute',

    right: 24,
    top: 27,

    alignItems: 'flex-end',
  },

  amexSmall: {
    color: 'rgba(255,255,255,0.55)',

    fontSize: 7,

    fontWeight: '700',

    letterSpacing: 2,
  },

  amexMain: {
    color: '#fff',

    fontSize: 15,

    fontWeight: '900',

    letterSpacing: 1,
  },

  /* =====================================================
     CHIP
  ===================================================== */

  chip: {
    width: 48,
    height: 36,

    marginTop: 21,

    borderRadius: 7,

    backgroundColor: '#b9b9b9',

    overflow: 'hidden',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.35)',
  },

  chipHorizontal: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 17,

    height: 1,

    backgroundColor: '#777',
  },

  chipVertical: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    left: 23,

    width: 1,

    backgroundColor: '#777',
  },

  chipSmallVertical: {
    position: 'absolute',

    top: 0,
    bottom: 0,

    left: 11,

    width: 1,

    backgroundColor: '#777',
  },

  chipInner: {
    position: 'absolute',

    width: 18,
    height: 12,

    borderWidth: 1,

    borderColor: '#777',

    borderRadius: 4,

    left: 14,
    top: 11,
  },

  /* =====================================================
     NUMBER
  ===================================================== */

  cardNumber: {
    color: '#f2f2f2',

    fontWeight: '500',

    letterSpacing: 2,

    marginTop: 18,
  },

  /* =====================================================
     BOTTOM
  ===================================================== */

  bottomRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    marginTop: 14,
  },

  holder: {
    flex: 1,

    paddingRight: 12,
  },

  expiry: {
    width: 65,
  },

  label: {
    color: 'rgba(255,255,255,0.32)',

    fontSize: 6,

    letterSpacing: 1.1,

    marginBottom: 3,
  },

  value: {
    color: '#f5f5f5',

    fontSize: 11,

    fontWeight: '600',

    letterSpacing: 0.8,
  },

  tapText: {
    position: 'absolute',

    right: 24,
    bottom: 9,

    color: 'rgba(255,255,255,0.22)',

    fontSize: 6,

    letterSpacing: 1,
  },

  /* =====================================================
     BACK
  ===================================================== */

  backLogo: {
    alignItems: 'flex-end',

    marginBottom: 8,
  },

  backLogoSmall: {
    color: 'rgba(255,255,255,0.45)',

    fontSize: 6,

    fontWeight: '700',

    letterSpacing: 1.8,
  },

  backLogoMain: {
    color: '#fff',

    fontSize: 14,

    fontWeight: '900',

    letterSpacing: 1,
  },

  blackStripe: {
    position: 'absolute',

    left: 0,
    right: 0,

    top: 63,

    height: 42,

    backgroundColor: '#000',
  },

  /* =====================================================
     CVV
  ===================================================== */

  signatureRow: {
    flexDirection: 'row',

    alignItems: 'flex-end',

    marginTop: 53,
  },

  signatureBox: {
    flex: 1,

    height: 36,

    marginRight: 8,

    paddingHorizontal: 10,

    justifyContent: 'center',

    backgroundColor: '#dedede',
  },

  signatureText: {
    color: '#161616',

    fontSize: 9,

    fontStyle: 'italic',
  },

  cvvContainer: {
    width: 72,
  },

  cvvLabel: {
    color: 'rgba(255,255,255,0.35)',

    fontSize: 6,

    marginBottom: 3,

    letterSpacing: 0.6,
  },

  cvvBox: {
    height: 36,

    backgroundColor: '#fff',

    borderRadius: 3,

    justifyContent: 'center',

    alignItems: 'center',
  },

  cvv: {
    color: '#111',

    fontSize: 13,

    fontWeight: '800',

    letterSpacing: 1,
  },

  /* =====================================================
     BACK INFO
  ===================================================== */

  backInfo: {
    color: 'rgba(255,255,255,0.3)',

    fontSize: 7,

    lineHeight: 10,

    marginTop: 14,

    maxWidth: '87%',
  },

  /* =====================================================
     BACK BOTTOM
  ===================================================== */

  backBottom: {
    position: 'absolute',

    left: 24,
    right: 24,

    bottom: 20,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-end',
  },

  backLabel: {
    color: 'rgba(255,255,255,0.28)',

    fontSize: 6,

    letterSpacing: 1,
  },

  backName: {
    color: '#ddd',

    fontSize: 10,

    fontWeight: '600',

    marginTop: 2,
  },

  amexBack: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '900',

    letterSpacing: 1,
  },

  flipBack: {
    position: 'absolute',

    right: 24,
    bottom: 7,

    color: 'rgba(255,255,255,0.2)',

    fontSize: 6,

    letterSpacing: 1,
  },
});