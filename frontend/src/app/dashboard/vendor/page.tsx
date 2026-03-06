"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, BarChart3, Package, Calendar, MessageCircle, DollarSign, ToggleLeft, ToggleRight, Building2, Clock, Users, TrendingUp, Star, type LucideIcon } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const TABS = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "mandaps", label: "My Mandaps", icon: Package },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "earnings", label: "Earnings", icon: DollarSign },
];

export default function VendorDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState("overview");
    const [mandaps, setMandaps] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [vendor, setVendor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalMandaps: 0, totalBookings: 0, pendingBookings: 0, totalEarnings: 0 });

    useEffect(() => {
        if (!user) { router.push("/login"); return; }
        const load = async () => {
            try {
                const [vd, bk, md] = await Promise.all([
                    api.get("/vendors/me/profile"),
                    api.get("/bookings/vendor?limit=20"),
                    api.get("/mandaps?limit=50"),
                ]);
                setVendor(vd.data.data);
                const bkData = bk.data.data || [];
                setBookings(bkData);
                setMandaps(md.data.data?.filter((m: any) => m.vendor?._id === vd.data.data?._id) || []);
                setStats({
                    totalMandaps: md.data.data?.filter((m: any) => m.vendor?._id === vd.data.data?._id).length || 0,
                    totalBookings: bkData.length,
                    pendingBookings: bkData.filter((b: any) => b.status === "pending").length,
                    totalEarnings: vd.data.data?.totalEarnings || 0,
                });
            } catch { }
            setLoading(false);
        };
        load();
    }, [user, router]);

    const toggleMandap = async (mandapId: string, isActive: boolean) => {
        try {
            await api.put(`/mandaps/${mandapId}`, { isActive: !isActive });
            setMandaps((prev) => prev.map((m) => m._id === mandapId ? { ...m, isActive: !isActive } : m));
        } catch { }
    };

    const updateBookingStatus = async (bookingId: string, status: string) => {
        try {
            await api.put(`/bookings/${bookingId}/status`, { status });
            setBookings((prev) => prev.map((b) => b._id === bookingId ? { ...b, status } : b));
        } catch { }
    };

    if (!user) return null;

    const STAT_CARDS: { label: string; value: string | number; Icon: LucideIcon; color: string }[] = [
        { label: "My Mandaps", value: stats.totalMandaps, Icon: Building2, color: "#800000" },
        { label: "Total Bookings", value: stats.totalBookings, Icon: Calendar, color: "#3b82f6" },
        { label: "Pending", value: stats.pendingBookings, Icon: Clock, color: "#d97706" },
        { label: "Earnings", value: `₹${stats.totalEarnings.toLocaleString()}`, Icon: TrendingUp, color: "#16a34a" },
    ];

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="section-title text-2xl">Vendor Dashboard</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${vendor?.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {vendor?.status?.toUpperCase() || "PENDING"}
                            </span>
                        </div>
                        <p className="text-stone-500 text-sm">{vendor?.businessName}</p>
                    </div>
                    <Link href="/dashboard/vendor/upload" className="btn-gold text-sm py-2 px-4 flex items-center gap-2">
                        <Plus size={16} /> Add New Mandap
                    </Link>
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
                            <p className={`text-2xl font-bold font-serif`} style={{ color: s.color }}>{s.value}</p>
                            <p className="text-xs text-stone-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === id ? "bg-gold-500 text-white" : "text-stone-600 hover:text-gold-600"}`}
                        >
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" /></div>
                ) : (
                    <>
                        {/* My Mandaps */}
                        {tab === "mandaps" && (
                            <div className="space-y-4">
                                <div className="flex justify-end">
                                    <Link href="/dashboard/vendor/upload" className="btn-gold text-sm py-2 px-5 flex items-center gap-2"><Plus size={16} /> Add Mandap</Link>
                                </div>
                                {mandaps.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl">
                                        <Building2 size={48} className="mx-auto text-stone-200 mb-4" strokeWidth={1} />
                                        <h3 className="font-serif text-lg text-stone-600">No mandaps listed yet</h3>
                                        <p className="text-stone-400 text-sm mt-1">Add your first mandap design to start getting bookings</p>
                                    </div>
                                ) : (
                                    mandaps.map((m: any) => (
                                        <div key={m._id} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-center">
                                            {m.images?.[0]?.url && (
                                                <img src={m.images[0].url} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt={m.title} />
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-stone-800">{m.title}</h3>
                                                <div className="flex gap-4 text-sm text-stone-400 mt-1">
                                                    <span>₹{(m.discountedPrice || m.basePrice)?.toLocaleString()}</span>
                                                    <span>{m.location?.city}</span>
                                                    <span className="flex items-center gap-1"><Star size={12} className="fill-gold-400 text-gold-400" /> {m.ratings?.average?.toFixed(1)} ({m.ratings?.count})</span>
                                                    <span className="flex items-center gap-1"><Calendar size={12} /> {m.bookingCount || 0} bookings</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button onClick={() => toggleMandap(m._id, m.isActive)} className={m.isActive ? "text-green-500" : "text-stone-300"}>
                                                    {m.isActive ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                                                </button>
                                                <Link href={`/catalog/${m.slug || m._id}`} className="text-xs text-gold-600 hover:underline">View</Link>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Bookings */}
                        {tab === "bookings" && (
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-2xl">
                                        <Calendar size={48} className="mx-auto text-stone-200 mb-4" strokeWidth={1} />
                                        <h3 className="font-serif text-lg text-stone-600">No bookings received yet</h3>
                                    </div>
                                ) : (
                                    bookings.map((b: any) => (
                                        <div key={b._id} className="bg-white rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <p className="font-semibold text-stone-800">{b.user?.name}</p>
                                                        <p className="text-xs text-stone-400 mt-0.5">{b.bookingRef} · {b.eventType}</p>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-stone-100 text-stone-500"}`}>
                                                        {b.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-stone-400 mt-2">
                                                    <span className="flex items-center gap-1"><Calendar size={13} />{new Date(b.eventDate).toDateString()}</span>
                                                    <span className="flex items-center gap-1"><Users size={13} />{b.guestCount} guests</span>
                                                    <span className="flex items-center gap-1 font-medium text-stone-600">₹{b.totalAmount?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            {b.status === "pending" && (
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <button onClick={() => updateBookingStatus(b._id, "confirmed")} className="btn-gold text-xs py-2 px-4">Confirm</button>
                                                    <button onClick={() => updateBookingStatus(b._id, "cancelled")} className="text-xs px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50">Decline</button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Earnings */}
                        {tab === "earnings" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100">
                                    <h3 className="font-serif text-xl text-maroon-500 mb-6">Earnings Summary</h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                                            <span className="text-stone-600">Total Earnings</span>
                                            <span className="text-2xl font-bold text-green-600">₹{(vendor?.totalEarnings || 0).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-stone-50 rounded-xl">
                                            <span className="text-stone-600">Completed Bookings</span>
                                            <span className="text-xl font-bold text-stone-700">{vendor?.completedBookings || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-stone-50 rounded-xl">
                                            <span className="text-stone-600">Avg Rating</span>
                                            <span className="flex items-center gap-1.5 text-xl font-bold text-gold-600">
                                                <Star size={18} className="fill-gold-400 text-gold-400" />
                                                {vendor?.ratings?.average?.toFixed(1) || "–"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-serif text-xl text-maroon-500 mb-4">Bank Details</h3>
                                    {vendor?.bankDetails?.accountNumber ? (
                                        <div className="space-y-3 text-sm">
                                            <p className="text-stone-600">Account: <span className="font-mono text-stone-800">••••{vendor.bankDetails.accountNumber.slice(-4)}</span></p>
                                            <p className="text-stone-600">Bank: <span className="font-semibold text-stone-800">{vendor.bankDetails.bankName}</span></p>
                                            <p className="text-stone-600">IFSC: <span className="font-mono text-stone-800">{vendor.bankDetails.ifscCode}</span></p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-stone-400 text-sm">No bank details added</p>
                                            <Link href="/dashboard/vendor/settings" className="btn-outline-gold text-sm mt-4 inline-flex">Add Bank Details</Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Overview */}
                        {tab === "overview" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-serif text-xl text-maroon-500 mb-4">Recent Bookings</h3>
                                    <div className="space-y-3">
                                        {bookings.slice(0, 5).map((b: any) => (
                                            <div key={b._id} className="flex items-center justify-between text-sm border-b border-stone-100 pb-3">
                                                <div>
                                                    <p className="font-medium text-stone-700">{b.user?.name}</p>
                                                    <p className="text-xs text-stone-400">{new Date(b.eventDate).toDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                    {b.status}
                                                </span>
                                            </div>
                                        ))}
                                        {bookings.length === 0 && <p className="text-stone-400 text-sm">No bookings yet</p>}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-serif text-xl text-maroon-500 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <Link href="/chat" className="flex items-center justify-center gap-2 btn-gold text-center text-sm py-3"><MessageCircle size={16} />Chat with Customers</Link>
                                        <Link href="/dashboard/vendor/upload" className="flex items-center justify-center gap-2 btn-outline-gold text-center text-sm py-3"><Plus size={16} />Add Mandap Design</Link>
                                        <Link href="/notifications" className="block py-3 rounded-xl border border-stone-200 text-center text-stone-600 text-sm hover:border-gold-300 transition-all">View Notifications</Link>
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
