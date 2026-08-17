import type { SetUploadForm } from "@/providers/app-context";

const handleExpenseForm = ({
  setUploadForm,
}: {
  setUploadForm: SetUploadForm;
}) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    inputs: [
      {
        label: "Email",
        placeholderText: "you@example.com",
      },
      {
        label: "Password",
        placeholderText: "At least 6 characters",
      },
      {
        isPicker: true,
        label: "Category",
        placeholderText: "Select category",
      },
    ],
  }));
};

export default handleExpenseForm;
