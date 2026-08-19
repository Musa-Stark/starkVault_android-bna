import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";

export interface IncomeForm {
  setUploadForm: SetUploadForm;
  source: string;
  setSource: SetString;
  sourceRef: Ref;
  type: string;
  setType: SetString;
  typeRef: Ref;
  amount: string;
  setAmount: SetString;
  amountRef: Ref;
}

const handleIncomeForm = ({
  setUploadForm,
  source,
  setSource,
  sourceRef,
  type,
  setType,
  typeRef,
  amount,
  setAmount,
  amountRef,
}: IncomeForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Income",

    inputs: [
      {
        label: "Source",
        placeholderText: "Enter source name",
        value: source,
        setValue: setSource,
        ref: sourceRef,
        nextRef: typeRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        isPicker: true,
        label: "Type",
        placeholderText: "Select type",
        value: type,
        setValue: setType,
        ref: typeRef,
        nextRef: amountRef,
        showErrorText: false,
        pickerOptions: [
          { label: "Salary", value: "Salary" },
          { label: "Freelance", value: "Freelance" },
          { label: "Business", value: "Business" },
          { label: "Investment", value: "Investment" },
          { label: "Interest", value: "Interest" },
          { label: "Rental Income", value: "Rental Income" },
          { label: "Bonus", value: "Bonus" },
          { label: "Gift", value: "Gift" },
          { label: "Refund", value: "Refund" },
          { label: "Dividends", value: "Dividends" },
          { label: "Pension", value: "Pension" },
          {
            label: "Other",
            value: "Other",
            description: "Any income source not listed above",
          },
        ],
      },

      {
        label: "Amount",
        placeholderText: "Enter amount",
        inputMode: "numeric",
        value: amount,
        setValue: setAmount,
        ref: amountRef,
        showErrorText: false,
      },
    ],
  }));
};

export default handleIncomeForm;
