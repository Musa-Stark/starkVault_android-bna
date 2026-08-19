import type { SetUploadForm, SetString, Ref } from "@/providers/app-context";

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

  pin: string;
  setPin: SetString;
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
        setValue: setNoteTitle,
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
        setValue: setContent,
        ref: contentRef,
        nextRef: categoryRef,
        entryKeyHint: "next",
        returnKeyType: "next",
        multiline: true,
        showErrorText: false,
      },

      {
        isPicker: true,
        label: "Category",
        placeholderText: "e.g. Personal",
        value: category,
        setValue: setCategory,
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
        label: "Pin",
        placeholderText: "Pin",
      },
    ],
  }));
};

export default handleNoteForm;
