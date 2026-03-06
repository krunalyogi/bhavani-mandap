"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import MandapCard from "@/components/MandapCard";
import { useAuth } from "@/context/AuthContext";

export default function WishlistPage() {
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) { setLoading(false); return; }
        api.get("/auth/me").then(({ data }) => {
            setWishlist(data.user?.wishlist || []);
        }).catch(() => setWishlist([])).finally(() => setLoading(false));
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center pt-20">
                <div className="text-center">
                    <Heart size={64} className="mx-auto text-gold-400 mb-4" />
                    <h2 className="text-2xl font-serif font-bold text-maroon-500 mb-2">Your Wishlist</h2>
                    <p className="text-stone-500 mb-6">Please log in to view and save your favourite mandaps.</p>
                    <Link href="/login" className="btn-gold px-8 py-3">Login to View</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <p className="section-subtitle mb-2">Saved Mandaps</p>
                    <h1 className="section-title flex items-center justify-center gap-3">
                        <Heart className="text-maroon-500" size={36} /> My Wishlist
                    </h1>
                    <div className="gold-divider" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden">
                                <div className="shimmer h-56 w-full" />
                                <div className="p-5 space-y-3">
                                    <div className="shimmer h-5 rounded w-3/4" />
                                    <div className="shimmer h-4 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <Heart size={72} className="mx-auto text-stone-200 mb-6" strokeWidth={1} />
                        <h3 className="text-2xl font-serif text-stone-500 mb-3">No saved mandaps yet</h3>
                        <p className="text-stone-400 mb-8">Browse our collection and tap the heart icon to save your favourites.</p>
                        <Link href="/catalog" className="btn-gold px-8 py-3">Browse Mandaps</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {wishlist.map((m, i) => (
                            <motion.div key={m._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                <MandapCard mandap={m} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
