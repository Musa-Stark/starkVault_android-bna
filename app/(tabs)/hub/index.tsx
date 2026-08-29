import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "@/components/ui/text";
import React from "react";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import {
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  HandCoins,
  KeyRound,
  LucideProps,
  NotebookPenIcon,
  Repeat,
  Wallet,
} from "lucide-react-native";
import { Href, useRouter } from "expo-router";

const ListItem = ({
  Icon,
  text,
  route,
}: {
  Icon: React.ComponentType<LucideProps>;
  text: string;
  route: Href;
}) => {
  const foreground = useColor("foreground");
  const muted = useColor("mutedForeground");
  const primary = useColor("primary");
  const card = useColor("card");
  const border = useColor("border");
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(route)}
      style={({ pressed }) => ({
        ...globalStyles.flexBoxHorizantal,
        justifyContent: "flex-start",
        padding: 13,
        gap: 12,
        borderRadius: 16,
        backgroundColor: pressed ? `${primary}10` : card,
        borderWidth: 1,
        borderColor: border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View style={{ width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: `${primary}14` }}>
        <Icon size={20} color={primary} />
      </View>
      <Text variant="body" style={{ color: foreground, fontWeight: "700", flex: 1 }}>
        {text}
      </Text>
      <ChevronRight size={19} color={muted} />
    </Pressable>
  );
};

const Money = () => {
  const foreground = useColor("foreground");

  const items: {
    icon: React.ComponentType<LucideProps>;
    text: string;
    category: string;
    route: Href;
  }[] = [
    {
      icon: CircleDollarSign,
      text: "Expenses",
      category: "money",
      route: "/hub/expenses",
    },
    { icon: Wallet, text: "Income", category: "money", route: "/hub/income" },
    {
      icon: Repeat,
      text: "Subscriptions",
      category: "money",
      route: "/hub/subscriptions",
    },
    {
      icon: HandCoins,
      text: "Savings Goals",
      category: "money",
      route: "/hub/savings-goals",
    },
    { icon: KeyRound, text: "Passwords", category: "vault", route: "/hub/passwords" },
    { icon: CreditCard, text: "Cards", category: "vault", route: "/hub/cards" },
    // {
    //   icon: FileLock,
    //   text: "Documents",
    //   category: "vault",
    //   route: "/hub/documents",
    // },
    {
      icon: NotebookPenIcon,
      text: "Notes",
      category: "vault",
      route: "/hub/notes",
    },
  ];

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ color: foreground }}>
        Hub
      </Text>

      {/* description */}
      <Text variant="caption" style={{ marginTop: 5 }}>
        Your personal control center for money and private information.
      </Text>

      {/* items */}
      <ScrollView style={{ marginTop: 16 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 130 }}>
        {items.map((item, idx) => {
          const previous = items[idx - 1]?.category;
          const showCategory = item.category !== previous;
          const showSeparator = idx !== items.length - 1;

          return (
            <View key={`${idx}-${item.category}-${item.text}`}>
              {showCategory && (
                <Text
                  key={`${idx}-${item.category}`}
                  variant="caption"
                  style={{ fontSize: 13, fontWeight: "700", letterSpacing: 0.7, textTransform: "uppercase", marginTop: idx === 0 ? 4 : 24, marginBottom: 10 }}
                >
                  {item.category.slice(0, 1).toUpperCase() +
                    item.category.slice(1)}
                </Text>
              )}
              <ListItem
                key={idx}
                Icon={item.icon}
                route={item.route}
                text={item.text}
              />
              {showSeparator && <View style={{ height: 8 }} />}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Money;
