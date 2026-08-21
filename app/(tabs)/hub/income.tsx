import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Item } from "@/components/starkUI/list/ListItem";
import { Text } from "@/components/ui/text";
import { ViewAll } from "@/components/starkUI/list/ListItem";
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
import handleIncomeForm from "@/components/starkUI/upload/income.form";
import { ScrollView } from "react-native-gesture-handler";

const income = () => {
  const {
    source,
    type,
    amount,
    setSource,
    setType,
    setAmount,
    sourceRef,
    typeRef,
    amountRef,
    uploadForm,
    setUploadForm,
  } = useApp();

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({ source, type, amount });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setSource("");
    setType("");
    setAmount("");
  }, [uploadForm.submit]);

  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      title: "Food",
      Icon: ShoppingCart,
    },
    {
      id: "2",
      title: "Shopping",
      Icon: Wallet,
    },
    {
      id: "3",
      title: "Savings",
      Icon: CircleDollarSign,
    },
  ]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Income
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* title */}
        <Text variant="caption">All income streams.</Text>
        {/* button */}
        <Button
          icon={Plus}
          style={{ marginTop: 20 }}
          onPress={() =>
            handleIncomeForm({
              amount,
              amountRef,
              source,
              sourceRef,
              type,
              typeRef,
              setAmount,
              setSource,
              setType,
              setUploadForm,
            })
          }
        >
          Add Income
        </Button>

        {/* this month */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader>
            <Text variant="caption" style={{ fontSize: 15 }}>
              This month
            </Text>
            <CardTitle>Rs 0</CardTitle>
          </CardHeader>
        </Card>

        {/* regular income */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader>
            <Text variant="caption" style={{ fontSize: 15 }}>
              Recurring streams
            </Text>
            <CardTitle>Rs 0</CardTitle>
          </CardHeader>
        </Card>

        {/* average per entry */}
        <Card style={{ marginTop: 20 }}>
          <CardHeader>
            <Text variant="caption" style={{ fontSize: 15 }}>
              Average per entry
            </Text>
            <CardTitle>Rs 0</CardTitle>
          </CardHeader>
        </Card>

        {/* income */}
        {items.length ? (
          <ViewAll
            items={items}
            header="List"
            // onEdit={(selectedItems) => {
            //   console.log("Edit:", selectedItems);
            // }}
            onDelete={(selectedItems: Item[]) => {
              console.log("Delete:", selectedItems[0].id);
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

export default income;
