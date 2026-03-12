"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
                    Privacy Policy
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                <p className="text-white/70 max-w-xl mx-auto text-sm">
                    How we handle and protect your personal information.
                </p>
            </section>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 prose prose-stone">
                <p className="text-sm text-stone-500 mb-8">Last Updated: March 2026</p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">1. Information We Collect</h3>
                <p className="text-stone-600 mb-6">
                    When you contact us, book an event, or browse our website, we may collect personal information such as your name, phone number, email address, and event details.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">2. How We Use Your Information</h3>
                <p className="text-stone-600 mb-6">
                    The information we collect is used solely to provide our wedding and event decoration services, respond to your inquiries, send quotations, and improve the user experience of our website. We do not sell or rent your personal data to third parties.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">3. Data Security</h3>
                <p className="text-stone-600 mb-6">
                    Bhavani Mandap takes the security of your data seriously. We implement reasonable administrative and technical safeguards to protect your personal information from unauthorized access, loss, or misuse.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">4. Third-Party Services</h3>
                <p className="text-stone-600 mb-6">
                    Our website may contain links to third-party services (such as our payment processors or social media). This privacy policy does not apply to those third parties, and we encourage you to review their respective privacy policies.
                </p>

                <h3 className="text-2xl font-serif text-maroon-500 mb-4">5. Contact Us</h3>
                <p className="text-stone-600">
                    If you have any questions regarding this Privacy Policy or how your data is handled, please contact us at: <br />
                    <strong>Phone:</strong> +91 98245 20806 <br />
                    <strong>Address:</strong> 21, Gautam Nagar, Opp. Nirma Factory, Modhera Road, Mehsana - 2, Gujarat, India.
                </p>
            </div>
        </div>
    );
}
