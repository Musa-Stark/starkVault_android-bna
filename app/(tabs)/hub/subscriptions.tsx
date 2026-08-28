import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionCardSkeleton } from "@/components/starkUI/skeleton/SubscriptionSkeleton";
import handleSubscriptionForm from "@/components/starkUI/upload/subscriptions.form";
import { useApp } from "@/providers/app-context";
import { ScrollView } from "react-native-gesture-handler";
import ItemsCard, {
  type BillingCycle,
  categories,
} from "@/components/starkUI/list/SubscriptionCard";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";
import useDeleteOne from "@/components/starkUI/DeleteOne";

interface Subscription {
  _id: string;
  subscriptionName: string;
  category: (typeof categories)[number]["name"];
  cost: string;
  billingCycle: BillingCycle;
  date: string;
}

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

  const apiCall = useAPICall();
  const { toast } = useToast();
  const deleteOne = useDeleteOne();

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  // fetch
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await apiCall({ page: "subscriptions", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setSubscriptions([]);
        setItemState("notFound");
        return;
      }

      setSubscriptions([
        ...response.data.map((el: any) => ({
          _id: el._id,
          billingCycle: el.billingCycle,
          category: el.category,
          cost: el.cost,
          date: el.createdAt,
          subscriptionName: el.subscriptionName,
        })),
      ]);

      setItemState("found");
    };

    fetchSubscriptions();
  }, []);

  // upload
  useEffect(() => {
    const uploadSubscription = async () => {
      if (!uploadForm.submit) return;

      const response = await apiCall({
        page: "subscriptions",
        data: {
          subscriptionName,
          cost: amount,
          billingCycle,
          category,
        },
        method: uploadForm.method!,
        itemId: uploadForm.itemId,
      });

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      if (uploadForm.method === "POST") {
        setSubscriptions((prev) => [
          ...prev,
          {
            _id: response.data._id,
            billingCycle: response.data.billingCycle,
            category: response.data.category,
            cost: response.data.cost,
            date: response.data.createdAt,
            subscriptionName: response.data.subscriptionName,
          },
        ]);
      } else {
        setSubscriptions((prev) => [
          ...prev.map((el) =>
            el._id === response.data._id
              ? ({
                  _id: response.data._id,
                  billingCycle: response.data.billingCycle,
                  category: response.data.category,
                  cost: response.data.cost,
                  date: response.data.createdAt,
                  subscriptionName: response.data.subscriptionName,
                } satisfies Subscription)
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
      });

      setSubscriptionName("");
      setAmount("");
      setBillingCycle("");
      setCategory("");
    };

    uploadSubscription();
  }, [uploadForm.submit]);

  const subscriptionScreens = {
    found: (
      <View style={{ marginTop: 15, gap: 15 }}>
        {subscriptions.map((el) => (
          <ItemsCard
            key={el._id}
            categories={categories}
            subscriptions={[el]}
            onDelete={(item) =>
              deleteOne({
                id: item._id,
                page: "subscriptions",
                setState: setSubscriptions,
              })
            }
            onEdit={(item) => {
              const newBillingCycle = item.billingCycle;
              const newCategory = item.category;
              const newCost = item.cost.toString();
              const newSubscriptionName = item.subscriptionName;

              setBillingCycle(newBillingCycle);
              setCategory(newCategory);
              setAmount(newCost);
              setSubscriptionName(newSubscriptionName);

              handleSubscriptionForm({
                subscriptionName: newSubscriptionName,
                setSubscriptionName,
                subscriptionNameRef,

                amount: newCost,
                setAmount,
                amountRef,

                billingCycle: newBillingCycle,
                setBillingCycle,
                billingCycleRef,

                category: newCategory,
                setCategory,
                categoryRef,

                setUploadForm,

                method: "PATCH",
                itemId: item._id,
              });
            }}
          />
        ))}
      </View>
    ),
    notFound: (
      <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
        <Text variant="caption">No subscriptions added yet</Text>
      </Card>
    ),
    fetching: <SubscriptionCardSkeleton />,
  };

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Subscriptions
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
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
        {subscriptionScreens[itemState]}
      </ScrollView>
    </View>
  );
};

export default Subscriptions;
