import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { ItemsListSkeleton } from "@/components/starkUI/skeleton/ItemsListSkeleton";
import type { LucideIcon } from "lucide-react-native";
import {
  Utensils,
  House,
  Car,
  ShoppingBag,
  HeartPulse,
  Clapperboard,
  Receipt,
  Plane,
  GraduationCap,
  UsersRound,
  Wallet,
  Shapes,
  Plus,
} from "lucide-react-native";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/providers/app-context";
import handleExpenseForm from "@/components/starkUI/upload/expenses.form";
import { Item, ViewAll } from "@/components/starkUI/list/ItemsList";
import { ScrollView } from "react-native-gesture-handler";
import { useColor } from "@/hooks/useColor";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";

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
  const red = useColor("red");
  const apiCall = useAPICall();
  const { toast } = useToast();

  const categoryIcons: Record<string, LucideIcon> = {
    "Food & Dining": Utensils,
    Housing: House,
    Transportation: Car,
    Shopping: ShoppingBag,
    Health: HeartPulse,
    Entertainment: Clapperboard,
    "Bills & Subscriptions": Receipt,
    Travel: Plane,
    Education: GraduationCap,
    "Family & Personal": UsersRound,
    Finance: Wallet,
    Other: Shapes,
  };

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  const [items, setItems] = useState<Item[]>([]);

  // fetch
  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await apiCall({ page: "expenses", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItems([]);
        setItemState("notFound");
        return;
      }

      setItems([
        ...response.data.map((el: any) => ({
          id: el._id,
          title: el.merchant,
          caption: el.category,
          Icon: categoryIcons[el.category],
          right: {
            type: "text",
            text: `Rs ${el.amount}/-`,
            textStyle: { color: red, fontSize: 15 },
          },
        })),
      ]);

      setItemState("found");
    };

    fetchExpenses();
  }, []);

  // upload
  useEffect(() => {
    const uploadExpense = async () => {
      if (!uploadForm.submit) return;

      const response = await apiCall({
        page: "expenses",
        data: { merchant, amount, category },
        method: uploadForm.method!,
        itemId: uploadForm.itemId,
      });

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      if (uploadForm.method === "POST") {
        setItems((prev) => [
          ...prev,
          {
            id: response.data._id,
            title: response.data.merchant,
            caption: response.data.category,
            Icon: categoryIcons[response.data.category],
            right: {
              type: "text",
              text: `Rs ${response.data.amount}/-`,
              textStyle: { color: red, fontSize: 15, fontWeight: 600 },
            },
          },
        ]);
      } else {
        setItems((prev) => [
          ...prev.map((el) =>
            el.id === response.data._id
              ? ({
                  id: response.data._id,
                  title: response.data.merchant,
                  caption: response.data.category,
                  Icon: categoryIcons[response.data.category],
                  right: {
                    type: "text",
                    text: `Rs ${response.data.amount}/-`,
                    textStyle: { color: red, fontSize: 15, fontWeight: 600 },
                  },
                } satisfies Item)
              : el,
          ),
        ]);
      }

      setItemState("found");

      setUploadForm({
        inputs: undefined,
        name: "",
        show: false,
        submit: false,
        method: "POST",
      });

      setMerchant("");
      setAmount("");
      setCategory("");
    };

    uploadExpense();
  }, [uploadForm.submit]);

  // sections
  const itemSections = {
    found: (
      <ViewAll
        items={items}
        header="List"
        clearSelection={uploadForm.submit}
        onEdit={(item) => {
          const newAmount = item.right?.text?.replace(/[^0-9.]/g, "") ?? "";
          const newCategory = item.caption ?? "";
          const newMerchant = item.title;

          setAmount(newAmount);
          setCategory(newCategory);
          setMerchant(newMerchant);

          handleExpenseForm({
            amount: newAmount,
            amountRef,
            category: newCategory,
            categoryRef,
            merchant: newMerchant,
            merchantRef,
            setAmount,
            setCategory,
            setMerchant,
            setUploadForm,
            method: "PATCH",
            itemId: item.id,
          });
        }}
        onDelete={(selectedItems: Item[]) => {
          console.log("Delete:", selectedItems[0].id);
        }}
        style={{ marginVertical: 20 }}
      />
    ),
    notFound: (
      <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
        <Text variant="caption">No expenses added yet</Text>
      </Card>
    ),
    fetching: <ItemsListSkeleton style={{ marginTop: 20 }} />,
  };

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
              method: "POST",
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
        {itemSections[itemState]}
      </ScrollView>
    </View>
  );
};

export default expenses;
