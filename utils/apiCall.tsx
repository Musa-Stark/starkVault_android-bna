import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { APIResponse } from "@/providers/auth-provider";

export type APIPages =
  | "expenses"
  | "incomes"
  | "subscriptions"
  | "savings-goals"
  | "passwords"
  | "cards"
  | "documents"
  | "notes";

export interface APIData {
  page: APIPages;
  data?: any;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  itemId?: string;
  option?: string;
}

const useAPICall = () => {
  const router = useRouter();

  return async ({
    page,
    data,
    method,
    itemId,
    option,
  }: APIData): Promise<APIResponse> => {
    const accessToken = await SecureStore.getItemAsync("access_token");
    if (!accessToken) {
      router.replace("/login");
      return { success: false, message: "" };
    }

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/v1/${page}${itemId ? `/${itemId}` : ""}${option ? `/${option}` : ""}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body:
          method !== "GET"
            ? JSON.stringify({ accessToken, ...data })
            : undefined,
      },
    );

    const res = await response.json();
    if (!res.success) {
      console.log("RES: =====================================================");
      console.log(res);
    }
    return res;
  };
};

export default useAPICall;
