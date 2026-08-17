import React, { useContext, createContext, useState, ReactNode } from "react";
import type { InputWithLabel } from "@/components/starkUI/auth/InputWithLabel";

interface UploadFormInput {
  show: boolean;
  name: string;
  inputs: InputWithLabel[] | undefined;
}

export type SetUploadForm = React.Dispatch<React.SetStateAction<UploadFormInput>>

interface CreateContext {
  uploadForm: UploadFormInput;
  setUploadForm: SetUploadForm;
}

const AppContext = createContext<CreateContext | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [uploadForm, setUploadForm] = useState<UploadFormInput>({
    show: false,
    name: "Service Name",
    inputs: undefined,
  });

  const values: CreateContext = { uploadForm, setUploadForm };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) throw new Error("useApp must be used inside AppProvider");

  return context;
};
