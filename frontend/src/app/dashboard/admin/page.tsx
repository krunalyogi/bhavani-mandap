"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard, Users, Store, Package, Calendar,
    CreditCard, Tag, Check, X, RefreshCw,
    CalendarDays, ShoppingBag, BadgeIndianRupee, type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const TABS = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "vendors", label: "Vendors", icon: Store },
    { id: "users", label: "Users", icon: Users },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "offers", label: "Offers", icon: Tag },
];

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [tab, setTab] = useState("overview");
    const [data, setData] = useState<any>({
        bookings: [], vendors: [], users: [], payments: [], offers: [],
        stats: { bookings: 0, vendors: 0, users: 0, revenue: 0 },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { router.push("/login"); return; }
        const load = async () => {
            try {
                const [bk, vd, us, pm, of] = await Promise.all([
                    api.get("/bookings/admin?limit=20"),
                    api.get("/vendors"),
                    api.get("/users"),
                    api.get("/payments/admin"),
                    api.get("/offers"),
                ]);
                const bkData = bk.data.data || [];
                const vdData = vd.data.data || [];
                const usData = us.data.data || [];
                const pmData = pm.data.data || [];
                const pmStats = pm.data.stats || {};
                setData({
                    bookings: bkData, vendors: vdData, users: usData, payments: pmData,
                    offers: of.data.data || [],
                    stats: { bookings: bkData.length, vendors: vdData.length, users: usData.length, revenue: pmStats.totalRevenue || 0 },
                });
            } catch { }
            setLoading(false);
        };
        load();
    }, [user, router]);

    const approveVendor = async (vendorId: string, status: "approved" | "rejected") => {
        try {
            await api.put(`/vendors/${vendorId}/status`, { status });
            setData((prev: any) => ({ ...prev, vendors: prev.vendors.map((v: any) => v._id === vendorId ? { ...v, status } : v) }));
        } catch { }
    };

    const toggleUser = async (userId: string) => {
        try {
            await api.put(`/users/${userId}/toggle`);
            setData((prev: any) => ({ ...prev, users: prev.users.map((u: any) => u._id === userId ? { ...u, isActive: !u.isActive } : u) }));
        } catch { }
    };

    if (!user) return null;

    const STAT_CARDS: { label: string; value: string | number; Icon: LucideIcon; color: string }[] = [
        { label: "Total Bookings", value: data.stats.bookings, Icon: CalendarDays, color: "#3b82f6" },
        { label: "Active Vendors", value: data.stats.vendors, Icon: ShoppingBag, color: "#800000" },
        { label: "Registered Users", value: data.stats.users, Icon: Users, color: "#d4a017" },
        { label: "Total Revenue", value: `₹${(data.stats.revenue || 0).toLocaleString()}`, Icon: BadgeIndianRupee, color: "#16a34a" },
    ];

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="section-title text-2xl">Admin Dashboard</h1>
                    <p className="text-stone-500 text-sm mt-1">Bhavani Mandap – Platform Management</p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {STAT_CARDS.map((s) => (
                        <motion.div
                            key={s.label}
                            whileHover={{ y: -2 }}
                            className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 text-center"
                        >
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto"
                                style={{ background: `${s.color}18`, border: `1.5px solid ${s.color}44` }}
                            >
                                <s.Icon size={22} style={{ color: s.color }} strokeWidth={1.5} />
                            </div>
                            <p className="text-2xl font-bold font-serif" style={{ color: s.color }}>{s.value}</p>
                            <p className="text-xs text-stone-500 mt-1">{s.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${tab === id ? "bg-maroon-500 text-white" : "text-stone-600 hover:text-maroon-500"}`}
                        >
                            <Icon size={15} /> {label}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" /></div>
                ) : (
                    <>
                        {/* Bookings */}
                        {tab === "bookings" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-stone-100">
                                    <h2 className="font-serif text-lg text-maroon-500">All Bookings ({data.bookings.length})</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-stone-50">
                                            <tr>{["Ref", "Customer", "Mandap", "Date", "Amount", "Status"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{h}</th>
                                            ))}</tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {data.bookings.map((b: any) => (
                                                <tr key={b._id} className="hover:bg-stone-50">
                                                    <td className="px-4 py-3 font-mono text-xs text-stone-500">{b.bookingRef}</td>
                                                    <td className="px-4 py-3 font-medium text-stone-700">{b.user?.name}</td>
                                                    <td className="px-4 py-3 text-stone-600 max-w-[150px] truncate">{b.mandap?.title}</td>
                                                    <td className="px-4 py-3 text-stone-500">{new Date(b.eventDate).toLocaleDateString("en-IN")}</td>
                                                    <td className="px-4 py-3 font-semibold text-stone-700">₹{b.totalAmount?.toLocaleString()}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === "confirmed" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : b.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-stone-100 text-stone-500"}`}>
                                                            {b.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Vendors */}
                        {tab === "vendors" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-stone-100">
                                    <h2 className="font-serif text-lg text-maroon-500">Vendor Management ({data.vendors.length})</h2>
                                </div>
                                <div className="divide-y divide-stone-100">
                                    {data.vendors.map((v: any) => (
                                        <div key={v._id} className="flex items-center gap-4 p-5">
                                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #d4a017, #800000)" }}>
                                                {v.businessName?.[0]}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-stone-800">{v.businessName}</p>
                                                <p className="text-xs text-stone-400">{v.user?.email} · {v.address?.city}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.status === "approved" ? "bg-green-100 text-green-700" : v.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"}`}>
                                                {v.status}
                                            </span>
                                            {v.status === "pending" && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveVendor(v._id, "approved")} className="w-8 h-8 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center transition-all">
                                                        <Check size={14} />
                                                    </button>
                                                    <button onClick={() => approveVendor(v._id, "rejected")} className="w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-all">
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Users */}
                        {tab === "users" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-stone-100">
                                    <h2 className="font-serif text-lg text-maroon-500">User Management ({data.users.length})</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-stone-50">
                                            <tr>{["Name", "Email", "Phone", "Joined", "Status", "Action"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{h}</th>
                                            ))}</tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {data.users.map((u: any) => (
                                                <tr key={u._id} className="hover:bg-stone-50">
                                                    <td className="px-4 py-3 font-medium text-stone-700">{u.name}</td>
                                                    <td className="px-4 py-3 text-stone-500">{u.email}</td>
                                                    <td className="px-4 py-3 text-stone-500">{u.phone || "–"}</td>
                                                    <td className="px-4 py-3 text-stone-400">{new Date(u.createdAt).toLocaleDateString("en-IN")}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                                                            {u.isActive ? "Active" : "Inactive"}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <button onClick={() => toggleUser(u._id)} className="text-xs text-gold-600 hover:text-maroon-500 transition-colors">
                                                            <RefreshCw size={14} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Payments */}
                        {tab === "payments" && (
                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                                    <h2 className="font-serif text-lg text-maroon-500">Payment Records</h2>
                                    <span className="text-sm text-stone-500">Total Revenue: <strong className="text-green-600">₹{(data.stats.revenue || 0).toLocaleString()}</strong></span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-stone-50">
                                            <tr>{["Booking", "Customer", "Amount", "Method", "Status", "Date"].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">{h}</th>
                                            ))}</tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {data.payments.map((p: any) => (
                                                <tr key={p._id} className="hover:bg-stone-50">
                                                    <td className="px-4 py-3 font-mono text-xs">{p.booking?.bookingRef || "–"}</td>
                                                    <td className="px-4 py-3 font-medium text-stone-700">{p.user?.name}</td>
                                                    <td className="px-4 py-3 font-semibold text-stone-700">₹{((p.amount || 0) / 100).toLocaleString()}</td>
                                                    <td className="px-4 py-3 capitalize text-stone-500">{p.method}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === "captured" ? "bg-green-100 text-green-700" : p.status === "failed" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-stone-400">{p.paidAt ? new Date(p.paidAt).toLocaleDateString("en-IN") : "–"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Offers */}
                        {tab === "offers" && (
                            <div>
                                <div className="flex justify-end mb-4">
                                    <Link href="/dashboard/admin/offers/new" className="btn-gold text-sm py-2 px-5">+ Add Offer</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.offers.map((o: any) => (
                                        <div key={o._id} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 flex gap-4">
                                            {o.image?.url && <img src={o.image.url} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt={o.title} />}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-semibold text-stone-800">{o.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${o.isActive ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                                                        {o.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-stone-400 mt-1">{o.type} · {o.discountType === "percentage" ? `${o.discountValue}% off` : o.discountValue ? `₹${o.discountValue} off` : ""}</p>
                                                {o.couponCode && <p className="text-xs font-mono text-gold-600 mt-1">{o.couponCode}</p>}
                                                <p className="text-xs text-stone-400 mt-1">Valid till: {o.validTill ? new Date(o.validTill).toLocaleDateString("en-IN") : "No expiry"}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {data.offers.length === 0 && (
                                        <div className="col-span-2 text-center py-12 bg-white rounded-2xl">
                                            <p className="text-stone-400">No offers created yet</p>
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
                                        {data.bookings.slice(0, 5).map((b: any) => (
                                            <div key={b._id} className="flex justify-between items-center text-sm border-b border-stone-100 pb-3">
                                                <div>
                                                    <p className="font-medium text-stone-700">{b.user?.name}</p>
                                                    <p className="text-xs text-stone-400 font-mono">{b.bookingRef}</p>
                                                </div>
                                                <span className="text-gold-600 font-bold">₹{b.totalAmount?.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-serif text-xl text-maroon-500 mb-4">Pending Vendor Approvals</h3>
                                    <div className="space-y-3">
                                        {data.vendors.filter((v: any) => v.status === "pending").slice(0, 5).map((v: any) => (
                                            <div key={v._id} className="flex justify-between items-center border-b border-stone-100 pb-3">
                                                <div>
                                                    <p className="font-medium text-stone-700 text-sm">{v.businessName}</p>
                                                    <p className="text-xs text-stone-400">{v.address?.city}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => approveVendor(v._id, "approved")} className="text-xs btn-gold py-1 px-3">Approve</button>
                                                    <button onClick={() => approveVendor(v._id, "rejected")} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-500">Reject</button>
                                                </div>
                                            </div>
                                        ))}
                                        {data.vendors.filter((v: any) => v.status === "pending").length === 0 && (
                                            <p className="text-stone-400 text-sm">No pending approvals</p>
                                        )}
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
