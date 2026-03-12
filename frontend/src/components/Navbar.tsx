"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        
        // Close menu on click outside
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (menuOpen && !target.closest('.mobile-menu-container')) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("click", handleClickOutside);
        
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <header
            className={`mobile-menu-container fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gold-100"
                : "bg-cream/80 backdrop-blur-sm"
                }`}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image
                            src="/logo.png"
                            alt="Bhavani Mandap Logo"
                            width={56}
                            height={56}
                            className="rounded-full object-fill w-14 h-14"
                            style={{ background: "#f5a623" }}
                        />
                        <div>
                            <p className="font-serif text-xl font-bold leading-none" style={{ color: "#800000" }}>Bhavani</p>
                            <p className="text-xs tracking-widest uppercase" style={{ color: "#d4a017" }}>Mandap</p>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden lg:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className={`text-sm font-medium transition-colors duration-200 relative group ${pathname === link.href ? "text-gold-600" : "text-stone-700 hover:text-gold-600"
                                        }`}
                                >
                                    {link.label}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-gold-500 transition-all duration-200 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                            }`}
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link href="/contact" className="btn-gold text-sm py-2 px-5">
                            Enquire Now
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button className="lg:hidden p-2 text-stone-700" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="lg:hidden overflow-hidden border-t border-gold-100 bg-white"
                        >
                            <div className="py-4 space-y-1">
                                {NAV_LINKS.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMenuOpen(false)}
                                        className="block px-4 py-3 text-stone-700 hover:text-gold-600 hover:bg-gold-50 rounded-xl transition-colors font-medium"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <div className="px-4 pt-2">
                                    <Link href="/contact" onClick={() => setMenuOpen(false)} className="btn-gold w-full text-center text-sm py-3 block">
                                        Enquire Now
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
