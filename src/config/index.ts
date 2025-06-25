import dotenv from "dotenv";
dotenv.config();

const API_HOST = process.env.API_HOST || "http://localhost";
const APP_PORT = process.env.APP_PORT || "3002";

// Jika API_HOST sudah punya port (mengandung ":" di bagian host) atau bukan localhost, jangan tambahkan port
const isLocalhost =
  API_HOST.includes("localhost") ||
  API_HOST.startsWith("127.") ||
  API_HOST.startsWith("[::1]");
const hasPort = API_HOST.includes(
  `${API_HOST.startsWith("http") ? "://" : ""}:`
);

const BASE_API = isLocalhost && !hasPort ? `${API_HOST}:${APP_PORT}` : API_HOST;

export { BASE_API };
