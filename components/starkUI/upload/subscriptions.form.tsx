import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";

export interface SubscriptionForm {
  setUploadForm: SetUploadForm;

  subscriptionName: string;
  setSubscriptionName: SetString;
  subscriptionNameRef: Ref;

  amount: string;
  setAmount: SetString;
  amountRef: Ref;

  billingCycle: string;
  setBillingCycle: SetString;
  billingCycleRef: Ref;

  category: string;
  setCategory: SetString;
  categoryRef: Ref;

  method?: "POST" | "PATCH";
  itemId?: string;
}

const handleSubscriptionForm = ({
  setUploadForm,

  subscriptionName,
  setSubscriptionName,
  subscriptionNameRef,

  amount,
  setAmount,
  amountRef,

  billingCycle,
  setBillingCycle,
  billingCycleRef,

  category,
  setCategory,
  categoryRef,

  method = "POST",
  itemId = "",
}: SubscriptionForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Subscription",
    method,
    itemId,

    inputs: [
      {
        label: "Subscription Name",
        placeholderText: "Enter subscription name",
        value: subscriptionName,
        setStringValue: setSubscriptionName,
        ref: subscriptionNameRef,
        nextRef: amountRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Cost",
        placeholderText: "Enter cost",
        inputMode: "numeric",
        value: amount,
        setStringValue: setAmount,
        ref: amountRef,
        nextRef: billingCycleRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        inputType: "picker",
        label: "Billing Cycle",
        placeholderText: "Select billing cycle",
        value: billingCycle,
        setStringValue: setBillingCycle,
        ref: billingCycleRef,
        nextRef: categoryRef,
        showErrorText: false,
        pickerOptions: [
          { label: "Daily", value: "Daily" },
          { label: "Weekly", value: "Weekly" },
          { label: "Monthly", value: "Monthly" },
          { label: "Quarterly", value: "Quarterly" },
          { label: "Yearly", value: "Yearly" },
        ],
      },

      {
        inputType: "picker",
        label: "Category",
        placeholderText: "Select category",
        value: category,
        setStringValue: setCategory,
        ref: categoryRef,
        showErrorText: false,
        pickerOptions: [
          { label: "Entertainment", value: "Entertainment" },
          { label: "Software", value: "Software" },
          { label: "Streaming", value: "Streaming" },
          { label: "Music", value: "Music" },
          { label: "Gaming", value: "Gaming" },
          { label: "Fitness", value: "Fitness" },
          { label: "News & Magazines", value: "News & Magazines" },
          { label: "Education", value: "Education" },
          { label: "Cloud Storage", value: "Cloud Storage" },
          {
            label: "Other",
            value: "Other",
            description: "Any subscription category not listed above",
          },
        ],
      },
    ],
  }));
};

export default handleSubscriptionForm;
