import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Heart } from "lucide-react";

const SERVICES = ["Mandap Setup", "Stage Decoration", "Floral Décor", "Lighting", "Entry Gate Decor", "Seating Arrangements"];
const QUICK_LINKS = [
    { href: "/about", label: "About Us" },
    { href: "/gallery", label: "Gallery" },
    { href: "/contact", label: "Contact" },
];

export default function Footer() {
    return (
        <footer className="relative bg-stone-900 text-stone-300 overflow-hidden">
            {/* Gold accent top border */}
            <div className="h-1 w-full bg-gold-gradient" />

            {/* Decorative background */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #d4a017 0%, transparent 50%), radial-gradient(circle at 80% 20%, #800000 0%, transparent 50%)" }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src="/logo.png"
                                alt="Bhavani Mandap Logo"
                                width={64}
                                height={64}
                                className="rounded-full object-fill w-16 h-16"
                                style={{ background: "#f5a623" }}
                            />
                            <div>
                                <p className="font-serif text-2xl font-bold text-white">Bhavani Mandap</p>
                                <p className="text-xs tracking-widest uppercase text-gold-400">Premium Wedding Decorations</p>
                            </div>
                        </div>
                        <p className="text-stone-400 leading-relaxed mb-6 max-w-sm">
                            Creating unforgettable wedding memories with royal elegance, exquisite floral arrangements, and premium mandap setups across India.
                        </p>
                        {/* Contact */}
                        <div className="space-y-2 text-sm">
                            <a href="tel:+919824520806" className="flex items-center gap-3 hover:text-gold-400 transition-colors">
                                <Phone size={16} className="text-gold-500 flex-shrink-0" /> +91 98245 20806 (Sanjay Patel)
                            </a>
                            <a href="mailto:info@bhavanmandap.com" className="flex items-center gap-3 hover:text-gold-400 transition-colors">
                                <Mail size={16} className="text-gold-500 flex-shrink-0" /> info@bhavanmandap.com
                            </a>
                            <p className="flex items-center gap-3">
                                <MapPin size={16} className="text-gold-500 flex-shrink-0" /> Mehsana, Gujarat, India
                            </p>
                        </div>
                        {/* Social */}
                        <div className="flex gap-3 mt-6">
                            {[
                                { icon: Instagram, href: "#", label: "Instagram" },
                                { icon: Facebook, href: "#", label: "Facebook" },
                                { icon: Youtube, href: "#", label: "YouTube" },
                            ].map(({ icon: Icon, href, label }) => (
                                <a key={label} href={href} aria-label={label}
                                    className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:text-gold-400 hover:bg-stone-700 transition-all"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-4 border-b border-gold-800 pb-2">Our Services</h3>
                        <ul className="space-y-2">
                            {SERVICES.map((s) => (
                                <li key={s}>
                                    <Link href="/gallery" className="text-sm text-stone-400 hover:text-gold-400 transition-colors flex items-center gap-2">
                                        <span className="text-gold-600 text-xs">✦</span> {s}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-serif text-lg mb-4 border-b border-gold-800 pb-2">Quick Links</h3>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map(({ href, label }) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-stone-400 hover:text-gold-400 transition-colors flex items-center gap-2">
                                        <span className="text-gold-600 text-xs">›</span> {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* WhatsApp CTA */}
                        <a
                            href="https://wa.me/919824520806?text=Hi%20Bhavani%20Mandap%2C%20I%20want%20to%20inquire%20about%20wedding%20decoration."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                            WhatsApp Inquiry
                        </a>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                    <p>© {new Date().getFullYear()} Bhavani Mandap. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Made with <Heart size={12} className="text-red-400" /> in India
                    </p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gold-400 transition-colors">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
