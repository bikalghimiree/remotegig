import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Reputo helps creators find and apply to paid brand deals. No cold DMs, no guessing. Just browse, filter, and apply.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
