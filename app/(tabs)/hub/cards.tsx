import { View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import handleCardForm from "@/components/starkUI/upload/cards.form";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";

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

  const [cards, setCards] = useState([]);

  const apiCall = useAPICall();
  const { toast } = useToast();

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  // fetch - GET
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await apiCall({ page: "cards", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItemState("notFound");
        return;
      }

      console.log("GET /cards: ", response.data)

      setCards([]);

      setItemState("found");
    };

    fetchSubscriptions();
  }, []);

  // upload - POST
  useEffect(() => {
    const uploadSubscription = async () => {
      if (!uploadForm.submit) return;

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
      console.log("POST /cards: ", response)


      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }
      setCards([]);

      setItemState("found");

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
    };

    uploadSubscription();
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
