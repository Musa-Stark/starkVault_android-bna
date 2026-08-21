import { View } from "react-native";
import React, { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { UploadCloud } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import { MediaPicker, MediaAsset } from "@/components/ui/media-picker";
import DocumentCard, {
  DocumentFile,
} from "@/components/starkUI/list/DocumentCard";
import { ScrollView } from "react-native-gesture-handler";

const documents = () => {
  const { file, setFile, fileRef, uploadForm, setUploadForm } = useApp();
  const [assets, setAssets] = useState<MediaAsset[]>([
    {
      duration: undefined,
      fileSize: 351206,
      filename: "16211.png",
      height: 2400,
      id: "picker_1787208111406_0",
      type: "image",
      uri: "file:///data/user/0/host.exp.exponent/cache/ImagePicker/aa48206b-7147-44f8-bb2a-2bca402f062b.png",
      width: 1080,
    },
  ]);

  useEffect(() => {
    if (!uploadForm.submit) return;

    console.log({ file });

    setUploadForm({
      inputs: undefined,
      name: "",
      show: false,
      submit: false,
    });

    setFile({
      id: "random-id",
      type: "image",
      uri: "https://random-uri.com",
    });
  }, [uploadForm.submit]);

  const documentCategories = [
    {
      name: "Personal",
      color: "#bfdbfe",
    },
    {
      name: "Work",
      color: "#ddd6fe",
    },
    {
      name: "Finance",
      color: "#bbf7d0",
    },
    {
      name: "Legal",
      color: "#fde68a",
    },
    {
      name: "Medical",
      color: "#fecaca",
    },
  ];

  const documents: DocumentFile[] = [
    {
      _id: "doc_001",
      documentTitle: "Passport",
      documentCategory: "Personal",
      documentCategories: "Personal",
      format: "pdf",
      size: "2.4 MB",
      date: "2026-08-10",
      uploadStatus: "done",
      progress: 100,
    },
    {
      _id: "doc_002",
      documentTitle: "Employment Contract",
      documentCategory: "Work",
      documentCategories: "Work",
      format: "pdf",
      size: "1.8 MB",
      date: "2026-08-15",
      uploadStatus: "done",
      progress: 100,
    },
    {
      _id: "doc_003",
      documentTitle: "Bank Statement",
      documentCategory: "Finance",
      documentCategories: "Finance",
      format: "pdf",
      size: "856 KB",
      date: "2026-08-18",
      uploadStatus: "done",
      progress: 100,
    },
    {
      _id: "doc_004",
      documentTitle: "Property Agreement",
      documentCategory: "Legal",
      documentCategories: "Legal",
      format: "docx",
      size: "3.2 MB",
      date: "2026-08-20",
      uploadStatus: "uploading",
      progress: 45,
    },
    {
      _id: "doc_005",
      documentTitle: "Insurance Certificate",
      documentCategory: "Medical",
      documentCategories: "Medical",
      format: "jpg",
      size: "1.1 MB",
      date: "2026-08-21",
      uploadStatus: "uploading",
      progress: 0,
    },
  ];

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Documents
      </Text>

      <ScrollView>
        <Text variant="caption">0 documents</Text>

        {/* <MediaPicker
        mediaType="all"
        multiple={true}
        maxSelection={6}
        showPreview={true}
        icon={UploadCloud}
        previewSize={100}
        buttonText="Upload"
        selectedAssets={assets}
        onSelectionChange={(newAssets) => {
          setAssets(newAssets);
          console.log("Assets with preview:", newAssets);
        }}
        style={{ marginTop: 20 }}
      /> */}

        <View style={{ gap: 12, marginVertical: 20 }}>
          {documents.map((doc) => (
            <DocumentCard
              key={doc._id}
              document={doc}
              categories={documentCategories}
              onEdit={() => {
                console.log("Edit:", doc);
              }}
              onDelete={(doc) => {
                console.log("Delete:", doc);
              }}
              onView={(doc) => {
                console.log("View:", doc);
              }}
              onDownload={(doc) => {
                console.log("Download:", doc);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default documents;
