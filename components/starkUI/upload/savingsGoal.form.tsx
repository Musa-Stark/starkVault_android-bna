import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";

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

  deadline: string;
  setDeadline: SetString;
  deadlineRef: Ref;

  category: string;
  setCategory: SetString;
  categoryRef: Ref;
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
}: SavingsGoalForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Savings Goal",

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
        label: "Deadline",
        placeholderText: "e.g. 31 Dec 2026",
        value: deadline,
        setStringValue: setDeadline,
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
