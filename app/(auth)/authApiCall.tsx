export interface AuthData {
  email: string;
  page:
    | "login"
    | "signup"
    | "forgotPassword"
    | "twoFactorAuth"
    | "resetPassword";
  fullName?: string;
  password?: string;
  code?: string;
}
const authApiCall = async (userData: AuthData) => {
  const { page, ...cleaned } = userData;
  const res = await fetch(`${process.env.BACKEND_API}/auth/${page}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleaned),
  });

  const data = await res.json();
  console.log(data);
};

export default authApiCall;
