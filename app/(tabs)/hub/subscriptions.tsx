import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card,  CardHeader, CardTitle } from "@/components/ui/card";

const subscriptions = () => {
  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Subscriptions
      </Text>
      {/* title */}
      <Text variant="caption">0 active subscriptions</Text>
      {/* button */}
      <Button icon={Plus} style={{ marginTop: 20 }}>
        Track New
      </Button>

      {/* this month */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Monthly burn
          </Text>
          <CardTitle>Rs 0</CardTitle>
        </CardHeader>
      </Card>

      {/* regular subscriptions */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Yearly equivalent
          </Text>
          <CardTitle>Rs 0</CardTitle>
        </CardHeader>
      </Card>

      {/* total subscriptions */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Total Subscriptions
          </Text>
          <CardTitle>0</CardTitle>
        </CardHeader>
      </Card>

      {/* subscriptions */}
      <Card style={{ marginTop: 20 }}>
        <Text variant="caption">No subscriptions added yet</Text>
      </Card>
    </View>
  );
};

export default subscriptions;
