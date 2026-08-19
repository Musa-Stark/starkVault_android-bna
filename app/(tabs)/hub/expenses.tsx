import { View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/providers/app-context";
import handleExpenseForm from "@/components/starkUI/upload/expenses.form";

const expenses = () => {
  const {
    amount,
    amountRef,
    category,
    categoryRef,
    merchant,
    merchantRef,
    setAmount,
    setCategory,
    setMerchant,
    setUploadForm,
    uploadForm,
  } = useApp();

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({ merchant, amount, category });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setMerchant("")
    setAmount("")
    setCategory("")
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Expenses
      </Text>
      {/* title */}
      <Text variant="caption">Track every penny with intelligence.</Text>
      {/* button */}
      <Button
        icon={Plus}
        style={{ marginTop: 20 }}
        onPress={() =>
          handleExpenseForm({
            amount,
            amountRef,
            category,
            categoryRef,
            merchant,
            merchantRef,
            setAmount,
            setCategory,
            setMerchant,
            setUploadForm,
          })
        }
      >
        Add Expense
      </Button>
      {/* total spent */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Total Spent
          </Text>
          <CardTitle>Rs 0</CardTitle>
        </CardHeader>
      </Card>

      {/* average per transaction */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Average per transaction
          </Text>
          <CardTitle>Rs 0</CardTitle>
        </CardHeader>
      </Card>

      {/* top category */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Top category
          </Text>
          <CardTitle>N/A</CardTitle>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Top category
          </Text>
        </CardHeader>
      </Card>

      {/* expenses */}
      <Card style={{ marginTop: 20 }}>
        <Text variant="caption">No expenses added yet</Text>
      </Card>
    </View>
  );
};

export default expenses;
