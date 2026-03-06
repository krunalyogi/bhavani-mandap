"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Filter, ThumbsUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

const SORT_OPTIONS = [
    { label: "Most Recent", value: "-createdAt" },
    { label: "Highest Rated", value: "-rating.overall" },
    { label: "Most Helpful", value: "-helpful" },
];

const FILTER_RATINGS = [5, 4, 3, 2, 1];

const DEMO_REVIEWS = [
    { _id: "1", user: { name: "Priya Sharma" }, mandap: { title: "Royal Gold Mandap" }, rating: { overall: 5, decor: 5, service: 5, value: 4 }, title: "Absolutely Magical!", body: "The team at Bhavani Mandap turned our wedding into a fairy tale. Every flower, every light was perfectly put together. Highly recommend for any couple!", helpful: 24, createdAt: "2025-12-14T00:00:00Z" },
    { _id: "2", user: { name: "Aisha Mehta" }, mandap: { title: "Mogra & Jasmine Mandap" }, rating: { overall: 5, decor: 5, service: 4, value: 5 }, title: "Exceeded All Expectations", body: "We were blown away by how beautiful everything was. The decorators were professional, punctual, and so creative. The jasmine scent was heavenly throughout the ceremony.", helpful: 18, createdAt: "2025-11-22T00:00:00Z" },
    { _id: "3", user: { name: "Kavya Nair" }, mandap: { title: "Crystal Palace Mandap" }, rating: { overall: 4, decor: 5, service: 4, value: 3 }, title: "Beautiful Setup, Minor Delays", body: "The decoration was stunning – easily the best mandap I've seen. There was a slight delay in setup but the team made up for it with their work quality.", helpful: 11, createdAt: "2025-10-08T00:00:00Z" },
    { _id: "4", user: { name: "Rohan Verma" }, mandap: { title: "Royal Gold Mandap" }, rating: { overall: 5, decor: 5, service: 5, value: 5 }, title: "Worth Every Penny", body: "Best investment for our wedding! The gold and maroon theme was exactly what we envisioned. Our guests are still talking about the decoration months later.", helpful: 31, createdAt: "2025-09-15T00:00:00Z" },
    { _id: "5", user: { name: "Deepa Krishnan" }, mandap: { title: "Lotus Floral Mandap" }, rating: { overall: 5, decor: 5, service: 5, value: 4 }, title: "Traditional & Elegant", body: "The lotus theme was perfect for our South Indian ceremony. The decorators understood every cultural nuance. Truly outstanding work!", helpful: 19, createdAt: "2025-08-22T00:00:00Z" },
    { _id: "6", user: { name: "Suresh Patel" }, mandap: { title: "Mughal Garden Mandap" }, rating: { overall: 4, decor: 4, service: 5, value: 4 }, title: "Great Service Team", body: "The team was incredibly responsive and accommodating with all our last-minute changes. The Mughal garden setup was regal and elegant.", helpful: 8, createdAt: "2025-07-30T00:00:00Z" },
];

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
                <Star
                    key={s}
                    size={size}
                    className={s <= Math.round(rating) ? "fill-gold-400 text-gold-400" : "text-stone-200 fill-stone-200"}
                />
            ))}
        </div>
    );
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<any[]>(DEMO_REVIEWS);
    const [sort, setSort] = useState("-createdAt");
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/reviews?sort=${sort}${filterRating ? `&rating=${filterRating}` : ""}&limit=20`);
                if (res.data.data?.length) setReviews(res.data.data);
            } catch {
                // use demo data
            }
            setLoading(false);
        };
        load();
    }, [sort, filterRating]);

    const avgRating = (reviews.reduce((a, r) => a + (r.rating?.overall || r.rating || 0), 0) / reviews.length).toFixed(1);

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
                    What Couples Say
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl font-bold text-white mt-3 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                    Reviews & Testimonials
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                {/* Summary stats */}
                <div className="flex items-center justify-center gap-6 mt-6">
                    <div className="text-center">
                        <p className="text-5xl font-bold text-gold-400 font-serif">{avgRating}</p>
                        <StarDisplay rating={parseFloat(avgRating)} size={18} />
                        <p className="text-white/60 text-xs mt-1">{reviews.length} reviews</p>
                    </div>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    {/* Rating filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter size={15} className="text-stone-400" />
                        <span className="text-sm text-stone-500">Filter:</span>
                        {FILTER_RATINGS.map((r) => (
                            <button
                                key={r}
                                onClick={() => setFilterRating(filterRating === r ? null : r)}
                                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${filterRating === r ? "bg-gold-500 text-white border-gold-500" : "bg-white text-stone-600 border-stone-200 hover:border-gold-300"
                                    }`}
                            >
                                <Star size={11} className={filterRating === r ? "fill-white text-white" : "fill-gold-400 text-gold-400"} />
                                {r}
                            </button>
                        ))}
                    </div>
                    {/* Sort */}
                    <div className="relative">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="appearance-none bg-white border border-stone-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-stone-600 focus:outline-none focus:border-gold-400 cursor-pointer"
                        >
                            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                </div>

                {/* Review Cards */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div className="space-y-5">
                        {reviews.map((review, i) => (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-maroon-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                            {review.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800 text-sm">{review.user?.name}</p>
                                            <p className="text-xs text-stone-400">
                                                {review.mandap?.title} · {new Date(review.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                    <StarDisplay rating={review.rating?.overall || review.rating} />
                                </div>
                                {review.title && <h3 className="font-semibold text-stone-800 mb-2">{review.title}</h3>}
                                <p className="text-stone-600 text-sm leading-relaxed mb-4">{review.body || review.comment}</p>
                                {/* Sub-ratings */}
                                {review.rating?.decor && (
                                    <div className="flex gap-4 text-xs text-stone-400 border-t border-stone-100 pt-3 mb-3">
                                        {[["Décor", review.rating.decor], ["Service", review.rating.service], ["Value", review.rating.value]].map(([label, val]) => (
                                            <div key={label as string} className="flex items-center gap-1">
                                                <span>{label}:</span>
                                                <StarDisplay rating={val as number} size={11} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <button className="flex items-center gap-1 hover:text-gold-500 transition-colors">
                                        <ThumbsUp size={13} /> Helpful ({review.helpful || 0})
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Write review CTA */}
                <div className="mt-10 text-center bg-white rounded-2xl p-8 shadow-sm">
                    <p className="text-2xl font-serif text-maroon-500 mb-2">Booked with us?</p>
                    <p className="text-stone-500 text-sm mb-5">Your experience helps other couples make the right choice.</p>
                    <Link href="/reviews/new" className="btn-gold px-8 py-3">Write a Review</Link>
                </div>
            </div>
        </div>
    );
}
