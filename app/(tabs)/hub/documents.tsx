import { View } from "react-native";
import React, { useEffect, useState } from "react";

import { Text } from "@/components/ui/text";
import globalStyles from "@/starkwind/globalStyle";
import { UploadCloud } from "lucide-react-native";
import { useApp } from "@/providers/app-context";
import { MediaPicker, MediaAsset } from "@/components/ui/media-picker";

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

  return (
    <View style={{ ...globalStyles.globalPaddingContainer }}>
      <Text variant="heading" style={{ marginBottom: 20 }}>
        Documents
      </Text>

      <Text variant="caption">0 documents</Text>

      <MediaPicker
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
      />
    </View>
  );
};

export default documents;
