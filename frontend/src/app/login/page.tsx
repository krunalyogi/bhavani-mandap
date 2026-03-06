"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            router.push("/dashboard/user");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-cream flex pt-20">
            {/* Left Panel (desktop only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #800000, #4a0000)" }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #d4a017 0%, transparent 70%)" }} />
                <div className="relative z-10 flex flex-col justify-center items-center text-center px-12">
                    <div className="w-20 h-20 rounded-full mb-6 flex items-center justify-center" style={{ background: "rgba(212,160,23,0.2)", border: "2px solid rgba(212,160,23,0.4)" }}>
                        <span className="text-5xl">🏰</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white font-serif mb-4">Welcome Back</h1>
                    <p className="text-white/60 text-lg leading-relaxed">
                        Sign in to manage your bookings, customize mandaps, and create unforgettable weddings.
                    </p>
                    <div className="mt-12 grid grid-cols-2 gap-6">
                        {[{ v: "2000+", l: "Weddings" }, { v: "99%", l: "Satisfaction" }, { v: "50+", l: "Cities" }, { v: "15+", l: "Years" }].map((s) => (
                            <div key={s.l} className="text-center">
                                <p className="text-3xl font-bold text-gold-400 font-serif">{s.v}</p>
                                <p className="text-white/50 text-sm">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <Link href="/" className="inline-flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #d4a017, #800000)" }}>
                                <span className="text-white font-bold text-lg font-serif">भ</span>
                            </div>
                        </Link>
                        <h2 className="text-3xl font-bold text-maroon-500 font-serif">Sign In</h2>
                        <p className="text-stone-500 mt-2">Access your Bhavani Mandap account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-stone-600 mb-1 block">Email Address</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="input-premium pl-12"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-stone-600 mb-1 block">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type={showPass ? "text" : "password"}
                                    required
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="input-premium pl-12 pr-12"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-gold w-full py-4 text-base"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-stone-500 mt-6">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-gold-600 font-semibold hover:text-maroon-500 transition-colors">
                            Sign Up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
