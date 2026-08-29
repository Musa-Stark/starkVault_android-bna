import React, { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
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

    uploadForm,
    setUploadForm,
  } = useApp();

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
  }

  const [cards, setCards] = useState<Card[]>([]);

  const [itemState, setItemState] = useState<
    "found" | "notFound" | "fetching"
  >("fetching");

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
          setItemState("notFound");
          return;
        }

        toast.error(response.message || "Failed to fetch cards");
        setCards([]);
        setItemState("notFound");
        return;
      }

      const fetchedCards = response.data ?? [];

      setCards(fetchedCards);
      setItemState(fetchedCards.length > 0 ? "found" : "notFound");
    } catch (error) {
      toast.error("Failed to fetch cards");
      setCards([]);
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
        });

        setLabel("");
        setBrand("");
        setCardNumber("");
        setCardHolder("");
        setExpiryDate(undefined);
        setCvv("");
        setBank("");

        /**
         * Refetch cards so the newly added card appears
         */
        await fetchCards();

        toast.success("Card added successfully");
      } catch (error) {
        toast.error("Failed to add card");
      }
    };

    uploadCard();
  }, [
    uploadForm.submit,
    apiCall,
    label,
    brand,
    cardNumber,
    cardHolder,
    expiryDate,
    cvv,
    bank,
    setUploadForm,
    setLabel,
    setBrand,
    setCardNumber,
    setCardHolder,
    setExpiryDate,
    setCvv,
    setBank,
    fetchCards,
    toast,
  ]);

  /**
   * Render card based on brand
   */
  const getCard = (card: Card) => {
    switch (card.brand) {
      case "American Express":
        return (
          <AmericanExpress
            key={card._id}
            cardHolder={card.cardHolder}
            cardNumber={card.cardNumber}
            cvv={card.cvv}
            expiry={card.expiryDate}
          />
        );

      case "Visa":
        return (
          <VisaCard
            key={card._id}
            cardHolder={card.cardHolder}
            cardNumber={card.cardNumber}
            cvv={card.cvv}
            expiry={card.expiryDate}
          />
        );

      case "Mastercard":
        return (
          <Mastercard
            key={card._id}
            cardHolder={card.cardHolder}
            cardNumber={card.cardNumber}
            cvv={card.cvv}
            expiry={card.expiryDate}
          />
        );

      case "SadaPay":
        return (
          <SadapayCard
            key={card._id}
            cardHolder={card.cardHolder}
            cardNumber={card.cardNumber}
            cvv={card.cvv}
            expiry={card.expiryDate}
          />
        );

      default:
        return null;
    }
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

      setUploadForm,
    });
  };

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Cards
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text variant="caption">
          {cards.length} {cards.length === 1 ? "card" : "cards"} in vault
        </Text>

        <Button
          icon={Plus}
          style={{ marginTop: 20 }}
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
          {itemState === "fetching" && (
            <Text variant="caption">Loading cards...</Text>
          )}

          {itemState === "notFound" && (
            <Text variant="caption">No cards added yet.</Text>
          )}

          {itemState === "found" && cards.map(getCard)}
        </View>
      </ScrollView>
    </View>
  );
};

export default Cards;