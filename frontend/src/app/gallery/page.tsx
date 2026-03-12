import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
    title: "Gallery",
    description: "Browse our extensive portfolio of royal mandap setups, exquisite floral décor, and illuminating stage designs.",
    openGraph: {
        title: "Bhavani Mandap Gallery | Premium Wedding Decorations",
        description: "Browse our extensive portfolio of royal mandap setups and exquisite floral designs.",
        images: ["https://bhavani-mandap.vercel.app/icon.png"],
    }
};

export default function GalleryPage() {
    return <GalleryClient />;
}
