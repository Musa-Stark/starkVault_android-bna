import type {
  SetUploadForm,
  SetString,
  Ref,
} from "@/providers/app-context";

export interface SavingsContribute {
  setUploadForm: SetUploadForm;

  currentAmount: string;
  setCurrentAmount: SetString;
  currentAmountRef: Ref;

  method?: "POST" | "PATCH";
  itemId?: string;

  option?: string;
}

const savingsContribute = ({
  setUploadForm,

  currentAmount,
  setCurrentAmount,
  currentAmountRef,

  method = "POST",
  itemId = "",

  option
}: SavingsContribute) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Savings Goal",
    option,
    method,
    itemId,

    inputs: [
      {
        label: "Current Amount",
        placeholderText: "e.g. 25000",
        inputMode: "numeric",
        value: currentAmount,
        setStringValue: setCurrentAmount,
        ref: currentAmountRef,
        entryKeyHint: "done",
        returnKeyType: "done",
        showErrorText: false,
      },
    ],
  }));
};

export default savingsContribute;
