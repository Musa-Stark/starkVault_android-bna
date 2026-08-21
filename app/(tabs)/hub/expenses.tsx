import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  Plus,
  ShoppingCart,
  Wallet,
} from "lucide-react-native";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/providers/app-context";
import handleExpenseForm from "@/components/starkUI/upload/expenses.form";
import { Item, ViewAll } from "@/components/starkUI/list/ListItem";
import { ScrollView } from "react-native-gesture-handler";

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
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      title: "Food",
      caption: "Monthly spending",
      Icon: ShoppingCart,
      right: <Text style={{ fontSize: 14, fontWeight: "600" }}>32%</Text>,
    },
    {
      id: "2",
      title: "Shopping",
      caption: "Monthly spending",
      Icon: Wallet,
      // right: <Text style={{ fontSize: 14, fontWeight: "600" }}>18%</Text>,
    },
    {
      id: "3",
      title: "Savings",
      caption: "Monthly target",
      Icon: CircleDollarSign,
      right: <Text style={{ fontSize: 14, fontWeight: "600" }}>50%</Text>,
    },
  ]);

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({ merchant, amount, category });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setMerchant("");
    setAmount("");
    setCategory("");
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Expenses
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
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
        {items.length ? (
          <ViewAll
            items={items}
            header="List"
            onEdit={(selectedItems) => {
              console.log("Edit:", selectedItems);
            }}
            onDelete={(selectedItems) => {
              console.log("Delete:", selectedItems);
            }}
            style={{ marginVertical: 20 }}
          />
        ) : (
          <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
            <Text variant="caption">No expenses added yet</Text>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

export default expenses;
