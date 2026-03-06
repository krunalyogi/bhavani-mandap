"use client";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const CATEGORIES = ["All", "Royal Mandap", "Floral Décor", "Stage", "Lighting", "Entry Gate", "Reception"];

const GALLERY_ITEMS = [
    { id: 1, category: "Royal Mandap", title: "Gold & White Royal Setup", location: "Mehsana", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80", aspect: "landscape" },
    { id: 2, category: "Floral Décor", title: "Rose & Marigold Arch", location: "Ahmedabad", src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80", aspect: "portrait" },
    { id: 3, category: "Stage", title: "Velvet Backdrop Stage", location: "Surat", src: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=800&q=80", aspect: "landscape" },
    { id: 4, category: "Lighting", title: "Fairy Light Canopy", location: "Vadodara", src: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80", aspect: "portrait" },
    { id: 5, category: "Entry Gate", title: "Floral Entry Arch", location: "Rajkot", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", aspect: "landscape" },
    { id: 6, category: "Reception", title: "Grand Reception Setup", location: "Gandhinagar", src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", aspect: "landscape" },
    { id: 7, category: "Royal Mandap", title: "Maroon & Gold Mandap", location: "Mehsana", src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80", aspect: "portrait" },
    { id: 8, category: "Floral Décor", title: "Orchid & Lily Decor", location: "Ahmedabad", src: "https://images.unsplash.com/photo-1523438096851-9de18a8b11a4?w=800&q=80", aspect: "landscape" },
    { id: 9, category: "Stage", title: "Led Wall Stage", location: "Surat", src: "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?w=800&q=80", aspect: "landscape" },
    { id: 10, category: "Lighting", title: "Chandelier Mandap", location: "Vadodara", src: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80", aspect: "portrait" },
    { id: 11, category: "Entry Gate", title: "Jasmine Gate Decor", location: "Mehsana", src: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80", aspect: "landscape" },
    { id: 12, category: "Reception", title: "Crystal Ballroom Setup", location: "Ahmedabad", src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80", aspect: "portrait" },
];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" as const } }),
};

export default function GalleryPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const filtered = activeCategory === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === activeCategory);

    const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null));
    const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null));

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            {/* Header */}
            <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
                    Our Portfolio
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl font-bold text-white mt-3 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                    Gallery
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                <p className="text-white/70 max-w-xl mx-auto text-sm">
                    Every event tells a unique love story. Explore our stunning collection of mandap setups and wedding decorations.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {/* Filter Pills */}
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                ? "bg-gold-500 text-white shadow-gold"
                                : "bg-white text-stone-600 border border-stone-200 hover:border-gold-300"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {filtered.map((item, i) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                            custom={i}
                            className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300"
                            onClick={() => setLightboxIndex(i)}
                        >
                            <img
                                src={item.src}
                                alt={item.title}
                                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                style={{ aspectRatio: item.aspect === "portrait" ? "3/4" : "4/3" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-semibold text-sm">{item.title}</p>
                                    <p className="text-gold-300 text-xs mt-1">{item.location}</p>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <ZoomIn className="text-white w-8 h-8 opacity-80" />
                                </div>
                            </div>
                            <span className="absolute top-3 left-3 bg-gold-500/90 text-white text-xs px-2.5 py-1 rounded-full">
                                {item.category}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Close */}
                        <button
                            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <X size={28} />
                        </button>

                        {/* Prev */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* Image */}
                        <motion.div
                            key={lightboxIndex}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-4xl w-full"
                        >
                            <img
                                src={filtered[lightboxIndex].src}
                                alt={filtered[lightboxIndex].title}
                                className="w-full rounded-2xl object-cover max-h-[80vh]"
                            />
                            <div className="mt-4 text-center">
                                <p className="text-white font-semibold text-lg">{filtered[lightboxIndex].title}</p>
                                <p className="text-gold-400 text-sm mt-1">{filtered[lightboxIndex].category} · {filtered[lightboxIndex].location}</p>
                            </div>
                        </motion.div>

                        {/* Next */}
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                            {lightboxIndex + 1} / {filtered.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
