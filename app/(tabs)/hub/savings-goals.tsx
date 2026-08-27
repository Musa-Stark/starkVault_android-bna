import { View } from "react-native";
import React, { useEffect, useState } from "react";
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
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";

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

  const savingsGoalCategories = [
  {
    name: "Emergency Fund",
    color: "#fecaca",
  },
  {
    name: "Travel",
    color: "#bfdbfe",
  },
  {
    name: "Education",
    color: "#fbcfe8",
  },
  {
    name: "Home",
    color: "#bbf7d0",
  },
  {
    name: "Car",
    color: "#fde68a",
  },
  {
    name: "Electronics",
    color: "#ddd6fe",
  },
  {
    name: "Wedding",
    color: "#f5d0fe",
  },
  {
    name: "Investment",
    color: "#a7f3d0",
  },
  {
    name: "Health",
    color: "#fed7aa",
  },
  {
    name: "Personal",
    color: "#bae6fd",
  },
  {
    name: "Other",
    color: "#e5e7eb",
  },
];

  interface SavingsGoals {
    _id: string;
    goalName: string;
    category: (typeof savingsGoalCategories)[number]["name"];
    targetAmount: number;
    currentAmount: number;
    deadline: Date | undefined;
  }

  const [savings, setSavings] = useState<SavingsGoals[]>([]);

  const apiCall = useAPICall();
  const { toast } = useToast();

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  // fetch - GET
  useEffect(() => {
    const fetchSubscriptions = async () => {
      const response = await apiCall({ page: "savings-goals", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItemState("notFound");
        return;
      }

      console.log(response.data)

      setSavings([
        ...response.data.map((el: SavingsGoals) => ({
          _id: el._id,
          category: el.category,
          currentAmount: el.currentAmount,
          deadline: el.deadline,
          goalName: el.goalName,
          targetAmount: el.targetAmount,
        })),
      ]);

      setItemState("found");
    };

    fetchSubscriptions();
  }, []);

  // upload - POST
  useEffect(() => {
    const uploadSubscription = async () => {
      if (!uploadForm.submit) return;

      const response = await apiCall({
        page: "savings-goals",
        data: {
          goalName,
          targetAmount,
          currentAmount,
          deadline,
          category,
        },
        method: "POST",
      });

      console.log("POST /savings-goals: ", response);

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      setSavings((prev) => [
        ...prev,
        {
          _id: response.data._id,
          category: response.data.category,
          currentAmount: response.data.currentAmount,
          deadline: response.data.deadline,
          goalName: response.data.goalName,
          targetAmount: response.data.targetAmount,
        },
      ]);

      setItemState("found");

      setUploadForm({
        inputs: undefined,
        name: "",
        show: false,
        submit: false,
      });

      setGoalName("");
      setTargetAmount("");
      setCurrentAmount("");
      setDeadline(undefined);
      setCategory("");
    };

    uploadSubscription();
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      {/* heading */}
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Savings Goals
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
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
              categories={savingsGoalCategories}
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
