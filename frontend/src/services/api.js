import axios from "axios";

let baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (baseUrl) {
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.slice(0, -1);
  }
  if (!baseUrl.endsWith("/api")) {
    baseUrl = `${baseUrl}/api`;
  }
}

const API = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to automatically attach JWT token to headers
API.interceptors.request.use(
  (config) => {
    try {
      const session = sessionStorage.getItem("sp:session");
      if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession && parsedSession.token) {
          config.headers["Authorization"] = `Bearer ${parsedSession.token}`;
        }
      }
    } catch (error) {
      console.error("Error reading token from sessionStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
