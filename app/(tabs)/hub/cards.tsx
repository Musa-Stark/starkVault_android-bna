import { View } from "react-native";
import React, { useEffect } from "react";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import handleCardForm from "@/components/starkUI/upload/cards.form";

const cards = () => {
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

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({
      label,
      brand,
      cardNumber,
      cardHolder,
      expiryDate,
      cvv,
      bank,
    });

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
    setExpiryDate("");
    setCvv("");
    setBank("");
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Cards
      </Text>

      <Text variant="caption">0 cards in vault</Text>

      <Button
        icon={Plus}
        style={{ marginTop: 20 }}
        onPress={() =>
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
          })
        }
      >
        Add Card
      </Button>
    </View>
  );
};

export default cards;
