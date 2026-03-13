export function backendBaseUrl() {
  const defaultUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4000"
      : "http://localhost:4000";
  return (process.env.NEXT_PUBLIC_BACKEND_URL || defaultUrl).replace(/\/+$/, "");
}

export function getAuthToken() {
  try {
    return localStorage.getItem("auth_token") || "";
  } catch {
    return "";
  }
}

export function getAuthUser<T = any>(): T | null {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export async function apiJson<T = any>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string; data: any }> {
  const base = backendBaseUrl();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  const auth = init?.auth ?? true;
  const headers: Record<string, string> = {
    ...(init?.headers as any),
  };
  if (!headers["content-type"] && init?.body) headers["content-type"] = "application/json";
  if (auth) {
    const token = getAuthToken();
    if (token) headers.authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...init, headers });
  const json = await res.json().catch(() => null);
  if (!res.ok) return { ok: false, status: res.status, error: json?.error || "Request failed.", data: json };
  return { ok: true, data: json as T };
}

