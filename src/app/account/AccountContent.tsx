"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon, ArrowLeftIcon } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";
import UpgradeModal from "@/components/UpgradeModal";
import type { ServerUser } from "@/lib/server-auth";

export default function AccountContent({
  user,
  plan,
}: {
  user: ServerUser;
  plan: "pro" | "free";
}) {
  const { dark, toggle } = useTheme();
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  async function openPortal() {
    setLoadingPortal(true);
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
    await authClient.signOut();
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-background">
        <div className="mx-auto max-w-[1350px] px-4 sm:px-6 h-[56px] flex items-center">
          <Link href="/" className="shrink-0 no-underline flex items-center gap-2">
            <Image src="/logo.svg" alt="Reputo" width={24} height={24} className="size-6" />
            <span className="text-[18px] font-semibold tracking-tight text-foreground">REPUTO</span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              className="size-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-colors cursor-pointer bg-transparent border-0"
              aria-label="Toggle theme"
            >
              {dark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
            </button>
            {user.avatarUrl && (
              <Image src={user.avatarUrl} alt="" width={28} height={28} className="rounded-full" />
            )}
          </div>
        </div>
      </header>

      <main className="w-full flex-1 mx-auto max-w-[600px] px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[14px] text-foreground hover:underline no-underline mb-8">
          <ArrowLeftIcon size={14} />
          Back
        </Link>

        <h1 className="text-[28px] font-normal tracking-[-0.02em] text-foreground mb-6">Account</h1>

        {/* Profile */}
        <div className="border border-border rounded-xl bg-card p-4 mb-3">
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
              <p className="text-[14px] text-foreground mt-0.5">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="border border-border rounded-xl bg-card p-4 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-foreground">
                {plan === "pro" ? "Pro Plan" : "Upgrade your plan"}
              </p>
              <p className="text-[14px] text-foreground mt-0.5">
                {plan === "pro"
                  ? "Full access to all features"
                  : "Get unlimited access and premium features"}
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
                onClick={() => setShowUpgradeModal(true)}
                className="h-8 px-3 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer hover:opacity-90 transition-opacity shrink-0 border-0"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          disabled={loggingOut}
          className="h-8 px-3 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 border-0"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </main>

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}

      <Footer />
    </div>
  );
}
