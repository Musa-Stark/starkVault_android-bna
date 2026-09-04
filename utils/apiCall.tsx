import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { APIResponse } from "@/providers/auth-provider";

export type APIPages =
  | "recents"
  | "expenses"
  | "incomes"
  | "subscriptions"
  | "savings-goals"
  | "passwords"
  | "cards"
  | "documents"
  | "notes"
  | "account"
  | "dashboard"

export type APIBodyType = "json" | "multipart";

export interface APIFile {
  uri: string;
  name?: string;
  filename?: string;
  type?: string;
  mimeType?: string;
}

export interface APIData {
  page: APIPages;
  data?: Record<string, any>;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  itemId?: string;
  option?: string;
  bodyType?: APIBodyType;
}

const getMimeType = (file: APIFile): string => {
  // If an actual MIME type was provided, use it.
  if (file.mimeType) {
    return file.mimeType;
  }

  if (file.type?.includes("/")) {
    return file.type;
  }

  const filename = file.name || file.filename || file.uri;

  const extension = filename.split("?")[0].split(".").pop()?.toLowerCase();

  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";

    case "png":
      return "image/png";

    case "gif":
      return "image/gif";

    case "webp":
      return "image/webp";

    case "heic":
      return "image/heic";

    case "pdf":
      return "application/pdf";

    case "txt":
      return "text/plain";

    case "json":
      return "application/json";

    case "doc":
      return "application/msword";

    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    case "xls":
      return "application/vnd.ms-excel";

    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    default:
      return "application/octet-stream";
  }
};

const isAPIFile = (value: any): value is APIFile => {
  return (
    value !== null && typeof value === "object" && typeof value.uri === "string"
  );
};

const appendFile = (formData: FormData, fieldName: string, file: APIFile) => {
  const name = file.name || file.filename || "file";
  const type = getMimeType(file);

  formData.append(fieldName, {
    uri: file.uri,
    name,
    type,
  } as any);
};

const useAPICall = () => {
  const router = useRouter();

  return async ({
    page,
    data,
    method,
    itemId,
    option,
    bodyType = "json",
  }: APIData): Promise<APIResponse> => {
    const accessToken = await SecureStore.getItemAsync("access_token");

    if (!accessToken) {
      router.replace("/login");

      return {
        success: false,
        message: "",
      };
    }

    const url = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/${page}${
      itemId ? `/${itemId}` : ""
    }${option ? `/${option}` : ""}`;

    let body: BodyInit | undefined;
    const headers: HeadersInit = {};

    if (method !== "GET") {
      if (bodyType === "multipart") {
        const formData = new FormData();

        formData.append("accessToken", accessToken);

        for (const [key, value] of Object.entries(data ?? {})) {
          if (value === undefined || value === null) {
            continue;
          }

          // ---------------------------------------------------------
          // SINGLE FILE
          // ---------------------------------------------------------
          if (isAPIFile(value)) {
            appendFile(formData, key, value);
            continue;
          }

          // ---------------------------------------------------------
          // ARRAY
          // ---------------------------------------------------------
          if (Array.isArray(value)) {
            // Array of files
            if (value.length > 0 && value.every(isAPIFile)) {
              for (const file of value) {
                appendFile(formData, key, file);
              }

              continue;
            }

            // Normal array
            formData.append(key, JSON.stringify(value));
            continue;
          }

          // ---------------------------------------------------------
          // OBJECT
          // ---------------------------------------------------------
          if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
            continue;
          }

          // ---------------------------------------------------------
          // STRING / NUMBER / BOOLEAN
          // ---------------------------------------------------------
          formData.append(key, String(value));
        }

        body = formData;

        // DO NOT set Content-Type manually.
        //
        // React Native fetch will create:
        //
        // multipart/form-data; boundary=...
      } else {
        headers["Content-Type"] = "application/json";

        body = JSON.stringify({
          accessToken,
          ...data,
        });
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const res = await response.json();

    if (!res.success) {
      console.log("RES: =====================================================");
      console.log(res);
    }

    return res;
  };
};

export default useAPICall;
