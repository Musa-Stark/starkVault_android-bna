import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { APIResponse } from "@/providers/auth-provider";
import { useAuth } from "@/providers/auth-provider";

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
  | "dashboard";

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
    value !== null &&
    typeof value === "object" &&
    typeof value.uri === "string"
  );
};

const appendFile = (
  formData: FormData,
  fieldName: string,
  file: APIFile,
) => {
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
  const { refreshSession } = useAuth();

  return async ({
    page,
    data,
    method,
    itemId,
    option,
    bodyType = "json",
  }: APIData): Promise<APIResponse> => {
    const url = `${process.env.EXPO_PUBLIC_API_URL}/api/v1/${page}${
      itemId ? `/${itemId}` : ""
    }${option ? `/${option}` : ""}`;

    /**
     * ---------------------------------------------------------------
     * MAKE REQUEST
     * ---------------------------------------------------------------
     *
     * This function gets the latest access token every time it runs.
     *
     * That is important because after refreshSession() the token
     * stored in SecureStore has changed.
     */
    const makeRequest = async () => {
      const accessToken = await SecureStore.getItemAsync("access_token");

      if (!accessToken) {
        router.replace("/login");

        return {
          success: false,
          message: "",
        } as APIResponse;
      }

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

            // SINGLE FILE
            if (isAPIFile(value)) {
              appendFile(formData, key, value);
              continue;
            }

            // ARRAY
            if (Array.isArray(value)) {
              if (value.length > 0 && value.every(isAPIFile)) {
                for (const file of value) {
                  appendFile(formData, key, file);
                }

                continue;
              }

              formData.append(key, JSON.stringify(value));
              continue;
            }

            // OBJECT
            if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
              continue;
            }

            // STRING / NUMBER / BOOLEAN
            formData.append(key, String(value));
          }

          body = formData;
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

      return await response.json();
    };

    /**
     * ---------------------------------------------------------------
     * FIRST REQUEST
     * ---------------------------------------------------------------
     */
    let res = await makeRequest();

    /**
     * ---------------------------------------------------------------
     * ACCESS TOKEN EXPIRED / INVALID
     * ---------------------------------------------------------------
     */
    if (!res.success && res.code === "JWT_INVALID") {
      await refreshSession();
      /**
       * -------------------------------------------------------------
       * RETRY THE ORIGINAL REQUEST
       * -------------------------------------------------------------
       *
       * makeRequest() gets the NEW access token from SecureStore.
       */
      res = await makeRequest();
    }

    return res;
  };
};

export default useAPICall;