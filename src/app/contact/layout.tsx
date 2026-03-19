import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the RemoteGig team.",
  alternates: { canonical: "https://remotegig.pro/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
