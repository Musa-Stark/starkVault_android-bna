import { View } from "react-native";
import React, { useEffect } from "react";
import * as Clipboard from "expo-clipboard";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { Button } from "@/components/ui/button";
import { Pen, Plus, Trash2 } from "lucide-react-native";
import { Table } from "@/components/ui/table";
import { useApp } from "@/providers/app-context";
import handlePasswordForm from "@/components/starkUI/upload/passwords.form";

interface Row {
  id: number;
  service: string;
  username: string;
  password: string;
  actions: string;
}
const passwords = () => {
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
  } = useApp();

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({
      service,
      username,
      password,
    });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setService("");
    setUsername("");
    setPassword("");
  }, [uploadForm.submit]);

  const handleRowPress = async (row: Row) => {
    await Clipboard.setStringAsync(row.password);
  };

  const handleLongRowPress = async (row: Row) => {
    const credentials = `Username: ${row.username}\nPassword: ${row.password}`;

    await Clipboard.setStringAsync(credentials);
  };

  // new
  const passwords = [
    {
      _id: "pass_001",
      serviceName: "GitHub",
      username: "john.doe@example.com",
      password: "Gh!p9X#k2Lm@82",
    },
    {
      _id: "pass_002",
      serviceName: "Netflix",
      username: "john.doe@example.com",
      password: "Nf@2026!xK92",
    },
    {
      _id: "pass_003",
      serviceName: "Google",
      username: "john.doe@gmail.com",
      password: "Goo!e_82#Lm91",
    },
    {
      _id: "pass_004",
      serviceName: "AWS Console",
      username: "admin@example.com",
      password: "Aws#92!LmXk@71",
    },
    {
      _id: "pass_005",
      serviceName: "Notion",
      username: "john.doe@example.com",
      password: "Not!on_72#Klm",
    },
  ];

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Passwords
      </Text>

      <Text variant="caption">0 credentials secured</Text>

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

      <Table
        style={{ marginTop: 20, marginBottom: 300 }}
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
                <Button variant="ghost" size="icon" icon={Pen} />

                <Button variant="ghost" size="icon" icon={Trash2} />
              </View>
            ),
          },
        ]}
        data={[
          {
            id: 1,
            service: "Github",
            username: "Musa",
            password: "musa123",
            actions: "nothing",
          },
          {
            id: 2,
            service: "Google",
            username: "Esa",
            password: "stark",
            actions: "stark",
          },
        ]}
      />
    </View>
  );
};

export default passwords;
