"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/lib/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface WishlistContextType {
    wishlist: string[];
    toggle: (mandapId: string) => Promise<void>;
    isWishlisted: (mandapId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState<string[]>([]);

    useEffect(() => {
        const loadWishlist = async () => {
            if (!user) return;
            try {
                const { data } = await api.get("/users/wishlist");
                setWishlist(data.data.map((m: { _id: string }) => m._id));
            } catch { }
        };
        loadWishlist();
    }, [user]);

    const toggle = async (mandapId: string) => {
        if (!user) { toast.error("Please login to save to wishlist"); return; }
        try {
            const { data } = await api.post(`/mandaps/${mandapId}/wishlist`);
            setWishlist(data.isWishlisted
                ? [...wishlist, mandapId]
                : wishlist.filter((id) => id !== mandapId)
            );
            toast.success(data.isWishlisted ? "Added to wishlist ❤️" : "Removed from wishlist");
        } catch {
            toast.error("Failed to update wishlist");
        }
    };

    const isWishlisted = (mandapId: string) => wishlist.includes(mandapId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted }}>
            {children}
        </WishlistContext.Provider>
    );
}

export const useWishlist = () => {
    const ctx = useContext(WishlistContext);
    if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
};
