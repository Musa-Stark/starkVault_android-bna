import type {
  SetUploadForm,
  SetString,
  SetDate,
  Ref,
} from "@/providers/app-context";

export interface SavingsGoalForm {
  setUploadForm: SetUploadForm;

  goalName: string;
  setGoalName: SetString;
  goalNameRef: Ref;

  targetAmount: string;
  setTargetAmount: SetString;
  targetAmountRef: Ref;

  currentAmount: string;
  setCurrentAmount: SetString;
  currentAmountRef: Ref;

  deadline: Date | undefined;
  setDeadline: SetDate;
  deadlineRef: Ref;

  category: string;
  setCategory: SetString;
  categoryRef: Ref;

  method?: "POST" | "PATCH";
  itemId?: string;
}

const savingsGoalsForm = ({
  setUploadForm,

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

  method = "POST",
  itemId = "",
}: SavingsGoalForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Savings Goal",
    method,
    itemId,

    inputs: [
      {
        label: "Goal Name",
        placeholderText: "e.g. New Laptop",
        value: goalName,
        setStringValue: setGoalName,
        ref: goalNameRef,
        nextRef: targetAmountRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Target Amount",
        placeholderText: "e.g. 150000",
        inputMode: "numeric",
        value: targetAmount,
        setStringValue: setTargetAmount,
        ref: targetAmountRef,
        nextRef: currentAmountRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Current Amount",
        placeholderText: "e.g. 25000",
        inputMode: "numeric",
        value: currentAmount,
        setStringValue: setCurrentAmount,
        ref: currentAmountRef,
        nextRef: deadlineRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },
      {
        inputType: "datePicker",
        label: "Deadline",
        placeholderText: "e.g. 27 Aug 2026",
        value: deadline,
        setDateValue: setDeadline,
        ref: deadlineRef,
        nextRef: categoryRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },
      {
        inputType: "picker",
        label: "Category",
        placeholderText: "e.g. Travel",
        value: category,
        setStringValue: setCategory,
        ref: categoryRef,
        showErrorText: false,
        pickerOptions: [
          { label: "Emergency Fund", value: "Emergency Fund" },
          { label: "Travel", value: "Travel" },
          { label: "Education", value: "Education" },
          { label: "Home", value: "Home" },
          { label: "Car", value: "Car" },
          { label: "Electronics", value: "Electronics" },
          { label: "Wedding", value: "Wedding" },
          { label: "Investment", value: "Investment" },
          { label: "Health", value: "Health" },
          { label: "Personal", value: "Personal" },
          {
            label: "Other",
            value: "Other",
            description: "Any savings goal category not listed above",
          },
        ],
      },
    ],
  }));
};

export default savingsGoalsForm;
