"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Save, RotateCcw, ArrowRight, IndianRupee } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function CustomizerPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const previewRef = useRef<HTMLDivElement>(null);
    const [mandap, setMandap] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selections, setSelections] = useState({
        flowerType: { name: "", priceAddon: 0 },
        colorTheme: { name: "", hexCode: "#d4a017", priceAddon: 0 },
        lighting: { name: "", priceAddon: 0 },
        fabricStyle: { name: "", priceAddon: 0 },
        extraServices: [] as { name: string; priceAddon: number }[],
    });

    const DEFAULT_OPTIONS = {
        flowerTypes: [
            { name: "Rose Cascade", priceAddon: 0, emoji: "🌹" },
            { name: "Marigold Garland", priceAddon: 2000, emoji: "🌼" },
            { name: "Orchid Elegance", priceAddon: 5000, emoji: "💜" },
            { name: "Lotus Royal", priceAddon: 3500, emoji: "🪷" },
            { name: "Jasmine Fresh", priceAddon: 1500, emoji: "🌸" },
        ],
        colorThemes: [
            { name: "Royal Gold", hexCode: "#d4a017", priceAddon: 0 },
            { name: "Crimson Red", hexCode: "#800000", priceAddon: 2000 },
            { name: "Blush Pink", hexCode: "#FFB6C1", priceAddon: 1500 },
            { name: "Royal Blue", hexCode: "#002366", priceAddon: 2000 },
            { name: "Sage Green", hexCode: "#8FBC8F", priceAddon: 1000 },
            { name: "Ivory White", hexCode: "#FFFFF0", priceAddon: 500 },
        ],
        lightingOptions: [
            { name: "Fairy Lights", priceAddon: 0, emoji: "✨" },
            { name: "Crystal Chandelier", priceAddon: 8000, emoji: "🔮" },
            { name: "LED Floodlights", priceAddon: 3000, emoji: "💡" },
            { name: "Vintage Edison", priceAddon: 4000, emoji: "🕯️" },
            { name: "Neon Glow", priceAddon: 5000, emoji: "🌟" },
        ],
        fabricStyles: [
            { name: "Silk Drape", priceAddon: 0, emoji: "🪡" },
            { name: "Velvet Royal", priceAddon: 6000, emoji: "👑" },
            { name: "Chiffon Light", priceAddon: 2000, emoji: "🎀" },
            { name: "Brocade Gold", priceAddon: 5000, emoji: "✦" },
        ],
    };

    useEffect(() => {
        if (!isAuthenticated) { router.push("/login"); return; }
        const load = async () => {
            try {
                const { data } = await api.get(`/mandaps/${id}`);
                setMandap(data.data);
                const opts = data.data.customizationOptions;
                if (opts?.flowerTypes?.[0]) setSelections((prev) => ({ ...prev, flowerType: opts.flowerTypes[0] }));
                if (opts?.colorThemes?.[0]) setSelections((prev) => ({ ...prev, colorTheme: opts.colorThemes[0] }));
                if (opts?.lightingOptions?.[0]) setSelections((prev) => ({ ...prev, lighting: opts.lightingOptions[0] }));
                if (opts?.fabricStyles?.[0]) setSelections((prev) => ({ ...prev, fabricStyle: opts.fabricStyles[0] }));
            } catch { toast.error("Failed to load mandap"); }
            setLoading(false);
        };
        load();
    }, [id, isAuthenticated]);

    const totalAddon = selections.flowerType.priceAddon + selections.colorTheme.priceAddon +
        selections.lighting.priceAddon + selections.fabricStyle.priceAddon +
        selections.extraServices.reduce((a, s) => a + s.priceAddon, 0);

    const basePrice = mandap ? (mandap.discountedPrice || mandap.basePrice) : 0;
    const totalPrice = basePrice + totalAddon;

    const opts = mandap?.customizationOptions || DEFAULT_OPTIONS;
    const flowerOptions = opts.flowerTypes || DEFAULT_OPTIONS.flowerTypes;
    const colorOptions = opts.colorThemes || DEFAULT_OPTIONS.colorThemes;
    const lightOptions = opts.lightingOptions || DEFAULT_OPTIONS.lightingOptions;
    const fabricOptions = opts.fabricStyles || DEFAULT_OPTIONS.fabricStyles;

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data } = await api.post("/custom-designs", {
                mandap: id,
                selections,
                totalAddonPrice: totalAddon,
                name: `Custom Design - ${mandap?.title}`,
            });
            toast.success("Design saved! Proceeding to booking...");
            router.push(`/book/${id}?customDesignId=${data.data._id}`);
        } catch { toast.error("Failed to save design"); }
        setSaving(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-cream pt-24 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <p className="section-subtitle mb-2">Personalize Your Wedding</p>
                    <h1 className="section-title">Mandap Customizer</h1>
                    <div className="gold-divider" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Customization Controls */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Flower Type */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-4">🌸 Flower Type</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {flowerOptions.map((f: any) => (
                                    <button
                                        key={f.name}
                                        onClick={() => setSelections((s) => ({ ...s, flowerType: { name: f.name, priceAddon: f.priceAddon } }))}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${selections.flowerType.name === f.name
                                                ? "border-gold-500 bg-gold-50"
                                                : "border-stone-100 hover:border-gold-200"
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{f.emoji}</div>
                                        <p className="text-sm font-medium text-stone-700">{f.name}</p>
                                        <p className="text-xs text-gold-600 mt-1">
                                            {f.priceAddon > 0 ? `+₹${f.priceAddon.toLocaleString()}` : "Included"}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Theme */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-4">🎨 Color Theme</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                                {colorOptions.map((c: any) => (
                                    <button
                                        key={c.name}
                                        onClick={() => setSelections((s) => ({ ...s, colorTheme: { name: c.name, hexCode: c.hexCode, priceAddon: c.priceAddon } }))}
                                        className={`group flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${selections.colorTheme.name === c.name ? "ring-2 ring-gold-500 ring-offset-1" : ""
                                            }`}
                                    >
                                        <div
                                            className="w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform group-hover:scale-110"
                                            style={{ backgroundColor: c.hexCode }}
                                        />
                                        <p className="text-xs text-stone-600 text-center">{c.name}</p>
                                        <p className="text-xs text-gold-600">{c.priceAddon > 0 ? `+₹${c.priceAddon.toLocaleString()}` : "Free"}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lighting */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-4">💡 Lighting Style</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {lightOptions.map((l: any) => (
                                    <button
                                        key={l.name}
                                        onClick={() => setSelections((s) => ({ ...s, lighting: { name: l.name, priceAddon: l.priceAddon } }))}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${selections.lighting.name === l.name ? "border-gold-500 bg-gold-50" : "border-stone-100 hover:border-gold-200"
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{l.emoji}</div>
                                        <p className="text-sm font-medium text-stone-700">{l.name}</p>
                                        <p className="text-xs text-gold-600 mt-1">{l.priceAddon > 0 ? `+₹${l.priceAddon.toLocaleString()}` : "Included"}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Fabric Style */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-4">🪡 Fabric Style</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {fabricOptions.map((fab: any) => (
                                    <button
                                        key={fab.name}
                                        onClick={() => setSelections((s) => ({ ...s, fabricStyle: { name: fab.name, priceAddon: fab.priceAddon } }))}
                                        className={`p-4 rounded-xl border-2 transition-all text-left ${selections.fabricStyle.name === fab.name ? "border-gold-500 bg-gold-50" : "border-stone-100 hover:border-gold-200"
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{fab.emoji}</div>
                                        <p className="text-sm font-medium text-stone-700">{fab.name}</p>
                                        <p className="text-xs text-gold-600 mt-1">{fab.priceAddon > 0 ? `+₹${fab.priceAddon.toLocaleString()}` : "Included"}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Live Preview + Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Visual Preview */}
                        <div
                            ref={previewRef}
                            className="rounded-3xl p-8 text-center shadow-premium transition-all duration-500 min-h-80 flex flex-col items-center justify-center"
                            style={{ backgroundColor: selections.colorTheme.hexCode + "15", border: `2px solid ${selections.colorTheme.hexCode}40` }}
                        >
                            <div className="text-7xl mb-4 animate-float">🏰</div>
                            <h3 className="font-serif text-xl font-bold mb-2" style={{ color: selections.colorTheme.hexCode }}>
                                {mandap?.title}
                            </h3>
                            <div className="text-4xl mb-3">{flowerOptions.find((f: any) => f.name === selections.flowerType.name)?.emoji || "🌸"}</div>
                            <p className="text-sm text-stone-500">{selections.flowerType.name || "Select flowers"}</p>
                            <p className="text-sm text-stone-500">{selections.lighting.name || "Select lighting"}</p>
                            <p className="text-sm text-stone-500">{selections.fabricStyle.name || "Select fabric"}</p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                {[selections.flowerType.name, selections.lighting.name, selections.fabricStyle.name]
                                    .filter(Boolean)
                                    .map((tag) => (
                                        <span key={tag} className="px-2 py-1 rounded-full text-xs text-white" style={{ backgroundColor: selections.colorTheme.hexCode }}>
                                            {tag}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100">
                            <h3 className="font-serif text-lg font-semibold text-maroon-500 mb-4 flex items-center gap-2">
                                <IndianRupee size={18} className="text-gold-500" /> Price Breakdown
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-stone-600">
                                    <span>Base Mandap Price</span>
                                    <span>₹{basePrice.toLocaleString()}</span>
                                </div>
                                {selections.flowerType.priceAddon > 0 && (
                                    <div className="flex justify-between text-stone-600">
                                        <span>{selections.flowerType.name}</span>
                                        <span className="text-green-600">+₹{selections.flowerType.priceAddon.toLocaleString()}</span>
                                    </div>
                                )}
                                {selections.colorTheme.priceAddon > 0 && (
                                    <div className="flex justify-between text-stone-600">
                                        <span>{selections.colorTheme.name}</span>
                                        <span className="text-green-600">+₹{selections.colorTheme.priceAddon.toLocaleString()}</span>
                                    </div>
                                )}
                                {selections.lighting.priceAddon > 0 && (
                                    <div className="flex justify-between text-stone-600">
                                        <span>{selections.lighting.name}</span>
                                        <span className="text-green-600">+₹{selections.lighting.priceAddon.toLocaleString()}</span>
                                    </div>
                                )}
                                {selections.fabricStyle.priceAddon > 0 && (
                                    <div className="flex justify-between text-stone-600">
                                        <span>{selections.fabricStyle.name}</span>
                                        <span className="text-green-600">+₹{selections.fabricStyle.priceAddon.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between font-bold text-lg text-maroon-500">
                                    <span>Total</span>
                                    <span>₹{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <motion.button
                                onClick={handleSave}
                                disabled={saving}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-gold w-full py-4 text-base"
                            >
                                {saving ? "Saving..." : <><Save size={18} /> Save & Proceed to Booking</>}
                            </motion.button>
                            <button
                                onClick={() => setSelections({ flowerType: { name: "", priceAddon: 0 }, colorTheme: { name: "Royal Gold", hexCode: "#d4a017", priceAddon: 0 }, lighting: { name: "", priceAddon: 0 }, fabricStyle: { name: "", priceAddon: 0 }, extraServices: [] })}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-stone-200 text-stone-500 hover:border-stone-300 text-sm transition-all"
                            >
                                <RotateCcw size={14} /> Reset Selections
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
