import { apiRequest } from "./client";

type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export async function registerWithEmail(payload: RegisterPayload): Promise<void> {
  const body = {
    data: {
      type: "email_account",
      attributes: {
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        password: payload.password
      }
    }
  };
  await apiRequest("account_block/accounts", "POST", { body });
}

export async function requestPasswordOtp(email: string): Promise<string> {
  type OtpResponse = {
    meta?: { token?: string };
  };
  const body = {
    data: {
      type: "email_account",
      attributes: { email }
    }
  };
  const res = await apiRequest<OtpResponse>("bx_block_forgot_password/otps", "POST", {
    body
  });
  if (!res?.meta?.token) {
    throw new Error("OTP token was not returned by backend");
  }
  return res.meta.token;
}

export async function confirmPasswordOtp(token: string, otpCode: string): Promise<string> {
  type ConfirmResponse = {
    meta?: { token?: string };
  };
  const body = {
    data: {
      token,
      otp_code: otpCode
    }
  };
  const res = await apiRequest<ConfirmResponse>("otp_confirmation", "POST", { body });
  return res?.meta?.token ?? token;
}

export async function changeForgotPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const body = {
    data: {
      token,
      new_password: newPassword
    }
  };
  await apiRequest("forgot_password/password", "POST", { body });
}

export type ContactPayload = {
  name: string;
  email: string;
  phoneNumber: string;
  comments: string;
};

/** Backend shape may vary; adjust if API returns validation errors. */
export async function submitContactMessage(
  token: string,
  payload: ContactPayload
): Promise<void> {
  const body = {
    data: {
      type: "contact",
      attributes: {
        name: payload.name,
        email: payload.email,
        phone_number: payload.phoneNumber,
        description: payload.comments
      }
    }
  };
  await apiRequest("contact_us", "POST", { token, body });
}
