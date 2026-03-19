import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How RemoteGig collects, uses, and protects your data.",
  alternates: { canonical: "https://remotegig.pro/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
