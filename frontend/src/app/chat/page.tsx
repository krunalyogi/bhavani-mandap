"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import Link from "next/link";

const DEMO_CONVERSATIONS = [
    {
        _id: "c1", vendorName: "Bhavani Decors", vendorInitial: "B",
        lastMessage: "We will arrive at 6 AM on your event day. Please ensure the hall is accessible.",
        time: "10:30 AM", unread: 2, messages: [
            { from: "vendor", text: "Namaste! How can I help you today?", time: "9:00 AM" },
            { from: "user", text: "Can you confirm the setup time for my event on 25th Dec?", time: "10:00 AM" },
            { from: "vendor", text: "Yes, we'll arrive at 6 AM. The complete setup takes about 4-5 hours.", time: "10:15 AM" },
            { from: "vendor", text: "We will arrive at 6 AM on your event day. Please ensure the hall is accessible.", time: "10:30 AM" },
        ]
    },
    {
        _id: "c2", vendorName: "Royal Floral Art", vendorInitial: "R",
        lastMessage: "The jasmine garlands are ready for your event.",
        time: "Yesterday", unread: 0, messages: [
            { from: "user", text: "Are the jasmine garlands confirmed for the entry gate?", time: "Yesterday 2 PM" },
            { from: "vendor", text: "The jasmine garlands are ready for your event.", time: "Yesterday 4 PM" },
        ]
    },
];

export default function ChatPage() {
    const { user } = useAuth();
    const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
    const [activeConv, setActiveConv] = useState<any>(DEMO_CONVERSATIONS[0]);
    const [messages, setMessages] = useState<any[]>(DEMO_CONVERSATIONS[0].messages);
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const selectConversation = (conv: any) => {
        setActiveConv(conv);
        setMessages(conv.messages);
        setConversations((cs) => cs.map((c) => c._id === conv._id ? { ...c, unread: 0 } : c));
    };

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newMsg = { from: "user", text: input.trim(), time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) };
        setMessages((m) => [...m, newMsg]);
        setInput("");
        // Simulate reply
        setTimeout(() => {
            setMessages((m) => [...m, { from: "vendor", text: "Thank you for your message! We'll get back to you shortly.", time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }]);
        }, 1500);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center pt-24">
                <div className="text-center">
                    <MessageCircle size={48} className="mx-auto text-stone-300 mb-4" />
                    <p className="text-stone-500 mb-4">Login to chat with vendors</p>
                    <Link href="/login" className="btn-gold px-6">Login</Link>
                </div>
            </div>
        );
    }

    const filtered = conversations.filter((c) =>
        c.vendorName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-cream pt-20">
            <div className="max-w-6xl mx-auto px-4 py-6 h-[calc(100vh-5rem)]">
                <div className="flex h-full gap-0 bg-white rounded-2xl shadow-sm overflow-hidden border border-stone-100">

                    {/* Sidebar */}
                    <div className="w-72 flex-shrink-0 border-r border-stone-100 flex flex-col">
                        <div className="p-4 border-b border-stone-100">
                            <h2 className="font-serif text-lg text-maroon-500 mb-3">Messages</h2>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Search vendors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-gold-400"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filtered.map((conv) => (
                                <button
                                    key={conv._id}
                                    onClick={() => selectConversation(conv)}
                                    className={`w-full text-left px-4 py-4 flex items-start gap-3 hover:bg-stone-50 transition-colors border-b border-stone-50 ${activeConv?._id === conv._id ? "bg-gold-50 border-l-2 border-l-gold-400" : ""}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-400 to-maroon-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {conv.vendorInitial}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className="text-sm font-semibold text-stone-800 truncate">{conv.vendorName}</p>
                                            <span className="text-xs text-stone-400 flex-shrink-0">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-stone-500 truncate mt-0.5">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unread > 0 && (
                                        <span className="w-5 h-5 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                                            {conv.unread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    {activeConv ? (
                        <div className="flex-1 flex flex-col min-w-0">
                            {/* Header */}
                            <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-3 bg-white">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-maroon-500 flex items-center justify-center text-white font-bold text-sm">
                                    {activeConv.vendorInitial}
                                </div>
                                <div>
                                    <p className="font-semibold text-stone-800 text-sm">{activeConv.vendorName}</p>
                                    <p className="text-xs text-green-500">Online</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-stone-50/50">
                                {messages.map((msg, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div className={`max-w-xs lg:max-w-md rounded-2xl px-4 py-3 ${msg.from === "user"
                                            ? "bg-gradient-to-br from-gold-500 to-gold-600 text-white rounded-br-sm"
                                            : "bg-white text-stone-700 shadow-sm rounded-bl-sm"}`}
                                        >
                                            <p className="text-sm leading-relaxed">{msg.text}</p>
                                            <p className={`text-xs mt-1 ${msg.from === "user" ? "text-gold-100" : "text-stone-400"}`}>{msg.time}</p>
                                        </div>
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={sendMessage} className="px-4 py-4 border-t border-stone-100 bg-white flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-gold-400 focus:ring-2 focus:ring-gold-100"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-white hover:from-gold-600 hover:to-gold-700 transition-all disabled:opacity-50 shadow-sm"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-stone-400">
                            <div className="text-center">
                                <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
                                <p>Select a conversation to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
