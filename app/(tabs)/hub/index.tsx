import { View, } from "react-native";
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

const ListItem = ({
  Icon,
  text,
}: {
  Icon: React.ComponentType<LucideProps>;
  text: string;
}) => {
  const foreground = useColor("foreground");

  return (
    <View
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
    </View>
  );
};

const Money = () => {
  const foreground = useColor("foreground");

  const items = [
    { icon: CircleDollarSign, text: "Expenses", category: "money" },
    { icon: Wallet, text: "Income", category: "money" },
    { icon: Repeat, text: "Subscriptions", category: "money" },
    { icon: HandCoins, text: "Savings Goals", category: "money" },
    { icon: Scale, text: "Debt", category: "money" },
    { icon: ChartColumnIcon, text: "Investments", category: "money" },
    { icon: KeyRound, text: "Password", category: "vault" },
    { icon: CreditCard, text: "Cards", category: "vault" },
    { icon: FileLock, text: "Documents", category: "vault" },
    { icon: NotebookPenIcon, text: "Notes", category: "vault" },
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
      <ScrollView style={{ marginTop: 20 }}>
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
              <ListItem key={idx} Icon={item.icon} text={item.text} />
              {showSeparator && <Separator />}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Money;
