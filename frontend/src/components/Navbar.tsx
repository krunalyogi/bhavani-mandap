"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Bell, User, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Mandaps" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const pathname = usePathname();
    const { user, logout, isAuthenticated } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const getDashboardPath = () => {
        if (user?.role === "admin") return "/dashboard/admin";
        if (user?.role === "vendor") return "/dashboard/vendor";
        return "/dashboard/user";
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
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

                    {/* Right Actions */}
                    <div className="hidden lg:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link href="/wishlist" className="p-2 rounded-full hover:bg-gold-50 text-stone-600 hover:text-maroon-500 transition-colors">
                                    <Heart size={20} />
                                </Link>
                                <Link href="/notifications" className="p-2 rounded-full hover:bg-gold-50 text-stone-600 hover:text-maroon-500 transition-colors">
                                    <Bell size={20} />
                                </Link>
                                {/* User Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gold-50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white text-sm font-bold">
                                            {user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="text-sm font-medium text-stone-700">{user?.name?.split(" ")[0]}</span>
                                        <ChevronDown size={14} className="text-stone-400" />
                                    </button>
                                    <AnimatePresence>
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-stone-100 overflow-hidden z-50"
                                            >
                                                <Link href={getDashboardPath()} className="flex items-center gap-3 px-4 py-3 text-sm text-stone-700 hover:bg-gold-50 hover:text-gold-700">
                                                    <User size={16} /> My Dashboard
                                                </Link>
                                                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-stone-100">
                                                    <LogOut size={16} /> Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm font-medium text-stone-700 hover:text-gold-600 transition-colors px-4 py-2">
                                    Login
                                </Link>
                                <Link href="/register" className="btn-gold text-sm py-2 px-5">
                                    Sign Up
                                </Link>
                            </>
                        )}
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
                                {isAuthenticated ? (
                                    <>
                                        <Link href={getDashboardPath()} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-stone-700 hover:bg-gold-50 rounded-xl">
                                            Dashboard
                                        </Link>
                                        <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl">
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <div className="px-4 pt-2 flex gap-3">
                                        <Link href="/login" className="btn-outline-gold flex-1 text-center text-sm py-2">Login</Link>
                                        <Link href="/register" className="btn-gold flex-1 text-center text-sm py-2">Register</Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
}
