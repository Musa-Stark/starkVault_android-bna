import React from "react";
import { useColor } from "@/hooks/useColor";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Sparkles } from "lucide-react-native";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import SadapayCard from "@/components/starkUI/cards/Sadapay";
import { ScrollView } from "react-native-gesture-handler";

const DashBoard = () => {
  const background = useColor("background");

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Dashboard
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
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
        <Button icon={Sparkles} variant="default" style={{ marginTop: 15 }}>
          <Text style={{ color: background }}>Add Password</Text>
        </Button>

        {/* recent */}
        <Card style={{ marginTop: 20 }}>
          <CardTitle children="Recent Activity" />
          <View style={{...globalStyles.flexBox, marginTop: 10}}>
            <CardDescription children="No recent activity yet" />
          </View>
        </Card>

        {/* cards */}
        <Card style={{ marginTop: 20, marginBottom: 20 }}>
          <CardTitle children="Latest Card" />
          <CardDescription children="Tap CVV to flip" />

          <SadapayCard style={{ marginTop: 15, width: 335 }} />

          <Button icon={CreditCard} variant="default" style={{ marginTop: 15 }}>
            <Text variant="body" style={{ color: background }}>
              Cards
            </Text>
          </Button>
        </Card>
      </ScrollView>
    </View>
  );
};

export default DashBoard;
