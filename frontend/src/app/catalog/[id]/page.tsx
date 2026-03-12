"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Users, ChevronLeft, ChevronRight, Share2, Check, Sparkles, Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function MandapDetailPage() {
    const { id } = useParams();
    const [mandap, setMandap] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);
    const [copied, setCopied] = useState(false);

    const shareLink = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    useEffect(() => {
        const load = async () => {
            try {
                const [md, rv] = await Promise.all([
                    api.get(`/mandaps/${id}`),
                    api.get(`/reviews/mandap/${id}`),
                ]);
                setMandap(md.data.data);
                setReviews(rv.data.data || []);
            } catch { toast.error("Failed to load mandap"); }
            setLoading(false);
        };
        load();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
                <div className="flex gap-2">
                    {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
            </div>
        );
    }

    if (!mandap) return (
        <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
            <div className="text-center">
                <p className="text-6xl mb-4">🏰</p>
                <h2 className="text-2xl font-serif text-stone-700">Mandap not found</h2>
                <Link href="/catalog" className="btn-gold mt-6 inline-flex">Back to Catalog</Link>
            </div>
        </div>
    );

    const images = mandap.images || [];
    const effectivePrice = mandap.discountedPrice || mandap.basePrice;

    return (
        <div className="min-h-screen bg-cream pt-20 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-stone-400 py-6">
                    <Link href="/" className="hover:text-gold-600">Home</Link> /
                    <Link href="/catalog" className="hover:text-gold-600">Catalog</Link> /
                    <span className="text-stone-700">{mandap.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Carousel */}
                    <div>
                        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-premium bg-stone-100">
                            {images.length > 0 ? (
                                <>
                                    <img
                                        src={images[currentImage]?.url}
                                        alt={mandap.title}
                                        className="w-full h-full object-cover"
                                    />
                                    {images.length > 1 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentImage((c) => (c - 1 + images.length) % images.length)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-md transition-all"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => setCurrentImage((c) => (c + 1) % images.length)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center hover:bg-white shadow-md transition-all"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {images.map((_: any, i: number) => (
                                            <button key={i} onClick={() => setCurrentImage(i)}
                                                className={`h-2 rounded-full transition-all ${i === currentImage ? "bg-gold-400 w-6" : "bg-white/60 w-2"}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-stone-300">
                                    <p className="text-5xl">🏰</p>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {images.map((img: any, i: number) => (
                                    <button key={i} onClick={() => setCurrentImage(i)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === currentImage ? "border-gold-500" : "border-transparent"}`}
                                    >
                                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {mandap.isFeatured && <span className="badge-gold">★ Featured</span>}
                            {mandap.isBestseller && <span className="px-3 py-1 rounded-full text-xs font-bold bg-maroon-500 text-white">Bestseller</span>}
                            {mandap.decorationStyles?.map((s: string) => (
                                <span key={s} className="px-3 py-1 rounded-full text-xs bg-stone-100 text-stone-600 capitalize">{s}</span>
                            ))}
                        </div>

                        <h1 className="section-title text-3xl md:text-4xl mb-2">{mandap.title}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.round(mandap.ratings.average) ? "fill-gold-500 text-gold-500" : "text-stone-300"} />
                                ))}
                                <span className="text-sm font-semibold text-stone-700 ml-1">{mandap.ratings.average.toFixed(1)}</span>
                                <span className="text-xs text-stone-400">({mandap.ratings.count} reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                            <MapPin size={16} className="text-gold-600" />
                            <span className="text-stone-600">{mandap.location.city}{mandap.location.state ? `, ${mandap.location.state}` : ""}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                            <Users size={16} className="text-gold-600" />
                            <span className="text-stone-600">{mandap.capacity?.min}–{mandap.capacity?.max} guests</span>
                        </div>

                        {/* Price */}
                        <div className="bg-white rounded-2xl p-6 border border-gold-100 mb-6">
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-3xl font-bold text-maroon-500">₹{effectivePrice.toLocaleString("en-IN")}</span>
                                {mandap.discountedPrice && (
                                    <span className="text-xl text-stone-400 line-through">₹{mandap.basePrice.toLocaleString("en-IN")}</span>
                                )}
                            </div>
                            <p className="text-sm text-stone-400">per event · 18% GST applicable · 30% advance required</p>
                        </div>

                        {/* Description */}
                        {mandap.description && (
                            <p className="text-stone-600 leading-relaxed mb-6">{mandap.description}</p>
                        )}

                        {/* Services included */}
                        {mandap.services?.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-stone-800 mb-3">What's Included</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {mandap.services.filter((s: any) => s.included).map((s: any) => (
                                        <div key={s.name} className="flex items-center gap-2 text-sm text-stone-600">
                                            <Check size={14} className="text-green-500 flex-shrink-0" /> {s.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <a
                                href="tel:+919824520806"
                                className="btn-gold w-full text-center py-4 text-base flex items-center justify-center gap-2"
                            >
                                <Phone size={18} /> Call to Enquire
                            </a>
                            <a
                                href={`https://wa.me/919824520806?text=Hi! I'm interested in booking ${encodeURIComponent(mandap?.title || 'your mandap')}. Please send me more details.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline-gold w-full text-center py-4 text-base flex items-center justify-center gap-2"
                            >
                                <MessageCircle size={18} /> WhatsApp Us
                            </a>
                            <button onClick={shareLink} className="flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-200 hover:border-gold-200 hover:bg-gold-50 transition-all text-sm text-stone-600">
                                <Share2 size={18} className="text-stone-400" /> {copied ? "Link copied!" : "Share"}
                            </button>
                        </div>

                        {/* Vendor Info */}
                        {mandap.vendor && (
                            <div className="mt-6 p-4 bg-stone-50 rounded-xl flex items-center gap-4">
                                {mandap.vendor.logo?.url ? (
                                    <img src={mandap.vendor.logo.url} className="w-12 h-12 rounded-full object-cover" alt={mandap.vendor.businessName} />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-white font-bold">
                                        {mandap.vendor.businessName?.[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold text-stone-800">{mandap.vendor.businessName}</p>
                                    <p className="text-xs text-stone-400">{mandap.vendor.ratings?.count || 0} reviews · Verified Vendor</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                {reviews.length > 0 && (
                    <div className="mt-16">
                        <h2 className="section-title text-2xl mb-8">Customer Reviews</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.slice(0, 6).map((r: any) => (
                                <div key={r._id} className="bg-white rounded-2xl p-6 border border-stone-100">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                                            {r.user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold text-stone-800">{r.user?.name}</p>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={12} className={i < r.rating ? "fill-gold-500 text-gold-500" : "text-stone-200"} />
                                                    ))}
                                                </div>
                                            </div>
                                            {r.title && <p className="text-sm font-medium text-stone-700 mb-1">{r.title}</p>}
                                            <p className="text-sm text-stone-500 leading-relaxed">{r.comment}</p>
                                            {r.vendorReply?.comment && (
                                                <div className="mt-3 pl-3 border-l-2 border-gold-300 bg-gold-50 rounded-r-lg py-2 pr-3">
                                                    <p className="text-xs font-semibold text-gold-700 mb-1">Vendor Reply:</p>
                                                    <p className="text-xs text-stone-600">{r.vendorReply.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
