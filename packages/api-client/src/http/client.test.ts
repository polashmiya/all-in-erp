import { ApiError, configureApiClient, customFetch, errorStatus, isTokenActive } from './client';

describe('errorStatus', () => {
  it('returns the HTTP status for API errors and 0 for network failures', () => {
    expect(errorStatus(new ApiError(429, undefined))).toBe(429);
    expect(errorStatus(new TypeError('Failed to fetch'))).toBe(0);
  });
});

describe('isTokenActive', () => {
  const now = Date.parse('2026-11-01T10:00:00Z');

  it('requires a token and a future expiry', () => {
    expect(isTokenActive('t', '2026-11-01T18:00:00Z', now)).toBe(true);
    expect(isTokenActive('t', '2026-11-01T09:59:59Z', now)).toBe(false);
    expect(isTokenActive(null, '2026-11-01T18:00:00Z', now)).toBe(false);
    expect(isTokenActive('t', null, now)).toBe(false);
  });
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': status >= 400 ? 'application/problem+json' : 'application/json' },
  });
}

describe('customFetch', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => vi.unstubAllGlobals());

  it('prefixes the base URL and sends token + business unit headers', async () => {
    configureApiClient({
      baseUrl: 'http://api.test/',
      getAccessToken: () => 'tok',
      getBusinessUnitId: () => 'bu-1',
    });
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    await expect(customFetch('/api/info', { method: 'GET' })).resolves.toEqual({ ok: true });

    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('http://api.test/api/info');
    const headers = new Headers(init?.headers);
    expect(headers.get('Authorization')).toBe('Bearer tok');
    expect(headers.get('X-Business-Unit')).toBe('bu-1');
  });

  it('omits auth headers when there is no session', async () => {
    configureApiClient({ baseUrl: 'http://api.test' });
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await customFetch('/health');

    const headers = new Headers(fetchMock.mock.calls[0]![1]?.headers);
    expect(headers.has('Authorization')).toBe(false);
    expect(headers.has('X-Business-Unit')).toBe(false);
  });

  it('throws ApiError with problem details and field errors', async () => {
    configureApiClient({ baseUrl: '' });
    fetchMock.mockResolvedValue(
      jsonResponse(400, { title: 'Validation failed', status: 400, errors: { code: ['Required'] } }),
    );

    const error = await customFetch('/x').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).message).toBe('Validation failed');
    expect((error as ApiError).fieldErrors).toEqual({ code: ['Required'] });
  });

  it('calls onUnauthorized on 401', async () => {
    const onUnauthorized = vi.fn();
    configureApiClient({ baseUrl: '', onUnauthorized });
    fetchMock.mockResolvedValue(new Response(null, { status: 401 }));

    await expect(customFetch('/secure')).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).toHaveBeenCalledOnce();
  });

  it('returns undefined for 204 No Content', async () => {
    configureApiClient({ baseUrl: '' });
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(customFetch('/delete')).resolves.toBeUndefined();
  });
});
