import { View } from "react-native";
import React, { useEffect } from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import handleNoteForm from "@/components/starkUI/upload/notes.form";

const notes = () => {
  const {
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
    uploadForm,
    setUploadForm,
  } = useApp();

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({
      noteTitle,
      content,
      category,
      pin,
    });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setNoteTitle("");
    setContent("");
    setCategory("");
    setPin(false);
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Notes
      </Text>

      <Text variant="caption">Lessons, ideas and reminders</Text>

      <Button
        icon={Plus}
        style={{ marginTop: 20 }}
        onPress={() =>
          handleNoteForm({
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

            setUploadForm,
          })
        }
      >
        New Note
      </Button>
    </View>
  );
};

export default notes;
