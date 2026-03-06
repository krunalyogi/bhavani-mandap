"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ElementType;
}

const Field = ({ icon: Icon, ...props }: FieldProps) => (
    <div className="relative">
        <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input {...props} className="input-premium pl-12 w-full" />
    </div>
);

export default function RegisterPage() {
    const [form, setForm] = useState({
        name: "", email: "", password: "", phone: "",
        role: "user", businessName: "", city: "", referralCode: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Client-side Indian phone validation
        if (form.phone && !/^[6-9]\d{9}$/.test(form.phone)) {
            toast.error("Please enter a valid 10-digit Indian mobile number (starting with 6-9)");
            return;
        }
        if (form.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            await register(form);
            router.push(form.role === "vendor" ? "/dashboard/vendor" : "/dashboard/user");
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error?.response?.data?.message || "Registration failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center py-28 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #d4a017, #800000)" }}>
                            <span className="text-white font-bold text-lg font-serif">भ</span>
                        </div>
                        <span className="font-serif text-lg font-bold text-maroon-500">Bhavani Mandap</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-maroon-500 font-serif">Create Account</h2>
                    <p className="text-stone-500 mt-2">Join thousands of happy couples</p>
                </div>

                {/* Role Toggle */}
                <div className="flex rounded-xl overflow-hidden border border-stone-200 mb-6">
                    {["user", "vendor"].map((r) => (
                        <button
                            key={r}
                            onClick={() => setForm({ ...form, role: r })}
                            className={`flex-1 py-3 text-sm font-semibold transition-all ${form.role === r ? "bg-gold-500 text-white" : "bg-white text-stone-600 hover:bg-stone-50"}`}
                        >
                            {r === "user" ? "👰 Customer" : "🏪 Vendor"}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-8 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-semibold text-stone-600 mb-1 block">Full Name *</label>
                            <Field icon={User} type="text" required placeholder="Your name" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-stone-600 mb-1 block">Phone (Indian Mobile) *</label>
                            <Field icon={Phone} type="tel" placeholder="e.g. 9876543210" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
                            <p className="text-[10px] text-stone-400 mt-1">Must be a valid 10-digit Indian number</p>
                        </div>
                    </div>

                    {form.role === "vendor" && (
                        <div>
                            <label className="text-xs font-semibold text-stone-600 mb-1 block">Business Name *</label>
                            <Field icon={Building2} type="text" required placeholder="Your decoration business name" value={form.businessName} onChange={(e: any) => setForm({ ...form, businessName: e.target.value })} />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-stone-600 mb-1 block">Email Address *</label>
                        <Field icon={Mail} type="email" required placeholder="you@example.com" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-stone-600 mb-1 block">Password *</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                            <input
                                type={showPass ? "text" : "password"}
                                required
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min. 6 characters"
                                className="input-premium pl-12 pr-12 w-full"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400">
                                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-stone-600 mb-1 block">Referral Code (Optional)</label>
                        <input type="text" value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} placeholder="Enter referral code" className="input-premium w-full" />
                    </div>

                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="btn-gold w-full py-4 text-base mt-2"
                    >
                        {loading ? "Creating Account..." : `Create ${form.role === "vendor" ? "Vendor" : ""} Account`}
                    </motion.button>
                </form>

                <p className="text-center text-sm text-stone-500 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-gold-600 font-semibold hover:text-maroon-500 transition-colors">Sign In</Link>
                </p>
            </motion.div>
        </div>
    );
}
