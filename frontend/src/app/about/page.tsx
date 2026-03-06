import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about Bhavani Mandap – 15+ years of crafting royal wedding decorations across India.",
};

export default function AboutPage() {
    return <AboutClient />;
}
