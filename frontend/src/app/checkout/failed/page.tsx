"use client";
import { Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { XCircle, RefreshCcw, PhoneCall } from "lucide-react";
import { useSearchParams } from "next/navigation";

function FailedContent() {
    const params = useSearchParams();
    const reason = params.get("reason") || "Your payment could not be processed.";

    return (
        <div className="text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
            >
                <XCircle size={52} className="text-red-500" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-4xl font-bold font-serif text-stone-800 mb-3">Payment Failed</h1>
                <p className="text-stone-500 mb-2">{reason}</p>
                <p className="text-stone-400 text-sm">Don't worry, no amount has been deducted from your account.</p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-amber-50 border border-amber-100 rounded-2xl p-6 text-left max-w-sm mx-auto"
            >
                <h3 className="font-semibold text-stone-700 mb-4">Common reasons for failure</h3>
                <div className="space-y-2 text-sm text-stone-600">
                    {[
                        "Insufficient funds in your account",
                        "Card expired or invalid details",
                        "Bank declined the transaction",
                        "Network timeout during payment",
                    ].map((r) => (
                        <div key={r} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{r}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
                <button
                    onClick={() => window.history.back()}
                    className="btn-gold px-8 py-3 flex items-center justify-center gap-2"
                >
                    <RefreshCcw size={18} /> Try Again
                </button>
                <a
                    href="https://wa.me/919824520806"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold px-8 py-3 flex items-center justify-center gap-2"
                >
                    <PhoneCall size={18} /> Contact Support
                </a>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-6 text-sm text-stone-400"
            >
                Need help?{" "}
                <Link href="/contact" className="text-gold-600 hover:underline">Contact us</Link>
                {" "}or call{" "}
                <a href="tel:+919824520806" className="text-gold-600 hover:underline">+91 98245 20806 (Sanjay Patel)</a>
            </motion.p>
        </div>
    );
}

export default function CheckoutFailedPage() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center pt-20 pb-16 px-4">
            <div className="max-w-lg w-full">
                <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading...</div>}>
                    <FailedContent />
                </Suspense>
            </div>
        </div>
    );
}
