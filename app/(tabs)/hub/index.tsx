import { Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Text } from "@/components/ui/text";
import React from "react";
import { useColor } from "@/hooks/useColor";
import globalStyles from "@/starkwind/globalStyle";
import { Separator } from "@/components/ui/separator";
import {
  ChartColumnIcon,
  CircleDollarSign,
  CreditCard,
  FileLock,
  HandCoins,
  KeyRound,
  LucideProps,
  NotebookPenIcon,
  Repeat,
  Scale,
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
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(route)}
      style={{
        ...globalStyles.flexBoxHorizantal,
        justifyContent: "flex-start",
        paddingVertical: 15,
        gap: 10,
      }}
    >
      <Icon size={24} color={foreground} />
      <Text variant="body" style={{ color: foreground }}>
        {text}
      </Text>
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
    {
      icon: FileLock,
      text: "Documents",
      category: "vault",
      route: "/hub/documents",
    },
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
      <Text variant="heading" style={{ color: foreground, marginBottom: 10 }}>
        Hub
      </Text>

      {/* description */}
      <Text variant="caption">
        Everything you need to manage money and personal information.
      </Text>

      {/* items */}
      <ScrollView style={{ marginTop: 20 }} showsVerticalScrollIndicator={false}>
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
                  style={{ fontSize: 15, marginTop: 20 }}
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
              {showSeparator && <Separator />}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Money;
