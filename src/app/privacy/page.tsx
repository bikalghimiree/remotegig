"use client";

import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="bg-background">
        <div className="mx-auto max-w-[1350px] px-4 sm:px-6 h-[56px] flex items-center">
          <Link href="/" className="shrink-0 no-underline flex items-center gap-2">
            <Image src="/logo.svg" alt="Reputo" width={24} height={24} className="size-6" />
            <span className="text-[18px] font-semibold tracking-tight text-foreground">REPUTO</span>
          </Link>
          <div className="flex-1" />
          <button
            onClick={toggle}
            className="size-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/[0.06] transition-colors cursor-pointer bg-transparent border-0"
            aria-label="Toggle theme"
          >
            {dark ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </button>
        </div>
      </header>

      <main className="w-full flex-1 mx-auto max-w-[640px] px-4 sm:px-6 pt-12 sm:pt-20 pb-20">
        <h1 className="text-[24px] sm:text-[28px] font-normal tracking-[-0.02em] text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-[16px] text-foreground mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Information We Collect</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              When you sign in with Google, we collect your name, email address, and profile picture. We also store your job applications and saved preferences within the platform.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">How We Use Your Information</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              Your information is used to authenticate your account, display relevant brand deal opportunities, and process your applications. We may send account-related notifications to your email.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Data Storage</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              Your data is stored securely on Neon (PostgreSQL) databases hosted in the United States. We use industry-standard encryption and security practices to protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Third-Party Services</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              We use Google OAuth for authentication, Neon for database hosting, and Stripe for payment processing. These services have their own privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Cookies</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              We use essential cookies to maintain your session and preferences. We do not use third-party tracking or advertising cookies.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Your Rights</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              You can request deletion of your account and all associated data at any time by contacting us at{" "}
              <a href="mailto:contact@reputo.co" className="text-foreground underline">contact@reputo.co</a>.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Contact</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              For privacy-related questions, email us at{" "}
              <a href="mailto:contact@reputo.co" className="text-foreground underline">contact@reputo.co</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
