import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Bhavani Mandap for premium wedding decoration services in Gujarat. Call +91 98245 20806 to book your event.",
    openGraph: {
        title: "Contact Bhavani Mandap | Book Royal Decorations",
        description: "Get in touch with Bhavani Mandap for premium wedding decoration services in Gujarat. Call +91 98245 20806.",
    }
};

export default function ContactPage() {
    return <ContactClient />;
}
