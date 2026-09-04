import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";
import { APIPages } from "@/utils/apiCall";

export interface ExpenseForm {
  setUploadForm: SetUploadForm;
  merchant: string;
  setMerchant: SetString;
  merchantRef: Ref;
  category: string;
  setCategory: SetString;
  categoryRef: Ref;
  amount: string;
  setAmount: SetString;
  amountRef: Ref;
  method?: "POST" | "PATCH";
  itemId?: string;
  page: APIPages
}

const handleExpenseForm = ({
  setUploadForm,
  merchant,
  setMerchant,
  merchantRef,
  category,
  setCategory,
  categoryRef,
  amount,
  setAmount,
  amountRef,
  method = "POST",
  itemId = "",
  page
}: ExpenseForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Expense",
    method,
    itemId,
    page,

    inputs: [
      {
        label: "Merchant",
        placeholderText: "Enter merchant name",
        value: merchant as string,
        setStringValue: setMerchant,
        ref: merchantRef,
        nextRef: categoryRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        inputType: "picker",
        label: "Category",
        placeholderText: "Select category",
        value: category,
        setStringValue: setCategory,
        ref: categoryRef,
        nextRef: amountRef,
        showErrorText: false,
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
        setStringValue: setAmount,
        ref: amountRef,
        showErrorText: false,
      },
    ],
  }));
};

export default handleExpenseForm;
