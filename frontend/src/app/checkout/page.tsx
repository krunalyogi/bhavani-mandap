"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Shield, Smartphone, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

declare global { interface Window { Razorpay: any; } }

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const bookingId = searchParams?.get("bookingId");
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentType, setPaymentType] = useState<"advance" | "full">("advance");

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);

        const load = async () => {
            if (!bookingId) { router.push("/"); return; }
            try {
                const { data } = await api.get(`/bookings/${bookingId}`);
                setBooking(data.data);
            } catch { toast.error("Failed to load booking"); }
            setLoading(false);
        };
        load();
        return () => { document.body.removeChild(script); };
    }, [bookingId]);

    const handlePayment = async () => {
        if (!booking) return;
        setProcessing(true);
        try {
            // Create Razorpay order
            const { data: orderData } = await api.post("/payments/create-order", {
                bookingId,
                paymentType,
            });

            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: "INR",
                name: "Bhavani Mandap",
                description: `Booking: ${booking.bookingRef}`,
                order_id: orderData.order.id,
                prefill: orderData.prefill,
                theme: { color: "#d4a017" },
                handler: async (response: any) => {
                    try {
                        await api.post("/payments/verify", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentId: orderData.paymentId,
                            bookingId,
                        });
                        router.push(`/payment/success?ref=${booking.bookingRef}`);
                    } catch { router.push("/payment/failed"); }
                },
                modal: {
                    ondismiss: () => { setProcessing(false); toast.error("Payment cancelled"); },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment initiation failed");
            setProcessing(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
        </div>
    );

    if (!booking) return null;

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-10">
                    <p className="section-subtitle mb-2">Secure Checkout</p>
                    <h1 className="section-title">Complete Payment</h1>
                    <div className="gold-divider" />
                </div>

                {/* Booking Summary Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gold-100">
                    <h2 className="font-serif text-lg font-semibold text-maroon-500 mb-4">Booking Summary</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-stone-500">Booking Ref</span>
                            <span className="font-mono font-bold text-stone-800">{booking.bookingRef}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Event Date</span>
                            <span className="font-semibold text-stone-800">{new Date(booking.eventDate).toDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Event Type</span>
                            <span className="capitalize text-stone-800">{booking.eventType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-stone-500">Total Amount</span>
                            <span className="font-bold text-stone-800">₹{booking.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Type */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <h2 className="font-serif text-lg font-semibold text-maroon-500 mb-4">Payment Option</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentType("advance")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${paymentType === "advance" ? "border-gold-500 bg-gold-50" : "border-stone-200"}`}
                        >
                            <p className="font-semibold text-stone-800">Advance (30%)</p>
                            <p className="text-2xl font-bold text-gold-600 mt-1">₹{booking.advanceAmount.toLocaleString()}</p>
                            <p className="text-xs text-stone-400 mt-1">Pay remaining on event day</p>
                        </button>
                        <button
                            onClick={() => setPaymentType("full")}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${paymentType === "full" ? "border-gold-500 bg-gold-50" : "border-stone-200"}`}
                        >
                            <p className="font-semibold text-stone-800">Full Amount</p>
                            <p className="text-2xl font-bold text-gold-600 mt-1">₹{booking.totalAmount.toLocaleString()}</p>
                            <p className="text-xs text-green-600 mt-1">✓ Get 5% extra discount</p>
                        </button>
                    </div>
                </div>

                {/* Security badges */}
                <div className="flex justify-center gap-6 mb-8 text-xs text-stone-400">
                    <span className="flex items-center gap-1"><Shield size={14} className="text-green-500" /> Secure Payment</span>
                    <span className="flex items-center gap-1"><CreditCard size={14} className="text-blue-500" /> Razorpay</span>
                    <span className="flex items-center gap-1"><Smartphone size={14} className="text-purple-500" /> UPI Supported</span>
                </div>

                <motion.button
                    onClick={handlePayment}
                    disabled={processing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-gold w-full py-5 text-lg"
                >
                    {processing ? "Opening Payment..." : `Pay ₹${(paymentType === "advance" ? booking.advanceAmount : booking.totalAmount).toLocaleString()} via Razorpay`}
                </motion.button>

                <p className="text-center text-xs text-stone-400 mt-4">
                    By proceeding, you agree to our Terms &amp; Cancellation Policy
                </p>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}
