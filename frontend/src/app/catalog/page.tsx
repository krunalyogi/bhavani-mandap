"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import api from "@/lib/api";
import MandapCard from "@/components/MandapCard";

const DECORATION_STYLES = ["traditional", "modern", "royal", "floral", "minimalist", "fusion"];
const CITIES = ["Mehsana", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Anand", "Motap"];
const SORT_OPTIONS = [
    { value: "-createdAt", label: "Newest First" },
    { value: "-ratings.average", label: "Top Rated" },
    { value: "basePrice", label: "Price: Low to High" },
    { value: "-basePrice", label: "Price: High to Low" },
    { value: "-bookingCount", label: "Most Popular" },
];

function CatalogContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mandaps, setMandaps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: searchParams?.get("search") || "",
        city: searchParams?.get("city") || "",
        style: searchParams?.get("style") || "",
        minPrice: searchParams?.get("minPrice") || "",
        maxPrice: searchParams?.get("maxPrice") || "",
        capacity: searchParams?.get("capacity") || "",
        sort: searchParams?.get("sort") || "-createdAt",
    });

    const fetchMandaps = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: "12", ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) });
            const { data } = await api.get(`/mandaps?${params}`);
            setMandaps(data.data || []);
            setTotal(data.pagination?.total || 0);

            // Sync to URL
            const urlParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "-createdAt") {
                    urlParams.set(key, value);
                }
            });
            const newUrl = urlParams.toString() ? `/catalog?${urlParams.toString()}` : '/catalog';
            router.push(newUrl, { scroll: false });
            
        } catch { setMandaps([]); }
        setLoading(false);
    }, [filters, page, router]);

    useEffect(() => { fetchMandaps(); }, [fetchMandaps]);

    const updateFilter = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPage(1);
    };

    const clearFilters = () => {
        setFilters({ search: "", city: "", style: "", minPrice: "", maxPrice: "", capacity: "", sort: "-createdAt" });
        setPage(1);
    };

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <p className="section-subtitle mb-2">Browse & Discover</p>
                    <h1 className="section-title">Mandap Designs</h1>
                    <div className="gold-divider" />
                    <p className="text-stone-500 mt-4">{total} mandap designs available</p>
                </div>

                {/* Search bar */}
                <div className="flex gap-3 mb-8">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search mandaps, styles, locations..."
                            value={filters.search}
                            onChange={(e) => updateFilter("search", e.target.value)}
                            className="input-premium pl-12"
                        />
                    </div>
                    <button
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl border transition-all ${filterOpen ? "bg-gold-500 text-white border-gold-500" : "border-stone-200 text-stone-600 hover:border-gold-400"}`}
                    >
                        <SlidersHorizontal size={18} /> Filters
                    </button>
                    <select
                        value={filters.sort}
                        onChange={(e) => updateFilter("sort", e.target.value)}
                        className="input-premium w-52"
                    >
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                </div>

                {/* Filter Panel */}
                {filterOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white rounded-2xl p-6 mb-8 border border-gold-100 shadow-sm"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-stone-600 mb-2 block">City</label>
                                <select value={filters.city} onChange={(e) => updateFilter("city", e.target.value)} className="input-premium text-sm">
                                    <option value="">All Cities</option>
                                    {CITIES.map((c) => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-stone-600 mb-2 block">Style</label>
                                <select value={filters.style} onChange={(e) => updateFilter("style", e.target.value)} className="input-premium text-sm">
                                    <option value="">All Styles</option>
                                    {DECORATION_STYLES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-stone-600 mb-2 block">Min Price (₹)</label>
                                <input type="number" placeholder="0" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} className="input-premium text-sm" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-stone-600 mb-2 block">Max Price (₹)</label>
                                <input type="number" placeholder="500000" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} className="input-premium text-sm" />
                            </div>
                        </div>
                        <button onClick={clearFilters} className="mt-4 text-sm text-stone-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                            <X size={14} /> Clear Filters
                        </button>
                    </motion.div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden">
                                <div className="shimmer h-56 w-full" />
                                <div className="p-5 space-y-3">
                                    <div className="shimmer h-5 rounded w-3/4" />
                                    <div className="shimmer h-4 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : mandaps.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-serif text-stone-600">No mandaps found</h3>
                        <p className="text-stone-400 mt-2">Try adjusting your filters</p>
                        <button onClick={clearFilters} className="btn-gold mt-6">Clear Filters</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {mandaps.map((m, i) => (
                                <motion.div key={m._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                    <MandapCard mandap={m} />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {Math.ceil(total / 12) > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                {[...Array(Math.ceil(total / 12))].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={`w-10 h-10 rounded-full font-semibold transition-all ${page === i + 1 ? "bg-gold-500 text-white" : "bg-white text-stone-600 hover:bg-gold-50 border border-stone-200"}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default function CatalogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
            </div>
        }>
            <CatalogContent />
        </Suspense>
    );
}
