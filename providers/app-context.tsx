import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useRef,
} from "react";
import type { InputWithLabel } from "@/components/starkUI/input/InputWithLabel";

interface UploadFormInput {
  show: boolean;
  name: string;
  inputs: InputWithLabel[] | undefined;
  submit: boolean;
}

export type SetString = React.Dispatch<React.SetStateAction<string>>;
export type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;
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

  source: string;
  setSource: SetString;
  sourceRef: Ref;

  type: string;
  setType: SetString;
  typeRef: Ref;

  subscriptionName: string;
  setSubscriptionName: SetString;
  subscriptionNameRef: Ref;

  billingCycle: string;
  setBillingCycle: SetString;
  billingCycleRef: Ref;

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

  service: string;
  setService: SetString;
  serviceRef: Ref;

  username: string;
  setUsername: SetString;
  usernameRef: Ref;

  password: string;
  setPassword: SetString;
  passwordRef: Ref;

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

  noteTitle: string;
  setNoteTitle: SetString;
  noteTitleRef: Ref;

  content: string;
  setContent: SetString;
  contentRef: Ref;

  pin: boolean;
  setPin: SetBoolean;
  pinRef: Ref;
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
  const [source, setSource] = useState("");
  const [type, setType] = useState("");
  const [subscriptionName, setSubscriptionName] = useState("");
  const [billingCycle, setBillingCycle] = useState("");
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bank, setBank] = useState("");
  const [brand, setBrand] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [label, setLabel] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [content, setContent] = useState("");
  const [pin, setPin] = useState(false);

  const merchantRef = useRef(null);
  const categoryRef = useRef(null);
  const amountRef = useRef(null);
  const sourceRef = useRef(null);
  const typeRef = useRef(null);
  const subscriptionNameRef = useRef(null);
  const billingCycleRef = useRef(null);
  const goalNameRef = useRef(null);
  const targetAmountRef = useRef(null);
  const currentAmountRef = useRef(null);
  const deadlineRef = useRef(null);
  const serviceRef = useRef<any>(null);
  const usernameRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const labelRef = useRef<any>(null);
  const bankRef = useRef<any>(null);
  const brandRef = useRef<any>(null);
  const cardHolderRef = useRef<any>(null);
  const cardNumberRef = useRef<any>(null);
  const cvvRef = useRef<any>(null);
  const expiryDateRef = useRef<any>(null);
  const noteTitleRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const pinRef = useRef<any>(null);

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

    source,
    setSource,
    sourceRef,

    type,
    setType,
    typeRef,

    subscriptionName,
    setSubscriptionName,
    subscriptionNameRef,

    billingCycle,
    setBillingCycle,
    billingCycleRef,

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

    service,
    setService,
    serviceRef,

    username,
    setUsername,
    usernameRef,

    password,
    setPassword,
    passwordRef,

    bank,
    setBank,
    bankRef,

    brand,
    setBrand,
    brandRef,

    cardHolder,
    setCardHolder,
    cardHolderRef,

    cardNumber,
    setCardNumber,
    cardNumberRef,

    cvv,
    setCvv,
    cvvRef,

    expiryDate,
    setExpiryDate,
    expiryDateRef,

    label,
    setLabel,
    labelRef,

    noteTitle,
    setNoteTitle,
    noteTitleRef,

    content,
    setContent,
    contentRef,

    pin,
    setPin,
    pinRef,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("useApp must be used inside AppProvider");

  return context;
};
