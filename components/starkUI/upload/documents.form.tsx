import type {
  SetFile,
  SetUploadForm,
  Ref,
} from "@/providers/app-context";
import { MediaAsset } from "@/components/ui/media-picker";

export interface DocumentForm {
  setUploadForm: SetUploadForm;

  file: MediaAsset;
  setFile: SetFile;
  fileRef: Ref;
}

const handleDocumentForm = ({
  setUploadForm,
  file,
  setFile,
  fileRef,
}: DocumentForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Document",

    inputs: [
      {
        inputType: "mediaPicker",
        label: "File",
        placeholderText: "Select document",
        value: file,
        setFileValue: setFile,
        ref: fileRef,
        showErrorText: false,
      },
    ],
  }));
};

export default handleDocumentForm;
