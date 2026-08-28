import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/providers/app-context";
import handleSavingsGoalsForm from "@/components/starkUI/upload/savingsGoal.form";
import SavingsGoalCard from "@/components/starkUI/list/SavingsCard";
import { ScrollView } from "react-native-gesture-handler";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";
import SavingsGoalCardSkeleton from "@/components/starkUI/skeleton/SavingsGoalsSkeleton";

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

  interface SavingsGoal {
    _id: string;
    goalName: string;
    category: (typeof savingsGoalCategories)[number]["name"];
    targetAmount: number;
    currentAmount: number;
    deadline: Date | undefined;
  }

  const [savings, setSavings] = useState<SavingsGoal[]>([]);

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

      setSavings([
        ...response.data.map((el: SavingsGoal) => ({
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
        method: uploadForm.method!,
        itemId: uploadForm.itemId,
      });

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      if (uploadForm.method === "POST") {
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
      } else {
        setSavings((prev) => [
          ...prev.map((el) =>
            el._id === response.data._id
              ? ({
                  _id: response.data._id,
                  category: response.data.category,
                  currentAmount: response.data.currentAmount,
                  deadline: response.data.deadline,
                  goalName: response.data.goalName,
                  targetAmount: response.data.targetAmount,
                } satisfies SavingsGoal)
              : el,
          ),
        ]);
      }

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

  const savingsGoalsScreens = {
    found: (
      <View style={{ gap: 12, marginVertical: 20 }}>
        {savings.map((goal) => (
          <SavingsGoalCard
            key={goal._id}
            goal={goal}
            categories={savingsGoalCategories}
            onEdit={(item) => {
              const newCurrentAmount = item.currentAmount.toString();
              const newTargetAmount = item.targetAmount.toString();
              const newCategory = item.category;
              const newDeadline = new Date(item.deadline!);
              const newGoalName = item.goalName;

              setCurrentAmount(newCurrentAmount)
              setCategory(newCategory);
              setDeadline(newDeadline);
              setTargetAmount(newTargetAmount)
              setGoalName(newGoalName)

              handleSavingsGoalsForm({
                goalName: newGoalName,
                setGoalName,
                goalNameRef,

                currentAmount: newCurrentAmount,
                setCurrentAmount,
                currentAmountRef,

                targetAmount: newTargetAmount,
                setTargetAmount,
                targetAmountRef,

                category: newCategory,
                setCategory,
                categoryRef,

                deadline: newDeadline,
                setDeadline,
                deadlineRef,

                setUploadForm,

                method: "PATCH",
                itemId: item._id,
              });
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
    ),
    notFound: (
      <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
        <Text variant="caption">No savings goals added yet</Text>
      </Card>
    ),
    fetching: <SavingsGoalCardSkeleton count={2} />,
  };

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
            handleSavingsGoalsForm({
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
        {savingsGoalsScreens[itemState]}
      </ScrollView>
    </View>
  );
};

export default savingsGoals;
