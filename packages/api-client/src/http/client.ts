/**
 * Fetch-based HTTP client used by every orval-generated hook. Apps call `configureApiClient`
 * once at startup; auth token and business unit are read lazily on each request.
 */
export interface ApiClientConfig {
  baseUrl: string;
  getAccessToken?: () => string | null | undefined;
  getBusinessUnitId?: () => string | null | undefined;
  onUnauthorized?: () => void;
}

/** RFC 7807 problem details as produced by the ASP.NET Core API. */
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly problem: ProblemDetails | undefined,
    readonly body?: unknown,
  ) {
    super(problem?.title ?? problem?.detail ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
  }

  /** Field-level validation errors keyed by field key. */
  get fieldErrors(): Record<string, string[]> {
    return this.problem?.errors ?? {};
  }
}

let config: ApiClientConfig = { baseUrl: '' };

export function configureApiClient(next: ApiClientConfig) {
  config = { ...next, baseUrl: next.baseUrl.replace(/\/$/, '') };
}

export function getApiBaseUrl() {
  return config.baseUrl;
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('json')) return response.json();
  const text = await response.text();
  return text.length ? text : undefined;
}

/** orval mutator: returns the parsed body for 2xx, throws ApiError otherwise. */
export async function customFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  const token = config.getAccessToken?.();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const businessUnitId = config.getBusinessUnitId?.();
  if (businessUnitId) headers.set('X-Business-Unit', businessUnitId);

  const response = await fetch(`${config.baseUrl}${url}`, { ...init, headers });
  const body = await readBody(response);

  if (!response.ok) {
    if (response.status === 401) config.onUnauthorized?.();
    const problem = body && typeof body === 'object' ? (body as ProblemDetails) : undefined;
    throw new ApiError(response.status, problem, body);
  }

  return body as T;
}

/** Picked up by orval: every generated hook's error type is ApiError. */
export type ErrorType<_Error> = ApiError;

/** Picked up by orval for request bodies. */
export type BodyType<BodyData> = BodyData;

export default customFetch;
