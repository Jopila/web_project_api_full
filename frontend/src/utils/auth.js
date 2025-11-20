const AUTH_BASE_URL = "http://localhost:3000";
const TOKEN_STORAGE_KEY = "around.jwt";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const hasWindow =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function parseErrorMessage(payload, response) {
  if (!payload || typeof payload !== "object") {
    return response?.statusText || "Não foi possível processar a requisição.";
  }

  const { message, error } = payload;
  if (typeof message === "string" && message.trim()) return message;
  if (typeof error === "string" && error.trim()) return error;

  return response?.statusText || "Não foi possível processar a requisição.";
}

async function handleResponse(response) {
  if (response.ok) {
    if (response.status === 204) return null;
    return response.json();
  }

  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    // ignore JSON parsing errors, fallback to statusText
  }

  const message = parseErrorMessage(data, response);
  throw new Error(message);
}

export function register({ email, password }) {
  return fetch(`${AUTH_BASE_URL}/signup`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

export function authorize({ email, password }) {
  return fetch(`${AUTH_BASE_URL}/signin`, {
    method: "POST",
    headers: defaultHeaders,
    body: JSON.stringify({ email, password }),
  }).then(handleResponse);
}

export function checkToken(token) {
  if (!token) {
    return Promise.reject(new Error("Token ausente."));
  }

  return fetch(`${AUTH_BASE_URL}/users/me`, {
    headers: {
      ...defaultHeaders,
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

export function saveToken(token) {
  if (!hasWindow || !token) return;
  try {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (err) {
    console.error("Falha ao salvar token", err);
  }
}

export function getToken() {
  if (!hasWindow) return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.error("Falha ao recuperar token", err);
    return null;
  }
}

export function clearToken() {
  if (!hasWindow) return;
  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.error("Falha ao remover token", err);
  }
}

export default {
  register,
  authorize,
  checkToken,
  saveToken,
  getToken,
  clearToken,
};
