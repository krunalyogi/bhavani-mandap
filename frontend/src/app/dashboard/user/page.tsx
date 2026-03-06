"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Calendar, Heart, Star, User, LogOut, MapPin, Clock, CheckCircle, Trophy, IndianRupee, type LucideIcon } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const TAB_ITEMS = [
    { id: "overview", label: "Overview", icon: User },
    { id: "bookings", label: "My Bookings", icon: Calendar },
    { id: "wishlist", label: "Wishlist", icon: Heart },
];

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    in_progress: "bg-blue-100 text-blue-700",
    completed: "bg-stone-100 text-stone-600",
    cancelled: "bg-red-100 text-red-600",
};

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState("overview");
    const [bookings, setBookings] = useState<any[]>([]);
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, confirmed: 0, completed: 0, spent: 0 });

    useEffect(() => {
        if (!user) { router.push("/login"); return; }
        const load = async () => {
            try {
                const [bk, wl] = await Promise.all([
                    api.get("/bookings/my?limit=20"),
                    api.get("/users/wishlist"),
                ]);
                const bkData = bk.data.data || [];
                setBookings(bkData);
                setWishlist(wl.data.data || []);
                setStats({
                    total: bkData.length,
                    confirmed: bkData.filter((b: any) => b.status === "confirmed").length,
                    completed: bkData.filter((b: any) => b.status === "completed").length,
                    spent: bkData.filter((b: any) => b.paymentStatus !== "unpaid").reduce((a: number, b: any) => a + (b.advanceAmount || 0), 0),
                });
            } catch { }
            setLoading(false);
        };
        load();
    }, [user, router]);

    if (!user) return null;

    const STAT_CARDS: { label: string; value: string | number; Icon: LucideIcon; color: string }[] = [
        { label: "Total Bookings", value: stats.total, Icon: Calendar, color: "#3b82f6" },
        { label: "Confirmed", value: stats.confirmed, Icon: CheckCircle, color: "#16a34a" },
        { label: "Completed", value: stats.completed, Icon: Trophy, color: "#d4a017" },
        { label: "Amount Paid", value: `₹${stats.spent.toLocaleString()}`, Icon: IndianRupee, color: "#800000" },
    ];

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="section-title text-2xl">Welcome back, {user?.name?.split(" ")[0]}</h1>
                        <p className="text-stone-500 text-sm mt-1">Manage your bookings and wishlist</p>
                    </div>
                    <button onClick={logout} className="flex items-center gap-2 text-sm text-stone-500 hover:text-red-500 transition-colors">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {STAT_CARDS.map((s) => (
                        <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm text-center border border-stone-100">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto"
                                style={{ background: `${s.color}18`, border: `1.5px solid ${s.color}44` }}
                            >
                                <s.Icon size={22} style={{ color: s.color }} strokeWidth={1.5} />
                            </div>
                            <p className="text-2xl font-bold text-maroon-500 font-serif">{s.value}</p>
                            <p className="text-xs text-stone-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm w-fit">
                    {TAB_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-gold-500 text-white shadow-sm" : "text-stone-600 hover:text-gold-600"}`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <>
                        {/* Bookings */}
                        {tab === "bookings" && (
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl">
                                        <Calendar size={48} className="mx-auto text-stone-200 mb-4" strokeWidth={1} />
                                        <h3 className="text-lg font-serif text-stone-600">No bookings yet</h3>
                                        <Link href="/catalog" className="btn-gold mt-6 inline-flex">Browse Mandaps</Link>
                                    </div>
                                ) : (
                                    bookings.map((b: any) => (
                                        <motion.div key={b._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            {b.mandap?.images?.[0]?.url && (
                                                <img src={b.mandap.images[0].url} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" alt={b.mandap.title} />
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h3 className="font-semibold text-stone-800">{b.mandap?.title}</h3>
                                                        <p className="text-xs font-mono text-stone-400 mt-0.5">{b.bookingRef}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_COLORS[b.status] || "bg-stone-100 text-stone-600"}`}>
                                                        {b.status?.replace("_", " ").toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex gap-4 mt-3 text-sm text-stone-500">
                                                    <span className="flex items-center gap-1"><Calendar size={13} />{new Date(b.eventDate).toDateString()}</span>
                                                    <span className="flex items-center gap-1"><Clock size={13} />{b.eventTime}</span>
                                                    {b.mandap?.location && <span className="flex items-center gap-1"><MapPin size={13} />{b.mandap.location.city}</span>}
                                                </div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <p className="font-bold text-maroon-500">₹{b.totalAmount?.toLocaleString()} <span className="text-xs text-stone-400 font-normal">total</span></p>
                                                    {b.status === "completed" && !b.isReviewed && (
                                                        <Link href={`/reviews/new?bookingId=${b._id}`} className="text-xs btn-outline-gold py-1 px-3">Write Review</Link>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Wishlist */}
                        {tab === "wishlist" && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.length === 0 ? (
                                    <div className="col-span-full text-center py-16 bg-white rounded-2xl">
                                        <Heart size={48} className="mx-auto text-stone-200 mb-4" strokeWidth={1} />
                                        <h3 className="text-lg font-serif text-stone-600">Your wishlist is empty</h3>
                                        <Link href="/catalog" className="btn-gold mt-6 inline-flex">Explore Mandaps</Link>
                                    </div>
                                ) : (
                                    wishlist.map((m: any) => (
                                        <Link key={m._id} href={`/catalog/${m.slug || m._id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all group">
                                            {m.images?.[0]?.url && (
                                                <img src={m.images[0].url} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" alt={m.title} />
                                            )}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-stone-800 line-clamp-1">{m.title}</h3>
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-gold-600 font-bold">₹{(m.discountedPrice || m.basePrice)?.toLocaleString()}</span>
                                                    <span className="flex items-center gap-1 text-xs text-stone-400">
                                                        <Star size={11} className="fill-gold-400 text-gold-400" />{m.ratings?.average.toFixed(1)}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Overview */}
                        {tab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-serif text-lg text-maroon-500 mb-4">Profile Details</h3>
                                    <div className="space-y-3 text-sm">
                                        {[{ label: "Name", value: user?.name }, { label: "Email", value: user?.email }, { label: "Role", value: user?.role?.toUpperCase() }].map((f) => (
                                            <div key={f.label} className="flex justify-between border-b border-stone-100 pb-3">
                                                <span className="text-stone-400">{f.label}</span>
                                                <span className="font-medium text-stone-700">{f.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-serif text-lg text-maroon-500 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link href="/catalog" className="btn-gold w-full text-center py-3 text-sm">Browse New Mandaps</Link>
                                        <Link href="/chat" className="btn-outline-gold w-full text-center py-3 text-sm">Chat with Vendor</Link>
                                        <Link href="/notifications" className="w-full py-3 text-sm text-center rounded-xl border border-stone-200 text-stone-600 hover:border-gold-300 transition-all block">View Notifications</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
