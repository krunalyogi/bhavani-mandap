"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Sparkles, Heart, Leaf, Handshake, Crown, Gem, Star, Map, Users, type LucideIcon } from "lucide-react";

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

const VALUES: { icon: LucideIcon; color: string; title: string; desc: string }[] = [
    { icon: Sparkles, color: "#d4a017", title: "Excellence", desc: "Every detail, from the tiniest flower to the grandest arch, is executed with perfection." },
    { icon: Heart, color: "#800000", title: "Passion", desc: "We pour our hearts into every event, treating each wedding as if it were our own." },
    { icon: Leaf, color: "#d4a017", title: "Eco-Conscious", desc: "We use fresh, natural materials and reduce waste through thoughtful sourcing." },
    { icon: Handshake, color: "#800000", title: "Trust", desc: "Transparent pricing, honest timelines, and no hidden costs. Your trust is our treasure." },
];

const TEAM = [
    { name: "Sanjay Patel", role: "Founder & Creative Director", exp: "40 years" },
];

const TIMELINE = [
    { year: "1985", title: "Founded in Mehsana", desc: "Sanjay Patel started Bhavani Mandap with a single mandap and a dream of creating unforgettable weddings in Gujarat." },
    { year: "1995", title: "A Decade of Celebrations", desc: "Completed 10 years serving families across Mehsana and nearby regions with growing fame." },
    { year: "2005", title: "Expanded Across Gujarat", desc: "Opened new offices in Ahmedabad, Surat, Vadodara, and Rajkot to serve more couples." },
    { year: "2010", title: "500th Wedding", desc: "Celebrated our 500th decorated wedding — a golden milestone for the entire team." },
    { year: "2019", title: "Award for Excellence", desc: "Received Gujarat Wedding Decorators Award for outstanding artistry and service." },
    { year: "2022", title: "Online Platform Launch", desc: "Launched bhavanimandap.in for seamless online booking across Gujarat." },
    { year: "2025", title: "50000+ Weddings", desc: "Proudly served over 50000 couples across Gujarat and beyond, carrying 40 years of legacy." },
];

export default function AboutClient() {
    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="py-20 text-center" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
                    Our Story
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-7xl font-bold text-white mt-3 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                    About Bhavani Mandap
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                <p className="text-white/70 max-w-2xl mx-auto text-base px-4">
                    For over 40 years, we have been weaving dreams into reality — one wedding at a time, with devotion, artistry, and unwavering dedication.
                </p>
            </section>

            {/* Mission */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                            <p className="section-subtitle mb-3">Who We Are</p>
                            <h2 className="section-title mb-6">Craftsmen of Dreams</h2>
                            <div className="gold-divider mb-8" />
                            <p className="text-stone-600 leading-relaxed mb-4">
                                Bhavani Mandap was born in 1985 from a simple belief: every couple deserves a wedding as unique as their love story. Founded by Sanjay Patel in Mehsana, Gujarat, we began with just a team of 5 artisans and an unwavering passion for floral artistry.
                            </p>
                            <p className="text-stone-600 leading-relaxed mb-4">
                                Today, we are a 200+ member family spread across 50+ cities, having decorated over 50000 weddings with our signature blend of traditional Indian aesthetics and modern design sensibilities.
                            </p>
                            <p className="text-stone-600 leading-relaxed">
                                From intimate home ceremonies to opulent 5-star banquet weddings, each event receives our complete attention and a personal touch that makes it unforgettable.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {[
                                { value: "50000+", label: "Weddings Decorated", Icon: Gem, color: "#d4a017" },
                                { value: "40+", label: "Years Experience", Icon: Star, color: "#800000" },
                                { value: "50+", label: "Cities Served", Icon: Map, color: "#d4a017" },
                                { value: "200+", label: "Expert Team Members", Icon: Users, color: "#800000" },
                            ].map((s) => (
                                <div key={s.label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gold-100">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mx-auto"
                                        style={{ background: `linear-gradient(135deg, ${s.color}22, ${s.color}44)`, border: `1.5px solid ${s.color}55` }}
                                    >
                                        <s.Icon size={22} style={{ color: s.color }} strokeWidth={1.5} />
                                    </div>
                                    <p className="text-3xl font-bold font-serif text-maroon-500">{s.value}</p>
                                    <p className="text-xs text-stone-500 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="section-subtitle">Our Principles</p>
                        <h2 className="section-title mt-2">What We Stand For</h2>
                        <div className="gold-divider" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {VALUES.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                className="bg-cream rounded-2xl p-7 text-center border border-gold-100 hover:border-gold-300 hover:shadow-gold transition-all"
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                                    style={{ background: `linear-gradient(135deg, ${v.color}22, ${v.color}44)`, border: `1.5px solid ${v.color}55` }}
                                >
                                    <v.icon size={26} style={{ color: v.color }} strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-3">{v.title}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 bg-cream">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="section-subtitle">Our Journey</p>
                        <h2 className="section-title mt-2">Milestones</h2>
                        <div className="gold-divider" />
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gold-200 -translate-x-1/2 hidden md:block" />
                        <div className="space-y-8">
                            {TIMELINE.map((ev, i) => (
                                <motion.div
                                    key={ev.year}
                                    initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                    className={`flex items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                                >
                                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100 inline-block w-full">
                                            <p className="text-gold-500 font-bold text-sm mb-1">{ev.year}</p>
                                            <h3 className="font-serif text-base font-semibold text-maroon-500 mb-2">{ev.title}</h3>
                                            <p className="text-stone-500 text-sm">{ev.desc}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:flex w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 items-center justify-center flex-shrink-0 z-10 shadow-gold">
                                        <div className="w-3 h-3 rounded-full bg-white" />
                                    </div>
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <p className="section-subtitle">The People</p>
                        <h2 className="section-title mt-2">Meet Our Team</h2>
                        <div className="gold-divider" />
                    </div>
                    <div className="flex justify-center">
                        <div className="w-full max-w-xs">
                            {TEAM.map((member, i) => (
                                <motion.div
                                    key={member.name}
                                    initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                                    className="bg-cream rounded-2xl p-8 text-center border border-gold-100 hover:shadow-gold transition-all"
                                >
                                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md" style={{ background: "linear-gradient(135deg, #d4a01722, #d4a01744)", border: "1.5px solid #d4a01755" }}>
                                        <Crown size={32} style={{ color: "#d4a017" }} strokeWidth={1.5} />
                                    </div>
                                    <h3 className="font-serif text-lg font-semibold text-stone-800">{member.name}</h3>
                                    <p className="text-gold-600 text-sm font-medium mt-1">{member.role}</p>
                                    <p className="text-stone-400 text-xs mt-2">{member.exp} experience</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <div className="max-w-2xl mx-auto px-4 text-center">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2 className="text-4xl font-bold text-white font-serif mb-4">Ready to Begin Your Story?</h2>
                        <p className="text-white/70 mb-8">Let Bhavani Mandap transform your wedding day into a timeless memory.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/gallery" className="btn-gold px-8 py-4">Explore Gallery</Link>
                            <Link href="/contact" className="bg-white/10 text-white border border-white/30 hover:bg-white/20 transition-all px-8 py-4 rounded-xl font-semibold">
                                Get in Touch
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
