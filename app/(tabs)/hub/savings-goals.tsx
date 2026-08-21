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
import SavingsGoalCard from "@/components/starkUI/list/SavingsCard";
import { ScrollView } from "react-native-gesture-handler";

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

  const inputSavingsGoalCategories = [
    {
      name: "Travel",
      color: "#bfdbfe",
    },
    {
      name: "Emergency",
      color: "#fecaca",
    },
    {
      name: "Technology",
      color: "#ddd6fe",
    },
    {
      name: "Vehicle",
      color: "#fde68a",
    },
    {
      name: "Home",
      color: "#bbf7d0",
    },
    {
      name: "Education",
      color: "#fbcfe8",
    },
  ];

  const savings = [
    {
      _id: "goal_001",
      goalName: "Japan Trip",
      category: "Travel",
      targetAmount: 3000,
      currentAmount: 1850,
      deadline: "2027-04-15",
    },
    {
      _id: "goal_002",
      goalName: "Emergency Fund",
      category: "Emergency",
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: "2027-01-01",
    },
    {
      _id: "goal_003",
      goalName: "New MacBook",
      category: "Technology",
      targetAmount: 2500,
      currentAmount: 2200,
      deadline: "2026-12-15",
    },
    {
      _id: "goal_004",
      goalName: "New Car",
      category: "Vehicle",
      targetAmount: 15000,
      currentAmount: 5250,
      deadline: "2028-06-01",
    },
    {
      _id: "goal_005",
      goalName: "Home Renovation",
      category: "Home",
      targetAmount: 8000,
      currentAmount: 8000,
      deadline: "2026-11-30",
    },
    {
      _id: "goal_006",
      goalName: "Online Course",
      category: "Education",
      targetAmount: 1200,
      currentAmount: 300,
      deadline: "2027-02-20",
    },
  ];

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Savings Goals
      </Text>

      <ScrollView>
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
        <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
          <Text variant="caption">No savings goals added yet</Text>
        </Card>

        <View style={{ gap: 12, marginVertical: 20 }}>
          {savings.map((goal) => (
            <SavingsGoalCard
              key={goal._id}
              goal={goal}
              categories={inputSavingsGoalCategories}
              onEdit={(goal) => {
                console.log("Edit:", goal);
              }}
              onDelete={(goal) => {
                console.log("Delete:", goal);
              }}
              onContribute={(goal) => {
                console.log("Contribute:", goal);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default savingsGoals;
