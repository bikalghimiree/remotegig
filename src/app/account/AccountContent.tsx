"use client";

import { useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth/client";
import { useOpenPanel } from "@openpanel/nextjs";
import { BellIcon, CrownIcon } from "lucide-react";
import type { ServerUser } from "@/lib/server-auth";
import type { AlertData } from "./page";

const CATEGORY_OPTIONS = ["Engineering", "Design", "Marketing", "Data", "Writing", "Customer Success"];
const LOCATION_OPTIONS = ["Remote (US)", "Remote (Worldwide)", "Remote (US/EU)", "Remote (LATAM)"];

export default function AccountContent({
  user,
  plan,
  alert,
}: {
  user: ServerUser;
  plan: "pro" | "free";
  alert: AlertData;
}) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const op = useOpenPanel();

  // Alert state
  const [categories, setCategories] = useState<string[]>(alert?.categories || []);
  const [locations, setLocations] = useState<string[]>(alert?.locations || []);
  const [keywords, setKeywords] = useState(alert?.keywords?.join(", ") || "");
  const [frequency, setFrequency] = useState(alert?.frequency || "daily");
  const [isActive, setIsActive] = useState(alert?.is_active ?? true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  const isPro = plan === "pro";

  async function openPortal() {
    setLoadingPortal(true);
    op.track("billing_portal_opened");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoadingPortal(false);
    }
  }

  async function handleSignOut() {
    setLoggingOut(true);
    op.track("user_signed_out");
    await authClient.signOut();
    window.location.href = "/";
  }

  function toggleItem(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
    setSaved(false);
  }

  async function handleSaveAlerts() {
    if (!isPro) {
      setShowUpgrade(true);
      return;
    }
    setSaving(true);
    op.track("job_alert_saved", { categories, locations, frequency, isActive });
    try {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
          categories,
          locations,
          frequency,
          is_active: isActive,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  }

  async function handleCheckout() {
    setCheckingOut(true);
    op.track("checkout_initiated", { source: "account_alerts" });
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setCheckingOut(false);
    } catch {
      setCheckingOut(false);
    }
  }

  return (
    <main className="w-full mx-auto max-w-[600px] px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
      <h1 className="text-[28px] font-medium tracking-[-0.02em] text-foreground mb-6">Account</h1>

      {/* Profile */}
      <div className="border border-border rounded-xl bg-card p-4 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt="" width={40} height={40} className="rounded-full" />
            ) : (
              <div className="size-10 rounded-full bg-foreground/[0.06] flex items-center justify-center text-[16px] text-foreground">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[15px] font-medium text-foreground">{user.displayName}</p>
              <p className="text-[14px] text-muted-foreground mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            disabled={loggingOut}
            className="h-8 px-3 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 border-0"
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>

      {/* Subscription */}
      <div className="border border-border rounded-xl bg-card p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-foreground">
              {plan === "pro" ? "Pro Plan" : "Upgrade To Pro - $9"}
            </p>
            <p className="text-[14px] text-muted-foreground mt-0.5">
              {plan === "pro"
                ? "Full access to all features"
                : "Upgrade to apply for unlimited jobs with custom job alerts"}
            </p>
          </div>
          {plan === "pro" ? (
            <button
              onClick={openPortal}
              disabled={loadingPortal}
              className="h-8 px-3 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 border-0"
            >
              {loadingPortal ? "Opening..." : "Manage"}
            </button>
          ) : (
            <button
              onClick={async () => {
                op.track("checkout_initiated", { source: "account_page" });
                try {
                  const res = await fetch("/api/stripe/checkout", { method: "POST" });
                  const data = await res.json();
                  if (data.url) window.location.href = data.url;
                } catch {}
              }}
              className="h-8 px-3 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer hover:opacity-90 transition-opacity shrink-0 border-0"
            >
              Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Job Alerts */}
      {
        <>
          <div className="flex items-center gap-2 mt-8 mb-4">
            <BellIcon size={18} className="text-foreground" />
            <h2 className="text-[18px] font-medium text-foreground">Job Alerts</h2>
          </div>

          {/* Active toggle */}
          <div className="border border-border rounded-xl bg-card p-4 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-medium text-foreground">Alerts {isActive ? "enabled" : "paused"}</p>
                <p className="text-[13px] text-muted-foreground mt-0.5">Receive email notifications for new jobs</p>
              </div>
              <button
                onClick={() => { setIsActive(!isActive); setSaved(false); }}
                className={`w-10 h-6 rounded-full cursor-pointer border-0 transition-colors relative ${isActive ? "" : "bg-foreground/[0.15]"}`}
                style={isActive ? { background: '#006145' } : {}}
              >
                <div className={`size-4 rounded-full bg-white absolute top-1 transition-all ${isActive ? "left-5" : "left-1"}`} />
              </button>
            </div>
          </div>

          {/* Keywords */}
          <div className="border border-border rounded-xl bg-card p-4 mb-3">
            <p className="text-[14px] font-medium text-foreground mb-2">Keywords</p>
            <input
              type="text"
              value={keywords}
              onChange={(e) => { setKeywords(e.target.value); setSaved(false); }}
              placeholder="e.g. React, Python, Product Design"
              className="w-full h-9 px-3 rounded-lg border border-border bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* Categories */}
          <div className="border border-border rounded-xl bg-card p-4 mb-3">
            <p className="text-[14px] font-medium text-foreground mb-2.5">Categories</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleItem(categories, setCategories, cat)}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border ${
                    categories.includes(cat)
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Locations */}
          <div className="border border-border rounded-xl bg-card p-4 mb-3">
            <p className="text-[14px] font-medium text-foreground mb-2.5">Locations</p>
            <div className="flex flex-wrap gap-2">
              {LOCATION_OPTIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => toggleItem(locations, setLocations, loc)}
                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border ${
                    locations.includes(loc)
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div className="border border-border rounded-xl bg-card p-4 mb-4">
            <p className="text-[14px] font-medium text-foreground mb-2.5">Frequency</p>
            <div className="flex gap-2">
              {(["daily", "weekly"] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => { setFrequency(freq); setSaved(false); }}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border capitalize ${
                    frequency === freq
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-border hover:border-foreground/40"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSaveAlerts}
            disabled={saving}
            className="w-full h-11 rounded-xl text-[15px] font-medium cursor-pointer border-0 hover:opacity-90 transition-all disabled:opacity-50 mb-6"
            style={{ background: '#006145', color: '#fff' }}
          >
            {saving ? "Saving..." : saved ? "Saved" : isPro ? "Save Alert Preferences" : "Save Alert Preferences"}
          </button>
        </>
      }

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md" onClick={() => setShowUpgrade(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-[420px] w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium mb-4" style={{ background: '#006145', color: '#fff' }}>
              <CrownIcon size={14} />
              PRO PLAN
            </div>
            <h2 className="text-[20px] sm:text-[22px] font-medium mb-1 text-foreground">Upgrade to Save Alerts</h2>
            <p className="text-[14px] text-muted-foreground mb-5">Get daily or weekly emails with new remote jobs matching your preferences.</p>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-[20px] font-medium line-through text-muted-foreground">$19</span>
              <span className="text-[40px] font-medium leading-none" style={{ color: '#006145' }}>$9</span>
              <span className="text-[16px] font-medium text-muted-foreground">/month</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full h-11 rounded-xl text-[15px] font-medium cursor-pointer border-0 hover:opacity-90 transition-all disabled:opacity-50"
              style={{ background: '#006145', color: '#fff' }}
            >
              {checkingOut ? "Redirecting..." : "Upgrade Now"}
            </button>
            <p className="text-center mt-4 text-[12px] text-muted-foreground">Secure payment via Stripe. Cancel anytime.</p>
          </div>
        </div>
      )}

    </main>
  );
}
