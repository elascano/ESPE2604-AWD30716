const BASE_URL = import.meta.env.VITE_BUSINESS_LOGIC_URL as string;

function isLocalhostUrl(url: string): boolean {
  return url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1');
}

function assertSecureUrl(url: string): void {
  if (url.startsWith('https://') || isLocalhostUrl(url)) {
    return;
  }
  throw new Error('Insecure connection: HTTPS is required for this environment.');
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  assertSecureUrl(BASE_URL);

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data && data.error) || 'Request failed.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}