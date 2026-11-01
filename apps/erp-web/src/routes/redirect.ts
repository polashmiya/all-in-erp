const DEFAULT_TARGET = '/dashboard';
const AUTH_PATHS = ['/login', '/select-unit'];

/** Where to go after sign-in: the page the user was sent away from, if it is a safe in-app path. */
export function redirectTarget(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//')) return DEFAULT_TARGET;
  if (AUTH_PATHS.some((path) => from === path || from.startsWith(`${path}?`))) return DEFAULT_TARGET;
  return from;
}
