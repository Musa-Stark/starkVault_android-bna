import React, { useState, useEffect } from "react";
import { useColor } from "@/hooks/useColor";
import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-context";
import {
  CircleDollarSign,
  CreditCard,
  HandCoins,
  KeyRound,
  LucideIcon,
  NotebookPenIcon,
  Plus,
  Repeat,
  Sparkles,
  Wallet,
} from "lucide-react-native";
import formatDate from "@/utils/formatDate";
import { Card, CardTitle } from "@/components/ui/card";
import SadapayCard from "@/components/starkUI/cards/Sadapay";
import { ScrollView } from "react-native-gesture-handler";
import RecentActivity from "./recentActivity";
import handleExpenseForm from "@/components/starkUI/upload/expenses.form";
import useAPICall from "@/utils/apiCall";
import { RelativePathString } from "expo-router";
import RecentActivitySkeleton from "@/components/starkUI/skeleton/RecentsSkeleton";
import SadapayCardSkeleton from "@/components/starkUI/skeleton/CardSkeleton";
import VisaCard from "@/components/starkUI/cards/VisaCard";
import Mastercard from "@/components/starkUI/cards/MasterCard";
import AmericanExpress from "@/components/starkUI/cards/AmericanExpress";

const DashBoard = () => {
  const background = useColor("background");
  const {
    uploadForm,
    setUploadForm,
    merchant,
    category,
    amount,
    setMerchant,
    setCategory,
    setAmount,
    merchantRef,
    categoryRef,
    amountRef,
  } = useApp();

  const apiCall = useAPICall();
  const primary = useColor("primary");
  const mutedForeground = useColor("mutedForeground");

  interface Recent {
    _id: string;
    title: string;
    type: string;
    route: RelativePathString;
    createdAt: Date;
    card?: any;
  }

  interface PrimaryCard {
    _id: string;
    label: string;
    brand: string;
    cardNumber: string;
    cardHolder: string;
    expiryDate: Date;
    cvv: string;
    bank: string;
    isPrimary: boolean;
  }

  const [recents, setRecents] = useState<Recent[]>([]);
  const [primaryCard, setPrimaryCard] = useState<PrimaryCard>();
  const [showViewMore, setshowViewMore] = useState(false);

  // submit
  useEffect(() => {
    if (!uploadForm.submit) return;

    setUploadForm((prev) => ({ ...prev, submit: false }));
    setMerchant("");
    setCategory("");
    setAmount("");
  }, [uploadForm.submit]);

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );
  const [primaryCardState, setPrimaryCardState] = useState<
    "found" | "notFound" | "fetching"
  >("fetching");

  // fetch
  useEffect(() => {
    const fetch = async () => {
      const response = await apiCall({ page: "recents", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItemState("notFound");
        return;
      }

      // setRecents
      setRecents(
        response.data
          .filter((item: any) => !item.card)
          .map((item: Recent) => ({
            _id: item._id,
            title: item.title,
            type: item.type,
            route: item.route,
            createdAt: item.createdAt,
          })),
      );

      setItemState("found");

      const primaryCardItem = response.data.find(
        (item: any) => item.card?.isPrimary,
      );
      if (primaryCardItem) {
        setPrimaryCard(primaryCardItem.card);
        setPrimaryCardState("found");
        return;
      }
      setPrimaryCardState("notFound");
    };

    fetch();
  }, []);

  const icons: Record<string, LucideIcon> = {
    Expense: CircleDollarSign,
    Income: Wallet,
    Subscription: Repeat,
    "Savings goal": HandCoins,
    Password: KeyRound,
    Card: CreditCard,
    Note: NotebookPenIcon,
  };

  // recentScreens
  const recentScreens = {
    notFound: <Text style={{ color: mutedForeground }}>No recents yet.</Text>,
    fetching: <RecentActivitySkeleton />,
    found: (
      <>
        {recents.map((item, idx) => {
          if (idx > 4) {
            setshowViewMore(true);
            return;
          }
          return (
            <RecentActivity
              key={item._id}
              Icon={icons[item.title]}
              age={formatDate(item.createdAt)}
              service={item.title}
              state={item.type}
              route={item.route}
            />
          );
        })}
      </>
    ),
  };

  const cardsMap = {
    Visa: VisaCard,
    Mastercard: Mastercard,
    "American Express": AmericanExpress,
    SadaPay: SadapayCard,
  };

  type CardBrand = keyof typeof cardsMap;

  const CardComponent =
    primaryCard?.brand && primaryCard.brand in cardsMap
      ? cardsMap[primaryCard.brand as CardBrand]
      : null;

  // cardScreens
  const cardScreen = {
    notFound: (
      <Text
        variant="caption"
        style={{ fontSize: 14, marginVertical: 25, textAlign: "center" }}
      >
        Your primary card will appear here.
      </Text>
    ),
    found: (
      <>
        <Text variant="caption" style={{ fontSize: 14 }}>
          Tap on card to flip
        </Text>

        {CardComponent ? (
          <CardComponent
            style={{ marginTop: 15, width: 335 }}
            cardHolder={primaryCard?.cardHolder}
            cardNumber={primaryCard?.cardNumber}
            cvv={primaryCard?.cvv}
            expiry={primaryCard?.expiryDate}
            key={primaryCard?._id}
          />
        ) : (
          <Text
            variant="caption"
            style={{ marginVertical: 25, textAlign: "center" }}
          >
            Unsupported card brand.{" "}
          </Text>
        )}
      </>
    ),
    fetching: <SadapayCardSkeleton />,
  };

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Dashboard
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* welcome */}
        <Text variant="caption">Welcome back, Musa</Text>

        {/* title */}
        <Text variant="title">Your finances are on track.</Text>

        {/* buttons */}
        {/* buttons horizontal */}
        <View
          style={[
            globalStyles.flexBoxHorizantal,
            { justifyContent: "flex-start", marginTop: 20, gap: 10 },
          ]}
        >
          <Button
            onPress={() =>
              handleExpenseForm({
                setUploadForm,
                amount,
                category,
                merchant,
                setAmount,
                setCategory,
                setMerchant,
                merchantRef,
                categoryRef,
                amountRef,
              })
            }
            icon={Plus}
            variant="outline"
          >
            <Text>Expense</Text>
          </Button>

          <Button icon={Plus} variant="outline">
            <Text>Card</Text>
          </Button>
        </View>

        {/* add password */}
        <Button icon={Sparkles} variant="default" style={{ marginTop: 15 }}>
          <Text style={{ color: background }}>Add Password</Text>
        </Button>

        {/* cards */}
        <Card style={{ marginTop: 20 }}>
          <CardTitle children="Primary Card" />

          {cardScreen[primaryCardState]}

          {primaryCardState === "found" && (
            <Button
              icon={CreditCard}
              variant="default"
              style={{ marginTop: 15 }}
            >
              <Text variant="body" style={{ color: background }}>
                Cards
              </Text>
            </Button>
          )}
        </Card>

        {/* recent */}
        <Card style={{ marginVertical: 20 }}>
          <View
            style={{
              ...globalStyles.flexBoxHorizantal,
              justifyContent: "space-between",
            }}
          >
            <CardTitle children="Recent Activity" />
            {showViewMore && (
              <Pressable
                style={({ pressed }) => [pressed && { opacity: 0.5 }]}
                onPress={() => console.log("View More")}
                hitSlop={24}
              >
                <Text style={{ color: primary, fontSize: 13 }}>VIew More</Text>
              </Pressable>
            )}
          </View>
          <View style={{ ...globalStyles.flexBox, marginTop: 10, gap: 10 }}>
            {recentScreens[itemState]}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

export default DashBoard;
