import React, {
  useContext,
  createContext,
  useState,
  ReactNode,
  useRef,
} from "react";
import type { InputWithLabel } from "@/components/starkUI/input/InputWithLabel";
import { MediaAsset } from "@/components/ui/media-picker";
import type { APIPages } from "@/utils/apiCall";

interface UploadFormInput {
  show: boolean;
  name?: string;
  inputs: InputWithLabel[] | undefined;
  submit: boolean;
  method?: "POST" | "PATCH";
  itemId?: string;
  option?: string;
  page: APIPages | undefined
}

interface DeleteModalInput {
  show: boolean;
  ids: string[];
  page: APIPages | undefined;
  setState: any;
  onDone: () => void;
}

export type SetString = React.Dispatch<React.SetStateAction<string>>;
export type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;
export type SetFile = React.Dispatch<React.SetStateAction<MediaAsset>>;
export type SetDate = React.Dispatch<React.SetStateAction<Date | undefined>>;
export type SetNumber = React.Dispatch<React.SetStateAction<number>>;
export type Ref = React.RefObject<null>;

export type SetUploadForm = React.Dispatch<
  React.SetStateAction<UploadFormInput>
>;

export type SetDeleteModal = React.Dispatch<
  React.SetStateAction<DeleteModalInput>
>;

interface CreateContext {
  uploadForm: UploadFormInput;
  setUploadForm: SetUploadForm;

  deleteModal: DeleteModalInput;
  setDeleteModal: SetDeleteModal;

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

  deadline: Date | undefined;
  setDeadline: SetDate;
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

  expiryDate: Date | undefined;
  setExpiryDate: SetDate;
  expiryDateRef: Ref;

  cvv: string;
  setCvv: SetString;
  cvvRef: Ref;

  bank: string;
  setBank: SetString;
  bankRef: Ref;

  primaryCard: boolean;
  setPrimaryCard: SetBoolean;
  primaryCardRef: Ref;

  file: MediaAsset;
  setFile: SetFile;
  fileRef: Ref;

  noteTitle: string;
  setNoteTitle: SetString;
  noteTitleRef: Ref;

  content: string;
  setContent: SetString;
  contentRef: Ref;

  pin: boolean;
  setPin: SetBoolean;
  pinRef: Ref;

  clearSelection: number;
  setClearSelection: SetNumber;

  deleteOneBusy: boolean;
  setDeleteOneBusy: SetBoolean;

  logoutModel: boolean;
  setLogoutModel: SetBoolean;
}
const AppContext = createContext<CreateContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [uploadForm, setUploadForm] = useState<UploadFormInput>({
    show: false,
    name: "",
    inputs: undefined,
    submit: false,
    method: "POST",
    itemId: "",
    option: "",
    page: undefined
  });

  const [deleteModal, setDeleteModal] = useState<DeleteModalInput>({
    show: false,
    ids: [],
    page: undefined,
    setState: undefined,
    onDone: () => {},
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
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [service, setService] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bank, setBank] = useState("");
  const [brand, setBrand] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [primaryCard, setPrimaryCard] = useState(false);
  const [label, setLabel] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [file, setFile] = useState<MediaAsset>({
    id: "random-id",
    type: "image",
    uri: "https://random-uri.com",
  });
  const [noteTitle, setNoteTitle] = useState("");
  const [content, setContent] = useState("");
  const [pin, setPin] = useState(false);
  const [clearSelection, setClearSelection] = useState(0);
  const [deleteOneBusy, setDeleteOneBusy] = useState(false);
  const [logoutModel, setLogoutModel] = useState(false);

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
  const primaryCardRef = useRef<any>(null);
  const expiryDateRef = useRef<any>(null);
  const fileRef = useRef<any>(null);
  const noteTitleRef = useRef<any>(null);
  const contentRef = useRef<any>(null);
  const pinRef = useRef<any>(null);

  const values: CreateContext = {
    uploadForm,
    setUploadForm,

    deleteModal,
    setDeleteModal,

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

    primaryCard,
    setPrimaryCard,
    primaryCardRef,

    label,
    setLabel,
    labelRef,

    file,
    setFile,
    fileRef,

    noteTitle,
    setNoteTitle,
    noteTitleRef,

    content,
    setContent,
    contentRef,

    pin,
    setPin,
    pinRef,

    clearSelection,
    setClearSelection,

    deleteOneBusy,
    setDeleteOneBusy,

    logoutModel,
    setLogoutModel,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("useApp must be used inside AppProvider");

  return context;
};
