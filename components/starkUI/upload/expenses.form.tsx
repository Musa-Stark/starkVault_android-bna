import type { SetUploadForm } from "@/providers/app-context";
import type { Dispatch, SetStateAction } from "react";

export interface ExpenseForm {
  setUploadForm: SetUploadForm;

  merchant: string;
  setMerchant: Dispatch<SetStateAction<string>>;

  category: string;
  setCategory: Dispatch<SetStateAction<string>>;

  amount: string;
  setAmount: Dispatch<SetStateAction<string>>;
}

const handleExpenseForm = ({
  setUploadForm,
  merchant,
  setMerchant,
  category,
  setCategory,
  amount,
  setAmount,
}: ExpenseForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Expense",

    inputs: [
      {
        label: "Merchant",
        placeholderText: "Enter merchant name",
        value: merchant,
        setValue: setMerchant,
      },

      {
        isPicker: true,
        label: "Category",
        placeholderText: "Select category",
        value: category,
        setValue: setCategory,

        pickerOptions: [
          { label: "Food & Dining", value: "Food & Dining" },
          { label: "Housing", value: "Housing" },
          { label: "Transportation", value: "Transportation" },
          { label: "Shopping", value: "Shopping" },
          { label: "Health", value: "Health" },
          { label: "Entertainment", value: "Entertainment" },
          { label: "Bills & Subscriptions", value: "Bills & Subscriptions" },
          { label: "Travel", value: "Travel" },
          { label: "Education", value: "Education" },
          { label: "Family & Personal", value: "Family & Personal" },
          { label: "Finance", value: "Finance" },
          {
            label: "Other",
            value: "Other",
            description:
              "This means any category other than the above mentioned",
          },
        ],
      },

      {
        label: "Amount",
        placeholderText: "Enter amount",
        inputMode: "numeric",
        value: amount,
        setValue: setAmount,
      },
    ],
  }));
};

export default handleExpenseForm;