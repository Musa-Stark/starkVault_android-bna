import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import handleSubscriptionForm from "@/components/starkUI/upload/subscriptions.form";
import { useApp } from "@/providers/app-context";
import { ScrollView } from "react-native-gesture-handler";
import ItemsCard from "@/components/starkUI/list/SubscriptionCard";

const Subscriptions = () => {
  const {
    subscriptionName,
    setSubscriptionName,
    subscriptionNameRef,

    amount,
    setAmount,
    amountRef,

    billingCycle,
    setBillingCycle,
    billingCycleRef,

    category,
    setCategory,
    categoryRef,

    uploadForm,
    setUploadForm,
  } = useApp();

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({
      subscriptionName,
      amount,
      billingCycle,
      category,
    });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setSubscriptionName("");
    setAmount("");
    setBillingCycle("");
    setCategory("");
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Subscriptions
      </Text>

      <ScrollView>
        <Text variant="caption">Track your recurring subscriptions.</Text>

        <Button
          icon={Plus}
          style={{ marginTop: 20 }}
          onPress={() =>
            handleSubscriptionForm({
              subscriptionName,
              setSubscriptionName,
              subscriptionNameRef,

              amount,
              setAmount,
              amountRef,

              billingCycle,
              setBillingCycle,
              billingCycleRef,

              category,
              setCategory,
              categoryRef,

              setUploadForm,
            })
          }
        >
          Add Subscription
        </Button>

        {/* This month */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader>
            <Text variant="caption" style={{ fontSize: 15 }}>
              Monthly burn
            </Text>
            <CardTitle>Rs 0</CardTitle>
          </CardHeader>
        </Card>

        {/* Yearly equivalent */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader>
            <Text variant="caption" style={{ fontSize: 15 }}>
              Yearly equivalent
            </Text>
            <CardTitle>Rs 0</CardTitle>
          </CardHeader>
        </Card>

        {/* Total subscriptions */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader>
            <Text variant="caption" style={{ fontSize: 15 }}>
              Total Subscriptions
            </Text>
            <CardTitle>0</CardTitle>
          </CardHeader>
        </Card>

        {/* Subscriptions */}
        <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
          <Text variant="caption">No subscriptions added yet</Text>
        </Card>

        <ItemsCard
          categories={[
            { name: "Entertainment", color: "#fbcfe8" },
            { name: "Software", color: "#bfdbfe" },
            { name: "Cloud", color: "#c7d2fe" },
            { name: "Music", color: "#bbf7d0" },
            { name: "Fitness", color: "#fde68a" },
            { name: "Education", color: "#ddd6fe" },
          ]}
          subscriptions={[
            {
              _id: "sub_001",
              subscriptionName: "Netflix",
              category: "Entertainment",
              cost: 15.99,
              billingCycle: "Monthly",
              date: "2026-08-24",
            },
            {
              _id: "sub_002",
              subscriptionName: "Spotify",
              category: "Music",
              cost: 10.99,
              billingCycle: "Monthly",
              date: "2026-08-27",
            },
            {
              _id: "sub_003",
              subscriptionName: "GitHub Pro",
              category: "Software",
              cost: 4,
              billingCycle: "Monthly",
              date: "2026-09-02",
            },
            {
              _id: "sub_004",
              subscriptionName: "AWS",
              category: "Cloud",
              cost: 42.75,
              billingCycle: "Monthly",
              date: "2026-09-05",
            },
            {
              _id: "sub_005",
              subscriptionName: "Adobe Creative Cloud",
              category: "Software",
              cost: 599.88,
              billingCycle: "Yearly",
              date: "2026-10-15",
            },
            {
              _id: "sub_006",
              subscriptionName: "Gym Membership",
              category: "Fitness",
              cost: 29.99,
              billingCycle: "Monthly",
              date: "2026-08-29",
            },
            {
              _id: "sub_007",
              subscriptionName: "Coursera Plus",
              category: "Education",
              cost: 399,
              billingCycle: "Yearly",
              date: "2027-01-12",
            },
          ]}
          onAdd={() => {
            console.log("added");
          }}
          onDelete={(item) => {
            console.log("deleted: ", item);
          }}
          onEdit={(item) => {
            console.log("edited: ", item);
          }}
        />
      </ScrollView>
    </View>
  );
};

export default Subscriptions;
