import { BASE_URL, authHeaders } from "../api";

export const fetchTodosApi = async (token: string) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    headers: {
      ...authHeaders(token),
    },
  });
  const json = await response.json();
  return { response, data: json };
};

export const createTodoApi = async (token: string, formData: FormData) => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
    },
    body: formData,
  });
  const json = await response.json();
  return { response, data: json };
};

export const updateTodoApi = async (
  token: string,
  id: number,
  formData: FormData,
) => {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
    },
    body: formData,
  });
  const json = await response.json();
  return { response, data: json };
};

export const deleteTodoApi = async (token: string, id: number) => {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeaders(token),
    },
  });
  const json = await response.json();
  return { response, data: json };
};
