import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Item } from "@/components/starkUI/list/ItemsList";
import { Text } from "@/components/ui/text";
import { ViewAll } from "@/components/starkUI/list/ItemsList";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { ItemsListSkeleton } from "@/components/starkUI/skeleton/ItemsListSkeleton";
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
import { useColor } from "@/hooks/useColor";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";
import {
  BriefcaseBusiness,
  Laptop,
  Building2,
  TrendingUp,
  Percent,
  House,
  BadgeDollarSign,
  Gift,
  RotateCcw,
  ChartNoAxesCombined,
  Landmark,
  Shapes,
} from "lucide-react-native";

import type { LucideIcon } from "lucide-react-native";

const Income = () => {
  const primary = useColor("primary");
  const apiCall = useAPICall();
  const { toast } = useToast();

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
    clearSelection,
    setClearSelection,
    setDeleteModal,
  } = useApp();

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  const categoryIcons: Record<string, LucideIcon> = {
    Salary: BriefcaseBusiness,
    Freelance: Laptop,
    Business: Building2,
    Investment: TrendingUp,
    Interest: Percent,
    "Rental Income": House,
    Bonus: BadgeDollarSign,
    Gift: Gift,
    Refund: RotateCcw,
    Dividends: ChartNoAxesCombined,
    Pension: Landmark,
    Other: Shapes,
  };

  const [items, setItems] = useState<Item[]>([]);

  // fetch
  useEffect(() => {
    const fetchIncomes = async () => {
      const response = await apiCall({ page: "incomes", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItems([]);
        setItemState("notFound");
        return;
      }

      setItems([
        ...response.data.map((el: any) => ({
          id: el._id,
          title: el.source,
          caption: el.type,
          Icon: categoryIcons[el.type],
          right: {
            type: "text",
            text: `PKR ${el.amount}`,
            textStyle: { color: primary, fontSize: 15 },
          },
        })),
      ]);

      setItemState("found");
    };

    fetchIncomes();
  }, []);

  // upload
  useEffect(() => {
    const uploadIncome = async () => {
      if (!uploadForm.submit) return;

      const response = await apiCall({
        page: "incomes",
        data: { source, type, amount },
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
            title: response.data.source,
            caption: response.data.type,
            Icon: categoryIcons[response.data.type],
            right: {
              type: "text",
              text: `Rs ${response.data.amount}/-`,
              textStyle: { color: primary, fontSize: 15, fontWeight: 600 },
            },
          },
        ]);
      } else {
        setItems((prev) => [
          ...prev.map((el) =>
            el.id === response.data._id
              ? ({
                  id: response.data._id,
                  title: response.data.source,
                  caption: response.data.type,
                  Icon: categoryIcons[response.data.type],
                  right: {
                    type: "text",
                    text: `Rs ${response.data.amount}/-`,
                    textStyle: { color: primary, fontSize: 15, fontWeight: 600 },
                  },
                } satisfies Item)
              : el,
          ),
        ]);

        setClearSelection((prev) => prev + 1);
      }

      setItemState("found");

      setUploadForm({
        inputs: undefined,
        name: "",
        show: false,
        submit: false,
      });

      setSource("");
      setType("");
      setAmount("");
    };

    uploadIncome();
  }, [uploadForm.submit]);

  const itemSections = {
    found: (
      <ViewAll
        items={items}
        header="List"
        clearSelection={clearSelection}
        onEdit={(item) => {
          const newAmount = item.right?.text?.replace(/[^0-9.]/g, "") ?? "";
          const newType = item.caption ?? "";
          const newSource = item.title;

          setAmount(newAmount);
          setType(newType);
          setSource(newSource);

          handleIncomeForm({
            amount: newAmount,
            amountRef,
            source: newSource,
            sourceRef,
            type: newType,
            typeRef,
            setAmount,
            setType,
            setSource,
            setUploadForm,
            method: "PATCH",
            itemId: item.id,
          });
        }}
        onDelete={(selectedItems: Item[]) => {
          setDeleteModal({
            show: true,
            ids: selectedItems.map((item) => item.id),
            page: "incomes",
            setState: setItems,
          });
        }}
        style={{ marginVertical: 20 }}
      />
    ),
    notFound: (
      <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
        <Text variant="caption">No income added yet</Text>
      </Card>
    ),
    fetching: <ItemsListSkeleton style={{ marginTop: 20 }} />,
  };

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

        {itemSections[itemState]}
      </ScrollView>
    </View>
  );
};

export default Income;
