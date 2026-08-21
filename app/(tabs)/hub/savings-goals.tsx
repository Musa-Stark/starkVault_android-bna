import { View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/providers/app-context";
import savingsGoalsForm from "@/components/starkUI/upload/savingsGoal.form";

const savingsGoals = () => {
  const {
    goalName,
    setGoalName,
    goalNameRef,

    targetAmount,
    setTargetAmount,
    targetAmountRef,

    currentAmount,
    setCurrentAmount,
    currentAmountRef,

    deadline,
    setDeadline,
    deadlineRef,

    category,
    setCategory,
    categoryRef,

    uploadForm,
    setUploadForm,
  } = useApp();

    useEffect(() => {
      if (!uploadForm.submit) return;

      console.log({
        goalName,
        targetAmount,
        currentAmount,
        deadline,
        category,
      });

      setUploadForm({
        inputs: undefined,
        name: "",
        show: false,
        submit: false,
      });

      setGoalName("");
      setTargetAmount("");
      setCurrentAmount("");
      setDeadline("");
      setCategory("");
    }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Savings Goals
      </Text>

      {/* title */}
      <Text variant="caption">Set and track your savings goals.</Text>

      {/* button */}
      <Button
        icon={Plus}
        style={{ marginTop: 20 }}
        onPress={() =>
          savingsGoalsForm({
            goalName,
            setGoalName,
            goalNameRef,

            targetAmount,
            setTargetAmount,
            targetAmountRef,

            currentAmount,
            setCurrentAmount,
            currentAmountRef,

            deadline,
            setDeadline,
            deadlineRef,

            category,
            setCategory,
            categoryRef,

            setUploadForm,
          })
        }
      >
        Add Savings Goal
      </Button>

      {/* total savings goals */}
      <Card style={{ marginTop: 20 }}>
        <CardContent
          style={{
            ...globalStyles.flexBoxHorizantal,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text variant="caption" style={{ fontSize: 15 }}>
              Total progress
            </Text>
            <View
              style={{
                ...globalStyles.flexBoxHorizantal,
                justifyContent: "flex-start",
                gap: 10,
                marginTop: 10,
              }}
            >
              <CardTitle>Rs 0</CardTitle>
              <Text variant="caption">of Rs 0</Text>
            </View>
          </View>
          <View>
            <Text variant="heading">33%</Text>
            <Text variant="caption" style={{ fontSize: 15 }}>
              on track
            </Text>
          </View>
        </CardContent>
        <Progress value={33} height={7} style={{ marginTop: 10 }} />
      </Card>

      {/* savings goals */}
      <Card style={{ marginTop: 20, ...globalStyles.flexBoxHorizantal }}>
        <Text variant="caption">No savings goals added yet</Text>
      </Card>
    </View>
  );
};

export default savingsGoals;
