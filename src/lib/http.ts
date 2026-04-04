import { env } from "./env";
import { ApiError } from "./errors";

type QueryValue = string | number | boolean | null | undefined;

type QueryParams = Record<string, QueryValue>;

export interface HttpRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  query?: QueryParams;
  signal?: AbortSignal;
  timeoutMs?: number;
  skipCsrf?: boolean;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  code?: string;
  details?: Record<string, unknown>;
}

let csrfToken: string | null = null;
let csrfFetched = false;

function isMutatingMethod(method: string): boolean {
  return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

function buildUrl(path: string, query?: QueryParams): string {
  const normalizedPath = path.startsWith("http") ? path : `${env.apiBaseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

  if (!query) return normalizedPath;

  const url = new URL(normalizedPath, window.location.origin);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return normalizedPath.startsWith("http") ? url.toString() : `${url.pathname}${url.search}`;
}

function mergeSignals(base?: AbortSignal, extra?: AbortSignal): AbortSignal | undefined {
  if (!base) return extra;
  if (!extra) return base;

  const controller = new AbortController();
  const abort = () => controller.abort();
  base.addEventListener("abort", abort, { once: true });
  extra.addEventListener("abort", abort, { once: true });
  return controller.signal;
}

async function parseJsonSafely(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

async function refreshCsrfToken(signal?: AbortSignal): Promise<void> {
  if (csrfFetched) return;
  csrfFetched = true;

  try {
    const response = await fetch(buildUrl("/security/csrf-token"), {
      method: "GET",
      credentials: "include",
      signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return;

    const payload = (await parseJsonSafely(response)) as { token?: string } | null;
    csrfToken = payload?.token || null;
  } catch {
    csrfToken = null;
  }
}

export async function httpRequest<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
  const method = options.method || "GET";
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? env.requestTimeoutMs;
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const signal = mergeSignals(options.signal, controller.signal);

  try {
    if (!options.skipCsrf && isMutatingMethod(method)) {
      await refreshCsrfToken(signal);
    }

    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    let body: BodyInit | undefined;
    if (options.body !== undefined) {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }

    if (!options.skipCsrf && isMutatingMethod(method) && csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }

    const response = await fetch(buildUrl(path, options.query), {
      method,
      credentials: "include",
      headers,
      body,
      signal,
    });

    const responseCsrf = response.headers.get("x-csrf-token");
    if (responseCsrf) csrfToken = responseCsrf;

    const payload = await parseJsonSafely(response);

    if (!response.ok) {
      const apiError = payload as ApiErrorResponse | null;
      const message = apiError?.message || apiError?.error || `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, apiError?.code, apiError?.details as Record<string, unknown> | undefined);
    }

    return payload as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

export const http = {
  get: <T>(path: string, options: Omit<HttpRequestOptions, "method"> = {}) =>
    httpRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options: Omit<HttpRequestOptions, "method" | "body"> = {}) =>
    httpRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options: Omit<HttpRequestOptions, "method" | "body"> = {}) =>
    httpRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options: Omit<HttpRequestOptions, "method" | "body"> = {}) =>
    httpRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options: Omit<HttpRequestOptions, "method"> = {}) =>
    httpRequest<T>(path, { ...options, method: "DELETE" }),
};
