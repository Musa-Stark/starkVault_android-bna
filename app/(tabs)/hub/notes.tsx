import { View } from "react-native";
import React, { useEffect } from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import handleNoteForm from "@/components/starkUI/upload/notes.form";
import NoteCard from "@/components/starkUI/list/NoteCard";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "@/components/ui/card";

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

      <ScrollView showsVerticalScrollIndicator={false}>
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

        <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
          <Text variant="caption">No notes added yet</Text>
        </Card>

        {/* notes */}
        <View style={{ marginVertical: 20 }}>
          <NoteCard
            note={{
              _id: "1",
              title: "Meeting Notes",
              content: "Discuss the new dashboard design, API integration, and release timeline. Discuss the new dashboard design, \n\n\nAPI integration, and release timeline. Discuss the new dashboard design, API integration, and release timeline. Discuss the new dashboard design, API integration, and release timeline.",
              category: "Work",
              pinned: true,
              updatedAt: new Date().toISOString(),
            }}
            onView={(note) => {
              console.log("View", note);
            }}
            onEdit={(note) => {
              console.log("Edit", note);
            }}
            onDelete={(note) => {
              console.log("Delete", note);
            }}
            onTogglePin={(note) => {
              console.log("Toggle pin", note);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default notes;
