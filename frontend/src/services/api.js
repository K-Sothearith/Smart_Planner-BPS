import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
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
