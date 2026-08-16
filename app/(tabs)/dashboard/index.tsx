import React from "react";
import { useColor } from "@/hooks/useColor";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Sparkles } from "lucide-react-native";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const DashBoard = () => {
  const background = useColor("background");

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Dashboard
      </Text>

      {/* welcome */}
      <Text variant="caption">Welcome back, Musa</Text>

      {/* title */}
      <Text variant="title">Your finances are on track.</Text>

      {/* buttons */}
      {/* buttons horizontal */}
      <View
        style={[
          globalStyles.flexBoxHorizantal,
          { justifyContent: "flex-start", marginTop: 20, gap: 10 },
        ]}
      >
        <Button icon={Plus} variant="outline">
          <Text>Expense</Text>
        </Button>

        <Button icon={Plus} variant="outline">
          <Text>Card</Text>
        </Button>
      </View>

      {/* add password */}
      <Button icon={Sparkles} variant="default" style={{ marginTop: 10 }}>
        <Text style={{ color: background }}>Add Password</Text>
      </Button>

      {/* recent */}
      <Card
        children={
          <>
            <CardTitle children="Recent Activity" />
            <CardDescription children="No recent activity yet" />
          </>
        }
        style={{ marginTop: 20 }}
      />

      {/* cards */}
      <Card
        children={
          <>
            <CardTitle children="Latest Card" />
            <CardDescription children="Tap CVV to flip" />

            <Button icon={CreditCard} variant="default" style={{ marginTop: 10 }}>
              <Text variant="body" style={{ color: background }}>
                Cards
              </Text>
            </Button>
          </>
        }
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default DashBoard;
