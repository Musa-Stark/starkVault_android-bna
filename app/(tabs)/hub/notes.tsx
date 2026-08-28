import { View } from "react-native";
import React, { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import handleNoteForm from "@/components/starkUI/upload/notes.form";
import NoteCard from "@/components/starkUI/list/NoteCard";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "@/components/ui/card";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";
import NoteCardSkeleton from "@/components/starkUI/skeleton/NoteCardSkeleton";

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

  interface Note {
    _id: string;
    title: string;
    content: string;
    category: string;
    pin: boolean;
    updatedAt: string;
  }

  const [notes, setNotes] = useState<Note[]>([]);

  const apiCall = useAPICall();
  const { toast } = useToast();

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  // fetch - GET
  useEffect(() => {
    const fetch = async () => {
      const response = await apiCall({ page: "notes", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItemState("notFound");
        return;
      }

      setNotes(
        response.data.map((note: any) => ({
          _id: note._id,
          category: note.category,
          content: note.content,
          pin: note.pin,
          title: note.noteTitle,
          updatedAt: note.updatedAt,
        })),
      );

      setItemState("found");
    };

    fetch();
  }, []);

  // upload - POST
  useEffect(() => {
    const upload = async () => {
      if (!uploadForm.submit) return;

      const response = await apiCall({
        page: "notes",
        data: {
          noteTitle,
          content,
          category,
          pin,
        },
        method: uploadForm.method!,
        itemId: uploadForm.itemId,
      });

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      if (uploadForm.method === "POST") {
        setNotes((prev) => [
          ...prev,
          {
            _id: response.data._id,
            category: response.data.category,
            content: response.data.content,
            pin: response.data.pin,
            title: response.data.noteTitle,
            updatedAt: response.data.updatedAt,
          },
        ]);
      } else {
        setNotes((prev) => [
          ...prev.map((el) =>
            el._id === response.data._id
              ? ({
                  _id: response.data._id,
                  category: response.data.category,
                  content: response.data.content,
                  pin: response.data.pin,
                  title: response.data.noteTitle,
                  updatedAt: response.data.updatedAt,
                } satisfies Note)
              : el,
          ),
        ]);
      }

      setItemState("found");

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
    };

    upload();
  }, [uploadForm.submit]);

  // handlePin
  const handleNotePin = async (id: string, pin: boolean) => {
    setNotes((prev) =>
      prev.map((note) =>
        note._id === id
          ? {
              ...note,
              pin: !pin,
            }
          : note,
      ),
    );

    const response = await apiCall({
      page: "notes",
      data: {
        pin,
      },
      method: "PATCH",
      itemId: id,
      option: "pin",
    });

    if (!response.success) {
      toast.error(response.message || "Something went wrong");
      setNotes((prev) =>
        prev.map((note) =>
          note._id === id
            ? {
                ...note,
                pin: pin,
              }
            : note,
        ),
      );
    }
  };

  const notesScreens = {
    notFound: (
      <Card style={{ marginTop: 20, ...globalStyles.flexBox }}>
        <Text variant="caption">No notes added yet</Text>
      </Card>
    ),
    fetching: (
      <View style={{ marginTop: 10, gap: 10 }}>
        <NoteCardSkeleton />
        <NoteCardSkeleton />
      </View>
    ),
    found: (
      <View style={{ marginVertical: 20, gap: 10 }}>
        {notes.map((note) => (
          <NoteCard
            key={note._id}
            note={{
              _id: note._id,
              title: note.title,
              content: note.content,
              category: note.category,
              pin: note.pin,
              updatedAt: note.updatedAt,
            }}
            onEdit={(note) => {
              const newTitle = note.title;
              const newContent = note.content;
              const newCategory = note.category ?? "";
              const newPin = note.pin;

              setNoteTitle(newTitle);
              setContent(newContent);
              setCategory(newCategory);
              setPin(newPin);

              handleNoteForm({
                category: newCategory,
                categoryRef,

                content: newContent,
                contentRef,

                noteTitle: newTitle,
                noteTitleRef,

                pin: newPin,
                pinRef,

                setCategory,
                setContent,
                setNoteTitle,
                setPin,

                setUploadForm,

                method: "PATCH",
                itemId: note._id,
              });
            }}
            onDelete={(note) => {
              console.log("Delete", note);
            }}
            onTogglePin={(note) => handleNotePin(note._id, note.pin)}
          />
        ))}
      </View>
    ),
  };

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

        {/* notes */}
        {notesScreens[itemState]}
      </ScrollView>
    </View>
  );
};

export default notes;
