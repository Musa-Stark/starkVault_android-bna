import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useRef,
} from "react";
import type { InputWithLabel } from "@/components/starkUI/auth/InputWithLabel";

interface UploadFormInput {
  show: boolean;
  name: string;
  inputs: InputWithLabel[] | undefined;
  submit: boolean;
}

export type SetString = React.Dispatch<React.SetStateAction<string>>;
export type Ref = React.RefObject<null>;

export type SetUploadForm = React.Dispatch<
  React.SetStateAction<UploadFormInput>
>;

interface CreateContext {
  uploadForm: UploadFormInput;
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
}

const AppContext = createContext<CreateContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [uploadForm, setUploadForm] = useState<UploadFormInput>({
    show: false,
    name: "Service Name",
    inputs: undefined,
    submit: false,
  });

  const [merchant, setMerchant] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const merchantRef = useRef(null);
  const categoryRef = useRef(null);
  const amountRef = useRef(null);

  const values: CreateContext = {
    uploadForm,
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
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("useApp must be used inside AppProvider");

  return context;
};
