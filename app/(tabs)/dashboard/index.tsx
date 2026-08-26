import React, { useState, useEffect } from "react";
import { useColor } from "@/hooks/useColor";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-context";
import {
  CreditCard,
  FileLock,
  LucideProps,
  Plus,
  Sparkles,
} from "lucide-react-native";
import { Card, CardTitle } from "@/components/ui/card";
import SadapayCard from "@/components/starkUI/cards/Sadapay";
import { ScrollView } from "react-native-gesture-handler";
import RecentActivity from "./recentActivity";
import handleExpenseForm from "@/components/starkUI/upload/expenses.form";
import { useToast } from "@/providers/toast-provider";

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

  const { toast } = useToast();

  // submit
  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({ merchant, category, amount });

    setUploadForm((prev) => ({ ...prev, submit: false }));
    setMerchant("");
    setCategory("");
    setAmount("");
  }, [uploadForm.submit]);

  const recents: {
    Icon: React.ComponentType<LucideProps>;
    age: string;
    service: string;
    state: string;
  }[] = [
    {
      age: "3 months",
      Icon: FileLock,
      service: "Document",
      state: "added",
    },
  ];

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

        {/* recent */}
        <Card style={{ marginTop: 20 }}>
          <CardTitle children="Recent Activity" />
          <View style={{ ...globalStyles.flexBox, marginTop: 10 }}>
            {/* <CardDescription children="No recent activity yet" /> */}
            {recents.map((item, idx) => (
              <RecentActivity
                key={idx}
                Icon={item.Icon}
                age={item.age}
                service={item.service}
                state={item.state}
              />
            ))}
          </View>
        </Card>

        {/* cards */}
        <Card style={{ marginTop: 20, marginBottom: 20 }}>
          <CardTitle children="Latest Card" />
          <Text variant="caption" style={{ fontSize: 14 }}>
            Tap on card to flip
          </Text>

          <SadapayCard style={{ marginTop: 15, width: 335 }} />

          <Button icon={CreditCard} variant="default" style={{ marginTop: 15 }}>
            <Text variant="body" style={{ color: background }}>
              Cards
            </Text>
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
};

export default DashBoard;
