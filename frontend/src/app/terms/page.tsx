"use client";
import { motion } from "framer-motion";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-cream pt-24 pb-20">
            {/* Header */}
            <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-400 font-semibold uppercase tracking-widest text-sm mb-4">
                    Legal Info
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                    Terms & Conditions
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                <p className="text-white/70 max-w-xl mx-auto text-sm">
                    The rules and guidelines for utilizing our decoration services.
                </p>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose prose-stone">
                <p className="text-sm text-stone-500 mb-8">Last Updated: March 2026</p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">1. Agreement to Terms</h3>
                <p className="text-stone-600 mb-6">
                    By browsing this website, contacting us for quotes, or booking a wedding/event mandap with Bhavani Mandap, you agree to be bound by these Terms and Conditions.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">2. Bookings and Payments</h3>
                <ul className="list-disc pl-5 text-stone-600 mb-6 space-y-2">
                    <li>A non-refundable advance payment (typically 30%) is required to secure your event date and selected mandap design.</li>
                    <li>The remaining balance must be cleared on or before the day of the event, as agreed upon in your final quotation.</li>
                    <li>Prices are subject to change based on modifications to floral decor, location distance, or additional customizations requested after the initial quote.</li>
                </ul>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">3. Cancellations & Rescheduling</h3>
                <p className="text-stone-600 mb-6">
                    If an event needs to be cancelled or rescheduled, the initial deposit is non-refundable. Rescheduling is subject to the availability of our dates and inventory. Bhavani Mandap reserves the right to retain any advance if materials, such as fresh flowers, have already been procured.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">4. Liability & Damage</h3>
                <p className="text-stone-600 mb-6">
                    Bhavani Mandap guarantees the completion of decor installations prior to the event start time. However, we are not liable for disruptions caused by extreme weather, venue restrictions, or delays beyond our control. Any deliberate damage or loss of rented decor assets (chairs, sofas, props) by event attendees will be billed to the booking party at replacement value.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">5. Modifications</h3>
                <p className="text-stone-600">
                    We reserve the right to modify these Terms and Conditions at any time. Changes will be updated on this page directly. Continued use of our site and services demonstrates acceptance of any updated terms.
                </p>

            </div>
        </div>
    );
}
