import { env } from "../../config/env";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod,
  options?: {
    token?: string;
    body?: unknown;
  }
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${env.apiBaseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (options?.token) headers.token = options.token;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined
    });
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    if (raw === "Network request failed" || raw.includes("Failed to fetch")) {
      throw new Error(
        "Network request failed: check EXPO_PUBLIC_API_BASE_URL, connectivity, and use a LAN URL (not localhost) on physical devices."
      );
    }
    throw err instanceof Error ? err : new Error(String(err));
  }

  const json = await response.json();
  if (!response.ok) {
    const msg = (json?.errors?.[0] && Object.values(json.errors[0])[0]) || "Request failed";
    throw new Error(String(msg));
  }
  return json as T;
}
