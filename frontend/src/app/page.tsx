"use client";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Star, Users, Flower2, Sparkles, ArrowRight, PhoneCall, Crown, Lightbulb, Theater, DoorOpen, Armchair, Search, Palette, CalendarCheck, Wand2, type LucideIcon } from "lucide-react";

const SERVICES: { icon: LucideIcon; color: string; title: string; desc: string }[] = [
  { icon: Crown, color: "#d4a017", title: "Royal Mandap Setup", desc: "Magnificent mandap structures with gold & marble finish" },
  { icon: Flower2, color: "#800000", title: "Floral Décor", desc: "Fresh flower arrangements – roses, marigolds, orchids" },
  { icon: Lightbulb, color: "#d4a017", title: "Lighting Design", desc: "Fairy lights, chandeliers, LED patterns & spotlights" },
  { icon: Theater, color: "#800000", title: "Stage Decoration", desc: "Premium backdrops, draping, and thematic setups" },
  { icon: DoorOpen, color: "#d4a017", title: "Entry Gate Decor", desc: "Grand entrance gates with flowers and lighting" },
  { icon: Armchair, color: "#800000", title: "Seating Arrangement", desc: "Elegant seating for all event types and budgets" },
];

const TESTIMONIALS = [
  {
    name: "Priya & Rohan Sharma",
    location: "Mehsana",
    rating: 5,
    text: "Bhavani Mandap transformed our wedding into a fairy tale. Every flower, every light was perfect. Highly recommended!",
    event: "Royal Wedding, Dec 2024",
  },
  {
    name: "Aisha & Arjun Mehta",
    location: "Ahmedabad",
    rating: 5,
    text: "The team was professional, punctual and creative. Our mandap looked absolutely stunning!",
    event: "Traditional Wedding, Nov 2024",
  },
  {
    name: "Kavya & Kiran Nair",
    location: "Surat",
    rating: 5,
    text: "Best wedding decorators we've ever seen. The floral décor was breathtaking. Worth every rupee!",
    event: "Destination Wedding, Oct 2024",
  },
];

const STATS = [
  { value: "2000+", label: "Weddings Decorated" },
  { value: "40+", label: "Years Experience" },
  { value: "50+", label: "Cities Served" },
  { value: "99%", label: "Happy Clients" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden text-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070"
            alt="Bhavani Mandap Decor"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-400 font-semibold uppercase tracking-widest text-sm mb-4"
          >
            ✦ Premium Wedding Decorations ✦
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight mb-6"
            style={{ fontFamily: "Cormorant Garamond, serif", color: "#ffffff" }}
          >
            Bhavani Mandap
            <span className="block text-gold-400" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Decorations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Crafting unforgettable wedding moments with exquisite floral artistry, dazzling lights, and age-old Indian traditions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/gallery" className="btn-gold text-base px-8 py-4">
              <Sparkles size={20} /> Explore Gallery
            </Link>
            <a
              href="tel:+919824520806"
              className="btn-outline-gold text-base px-8 py-4 backdrop-blur-sm bg-black/10 hover:bg-black/30 text-white border-white/30"
            >
              <PhoneCall size={20} /> Call to Enquire
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto"
          >
            {STATS.map((s) => (
              <div key={s.label} className="text-center backdrop-blur-sm bg-black/20 rounded-xl py-4 border border-white/10">
                <p className="text-4xl font-bold font-serif text-gold-400">{s.value}</p>
                <p className="text-sm text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gold-400 flex items-center justify-center">
            <div className="w-1 h-3 rounded-full bg-gold-400 mt-1" />
          </div>
        </div>
      </section >

      {/* ─── Services ─────────────────────────────────────────────────── */}
      < section className="py-24 bg-white" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.p
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} className="section-subtitle"
            >
              What We Offer
            </motion.p>
            <motion.h2
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              custom={1} variants={fadeUp} className="section-title mt-2"
            >
              Our Services
            </motion.h2>
            <div className="gold-divider" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, i) => (
              <motion.div
                key={service.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                whileHover={{ y: -4 }}
                className="bg-cream rounded-2xl p-8 border border-gold-100 hover:border-gold-300 hover:shadow-gold transition-all duration-300 group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${service.color}22, ${service.color}44)`, border: `1.5px solid ${service.color}55` }}
                >
                  <service.icon size={28} style={{ color: service.color }} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-maroon-500 mb-3">{service.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ─── Booking Process ──────────────────────────────────────────── */}
      < section className="py-24 bg-cream" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="section-subtitle">Simple & Easy</p>
            <h2 className="section-title mt-2">How It Works</h2>
            <div className="gold-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {([
              { step: "01", title: "Browse Gallery", desc: "Explore our collection of premium mandap designs", Icon: Search },
              { step: "02", title: "Customize", desc: "Choose flowers, colors, lights & fabric styles", Icon: Palette },
              { step: "03", title: "Book & Pay", desc: "Select your date, pay 30% advance online", Icon: CalendarCheck },
              { step: "04", title: "We Decorate", desc: "Our team arrives and creates magic on your day", Icon: Wand2 },
            ] as { step: string; title: string; desc: string; Icon: LucideIcon }[]).map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="text-center relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 -translate-x-1/2" style={{ background: "linear-gradient(90deg, #d4a017, transparent)" }} />
                )}
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #d4a017, #b8860b)" }}>
                  <s.Icon size={26} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="text-xs font-bold text-gold-400 mb-2">{s.step}</div>
                <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-2">{s.title}</h3>
                <p className="text-sm text-stone-500">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      < section className="py-24" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }
      }>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-gold-400 font-semibold uppercase tracking-widest text-sm">Happy Couples</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 font-serif">Love Stories</h2>
            <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                custom={i} variants={fadeUp}
                className="glass-card p-8 text-white"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} size={16} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-gold-300">{t.name}</p>
                  <p className="text-xs text-white/50">{t.location} · {t.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section >

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      < section className="py-24 bg-cream" >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="section-title mb-6">Ready to Create Your Dream Wedding?</h2>
            <p className="text-stone-500 text-lg mb-10">
              Book your mandap today and let us transform your special day into an eternal memory.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gallery" className="btn-gold px-10 py-4 text-base">
                Browse Our Gallery <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-outline-gold px-10 py-4 text-base">
                Get Custom Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </section >
    </div >
  );
}
