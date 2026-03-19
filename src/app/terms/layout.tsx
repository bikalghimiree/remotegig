import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for using RemoteGig.",
  alternates: { canonical: "https://remotegig.pro/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
