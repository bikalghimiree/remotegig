"use client";

import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-[16px] text-foreground mb-10">Last updated: March 19, 2026</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Service</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              Reputo is a job board that connects UGC creators with paid brand deal opportunities. By using our platform, you agree to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Accounts</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              You sign in using Google OAuth. You are responsible for maintaining the security of your account. You must provide accurate information when applying to brand deals.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Pricing</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              Reputo offers a free tier with limited access and paid plans starting at $14/month. You may cancel your subscription at any time through your account settings. Refunds are handled on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Content and Conduct</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              You agree not to misrepresent your credentials, submit false applications, or use the platform for spam or any unlawful purpose. We reserve the right to suspend accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Limitation of Liability</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              Reputo facilitates connections between creators and brands. We do not guarantee specific deal amounts, brand responses, or contract terms. Our liability is limited to the subscription fees paid during the relevant period.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Changes</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              We may update these terms from time to time. Continued use of the service after changes constitutes acceptance. Material changes will be communicated via email.
            </p>
          </section>

          <section>
            <h2 className="text-[16px] font-medium text-foreground mb-2">Contact</h2>
            <p className="text-[16px] text-foreground leading-relaxed">
              Questions about these terms? Email us at{" "}
              <a href="mailto:contact@reputo.co" className="text-foreground underline">contact@reputo.co</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
