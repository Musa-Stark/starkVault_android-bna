// PakistaniCnicCard.tsx

import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

type PakistaniCnicCardProps = {
  name?: string;
  fatherName?: string;
  cnicNumber?: string;
  dateOfBirth?: string;
  dateOfIssue?: string;
  dateOfExpiry?: string;
  address?: string;
  photoUri?: string;
};

export default function CNIC({
  name = 'MUHAMMAD AHMED',
  fatherName = 'MUHAMMAD ALI',
  cnicNumber = '35202-1234567-1',
  dateOfBirth = '01 JAN 1995',
  dateOfIssue = '01 JAN 2024',
  dateOfExpiry = '01 JAN 2034',
  address = '123 DEMO STREET, LAHORE',
  photoUri,
}: PakistaniCnicCardProps) {
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width - 32, 400);
  const cardHeight = cardWidth * 0.63;

  const [flipped, setFlipped] = useState(false);

  const rotate = useRef(new Animated.Value(0)).current;

  const flipCard = () => {
    const value = flipped ? 0 : 1;

    setFlipped(!flipped);

    Animated.timing(rotate, {
      toValue: value,
      duration: 650,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const frontRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
        alignSelf: 'center',
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
            transform: [
              { perspective: 1400 },
              { rotateY: frontRotate },
            ],
          },
        ]}
      >
        {/* Background decoration */}

        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.circleLarge} />
        <View style={styles.circleSmall} />

        {/* Header */}

        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <View style={styles.flag}>
              <View style={styles.flagWhite} />
              <View style={styles.flagGreen} />
            </View>

            <View>
              <Text style={styles.country}>PAKISTAN</Text>
              <Text style={styles.documentTitle}>
                IDENTITY CARD
              </Text>
            </View>
          </View>

          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>DEMO</Text>
          </View>
        </View>

        {/* Main */}

        <View style={styles.main}>
          {/* Photo */}

          <View style={styles.photoWrapper}>
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.personIcon}>👤</Text>
              </View>
            )}

            <Text style={styles.photoCaption}>
              PHOTO
            </Text>
          </View>

          {/* Details */}

          <View style={styles.details}>
            <ModernField
              label="FULL NAME"
              value={name}
            />

            <ModernField
              label="FATHER NAME"
              value={fatherName}
            />

            <View style={styles.twoColumns}>
              <View style={styles.column}>
                <ModernField
                  label="DATE OF BIRTH"
                  value={dateOfBirth}
                />
              </View>

              <View style={styles.column}>
                <ModernField
                  label="CNIC NUMBER"
                  value={cnicNumber}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Number */}

        <View style={styles.numberContainer}>
          <View>
            <Text style={styles.numberLabel}>
              IDENTIFICATION NUMBER
            </Text>

            <Text style={styles.number}>
              {cnicNumber}
            </Text>
          </View>

          <View style={styles.statusDot} />
        </View>

        {/* Bottom */}

        <View style={styles.bottom}>
          <Text style={styles.demoDocument}>
            DEMONSTRATION CARD
          </Text>

          <Text style={styles.flipHint}>
            TAP TO FLIP
          </Text>
        </View>

        {/* Watermark */}

        <Text style={styles.watermark}>
          NOT VALID
        </Text>
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
              { perspective: 1400 },
              { rotateY: backRotate },
            ],
          },
        ]}
      >
        {/* Header */}

        <View style={styles.backHeader}>
          <View>
            <Text style={styles.backTitle}>
              CARD INFORMATION
            </Text>

            <Text style={styles.backSubtitle}>
              DEMONSTRATION RECORD
            </Text>
          </View>

          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>
              DEMO
            </Text>
          </View>
        </View>

        {/* Address */}

        <View style={styles.addressCard}>
          <Text style={styles.backLabel}>
            ADDRESS
          </Text>

          <Text style={styles.addressText}>
            {address}
          </Text>
        </View>

        {/* Dates */}

        <View style={styles.dateCards}>
          <InfoBox
            label="DATE OF ISSUE"
            value={dateOfIssue}
          />

          <InfoBox
            label="DATE OF EXPIRY"
            value={dateOfExpiry}
          />
        </View>

        {/* Identity */}

        <View style={styles.identityBox}>
          <View style={styles.identityIcon}>
            <Text style={styles.identityIconText}>
              ID
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.backLabel}>
              CARD HOLDER
            </Text>

            <Text style={styles.identityName}>
              {name}
            </Text>
          </View>
        </View>

        {/* Notice */}

        <View style={styles.notice}>
          <View style={styles.noticeIcon}>
            <Text style={styles.noticeIconText}>
              i
            </Text>
          </View>

          <Text style={styles.noticeText}>
            This fictional card is for application UI
            demonstrations only and is not a government
            document.
          </Text>
        </View>

        {/* Bottom */}

        <View style={styles.backBottom}>
          <Text style={styles.notValid}>
            DEMO • NOT VALID
          </Text>

          <Text style={styles.flipHint}>
            TAP TO FLIP BACK
          </Text>
        </View>
      </Animated.View>

      {/* Touch */}

      <Pressable
        onPress={flipCard}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/* =========================================================
   FIELD
========================================================= */

function ModernField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>
        {label}
      </Text>

      <Text
        style={styles.fieldValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.backLabel}>
        {label}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>
    </View>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  card: {
    position: 'absolute',

    top: 0,
    left: 0,

    padding: 20,

    borderRadius: 22,

    overflow: 'hidden',

    backgroundColor: '#071d17',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.13)',

    backfaceVisibility: 'hidden',
  },

  backCard: {
    backgroundColor: '#061812',
  },

  /* =====================================================
     DECORATION
  ===================================================== */

  glowTop: {
    position: 'absolute',

    width: 260,
    height: 260,

    borderRadius: 130,

    right: -150,
    top: -150,

    backgroundColor: '#1f8f68',

    opacity: 0.25,
  },

  glowBottom: {
    position: 'absolute',

    width: 230,
    height: 230,

    borderRadius: 115,

    left: -160,
    bottom: -170,

    backgroundColor: '#3aa77d',

    opacity: 0.08,
  },

  circleLarge: {
    position: 'absolute',

    width: 210,
    height: 210,

    borderRadius: 105,

    right: -120,
    top: -100,

    borderWidth: 1,

    borderColor: 'rgba(151,235,201,0.08)',
  },

  circleSmall: {
    position: 'absolute',

    width: 150,
    height: 150,

    borderRadius: 75,

    right: -80,
    top: -70,

    borderWidth: 1,

    borderColor: 'rgba(151,235,201,0.06)',
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  brandContainer: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  flag: {
    width: 32,
    height: 21,

    flexDirection: 'row',

    borderRadius: 4,

    overflow: 'hidden',

    marginRight: 9,
  },

  flagWhite: {
    width: 8,

    backgroundColor: '#f5f5f5',
  },

  flagGreen: {
    flex: 1,

    backgroundColor: '#087b4c',
  },

  country: {
    color: 'rgba(221,250,238,0.5)',

    fontSize: 6,

    fontWeight: '700',

    letterSpacing: 1.5,
  },

  documentTitle: {
    color: '#fff',

    fontSize: 13,

    fontWeight: '800',

    letterSpacing: 0.5,

    marginTop: 1,
  },

  demoBadge: {
    paddingHorizontal: 8,

    paddingVertical: 5,

    borderRadius: 7,

    backgroundColor: 'rgba(255,255,255,0.07)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.13)',
  },

  demoBadgeText: {
    color: '#9ee2c2',

    fontSize: 6,

    fontWeight: '900',

    letterSpacing: 1,
  },

  /* =====================================================
     MAIN
  ===================================================== */

  main: {
    flexDirection: 'row',

    marginTop: 15,
  },

  photoWrapper: {
    width: 76,

    marginRight: 13,
  },

  photo: {
    width: 76,
    height: 86,

    borderRadius: 9,

    backgroundColor: '#ddd',
  },

  photoPlaceholder: {
    width: 76,
    height: 86,

    borderRadius: 9,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: '#d8dedb',
  },

  personIcon: {
    fontSize: 28,
  },

  photoCaption: {
    color: 'rgba(220,250,235,0.3)',

    fontSize: 5,

    textAlign: 'center',

    letterSpacing: 1,

    marginTop: 4,
  },

  details: {
    flex: 1,

    justifyContent: 'center',
  },

  field: {
    marginBottom: 7,
  },

  fieldLabel: {
    color: 'rgba(172,230,205,0.42)',

    fontSize: 5.5,

    fontWeight: '600',

    letterSpacing: 1,

    marginBottom: 2,
  },

  fieldValue: {
    color: '#fff',

    fontSize: 10,

    fontWeight: '700',

    letterSpacing: 0.35,
  },

  twoColumns: {
    flexDirection: 'row',
  },

  column: {
    flex: 1,
  },

  /* =====================================================
     NUMBER
  ===================================================== */

  numberContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    marginTop: 4,

    paddingHorizontal: 11,

    paddingVertical: 7,

    borderRadius: 9,

    backgroundColor: 'rgba(0,0,0,0.2)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.06)',
  },

  numberLabel: {
    color: 'rgba(172,230,205,0.35)',

    fontSize: 5,

    letterSpacing: 1,
  },

  number: {
    color: '#fff',

    fontSize: 12,

    fontWeight: '800',

    letterSpacing: 1.1,

    marginTop: 1,
  },

  statusDot: {
    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: '#65d29e',

    opacity: 0.8,
  },

  /* =====================================================
     BOTTOM
  ===================================================== */

  bottom: {
    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginTop: 7,
  },

  demoDocument: {
    color: 'rgba(255,255,255,0.28)',

    fontSize: 5.5,

    fontWeight: '600',

    letterSpacing: 0.8,
  },

  flipHint: {
    color: 'rgba(160,229,199,0.28)',

    fontSize: 5.5,

    fontWeight: '600',

    letterSpacing: 0.8,
  },

  watermark: {
    position: 'absolute',

    right: 30,
    top: 105,

    color: 'rgba(255,255,255,0.035)',

    fontSize: 18,

    fontWeight: '900',

    transform: [{ rotate: '-18deg' }],
  },

  /* =====================================================
     BACK
  ===================================================== */

  backHeader: {
    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  backTitle: {
    color: '#fff',

    fontSize: 12,

    fontWeight: '800',

    letterSpacing: 0.4,
  },

  backSubtitle: {
    color: 'rgba(190,240,218,0.35)',

    fontSize: 6,

    letterSpacing: 1,

    marginTop: 2,
  },

  /* =====================================================
     ADDRESS
  ===================================================== */

  addressCard: {
    marginTop: 16,

    padding: 11,

    borderRadius: 10,

    backgroundColor: 'rgba(255,255,255,0.045)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.06)',
  },

  backLabel: {
    color: 'rgba(175,230,207,0.4)',

    fontSize: 5.5,

    fontWeight: '600',

    letterSpacing: 1,

    marginBottom: 4,
  },

  addressText: {
    color: '#fff',

    fontSize: 9.5,

    fontWeight: '600',

    lineHeight: 13,
  },

  /* =====================================================
     DATES
  ===================================================== */

  dateCards: {
    flexDirection: 'row',

    marginTop: 9,
  },

  infoBox: {
    flex: 1,

    padding: 10,

    borderRadius: 9,

    marginRight: 7,

    backgroundColor: 'rgba(255,255,255,0.045)',
  },

  infoValue: {
    color: '#fff',

    fontSize: 9,

    fontWeight: '700',
  },

  /* =====================================================
     IDENTITY
  ===================================================== */

  identityBox: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 9,

    padding: 9,

    borderRadius: 9,

    backgroundColor: 'rgba(31,143,104,0.12)',

    borderWidth: 1,

    borderColor: 'rgba(125,220,180,0.08)',
  },

  identityIcon: {
    width: 28,
    height: 28,

    borderRadius: 8,

    marginRight: 9,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: 'rgba(132,222,181,0.12)',
  },

  identityIconText: {
    color: '#9ce2c1',

    fontSize: 8,

    fontWeight: '900',
  },

  identityName: {
    color: '#fff',

    fontSize: 10,

    fontWeight: '700',
  },

  /* =====================================================
     NOTICE
  ===================================================== */

  notice: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 9,

    padding: 8,

    borderRadius: 8,

    backgroundColor: 'rgba(255,255,255,0.035)',
  },

  noticeIcon: {
    width: 19,
    height: 19,

    borderRadius: 10,

    justifyContent: 'center',

    alignItems: 'center',

    backgroundColor: 'rgba(160,225,198,0.1)',

    marginRight: 8,
  },

  noticeIconText: {
    color: '#9bdcbd',

    fontSize: 10,

    fontWeight: '800',
  },

  noticeText: {
    flex: 1,

    color: 'rgba(220,250,235,0.38)',

    fontSize: 6,

    lineHeight: 9,
  },

  /* =====================================================
     BACK BOTTOM
  ===================================================== */

  backBottom: {
    position: 'absolute',

    left: 20,
    right: 20,

    bottom: 10,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',
  },

  notValid: {
    color: 'rgba(255,255,255,0.28)',

    fontSize: 5.5,

    fontWeight: '800',

    letterSpacing: 0.7,
  },
});