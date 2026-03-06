"use client";
import { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

function SuccessContent() {
    const params = useSearchParams();
    const orderId = params.get("orderId");
    const ref = params.get("ref");

    return (
        <div className="text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
                <CheckCircle size={52} className="text-green-500" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-4xl font-bold font-serif text-stone-800 mb-3">Booking Confirmed! 🎉</h1>
                <p className="text-stone-500 mb-2">Your payment was successful and your mandap has been booked.</p>
                <p className="text-stone-400 text-sm mb-2">We've sent a confirmation email with all the details.</p>
                {ref && <p className="text-xs font-mono bg-stone-100 inline-block px-3 py-1.5 rounded-lg text-stone-500 mt-2">Booking Ref: {ref}</p>}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 bg-green-50 border border-green-100 rounded-2xl p-6 text-left max-w-sm mx-auto"
            >
                <h3 className="font-semibold text-stone-700 mb-4">What happens next?</h3>
                <div className="space-y-3">
                    {[
                        { icon: "📧", text: "You'll receive a booking confirmation email" },
                        { icon: "📞", text: "Our team will call you within 24 hours" },
                        { icon: "📅", text: "A coordinator will be assigned to your event" },
                        { icon: "✨", text: "Sit back and let us create magic!" },
                    ].map((step) => (
                        <div key={step.text} className="flex items-start gap-3 text-sm text-stone-600">
                            <span>{step.icon}</span>
                            <span>{step.text}</span>
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
                <Link href="/dashboard/user" className="btn-gold px-8 py-3">View My Bookings</Link>
                <Link href="/catalog" className="btn-outline-gold px-8 py-3">Browse More Mandaps</Link>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center pt-20 pb-16 px-4">
            <div className="max-w-lg w-full">
                <Suspense fallback={<div className="text-center py-20 text-stone-400">Loading...</div>}>
                    <SuccessContent />
                </Suspense>
            </div>
        </div>
    );
}
