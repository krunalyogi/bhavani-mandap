import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("bm_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401: clear token and redirect to login
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("bm_token");
            localStorage.removeItem("bm_user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;
