import { ref } from 'vue';

const TOKEN_KEY = 'fabuladental_token';
const ROLE_KEY = 'fabuladental_role';

const token = ref<string | null>(sessionStorage.getItem(TOKEN_KEY));
const role = ref<string | null>(sessionStorage.getItem(ROLE_KEY));

function setSession(newToken: string, newRole: string): void {
  token.value = newToken;
  role.value = newRole;
  sessionStorage.setItem(TOKEN_KEY, newToken);
  sessionStorage.setItem(ROLE_KEY, newRole);
}

function clearSession(): void {
  token.value = null;
  role.value = null;
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
}

function isAuthenticated(): boolean {
  return token.value !== null;
}

export function useAuth() {
  return { token, role, setSession, clearSession, isAuthenticated };
}