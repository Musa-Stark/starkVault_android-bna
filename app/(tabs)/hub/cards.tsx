import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Plus } from "lucide-react-native";

import globalStyles from "@/starkwind/globalStyle";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import { useApp } from "@/providers/app-context";
import { useToast } from "@/providers/toast-provider";

import handleCardForm from "@/components/starkUI/upload/cards.form";
import useAPICall from "@/utils/apiCall";

import AmericanExpress from "@/components/starkUI/cards/AmericanExpress";
import Mastercard from "@/components/starkUI/cards/MasterCard";
import CNIC from "@/components/starkUI/cards/CNIC";
import SadapayCard from "@/components/starkUI/cards/Sadapay";
import VisaCard from "@/components/starkUI/cards/VisaCard";
import SadapayCardSkeleton from "@/components/starkUI/skeleton/CardSkeleton";

/**
 * Animated Gemini-style background
 *
 * This wrapper can be used for ANY card brand.
 * The animation itself does not care whether the
 * card is Visa, Mastercard, Amex, SadaPay, etc.
 */
const AnimatedPrimaryCard = ({ children }: { children: React.ReactNode }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),

        Animated.timing(animation, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();

    return () => {
      loop.stop();
    };
  }, [animation]);

  /**
   * Blue / Purple
   */
  const blob1TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-25, 35],
  });

  const blob1TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [10, -25],
  });

  /**
   * Pink
   */
  const blob2TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [30, -30],
  });

  const blob2TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 30],
  });

  /**
   * Cyan
   */
  const blob3TranslateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 30],
  });

  const blob3TranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [25, -15],
  });

  return (
    <View
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 30,
        paddingVertical: 5,
        backgroundColor: "#EEF2FF",
      }}
    >
      {/* Blue / Purple blob */}
      <Animated.View
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: "#6366F1",
          opacity: 0.75,
          top: -80,
          left: -50,
          transform: [
            { translateX: blob1TranslateX },
            { translateY: blob1TranslateY },
          ],
        }}
      />

      {/* Pink blob */}
      <Animated.View
        style={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: 85,
          backgroundColor: "#EC4899",
          opacity: 0.7,
          top: -50,
          right: -55,
          transform: [
            { translateX: blob2TranslateX },
            { translateY: blob2TranslateY },
          ],
        }}
      />

      {/* Cyan blob */}
      <Animated.View
        style={{
          position: "absolute",
          width: 190,
          height: 190,
          borderRadius: 95,
          backgroundColor: "#06B6D4",
          opacity: 0.65,
          bottom: -100,
          left: 80,
          transform: [
            { translateX: blob3TranslateX },
            { translateY: blob3TranslateY },
          ],
        }}
      />

      {/* Purple glow */}
      <Animated.View
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          borderRadius: 70,
          backgroundColor: "#A855F7",
          opacity: 0.45,
          bottom: -70,
          right: -30,
          transform: [
            { translateX: blob2TranslateX },
            { translateY: blob1TranslateY },
          ],
        }}
      />

      {/* Actual card */}
      <View
        style={{
          position: "relative",
          zIndex: 10,
        }}
      >
        {children}
      </View>
    </View>
  );
};

const Cards = () => {
  const {
    label,
    setLabel,
    labelRef,

    brand,
    setBrand,
    brandRef,

    cardNumber,
    setCardNumber,
    cardNumberRef,

    cardHolder,
    setCardHolder,
    cardHolderRef,

    expiryDate,
    setExpiryDate,
    expiryDateRef,

    cvv,
    setCvv,
    cvvRef,

    bank,
    setBank,
    bankRef,

    primaryCard,
    setPrimaryCard,
    primaryCardRef,

    uploadForm,
    setUploadForm,
  } = useApp();

  const [hasPrimary, setHasPrimary] = useState(false);

  const cardBrands = [
    { label: "Visa", value: "Visa" },
    { label: "Mastercard", value: "Mastercard" },
    { label: "American Express", value: "American Express" },
    { label: "SadaPay", value: "SadaPay" },
  ] as const;

  interface Card {
    _id: string;
    bank: string;
    brand: (typeof cardBrands)[number]["value"];
    cardHolder: string;
    cardNumber: string;
    cvv: string;
    expiryDate: Date;
    label: string;
    isPrimary?: boolean;
  }

  const [cards, setCards] = useState<Card[]>([]);

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  const apiCall = useAPICall();
  const { toast } = useToast();

  /**
   * Fetch cards
   */
  const fetchCards = useCallback(async () => {
    setItemState("fetching");

    try {
      const response = await apiCall({
        page: "cards",
        method: "GET",
      });

      if (!response.success) {
        if (response.message === "Data not found") {
          setCards([]);
          setHasPrimary(false);
          setItemState("notFound");
          return;
        }

        toast.error(response.message || "Failed to fetch cards");

        setCards([]);
        setHasPrimary(false);
        setItemState("notFound");
        return;
      }

      const fetchedCards = response.data ?? [];

      /**
       * Check whether ANY card is primary.
       */
      setHasPrimary(fetchedCards.some((card: Card) => card.isPrimary === true));

      setCards(fetchedCards);

      setItemState(fetchedCards.length > 0 ? "found" : "notFound");
    } catch (error) {
      toast.error("Failed to fetch cards");

      setCards([]);
      setHasPrimary(false);
      setItemState("notFound");
    }
  }, [apiCall, toast]);

  /**
   * Initial fetch
   */
  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  /**
   * Upload card
   */
  useEffect(() => {
    const uploadCard = async () => {
      if (!uploadForm.submit) return;

      try {
        if (uploadForm.page === "cards") {
          const response = await apiCall({
            page: "cards",

            data: {
              label,
              brand,
              cardNumber,
              cardHolder,
              expiryDate,
              cvv,
              bank,
              isPrimary: primaryCard,
            },

            method: "POST",
          });

          if (!response.success) {
            toast.error(response.message || "Something went wrong");
            return;
          }

          /**
           * Reset upload form
           */
          setUploadForm({
            inputs: undefined,
            name: "",
            show: false,
            submit: false,
            page: undefined,
          });

          setLabel("");
          setBrand("");
          setCardNumber("");
          setCardHolder("");
          setExpiryDate(undefined);
          setCvv("");
          setBank("");
        }

        /**
         * Refetch cards
         */
        await fetchCards();
      } catch (error) {
        toast.error("Failed to add card");
      }
    };

    uploadCard();
  }, [uploadForm.submit]);

  /**
   * Render the actual card based on brand.
   *
   * This function ONLY creates the card.
   * The primary animation is applied later,
   * regardless of the card brand.
   */
  const getCardComponent = (card: Card) => {
    switch (card.brand) {
      case "American Express":
        return (
          <View style={{ paddingVertical: 1 }}>
            <AmericanExpress
              cardHolder={card.cardHolder}
              cardNumber={card.cardNumber}
              cvv={card.cvv}
              expiry={card.expiryDate}
              style={{ width: 360 }}
            />
          </View>
        );

      case "Visa":
        return (
          <View style={{ paddingVertical: 1 }}>
            <VisaCard
              cardHolder={card.cardHolder}
              cardNumber={card.cardNumber}
              cvv={card.cvv}
              expiry={card.expiryDate}
              style={{ width: 360 }}
            />
          </View>
        );

      case "Mastercard":
        return (
          <View style={{ paddingVertical: 1 }}>
            <Mastercard
              cardHolder={card.cardHolder}
              cardNumber={card.cardNumber}
              cvv={card.cvv}
              expiry={card.expiryDate}
              style={{
                width: 360,
              }}
            />
          </View>
        );

      case "SadaPay":
        return (
          <View style={{ paddingVertical: 1 }}>
            <SadapayCard
              cardHolder={card.cardHolder}
              cardNumber={card.cardNumber}
              cvv={card.cvv}
              expiry={card.expiryDate}
              style={{ width: 360 }}
            />
          </View>
        );

      default:
        return null;
    }
  };

  /**
   * Render card.
   *
   * IMPORTANT:
   * If card.isPrimary is true, the animation
   * is applied to ANY card brand.
   */
  const getCard = (card: Card) => {
    const cardComponent = getCardComponent(card);

    if (!cardComponent) {
      return null;
    }

    if (card.isPrimary === true) {
      return (
        <AnimatedPrimaryCard key={card._id}>
          {cardComponent}
        </AnimatedPrimaryCard>
      );
    }

    return (
      <View
        key={card._id}
        style={{
          paddingVertical: 5,
          borderRadius: 30,
        }}
      >
        {cardComponent}
      </View>
    );
  };

  /**
   * Open add card form
   */
  const handleAddCard = () => {
    handleCardForm({
      label,
      setLabel,
      labelRef,

      brand,
      setBrand,
      brandRef,

      cardNumber,
      setCardNumber,
      cardNumberRef,

      cardHolder,
      setCardHolder,
      cardHolderRef,

      expiryDate,
      setExpiryDate,
      expiryDateRef,

      cvv,
      setCvv,
      cvvRef,

      bank,
      setBank,
      bankRef,

      primaryCard,
      setPrimaryCard,
      primaryCardRef,

      setUploadForm,

      disablePrimary: hasPrimary,
      page: "cards",
    });
  };

  return (
    <View
      style={{
        ...globalStyles.globalPaddingContainer,
      }}
    >
      <Text
        variant="heading"
        style={{
          marginBottom: 20,
        }}
      >
        Cards
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <Text variant="caption">
          {cards.length} {cards.length === 1 ? "card" : "cards"} in vault
        </Text>

        <Button
          icon={Plus}
          style={{
            marginVertical: 20,
          }}
          onPress={handleAddCard}
        >
          Add Card
        </Button>

        <View
          style={{
            gap: 10,
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          {itemState === "fetching" && <SadapayCardSkeleton />}

          {itemState === "notFound" && (
            <Text
              variant="caption"
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >
              No cards added yet.
            </Text>
          )}

          {itemState === "found" && cards.map(getCard)}
        </View>
      </ScrollView>
    </View>
  );
};

export default Cards;
