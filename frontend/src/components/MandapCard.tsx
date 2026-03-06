"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

interface MandapCardProps {
    mandap: {
        _id: string;
        title: string;
        slug: string;
        images: { url: string; alt?: string }[];
        basePrice: number;
        discountedPrice?: number;
        location: { city: string; state?: string };
        ratings: { average: number; count: number };
        vendor?: { businessName: string };
        isFeatured?: boolean;
        isBestseller?: boolean;
        tags?: string[];
    };
}

export default function MandapCard({ mandap }: MandapCardProps) {
    const { toggle, isWishlisted } = useWishlist();
    const img = mandap.images?.[0]?.url || "/placeholder.jpg";
    const wishlisted = isWishlisted(mandap._id);
    const discount = mandap.discountedPrice && mandap.basePrice > mandap.discountedPrice
        ? Math.round(((mandap.basePrice - mandap.discountedPrice) / mandap.basePrice) * 100)
        : 0;

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="card-premium group"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={img}
                    alt={mandap.images?.[0]?.alt || mandap.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {mandap.isFeatured && <span className="badge-gold text-xs">★ Featured</span>}
                    {mandap.isBestseller && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-maroon-500 text-white">Bestseller</span>
                    )}
                    {discount > 0 && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500 text-white">{discount}% OFF</span>
                    )}
                </div>

                {/* Wishlist button */}
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(mandap._id); }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center transition-all hover:scale-110 shadow-md"
                >
                    <Heart
                        size={18}
                        className={wishlisted ? "fill-red-500 text-red-500" : "text-stone-400"}
                    />
                </button>

                {/* Price on image */}
                <div className="absolute bottom-3 left-3 text-white">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold">
                            ₹{(mandap.discountedPrice || mandap.basePrice).toLocaleString("en-IN")}
                        </span>
                        {discount > 0 && (
                            <span className="text-sm line-through text-white/60">
                                ₹{mandap.basePrice.toLocaleString("en-IN")}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-white/70">per event</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-stone-800 leading-tight mb-1 line-clamp-1">
                    {mandap.title}
                </h3>

                {mandap.vendor && (
                    <p className="text-xs text-stone-500 mb-2">by {mandap.vendor.businessName}</p>
                )}

                <div className="flex items-center gap-1 mb-3">
                    <MapPin size={12} className="text-gold-600" />
                    <span className="text-xs text-stone-500">{mandap.location.city}{mandap.location.state ? `, ${mandap.location.state}` : ""}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Star size={14} className="fill-gold-500 text-gold-500" />
                        <span className="text-sm font-semibold text-stone-700">{mandap.ratings.average.toFixed(1)}</span>
                        <span className="text-xs text-stone-400">({mandap.ratings.count})</span>
                    </div>

                    <Link
                        href={`/catalog/${mandap.slug || mandap._id}`}
                        className="text-sm font-semibold text-gold-600 hover:text-maroon-500 transition-colors group-hover:underline"
                    >
                        View Details →
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
