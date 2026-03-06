"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

function StarPicker({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex items-center justify-between py-3 border-b border-stone-100">
            <span className="text-sm text-stone-600">{label}</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onMouseEnter={() => setHovered(s)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(s)}
                    >
                        <Star
                            size={22}
                            className={`transition-colors ${s <= (hovered || value) ? "fill-gold-400 text-gold-400" : "text-stone-300 fill-stone-300"}`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}

function WriteReviewForm() {
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId") || "";
    const router = useRouter();
    const { user } = useAuth();
    const [ratings, setRatings] = useState({ overall: 0, decor: 0, service: 0, value: 0 });
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!user) {
        return (
            <div className="text-center py-20">
                <p className="text-stone-500 mb-4">Please login to write a review.</p>
                <Link href="/login" className="btn-gold px-6">Login</Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (ratings.overall === 0) { toast.error("Please select an overall rating"); return; }
        if (!body.trim()) { toast.error("Please write your review"); return; }
        setSubmitting(true);
        try {
            await api.post("/reviews", { bookingId, rating: ratings, title, body });
            toast.success("Review submitted! Thank you 🙏");
            router.push("/reviews");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to submit review");
        }
        setSubmitting(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ratings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-serif text-lg text-maroon-500 mb-4">Rate Your Experience</h3>
                <StarPicker label="Overall Rating *" value={ratings.overall} onChange={(v) => setRatings({ ...ratings, overall: v })} />
                <StarPicker label="Décor Quality" value={ratings.decor} onChange={(v) => setRatings({ ...ratings, decor: v })} />
                <StarPicker label="Service & Team" value={ratings.service} onChange={(v) => setRatings({ ...ratings, service: v })} />
                <StarPicker label="Value for Money" value={ratings.value} onChange={(v) => setRatings({ ...ratings, value: v })} />
            </div>

            {/* Text */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-serif text-lg text-maroon-500">Write Your Review</h3>
                <div>
                    <label className="text-sm font-medium text-stone-600 mb-1.5 block">Review Title</label>
                    <input
                        type="text"
                        placeholder="e.g. Absolutely magical!"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-stone-600 mb-1.5 block">Your Experience *</label>
                    <textarea
                        rows={6}
                        placeholder="Tell other couples about the decoration quality, the team, what went well or could be improved..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 text-sm resize-none"
                    />
                    <p className="text-xs text-stone-400 mt-1">{body.length}/500 characters</p>
                </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-gold w-full py-4">
                {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Submitting...
                    </span>
                ) : "Submit Review 🌟"}
            </button>
        </form>
    );
}

export default function WriteReviewPage() {
    return (
        <div className="min-h-screen bg-cream pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-8">
                        <p className="section-subtitle">Your Feedback Matters</p>
                        <h1 className="section-title mt-2">Write a Review</h1>
                        <div className="gold-divider" />
                    </div>
                    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
                        <WriteReviewForm />
                    </Suspense>
                </motion.div>
            </div>
        </div>
    );
}
