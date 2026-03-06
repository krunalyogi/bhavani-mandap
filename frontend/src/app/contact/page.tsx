"use client";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

const OFFICES = [
    { city: "Mehsana", address: "21, Gautam Nagar, Opp. Nirma Factory, Modher Road, Mehsana - 2", phone: "+91 98245 20806" },
    { city: "Ahmedabad (Bopal)", address: "2/A, Baleshwar Vihar Complex, Nr. H.P Petrol Pump, Bopal, Ahmedabad", phone: "+91 98245 20806" },
    { city: "Motap", address: "105/B, Guru Estate, Motap-Sadhuthala Road, Motap", phone: "+91 98245 20806" },
];

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", message: "" });
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill all required fields");
            return;
        }
        setSending(true);
        await new Promise((r) => setTimeout(r, 1200));
        toast.success("Message sent! We'll get back to you within 24 hours 🙏");
        setForm({ name: "", email: "", phone: "", date: "", message: "" });
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-cream pt-24 pb-20">
            {/* Hero */}
            <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
                    Let&apos;s Connect
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl font-bold text-white mt-3 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                    Contact Us
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                <p className="text-white/70 max-w-xl mx-auto text-sm">
                    Planning your dream wedding? Our experts are here to help you create something truly magical.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Left – Info */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* WhatsApp CTA */}
                        <motion.a
                            href="https://wa.me/919824520806"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                            className="flex items-center gap-4 bg-green-500 text-white rounded-2xl p-5 hover:bg-green-600 transition-all shadow-sm"
                        >
                            <MessageCircle size={28} />
                            <div>
                                <p className="font-bold text-lg">Chat on WhatsApp</p>
                                <p className="text-white/80 text-sm">Instant response during business hours</p>
                            </div>
                        </motion.a>

                        {/* Hours */}
                        <motion.div
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Clock size={20} className="text-gold-500" />
                                <h3 className="font-serif text-lg text-maroon-500">Business Hours</h3>
                            </div>
                            {[
                                { day: "Monday – Friday", time: "9:00 AM – 7:00 PM" },
                                { day: "Saturday", time: "9:00 AM – 5:00 PM" },
                                { day: "Sunday", time: "Closed" },
                            ].map((h) => (
                                <div key={h.day} className="flex justify-between text-sm py-2 border-b border-stone-100 last:border-0">
                                    <span className="text-stone-500">{h.day}</span>
                                    <span className="font-medium text-stone-700">{h.time}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Offices */}
                        {OFFICES.map((o, i) => (
                            <motion.div
                                key={o.city}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <h3 className="font-serif text-base font-semibold text-maroon-500 mb-3">{o.city}</h3>
                                <div className="flex items-start gap-3 mb-2 text-sm text-stone-600">
                                    <MapPin size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                                    <span>{o.address}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-stone-600">
                                    <Phone size={16} className="text-gold-500 flex-shrink-0" />
                                    <a href={`tel:${o.phone}`} className="hover:text-gold-600 transition-colors">{o.phone}</a>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Right – Form */}
                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                        className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm"
                    >
                        <h2 className="font-serif text-2xl text-maroon-500 mb-2">Send Us a Message</h2>
                        <p className="text-stone-400 text-sm mb-8">Fill the form and we&apos;ll respond within 24 hours.</p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1.5">Your Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Priya Sharma"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1.5">Email Address *</label>
                                    <input
                                        type="email"
                                        placeholder="priya@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1.5">Event Date</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-600 mb-1.5">Message *</label>
                                <textarea
                                    rows={5}
                                    placeholder="Tell us about your dream wedding, budget, and any special requirements..."
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100 transition-all text-sm resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="btn-gold w-full py-4 text-base disabled:opacity-60"
                            >
                                {sending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Send size={18} /> Send Message
                                    </span>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
