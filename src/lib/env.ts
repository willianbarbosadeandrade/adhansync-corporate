function trimSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || "/api/v1";

export const env = {
  apiBaseUrl: trimSlash(rawApiBaseUrl),
  appEnv: import.meta.env.MODE || "development",
  requestTimeoutMs: Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS || 15000),
};
