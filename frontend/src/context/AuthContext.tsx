"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "user" | "vendor" | "admin";
    avatar?: { url: string };
    isVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: Record<string, string>) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem("bm_token");
        const storedUser = localStorage.getItem("bm_user");
        if (stored && storedUser) {
            setToken(stored);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("bm_token", data.token);
        localStorage.setItem("bm_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! 🙏`);
    };

    const register = async (formData: Record<string, string>) => {
        const { data } = await api.post("/auth/register", formData);
        localStorage.setItem("bm_token", data.token);
        localStorage.setItem("bm_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        toast.success("Account created successfully! 🎉");
    };

    const logout = () => {
        localStorage.removeItem("bm_token");
        localStorage.removeItem("bm_user");
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
