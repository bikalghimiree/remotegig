"use client";

import { useState } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth/client";
import { useOpenPanel } from "@openpanel/nextjs";
import type { ServerUser } from "@/lib/server-auth";

export default function AccountContent({
  user,
  plan,
}: {
  user: ServerUser;
  plan: "pro" | "free";
}) {
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const op = useOpenPanel();

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

  return (
    <main className="w-full mx-auto max-w-[600px] px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
      <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-foreground mb-6">Account</h1>

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
            <p className="text-[14px] text-muted-foreground mt-0.5">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Subscription */}
      <div className="border border-border rounded-xl bg-card p-4 mb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[15px] font-medium text-foreground">
              {plan === "pro" ? "Pro Plan" : "Free Plan"}
            </p>
            <p className="text-[14px] text-muted-foreground mt-0.5">
              {plan === "pro"
                ? "Full access to all features"
                : "Upgrade to unlock unlimited job views and alerts"}
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
              onClick={() => window.location.href = "/"}
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
  );
}
