import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";

export interface CardForm {
  setUploadForm: SetUploadForm;

  label: string;
  setLabel: SetString;
  labelRef: Ref;

  brand: string;
  setBrand: SetString;
  brandRef: Ref;

  cardNumber: string;
  setCardNumber: SetString;
  cardNumberRef: Ref;

  cardHolder: string;
  setCardHolder: SetString;
  cardHolderRef: Ref;

  expiryDate: string;
  setExpiryDate: SetString;
  expiryDateRef: Ref;

  cvv: string;
  setCvv: SetString;
  cvvRef: Ref;

  bank: string;
  setBank: SetString;
  bankRef: Ref;
}

const handleCardForm = ({
  setUploadForm,
  label,
  setLabel,
  labelRef,
  brand,
  setBrand,
  brandRef,
  cardNumber,
  setCardNumber,
  cardNumberRef,
  cardHolder,
  setCardHolder,
  cardHolderRef,
  expiryDate,
  setExpiryDate,
  expiryDateRef,
  cvv,
  setCvv,
  cvvRef,
  bank,
  setBank,
  bankRef,
}: CardForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Card",

    inputs: [
      {
        label: "Label",
        placeholderText: "e.g. Main Credit Card",
        value: label,
        setStringValue: setLabel,
        ref: labelRef,
        nextRef: brandRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        inputType: "picker",
        label: "Brand",
        placeholderText: "e.g. Visa",
        value: brand,
        setStringValue: setBrand,
        ref: brandRef,
        nextRef: cardNumberRef,
        showErrorText: false,
        pickerOptions: [
          { label: "Visa", value: "Visa" },
          { label: "Mastercard", value: "Mastercard" },
          { label: "American Express", value: "American Express" },
          { label: "NayaPay", value: "NayaPay" },
          { label: "SadaPay", value: "SadaPay" },
          { label: "HBL", value: "HBL" },
          { label: "Meezan Bank", value: "Meezan Bank" },
          { label: "UBL", value: "UBL" },
          { label: "Bank Alfalah", value: "Bank Alfalah" },
          { label: "Easypaisa", value: "Easypaisa" },
          { label: "JazzCash", value: "JazzCash" },
        ],
      },

      {
        label: "Card Number",
        placeholderText: "e.g. 4242 4242 4242 4242",
        value: cardNumber,
        setStringValue: setCardNumber,
        ref: cardNumberRef,
        nextRef: cardHolderRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        inputMode: "numeric",
        showErrorText: false,
      },

      {
        label: "Cardholder Name",
        placeholderText: "e.g. Musa Stark",
        value: cardHolder,
        setStringValue: setCardHolder,
        ref: cardHolderRef,
        nextRef: expiryDateRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Expiry Date",
        placeholderText: "e.g. 08/29",
        value: expiryDate,
        setStringValue: setExpiryDate,
        ref: expiryDateRef,
        nextRef: cvvRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "CVV",
        placeholderText: "e.g. 123",
        value: cvv,
        setStringValue: setCvv,
        ref: cvvRef,
        nextRef: bankRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        inputMode: "numeric",
        secureTextEntry: true,
        showErrorText: false,
      },

      {
        label: "Bank",
        placeholderText: "e.g. Meezan Bank",
        value: bank,
        setStringValue: setBank,
        ref: bankRef,
        showErrorText: false,
      },
    ],
  }));
};

export default handleCardForm;
