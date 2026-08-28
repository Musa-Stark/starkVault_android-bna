import { View, Modal, TouchableWithoutFeedback } from "react-native";
import { useState } from "react";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import React from "react";
import { useColor } from "@/hooks/useColor";
import { X, AlertTriangle } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";

const DeleteModal = () => {
  const { deleteModal, setDeleteModal } = useApp();
  const apiCall = useAPICall();
  const { toast } = useToast();

  const [busy, setBusy] = useState<boolean>(false);

  const handleCancelDelete = () => {
    setDeleteModal({
      show: false,
      ids: [],
      page: undefined,
      setState: undefined,
    });
  };

  const handleConfirmDelete = async () => {
    const { ids, page, setState } = deleteModal;

    setBusy(true);

    const response = await apiCall({
      page: page!,
      method: "DELETE",
      data: { ids },
    });

    setBusy(false);

    if (!response.success) {
      toast.error(response.message || "Something went wrong");
      return;
    }

    setState((prev: any) => prev.filter((item: any) => !ids.includes(item.id)));

    setDeleteModal({
      show: false,
      ids: [],
      page: undefined,
      setState: undefined,
    });
  };

  const cardColor = useColor("card");
  const foreground = useColor("foreground");
  const mutedForeground = useColor("mutedForeground");

  return (
    <Modal
      visible={deleteModal.show}
      transparent
      animationType="fade"
      onRequestClose={handleCancelDelete}
    >
      <TouchableWithoutFeedback onPress={handleCancelDelete}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                width: "100%",
                maxWidth: 400,
                borderRadius: 24,
                padding: 22,
                backgroundColor: cardColor,
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 8,
                },
                shadowOpacity: 0.25,
                shadowRadius: 20,
              }}
            >
              {/* Close */}

              <Button
                icon={X}
                size="icon"
                variant="outline"
                onPress={handleCancelDelete}
                disabled={busy}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 34,
                  height: 34,
                }}
              />

              {/* Warning Icon */}

              <View
                style={{
                  width: 52,
                  height: 52,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 16,
                  backgroundColor: "#ef444418",
                  marginBottom: 16,
                }}
              >
                <AlertTriangle size={26} color="#ef4444" strokeWidth={2} />
              </View>

              {/* Title */}

              <Text
                style={{
                  fontSize: 19,
                  fontWeight: "700",
                  color: foreground,
                }}
              >
                Delete note?
              </Text>

              {/* Description */}

              <Text
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  lineHeight: 20,
                  color: mutedForeground,
                }}
              >
                This will permanently delete{" "}
                <Text
                  style={{
                    fontWeight: "600",
                    color: foreground,
                  }}
                >
                    Selected Item(s)
                </Text>
                . This action cannot be undone.
              </Text>

              {/* Buttons */}

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 22,
                  justifyContent: "flex-end",
                }}
              >
                {/* Cancel */}

                <Button
                  size="sm"
                  variant="success"
                  onPress={handleCancelDelete}
                  disabled={busy}
                  textStyle={{ color: "black" }}
                >
                  Cancel
                </Button>

                {/* Delete */}

                <Button
                  size="sm"
                  onPress={handleConfirmDelete}
                  variant="destructive"
                  textStyle={{ color: "black" }}
                  disabled={busy}
                  loading={busy}
                  loadingVariant="default"
                >
                  Delete
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default DeleteModal;
