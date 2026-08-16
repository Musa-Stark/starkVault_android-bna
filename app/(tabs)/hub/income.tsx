import { View } from "react-native";
import React from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card,  CardHeader, CardTitle } from "@/components/ui/card";

const income = () => {
  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Income
      </Text>
      {/* title */}
      <Text variant="caption">All income streams.</Text>
      {/* button */}
      <Button icon={Plus} style={{ marginTop: 20 }}>
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

      {/* expenses */}
      <Card style={{ marginTop: 20 }}>
        <Text variant="caption">No income added yet</Text>
      </Card>
    </View>
  );
};

export default income;
