import { View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Pen, Plus, Trash2 } from "lucide-react-native";
import { Table } from "@/components/ui/table";
import { useApp } from "@/providers/app-context";
import handlePasswordForm from "@/components/starkUI/upload/passwords.form";
import useAPICall from "@/utils/apiCall";
import { useToast } from "@/providers/toast-provider";
import TableSkeleton from "@/components/starkUI/skeleton/TableSkeleton";
import useDeleteOne from "@/components/starkUI/DeleteOne";

interface Row {
  service: string;
  username: string;
  password: string;
}
const passwords = () => {
  // contexts
  const {
    service,
    setService,
    serviceRef,

    username,
    setUsername,
    usernameRef,

    password,
    setPassword,
    passwordRef,

    uploadForm,
    setUploadForm,

    deleteOneBusy,
  } = useApp();
  const deleteOne = useDeleteOne();

  const handleRowPress = async (row: Row) => {
    await Clipboard.setStringAsync(row.password);
  };

  const handleLongRowPress = async (row: Row) => {
    const credentials = `Username: ${row.username}\nPassword: ${row.password}`;

    await Clipboard.setStringAsync(credentials);
  };

  interface Password {
    _id: string;
    service: string;
    username: string;
    password: string;
  }

  const [passwords, setPasswords] = useState<Password[]>([]);
  const [deletingId, setDeletingId] = useState<string>("");

  const apiCall = useAPICall();
  const { toast } = useToast();

  const [itemState, setItemState] = useState<"found" | "notFound" | "fetching">(
    "fetching",
  );

  // fetch - GET
  useEffect(() => {
    const fetch = async () => {
      const response = await apiCall({ page: "passwords", method: "GET" });

      if (!response.success && response.message === "Data not found") {
        setItemState("notFound");
        return;
      }

      setPasswords([
        ...response.data.map((el: any) => ({
          _id: el._id,
          password: el.password,
          service: el.name,
          username: el.username,
        })),
      ]);

      setItemState("found");
    };

    fetch();
  }, []);

  // upload - POST
  useEffect(() => {
    const upload = async () => {
      if (!uploadForm.submit) return;

      const response = await apiCall({
        page: "passwords",
        data: {
          name: service,
          username,
          password,
        },
        method: uploadForm.method!,
        itemId: uploadForm.itemId,
      });

      if (!response.success) {
        toast.error(response.message || "Something went wrong");
        return;
      }

      if (uploadForm.method === "POST") {
        setPasswords((prev) => [
          ...prev,
          {
            _id: response.data._id,
            password: response.data.password,
            service: response.data.name,
            username: response.data.username,
          },
        ]);
      } else {
        setPasswords((prev) => [
          ...prev.map((el) =>
            el._id === response.data._id
              ? ({
                  _id: response.data._id,
                  password: response.data.password,
                  service: response.data.name,
                  username: response.data.username,
                } satisfies Password)
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

      setService("");
      setUsername("");
      setPassword("");
    };

    upload();
  }, [uploadForm.submit]);

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Passwords
      </Text>

      <Text variant="caption">{passwords.length} credentials secured</Text>

      <Button
        icon={Plus}
        style={{ marginTop: 20 }}
        onPress={() =>
          handlePasswordForm({
            service,
            setService,
            serviceRef,

            username,
            setUsername,
            usernameRef,

            password,
            setPassword,
            passwordRef,

            setUploadForm,
          })
        }
      >
        New Password
      </Button>

      {itemState === "fetching" ? (
        <TableSkeleton style={{ marginTop: 20 }} />
      ) : (
        <Table
          style={{ marginTop: 20, marginBottom: 300 }}
          emptyMessage="Passwords not found"
          onRowPress={handleRowPress}
          onRowLongPress={handleLongRowPress}
          columns={[
            {
              id: "1",
              header: "Service",
              accessorKey: "service",
              sortable: true,
              minWidth: 130,
              align: "left",
              filterable: true,
            },
            {
              id: "2",
              header: "Username",
              accessorKey: "username",
              sortable: true,
              filterable: true,
              minWidth: 130,
              align: "left",
            },
            {
              id: "3",
              header: "Password",
              accessorKey: "password",
              sortable: true,
              filterable: true,
              minWidth: 130,
              align: "left",
            },
            {
              id: "4",
              header: "Actions",
              accessorKey: "actions",
              width: 150,
              align: "center",
              filterable: false,
              sortable: false,
              cell: (_, row) => (
                <View style={{ ...globalStyles.flexBoxHorizantal }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    icon={Pen}
                    disabled={deleteOneBusy}
                    onPress={() => {
                      const newPassword = row.password;
                      const newUsername = row.username;
                      const newService = row.service;

                      setPassword(newPassword);
                      setUsername(newUsername);
                      setService(newService);

                      handlePasswordForm({
                        service: newService,
                        setService,
                        serviceRef,

                        username: newUsername,
                        setUsername,
                        usernameRef,

                        password: newPassword,
                        setPassword,
                        passwordRef,

                        setUploadForm,

                        method: "PATCH",
                        itemId: row._id,
                      });
                    }}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onPress={async () => {
                      setDeletingId(row._id);

                      try {
                        await deleteOne({
                          id: row._id,
                          setState: setPasswords,
                          page: "passwords",
                        });
                      } finally {
                        setDeletingId("");
                      }
                    }}
                    loading={deletingId === row._id}
                    disabled={deleteOneBusy}
                  >
                    <Trash2 size={20} color={"red"} />
                  </Button>
                </View>
              ),
            },
          ]}
          data={passwords}
        />
      )}
    </View>
  );
};

export default passwords;
