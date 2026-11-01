/** The Panel's landing page: the first (and for now only) menu destination. */
export const HOME_PATH = '/accounts';

/** Where to go after sign-in: the page the user was sent away from, if it is a safe in-app path. */
export function redirectTarget(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//') || from.startsWith('/login')) {
    return HOME_PATH;
  }
  return from;
}
