import type {
  SetUploadForm,
  SetString,
  Ref,
  SetBoolean,
} from "@/providers/app-context";

export interface NoteForm {
  setUploadForm: SetUploadForm;

  noteTitle: string;
  setNoteTitle: SetString;
  noteTitleRef: Ref;

  content: string;
  setContent: SetString;
  contentRef: Ref;

  category: string;
  setCategory: SetString;
  categoryRef: Ref;

  pin: boolean;
  setPin: SetBoolean;
  pinRef: Ref;
}

const handleNoteForm = ({
  setUploadForm,
  noteTitle,
  setNoteTitle,
  noteTitleRef,
  content,
  setContent,
  contentRef,
  category,
  setCategory,
  categoryRef,
  pin,
  setPin,
  pinRef,
}: NoteForm) => {
  setUploadForm((prev) => ({
    ...prev,
    show: true,
    name: "Note",

    inputs: [
      {
        label: "Title",
        placeholderText: "e.g. Meeting Notes",
        value: noteTitle,
        setStringValue: setNoteTitle,
        ref: noteTitleRef,
        nextRef: contentRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
      },

      {
        label: "Content",
        placeholderText: "Write your note...",
        value: content,
        setStringValue: setContent,
        ref: contentRef,
        nextRef: categoryRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        multiline: true,
        showErrorText: false,
      },

      {
        inputType: "picker",
        label: "Category",
        placeholderText: "e.g. Personal",
        value: category,
        setStringValue: setCategory,
        ref: categoryRef,
        nextRef: pinRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        showErrorText: false,
        pickerOptions: [
          { label: "Personal", value: "Personal" },
          { label: "Work", value: "Work" },
          { label: "Ideas", value: "Ideas" },
          { label: "Todo", value: "Todo" },
          { label: "Other", value: "Other" },
        ],
      },
      {
        checkboxAccessibilityLabel: "Pin",
        inputType: "checkbox",
        value: pin,
        setBooleanValue: setPin,
        ref: pinRef,
      },
    ],
  }));
};

export default handleNoteForm;
