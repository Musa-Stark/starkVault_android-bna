import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { APIResponse } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

export interface APIData {
  page:
    | "expenses"
    | "incomes"
    | "subscriptions"
    | "savings-goals"
    | "passwords"
    | "cards"
    | "documents"
    | "notes";
  data?: any;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  itemId?: string;
  option?: string;
}

const useAPICall = () => {
  const router = useRouter();
  const {toast} = useToast()

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

    if (!response.ok) {
      console.log(
        "RESPONSE: =====================================================",
      );
      console.log(response);
    }

    const res = await response.json();
    return res;
  };
};

export default useAPICall;
