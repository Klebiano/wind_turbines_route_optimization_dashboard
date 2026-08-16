import axios from "axios";

/**
 * Backend API Configuration
 * 
 * You can configure the backend API target using environment variables in `.env` or `.env.local`:
 * - `VITE_API_PORT`: Port number (default: "8000")
 * - `VITE_API_HOST`: Hostname or IP address (default: "127.0.0.1")
 * - `VITE_API_PROTOCOL`: Protocol "http" or "https" (default: "http")
 * - `VITE_API_URL`: Full base URL (takes precedence if provided, e.g. "http://localhost:8000")
 */

const API_PORT = import.meta.env.VITE_API_PORT || "8000";
const API_HOST = import.meta.env.VITE_API_HOST || "127.0.0.1";
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL || "http";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  `${API_PROTOCOL}://${API_HOST}:${API_PORT}`;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export default apiClient;
