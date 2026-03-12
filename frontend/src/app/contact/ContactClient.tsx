"use client";
import { motion, type Variants } from "framer-motion";
import { Phone, MapPin, MessageCircle, Clock } from "lucide-react";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

const OFFICES = [
    { city: "Mehsana", address: "21, Gautam Nagar, Opp. Nirma Factory, Modher Road, Mehsana - 2", phone: "+91 98245 20806" },
    { city: "Ahmedabad (Bopal)", address: "2/A, Baleshwar Vihar Complex, Nr. H.P Petrol Pump, Bopal, Ahmedabad", phone: "+91 98245 20806" },
    { city: "Motap", address: "105/B, Guru Estate, Motap-Sadhuthala Road, Motap", phone: "+91 98245 20806" },
];

export default function ContactClient() {
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
                    Planning your dream wedding? Call us or WhatsApp us — we&apos;d love to help!
                </p>
            </section>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-8">

                {/* WhatsApp CTA */}
                <motion.a
                    href="https://wa.me/919824520806"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="flex items-center gap-4 bg-green-500 text-white rounded-2xl p-6 hover:bg-green-600 transition-all shadow-sm"
                >
                    <MessageCircle size={32} />
                    <div>
                        <p className="font-bold text-xl">Chat on WhatsApp</p>
                        <p className="text-white/80 text-sm mt-0.5">Instant response during business hours</p>
                    </div>
                </motion.a>

                {/* Business Hours */}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {OFFICES.map((o, i) => (
                        <motion.div
                            key={o.city}
                            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 2}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <h3 className="font-serif text-base font-semibold text-maroon-500 mb-3">{o.city}</h3>
                            <div className="flex items-start gap-3 mb-3 text-sm text-stone-600">
                                <MapPin size={16} className="text-gold-500 mt-0.5 flex-shrink-0" />
                                <span>{o.address}</span>
                            </div>
                            <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm text-gold-600 font-medium hover:text-maroon-500 transition-colors">
                                <Phone size={16} className="flex-shrink-0" />
                                {o.phone}
                            </a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
