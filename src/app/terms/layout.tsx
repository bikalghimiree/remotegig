import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Reputo. Read before signing up.",
  alternates: { canonical: "https://reputo.co/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
