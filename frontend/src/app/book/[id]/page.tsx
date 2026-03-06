"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import { Clock, Users, FileText, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];
const EVENT_TYPES = ["wedding", "engagement", "reception", "haldi", "mehendi", "sangeet", "other"];

export default function BookingPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [mandap, setMandap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [blockedDates, setBlockedDates] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [form, setForm] = useState({
        eventType: "wedding",
        guestCount: 200,
        specialRequests: "",
        venueAddress: { street: "", city: "", state: "", pincode: "" },
    });
    const [availability, setAvailability] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        const load = async () => {
            try {
                const { data } = await api.get(`/mandaps/${id}`);
                setMandap(data.data);
                setBlockedDates(data.data.availability?.blockedDates?.map((d: string) => new Date(d)) || []);
            } catch { toast.error("Failed to load mandap"); }
            setLoading(false);
        };
        load();
    }, [id, isAuthenticated]);

    const checkDate = async (date: Date) => {
        setSelectedDate(date);
        const key = date.toISOString().split("T")[0];
        if (availability[key] !== undefined) return;
        try {
            const { data } = await api.get(`/bookings/availability/${id}?date=${key}`);
            setAvailability((prev) => ({ ...prev, [key]: data.available }));
            if (!data.available) toast.error(`Date unavailable: ${data.reason}`);
        } catch { }
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) { toast.error("Select date and time slot"); return; }

        const key = selectedDate.toISOString().split("T")[0];
        if (availability[key] === false) { toast.error("This date is not available"); return; }

        setSubmitting(true);
        try {
            const { data } = await api.post("/bookings", {
                mandapId: id,
                eventDate: selectedDate.toISOString(),
                eventTime: selectedTime,
                eventType: form.eventType,
                guestCount: form.guestCount,
                specialRequests: form.specialRequests,
                venueAddress: form.venueAddress,
            });

            toast.success("Booking created! Proceeding to payment...");
            router.push(`/checkout?bookingId=${data.data._id}`);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Booking failed");
        }
        setSubmitting(false);
    };

    const tileDisabled = ({ date }: { date: Date }) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (date < today) return true;
        return blockedDates.some((b) => b.toDateString() === date.toDateString());
    };

    if (loading) return (
        <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
        </div>
    );

    const advanceAmount = mandap ? Math.round((mandap.discountedPrice || mandap.basePrice) * 1.18 * 0.3) : 0;

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <p className="section-subtitle mb-2">Step 1 of 2</p>
                    <h1 className="section-title">Book Your Date</h1>
                    <div className="gold-divider" />
                    {mandap && <p className="text-stone-500 mt-3">Booking: <span className="font-semibold text-stone-800">{mandap.title}</span></p>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Calendar + Time Slots */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-serif text-lg font-semibold text-maroon-500 mb-4">Select Date</h2>
                            <style>{`.react-calendar { border: none; font-family: Inter; } .react-calendar__tile--active { background: #d4a017 !important; } .react-calendar__tile:enabled:hover { background: #fdf9ec; } .react-calendar__navigation button:enabled:hover { background: #fdf9ec; }`}</style>
                            <Calendar
                                onChange={(v) => checkDate(v as Date)}
                                value={selectedDate}
                                tileDisabled={tileDisabled}
                                className="w-full"
                                minDate={new Date()}
                            />
                            {selectedDate && availability[selectedDate.toISOString().split("T")[0]] === false && (
                                <p className="mt-3 text-red-500 text-sm text-center">This date is already booked</p>
                            )}
                            {selectedDate && availability[selectedDate.toISOString().split("T")[0]] === true && (
                                <p className="mt-3 text-green-600 text-sm text-center">✓ Date is available!</p>
                            )}
                        </div>

                        {/* Time Slots */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-serif text-lg font-semibold text-maroon-500 mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-gold-500" /> Select Start Time
                            </h2>
                            <div className="grid grid-cols-3 gap-3">
                                {TIME_SLOTS.map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setSelectedTime(t)}
                                        className={`py-2.5 rounded-xl text-sm font-medium transition-all ${selectedTime === t
                                                ? "bg-gold-500 text-white shadow-gold"
                                                : "bg-stone-50 text-stone-600 hover:bg-gold-50 hover:text-gold-700"
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Event Details + Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-serif text-lg font-semibold text-maroon-500 mb-4">Event Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Event Type</label>
                                    <select
                                        value={form.eventType}
                                        onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                                        className="input-premium text-sm"
                                    >
                                        {EVENT_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-stone-600 mb-1 block flex items-center gap-1"><Users size={12} /> Expected Guests</label>
                                    <input
                                        type="number"
                                        value={form.guestCount}
                                        onChange={(e) => setForm({ ...form, guestCount: parseInt(e.target.value) })}
                                        className="input-premium text-sm"
                                        min={1}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-stone-600 mb-1 block">Venue City *</label>
                                    <input
                                        type="text"
                                        placeholder="City where decoration is needed"
                                        value={form.venueAddress.city}
                                        onChange={(e) => setForm({ ...form, venueAddress: { ...form.venueAddress, city: e.target.value } })}
                                        className="input-premium text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-stone-600 mb-1 block flex items-center gap-1"><FileText size={12} /> Special Requests</label>
                                    <textarea
                                        rows={3}
                                        value={form.specialRequests}
                                        onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                                        placeholder="Any specific requirements..."
                                        className="input-premium text-sm resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        {mandap && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100">
                                <h2 className="font-serif text-lg font-semibold text-maroon-500 mb-4">Price Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-stone-600">
                                        <span>Base Price</span>
                                        <span>₹{(mandap.discountedPrice || mandap.basePrice).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-stone-600">
                                        <span>GST (18%)</span>
                                        <span>₹{Math.round((mandap.discountedPrice || mandap.basePrice) * 0.18).toLocaleString()}</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between font-bold text-stone-800">
                                        <span>Total</span>
                                        <span>₹{Math.round((mandap.discountedPrice || mandap.basePrice) * 1.18).toLocaleString()}</span>
                                    </div>
                                    <div className="bg-gold-50 rounded-xl p-3 flex justify-between text-gold-700 font-semibold">
                                        <span>Advance to Pay (30%)</span>
                                        <span>₹{advanceAmount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <motion.button
                            onClick={handleSubmit}
                            disabled={submitting || !selectedDate || !selectedTime}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="btn-gold w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Creating Booking..." : (
                                <><ArrowRight size={20} /> Proceed to Payment</>
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
