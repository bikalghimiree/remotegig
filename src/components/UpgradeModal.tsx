"use client";

import { useState } from "react";
import { useOpenPanel } from "@openpanel/nextjs";
import { Crown } from "lucide-react";

export default function UpgradeModal({
  onClose,
  variant = "default",
}: {
  onClose: () => void;
  variant?: "default" | "apply";
}) {
  const [loading, setLoading] = useState(false);
  const op = useOpenPanel();

  async function handleUpgrade() {
    setLoading(true);
    op.track("upgrade_cta_click", { plan: "pro", price: 14 });
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  const features = [
    "Unlimited applications to brand deals",
    "Direct brand contact info (emails, socials)",
    "AI-generated personalized pitch templates",
    "Priority access to new brand listings",
    "Apply to 2,500+ active gigs",
    "Advanced search filters",
    "Cancel anytime, no commitment",
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-[420px] w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold mb-4" style={{ background: '#006145', color: '#fff' }}>
          <Crown size={14} />
          PRO PLAN
        </div>

        {/* Title */}
        <h2 className="text-[20px] sm:text-[22px] font-bold mb-1 text-foreground">
          Unlock Unlimited Access
        </h2>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-[20px] font-medium line-through text-muted-foreground">$29</span>
          <span className="text-[40px] font-extrabold leading-none" style={{ color: '#006145' }}>$14</span>
          <span className="text-[16px] font-medium text-muted-foreground">/month</span>
        </div>

        {/* Features */}
        <ul className="space-y-2.5 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="12" fill="rgba(0,97,69,0.15)" />
                <path d="M7 12.5l3 3 7-7" stroke="#006145" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full h-11 rounded-xl text-[15px] font-bold cursor-pointer border-0 hover:opacity-90 transition-all disabled:opacity-50"
            style={{ background: '#006145', color: '#fff' }}
          >
            {loading ? "Redirecting..." : "Upgrade Now"}
          </button>
          <button
            onClick={onClose}
            className="w-full h-10 rounded-xl border border-border text-[14px] font-medium cursor-pointer hover:bg-foreground/[0.04] transition-colors bg-transparent text-foreground"
          >
            Maybe later
          </button>
        </div>

        {/* Trust */}
        <p className="text-center mt-4 text-[12px] text-muted-foreground">
          Secure payment via Stripe. Cancel anytime with one click.
        </p>
      </div>
    </div>
  );
}
