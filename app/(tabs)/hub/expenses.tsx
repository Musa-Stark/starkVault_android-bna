import { View } from "react-native";
import React from "react";
import { useColor } from "@/hooks/useColor";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const expenses = () => {
  const background = useColor("background");
  const foreground = useColor("foreground");
  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Expenses
      </Text>
      {/* title */}
      <Text variant="caption">Track every penny with intelligence.</Text>
      {/* button */}
      <Button icon={Plus} style={{ marginTop: 20 }}>
        Add Expense
      </Button>
      {/* total spent */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Total Spent
          </Text>
          <CardTitle>Rs 0</CardTitle>
        </CardHeader>
      </Card>

      {/* average per transaction */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Average per transaction
          </Text>
          <CardTitle>Rs 0</CardTitle>
        </CardHeader>
      </Card>

      {/* top category */}
      <Card style={{ marginTop: 20 }}>
        <CardHeader>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Top category
          </Text>
          <CardTitle>N/A</CardTitle>
          <Text variant="caption" style={{ fontSize: 15 }}>
            Top category
          </Text>
        </CardHeader>
      </Card>

      {/* expenses */}
      <Card style={{ marginTop: 20 }}>
        <Text variant="caption">No expenses added yet</Text>
      </Card>
    </View>
  );
};

export default expenses;
