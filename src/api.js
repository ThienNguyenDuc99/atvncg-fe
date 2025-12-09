// src/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // backend của bạn
});

// ⬇️ Tự động thêm token vào mọi request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    // Danh sách các URL public
    const publicPaths = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh"
    ];

    // Nếu URL request trùng public thì KHÔNG set Authorization
    if (!publicPaths.some(path => config.url.includes(path))) {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});

export default api;