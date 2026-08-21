import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";

export interface PasswordForm {
  setUploadForm: SetUploadForm;
  service: string;
  setService: SetString;
  serviceRef: Ref;
  username: string;
  setUsername: SetString;
  usernameRef: Ref;
  password: string;
  setPassword: SetString;
  passwordRef: Ref;
}

const handlePasswordForm = ({
  setUploadForm,
  service,
  setService,
  serviceRef,
  username,
  setUsername,
  usernameRef,
  password,
  setPassword,
  passwordRef,
}: PasswordForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Password",

    inputs: [
      {
        label: "Service",
        placeholderText: "e.g. Google",
        value: service,
        setStringValue: setService,
        ref: serviceRef,
        nextRef: usernameRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Username",
        placeholderText: "e.g. Musa Stark",
        value: username,
        setStringValue: setUsername,
        ref: usernameRef,
        nextRef: passwordRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Password",
        placeholderText: "••••••••••••",
        value: password,
        setStringValue: setPassword,
        ref: passwordRef,
        secureTextEntry: true,
        showErrorText: false,
      },
    ],
  }));
};

export default handlePasswordForm;