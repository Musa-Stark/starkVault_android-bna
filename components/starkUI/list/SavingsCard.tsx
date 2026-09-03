import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import { Calendar, Trash2, Pen, Plus } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useColor } from "@/hooks/useColor";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-context";

type SavingsGoal = {
  _id: string;
  goalName: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | undefined;
};

type SavingsGoalCategory = {
  name: string;
  color: string;
};

type Props = {
  goal: SavingsGoal;
  categories: SavingsGoalCategory[];

  onEdit: (goal: SavingsGoal) => void;
  onDelete: (goal: SavingsGoal) => void;
  onContribute: (goal: SavingsGoal) => void;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function SavingsGoalCard({
  goal,
  categories,
  onEdit,
  onDelete,
  onContribute,
}: Props) {
  const { deleteOneBusy } = useApp();

  const foreground = useColor("foreground");
  const mutedForeground = useColor("mutedForeground");
  const background = useColor("background");
  const cardColor = useColor("card");
  const borderColor = useColor("border");

  const targetAmount = Number(goal.targetAmount);
  const currentAmount = Number(goal.currentAmount);

  const percentage = useMemo(() => {
    if (targetAmount <= 0) return 0;

    return Math.min(100, Math.round((currentAmount / targetAmount) * 100));
  }, [currentAmount, targetAmount]);

  const remaining = Math.max(0, targetAmount - currentAmount);

  const category = categories.find((item) => item.name === goal.category);

  return (
    <View
      style={{
        padding: 18,
        borderRadius: 16,
        backgroundColor: cardColor,
        borderWidth: 1,
        borderColor,
        elevation: 1,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Goal name + category */}
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: foreground,
            }}
          >
            {goal.goalName}
          </Text>

          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 6,
              paddingHorizontal: 9,
              paddingVertical: 4,
              borderRadius: 999,
              backgroundColor: category?.color ?? background,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "500",
                color: "black",
              }}
            >
              {goal.category}
            </Text>
          </View>
        </View>

        {/* Percentage */}
        <Text
          style={{
            fontSize: 24,
            fontWeight: "700",
            color: foreground,
          }}
        >
          {percentage}%
        </Text>
      </View>

      {/* Progress bar */}
      <View
        style={{
          height: 8,
          marginTop: 16,
          overflow: "hidden",
          borderRadius: 999,
          backgroundColor: background,
        }}
      >
        <View
          style={{
            width: `${percentage}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: foreground,
          }}
        />
      </View>

      {/* Current / target + deadline */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: foreground,
            }}
          >
            {formatCurrency(currentAmount)}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: mutedForeground,
            }}
          >
            {" "}
            / {formatCurrency(targetAmount)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Calendar size={14} color={mutedForeground} />

          {goal.deadline && (
            <Text
              variant="caption"
              style={{
                fontSize: 12,
              }}
            >
              {formatDate(goal.deadline.toString())}
            </Text>
          )}
        </View>
      </View>

      {/* Bottom information + actions */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: 18,
          paddingTop: 14,
          borderTopWidth: 1,
          borderTopColor: borderColor,
        }}
      >
        {/* Remaining */}
        <View>
          <Text
            variant="caption"
            style={{
              fontSize: 12,
            }}
          >
            Remaining
          </Text>

          <Text
            style={{
              marginTop: 3,
              fontSize: 14,
              fontWeight: "700",
              color: foreground,
            }}
          >
            {formatCurrency(remaining)}
          </Text>
        </View>

        {/* Actions */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Button
            onPress={() => onEdit(goal)}
            hitSlop={8}
            style={{
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
            }}
            size="icon"
            variant="ghost"
            disabled={deleteOneBusy}
          >
            <Pen size={18} color={mutedForeground} />
          </Button>

          <Button
            onPress={() => onDelete(goal)}
            hitSlop={8}
            style={{
              width: 38,
              height: 38,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
            }}
            size="icon"
            variant="ghost"
            loading={deleteOneBusy}
            disabled={deleteOneBusy}
          >
            <Trash2 size={18} color="#ef4444" />
          </Button>
        </View>
      </View>

      {/* Contribute */}
      <Button
        onPress={() => onContribute(goal)}
        style={{
          height: 46,
          marginTop: 16,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          borderRadius: 999,
          backgroundColor: foreground,
        }}
      >
        <Plus size={16} color={background} />

        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: background,
          }}
        >
          Contribute
        </Text>
      </Button>
    </View>
  );
}
