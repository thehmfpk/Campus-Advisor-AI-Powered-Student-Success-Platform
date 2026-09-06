/**
 * Typed fetch wrapper for calling our own serverless functions under /api.
 * Server responses use a consistent envelope:
 *   success: the payload JSON directly (2xx)
 *   error:   { error: { code, message } } (non-2xx)
 *
 * All privileged work (AI, admin) happens server-side; secrets never touch
 * the client (R18). This wrapper only maps transport + error shapes.
 */

export interface ApiErrorShape {
  code: string;
  message: string;
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Bearer token (Supabase access token) for authenticated endpoints. */
  token?: string;
}

/** Parse a Response into either data or a normalized ApiError. */
export async function parseApiResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload: unknown = isJson ? await res.json().catch(() => null) : await res.text();

  if (res.ok) {
    return payload as T;
  }

  // Normalize error envelope; fall back to safe generic message (no internals leaked).
  let code = 'unknown_error';
  let message = 'Request failed. Please try again.';
  if (payload && typeof payload === 'object' && 'error' in payload) {
    const err = (payload as { error?: Partial<ApiErrorShape> }).error;
    if (err?.code) code = err.code;
    if (err?.message) message = err.message;
  } else if (res.status === 401) {
    code = 'unauthorized';
    message = 'You must be signed in to do that.';
  } else if (res.status === 429) {
    code = 'rate_limited';
    message = 'Too many requests. Please slow down and try again shortly.';
  }
  throw new ApiError(res.status, code, message);
}

export async function api<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, signal, token } = options;
  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    method,
    signal,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  return parseApiResponse<T>(res);
}
