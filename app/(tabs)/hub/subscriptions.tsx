import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import handleSubscriptionForm from "@/components/starkUI/upload/subscriptions.form";
import { useApp } from "@/providers/app-context";

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
  }, [
    uploadForm.submit,
  ]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Subscriptions
      </Text>

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
      <Card style={{ marginTop: 20 }}>
        <Text variant="caption">No subscriptions added yet</Text>
      </Card>
    </View>
  );
};

export default Subscriptions;
