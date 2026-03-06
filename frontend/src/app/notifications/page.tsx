"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, CreditCard, MessageCircle, Trash2, CheckCheck } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import toast from "react-hot-toast";

const TYPE_ICON: Record<string, any> = {
    booking: Calendar,
    payment: CreditCard,
    message: MessageCircle,
    general: Bell,
};

const TYPE_COLOR: Record<string, string> = {
    booking: "bg-blue-100 text-blue-600",
    payment: "bg-green-100 text-green-600",
    message: "bg-purple-100 text-purple-600",
    general: "bg-gold-100 text-gold-600",
};

const DEMO_NOTIFICATIONS = [
    { _id: "1", type: "booking", title: "Booking Confirmed!", message: "Your booking for Royal Gold Mandap on 25 Dec 2025 has been confirmed by the vendor.", isRead: false, createdAt: "2025-12-10T09:00:00Z", link: "/dashboard/user" },
    { _id: "2", type: "payment", title: "Payment Received", message: "₹15,000 advance payment received for your booking #BM2025001.", isRead: false, createdAt: "2025-12-09T14:30:00Z", link: "/dashboard/user" },
    { _id: "3", type: "message", title: "New Message from Vendor", message: "Bhavani Decors has sent you a message regarding your event setup details.", isRead: true, createdAt: "2025-12-08T11:00:00Z", link: "/chat" },
    { _id: "4", type: "general", title: "Offer Alert! 🎉", message: "Get 10% off on bookings this wedding season. Use code BHAVANI10 at checkout.", isRead: true, createdAt: "2025-12-07T10:00:00Z", link: "/catalog" },
    { _id: "5", type: "booking", title: "Reminder: Event in 3 Days", message: "Your Royal Gold Mandap event is scheduled for 25 Dec 2025. The team will arrive by 6 AM.", isRead: true, createdAt: "2025-12-06T09:00:00Z", link: "/dashboard/user" },
];

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>(DEMO_NOTIFICATIONS);
    const [loading, setLoading] = useState(false);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await api.get("/notifications?limit=30");
                if (res.data.data?.length) setNotifications(res.data.data);
            } catch { }
            setLoading(false);
        };
        load();
    }, [user]);

    const markAllRead = async () => {
        try {
            await api.put("/notifications/read-all");
        } catch { }
        setNotifications((n) => n.map((item) => ({ ...item, isRead: true })));
        toast.success("All notifications marked as read");
    };

    const markRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
        } catch { }
        setNotifications((n) => n.map((item) => item._id === id ? { ...item, isRead: true } : item));
    };

    const deleteNotification = (id: string) => {
        setNotifications((n) => n.filter((item) => item._id !== id));
        toast.success("Notification deleted");
    };

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="section-title text-2xl">Notifications</h1>
                        {unreadCount > 0 && (
                            <p className="text-sm text-stone-500 mt-1">{unreadCount} unread notification{unreadCount > 1 ? "s" : ""}</p>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllRead}
                            className="flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 font-medium transition-colors"
                        >
                            <CheckCheck size={16} /> Mark all read
                        </button>
                    )}
                </div>

                {/* Notifications */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-2xl">
                        <Bell size={48} className="mx-auto text-stone-300 mb-4" />
                        <h3 className="font-serif text-xl text-stone-500">No notifications yet</h3>
                        <p className="text-stone-400 text-sm mt-2">When you get notifications, they'll show up here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif, i) => {
                            const Icon = TYPE_ICON[notif.type] || Bell;
                            return (
                                <motion.div
                                    key={notif._id}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className={`relative bg-white rounded-2xl p-5 shadow-sm flex gap-4 transition-all ${!notif.isRead ? "border-l-4 border-gold-400" : "border border-stone-100"}`}
                                >
                                    {/* Icon */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[notif.type] || "bg-stone-100 text-stone-500"}`}>
                                        <Icon size={18} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm font-semibold ${notif.isRead ? "text-stone-600" : "text-stone-800"}`}>{notif.title}</p>
                                                <p className="text-xs text-stone-400 mt-0.5">{new Date(notif.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                {!notif.isRead && (
                                                    <button onClick={() => markRead(notif._id)} className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors" title="Mark as read">
                                                        <CheckCheck size={14} className="text-gold-500" />
                                                    </button>
                                                )}
                                                <button onClick={() => deleteNotification(notif._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                                    <Trash2 size={14} className="text-stone-400 hover:text-red-500 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-stone-500 mt-1.5 leading-relaxed">{notif.message}</p>
                                        {notif.link && (
                                            <Link href={notif.link} className="text-xs text-gold-600 font-medium hover:text-gold-700 mt-2 inline-block transition-colors">
                                                View details →
                                            </Link>
                                        )}
                                    </div>

                                    {!notif.isRead && (
                                        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-gold-400" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
