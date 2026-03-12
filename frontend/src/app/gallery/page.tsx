"use client";
import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

const GALLERY_ITEMS = [
  // Videos
  { id: 'v1', type: 'video', src: 'https://res.cloudinary.com/dgmlfzlkd/video/upload/v1773346143/bhavani_mandap/real_media/videos/VID-20260307-WA0101.mp4' },
  { id: 'v2', type: 'video', src: 'https://res.cloudinary.com/dgmlfzlkd/video/upload/v1773346146/bhavani_mandap/real_media/videos/VID-20260307-WA0102.mp4' },
  { id: 'v3', type: 'video', src: 'https://res.cloudinary.com/dgmlfzlkd/video/upload/v1773346155/bhavani_mandap/real_media/videos/VID-20260307-WA0103.mp4' },
  { id: 'v4', type: 'video', src: 'https://res.cloudinary.com/dgmlfzlkd/video/upload/v1773346161/bhavani_mandap/real_media/videos/VID-20260307-WA0104.mp4' },
  { id: 'v5', type: 'video', src: 'https://res.cloudinary.com/dgmlfzlkd/video/upload/v1773346167/bhavani_mandap/real_media/videos/VID-20260307-WA0105.mp4' },
  { id: 'v6', type: 'video', src: 'https://res.cloudinary.com/dgmlfzlkd/video/upload/v1773346173/bhavani_mandap/real_media/videos/VID-20260307-WA0117.mp4' },
  
  // Images
  { id: 'i1', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346037/bhavani_mandap/real_media/images/IMG-20260307-WA0044.jpg' },
  { id: 'i2', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346039/bhavani_mandap/real_media/images/IMG-20260307-WA0045.jpg' },
  { id: 'i3', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346041/bhavani_mandap/real_media/images/IMG-20260307-WA0046.jpg' },
  { id: 'i4', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346042/bhavani_mandap/real_media/images/IMG-20260307-WA0047.jpg' },
  { id: 'i5', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346044/bhavani_mandap/real_media/images/IMG-20260307-WA0048.jpg' },
  { id: 'i6', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346046/bhavani_mandap/real_media/images/IMG-20260307-WA0049.jpg' },
  { id: 'i7', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346048/bhavani_mandap/real_media/images/IMG-20260307-WA0050.jpg' },
  { id: 'i8', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346049/bhavani_mandap/real_media/images/IMG-20260307-WA0051.jpg' },
  { id: 'i9', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346051/bhavani_mandap/real_media/images/IMG-20260307-WA0052.jpg' },
  { id: 'i10', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346052/bhavani_mandap/real_media/images/IMG-20260307-WA0053.jpg' },
  { id: 'i11', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346054/bhavani_mandap/real_media/images/IMG-20260307-WA0054.jpg' },
  { id: 'i12', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346056/bhavani_mandap/real_media/images/IMG-20260307-WA0055.jpg' },
  { id: 'i13', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346058/bhavani_mandap/real_media/images/IMG-20260307-WA0056.jpg' },
  { id: 'i14', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346060/bhavani_mandap/real_media/images/IMG-20260307-WA0057.jpg' },
  { id: 'i15', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346062/bhavani_mandap/real_media/images/IMG-20260307-WA0058.jpg' },
  { id: 'i16', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346064/bhavani_mandap/real_media/images/IMG-20260307-WA0059.jpg' },
  { id: 'i17', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346066/bhavani_mandap/real_media/images/IMG-20260307-WA0060.jpg' },
  { id: 'i18', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346068/bhavani_mandap/real_media/images/IMG-20260307-WA0061.jpg' },
  { id: 'i19', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346070/bhavani_mandap/real_media/images/IMG-20260307-WA0062.jpg' },
  { id: 'i20', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346072/bhavani_mandap/real_media/images/IMG-20260307-WA0063.jpg' },
  { id: 'i21', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346073/bhavani_mandap/real_media/images/IMG-20260307-WA0064.jpg' },
  { id: 'i22', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346075/bhavani_mandap/real_media/images/IMG-20260307-WA0065.jpg' },
  { id: 'i23', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346077/bhavani_mandap/real_media/images/IMG-20260307-WA0066.jpg' },
  { id: 'i24', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346079/bhavani_mandap/real_media/images/IMG-20260307-WA0067.jpg' },
  { id: 'i25', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346080/bhavani_mandap/real_media/images/IMG-20260307-WA0068.jpg' },
  { id: 'i26', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346082/bhavani_mandap/real_media/images/IMG-20260307-WA0069.jpg' },
  { id: 'i27', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346084/bhavani_mandap/real_media/images/IMG-20260307-WA0070.jpg' },
  { id: 'i28', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346086/bhavani_mandap/real_media/images/IMG-20260307-WA0071.jpg' },
  { id: 'i29', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346088/bhavani_mandap/real_media/images/IMG-20260307-WA0072.jpg' },
  { id: 'i30', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346090/bhavani_mandap/real_media/images/IMG-20260307-WA0073.jpg' },
  { id: 'i31', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346091/bhavani_mandap/real_media/images/IMG-20260307-WA0074.jpg' },
  { id: 'i32', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346094/bhavani_mandap/real_media/images/IMG-20260307-WA0075.jpg' },
  { id: 'i33', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346096/bhavani_mandap/real_media/images/IMG-20260307-WA0076.jpg' },
  { id: 'i34', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346097/bhavani_mandap/real_media/images/IMG-20260307-WA0077.jpg' },
  { id: 'i35', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346099/bhavani_mandap/real_media/images/IMG-20260307-WA0078.jpg' },
  { id: 'i36', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346101/bhavani_mandap/real_media/images/IMG-20260307-WA0079.jpg' },
  { id: 'i37', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346103/bhavani_mandap/real_media/images/IMG-20260307-WA0080.jpg' },
  { id: 'i38', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346104/bhavani_mandap/real_media/images/IMG-20260307-WA0081.jpg' },
  { id: 'i39', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346106/bhavani_mandap/real_media/images/IMG-20260307-WA0082.jpg' },
  { id: 'i40', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346108/bhavani_mandap/real_media/images/IMG-20260307-WA0083.jpg' },
  { id: 'i41', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346110/bhavani_mandap/real_media/images/IMG-20260307-WA0084.jpg' },
  { id: 'i42', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346111/bhavani_mandap/real_media/images/IMG-20260307-WA0085.jpg' },
  { id: 'i43', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346113/bhavani_mandap/real_media/images/IMG-20260307-WA0086.jpg' },
  { id: 'i44', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346115/bhavani_mandap/real_media/images/IMG-20260307-WA0087.jpg' },
  { id: 'i45', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346117/bhavani_mandap/real_media/images/IMG-20260307-WA0088.jpg' },
  { id: 'i46', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346120/bhavani_mandap/real_media/images/IMG-20260307-WA0089.jpg' },
  { id: 'i47', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346122/bhavani_mandap/real_media/images/IMG-20260307-WA0090.jpg' },
  { id: 'i48', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346124/bhavani_mandap/real_media/images/IMG-20260307-WA0091.jpg' },
  { id: 'i49', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346126/bhavani_mandap/real_media/images/IMG-20260307-WA0092.jpg' },
  { id: 'i50', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346127/bhavani_mandap/real_media/images/IMG-20260307-WA0093.jpg' },
  { id: 'i51', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346129/bhavani_mandap/real_media/images/IMG-20260307-WA0094.jpg' },
  { id: 'i52', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346132/bhavani_mandap/real_media/images/IMG-20260307-WA0095.jpg' },
  { id: 'i53', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346134/bhavani_mandap/real_media/images/IMG-20260307-WA0096.jpg' },
  { id: 'i54', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346135/bhavani_mandap/real_media/images/IMG-20260307-WA0097.jpg' },
  { id: 'i55', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346137/bhavani_mandap/real_media/images/IMG-20260307-WA0098.jpg' },
  { id: 'i56', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346139/bhavani_mandap/real_media/images/IMG-20260307-WA0099.jpg' },
  { id: 'i57', type: 'image', src: 'https://res.cloudinary.com/dgmlfzlkd/image/upload/v1773346141/bhavani_mandap/real_media/images/IMG-20260307-WA0100.jpg' },
];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: "easeOut" as const } }),
};

export default function GalleryPage() {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length : null));
    const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % GALLERY_ITEMS.length : null));

    return (
        <div className="min-h-screen bg-cream pt-24 pb-16">
            {/* Header */}
            <section className="py-16 text-center" style={{ background: "linear-gradient(135deg, #800000 0%, #4a0000 100%)" }}>
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-gold-400 font-semibold uppercase tracking-widest text-sm">
                    Our Portfolio
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-5xl md:text-6xl font-bold text-white mt-3 mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                    Gallery
                </motion.h1>
                <div className="mx-auto my-4 w-20 h-0.5 bg-gold-400" />
                <p className="text-white/70 max-w-xl mx-auto text-sm">
                    Every event tells a unique love story. Explore our stunning collection of mandap setups and wedding decorations.
                </p>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">

                {/* Masonry Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {GALLERY_ITEMS.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "100px" }}
                            variants={fadeUp}
                            custom={i % 10} // Just slightly stagger rows
                            className="break-inside-avoid relative group cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 bg-stone-100"
                            onClick={() => setLightboxIndex(i)}
                        >
                            {item.type === 'video' ? (
                                <video
                                    src={item.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <img
                                    src={item.src}
                                    alt="Mandap Setup"
                                    loading="lazy"
                                    className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="text-white w-10 h-10 drop-shadow-lg" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setLightboxIndex(null)}
                    >
                        {/* Close */}
                        <button
                            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                            onClick={() => setLightboxIndex(null)}
                        >
                            <X size={28} />
                        </button>

                        {/* Prev */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                        >
                            <ChevronLeft size={32} />
                        </button>

                        {/* Media */}
                        <motion.div
                            key={lightboxIndex}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-4xl w-full flex justify-center items-center"
                        >
                            {GALLERY_ITEMS[lightboxIndex].type === 'video' ? (
                                <video
                                    src={GALLERY_ITEMS[lightboxIndex].src}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-auto max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                                />
                            ) : (
                                <img
                                    src={GALLERY_ITEMS[lightboxIndex].src}
                                    alt="Gallery Display"
                                    className="w-auto max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
                                />
                            )}
                        </motion.div>

                        {/* Next */}
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                        >
                            <ChevronRight size={32} />
                        </button>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium">
                            {lightboxIndex + 1} / {GALLERY_ITEMS.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
