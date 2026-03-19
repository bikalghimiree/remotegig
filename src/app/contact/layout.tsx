import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Have a question or want to list a brand deal? Get in touch with the Reputo team.",
  alternates: { canonical: "https://reputo.co/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
