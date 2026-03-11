// centralise les constantes et helpers pour les appels réseau
export const BASE_URL = "https://todos.leonmorival.xyz/api";

export const authHeaders = (token: string | null): HeadersInit => {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};
