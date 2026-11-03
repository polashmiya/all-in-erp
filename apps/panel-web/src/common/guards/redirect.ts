import { HOME_PATH, LOGIN_PATH } from '@/common/constants/routes';

export function redirectTarget(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;
  if (typeof from !== 'string' || !from.startsWith('/') || from.startsWith('//') || from.startsWith(LOGIN_PATH)) {
    return HOME_PATH;
  }
  return from;
}
