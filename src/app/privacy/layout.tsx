import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Reputo collects, uses, and protects your data. Read our full privacy policy.",
  alternates: { canonical: "https://reputo.co/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
