import axios from "axios";

const DEFAULT_API_URL = "http://localhost:5000/api/v1.0";
const baseURL = (import.meta as ImportMeta & { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL ?? DEFAULT_API_URL;

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Add response interceptor for improved error shaping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // try to extract a useful message for callers
    const remoteMessage = error?.response?.data?.message;
    const message = remoteMessage ?? error?.message ?? "Erro desconhecido ao chamar API";
    console.error("API Error:", message, error);
    // attach a normalized message and reject with the original error
    error.userMessage = message;
    return Promise.reject(error);
  }
);
