import React, { useMemo } from "react";
import { ScrollView, View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Plus, Calendar, Trash2, Pen, Clock3 } from "lucide-react-native";
import { useColor } from "@/hooks/useColor";

const daysUntil = (isoDate: string) => {
  const milliseconds = new Date(isoDate).getTime() - Date.now();

  return Math.max(0, Math.ceil(milliseconds / (1000 * 60 * 60 * 24)));
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("PK", {
    style: "currency",
    currency: "Pkr",
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const categories = [
  { name: "Entertainment", color: "#fbcfe8" },
  { name: "Software", color: "#bfdbfe" },
  { name: "Streaming", color: "#fecdd3" },
  { name: "Music", color: "#bbf7d0" },
  { name: "Gaming", color: "#c4b5fd" },
  { name: "Fitness", color: "#fde68a" },
  { name: "News & Magazines", color: "#fed7aa" },
  { name: "Education", color: "#ddd6fe" },
  { name: "Cloud Storage", color: "#c7d2fe" },
  { name: "Other", color: "#d1d5db" },
];

export type BillingCycle =
  | "Daily"
  | "Weekly"
  | "Monthly"
  | "Quarterly"
  | "Yearly"
  | "";

type Subscription = {
  _id: string;
  subscriptionName: string;
  category: (typeof categories)[number]["name"];
  cost: string;
  billingCycle: BillingCycle;
  date: string;
};

type SubscriptionCategory = {
  name: string;
  color: string;
};

type Props = {
  subscriptions: Subscription[];
  categories: SubscriptionCategory[];

  onEdit: (subscription: Subscription) => void;

  onDelete: (subscription: Subscription) => void;
};

export default function SubscriptionCard({
  subscriptions,
  categories,
  onEdit,
  onDelete,
}: Props) {
  const monthlyTotal = useMemo(() => {
    return subscriptions
      .filter((subscription) => subscription.billingCycle === "Monthly")
      .reduce((sum, subscription) => sum + Number(subscription.cost), 0);
  }, [subscriptions]);

  const yearlyEquivalent = useMemo(() => {
    return (
      monthlyTotal * 12 +
      subscriptions
        .filter((subscription) => subscription.billingCycle === "Yearly")
        .reduce((sum, subscription) => sum + Number(subscription.cost), 0)
    );
  }, [subscriptions, monthlyTotal]);

  const upcoming = useMemo(() => {
    return subscriptions
      .map((subscription) => ({
        ...subscription,
        days: daysUntil(subscription.date),
      }))
      .sort((left, right) => left.days - right.days);
  }, [subscriptions]);

  const nextSubscription = upcoming[0] ?? null;

  return (
      <View style={{ gap: 12 }}>
        {upcoming.map((subscription) => {
          const urgent = subscription.days <= 7;

          const category = categories.find(
            (category) => category.name === subscription.category,
          );

          const cardColor = useColor("card");
          const foreground = useColor("foreground");
          const background = useColor("background");

          return (
            <View
              key={subscription._id}
              style={{
                padding: 16,
                borderRadius: 16,
                backgroundColor: cardColor,
                elevation: 1,
              }}
            >
              {/* Top section */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                {/* Identity */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: background,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "800",
                        color: foreground,
                      }}
                    >
                      {subscription.subscriptionName?.slice(0, 2).toUpperCase()}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: foreground,
                      }}
                    >
                      {subscription.subscriptionName}
                    </Text>

                    <View
                      style={{
                        alignSelf: "flex-start",
                        marginTop: 5,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 999,
                        backgroundColor: category?.color ?? foreground,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "600",
                          color: background,
                        }}
                      >
                        {subscription.category}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Price */}
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: foreground,
                  }}
                >
                  {formatCurrency(Number(subscription.cost))}
                </Text>
              </View>

              {/* Bottom section */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 18,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* Date */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Calendar size={14} color="#737373" />

                    <Text
                      style={{
                        fontSize: 12,
                      }}
                      variant="caption"
                    >
                      {formatDate(subscription.date)}
                    </Text>
                  </View>

                  {/* Billing cycle */}
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 999,
                      backgroundColor: urgent ? "#fef3c7" : "#86ff0581",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: urgent ? "#92400e" : foreground,
                      }}
                    >
                      {subscription.billingCycle}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Pressable
                    onPress={() => onEdit(subscription)}
                    hitSlop={8}
                    style={{
                      width: 38,
                      height: 38,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                    }}
                  >
                    <Pen size={18} color="#737373" />
                  </Pressable>

                  <Pressable
                    onPress={() => onDelete(subscription)}
                    hitSlop={8}
                    style={{
                      width: 38,
                      height: 38,
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 999,
                    }}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}
      </View>
  );
}
