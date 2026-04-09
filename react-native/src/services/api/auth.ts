import { apiRequest } from "./client";

type LoginResponse = {
  meta?: {
    token?: string;
    id?: number | string;
  };
  errors?: unknown;
};

export async function loginWithEmail(email: string, password: string): Promise<string> {
  const body = {
    data: {
      type: "email_account",
      attributes: { email, password }
    }
  };

  const res = await apiRequest<LoginResponse>("bx_block_login/logins", "POST", { body });
  const token = res?.meta?.token;
  if (!token) throw new Error("Invalid login response");
  return token;
}
