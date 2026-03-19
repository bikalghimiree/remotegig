"use client";

import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";

export default function AboutPage() {
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
        <h1 className="text-[24px] sm:text-[28px] font-normal tracking-[-0.02em] text-foreground mb-8">
          About Reputo
        </h1>

        <div className="space-y-6 text-[16px] text-foreground leading-relaxed">
          <p>
            Reputo is a job board built for UGC creators and content professionals. We aggregate paid brand deal opportunities, from product reviews and sponsored posts to ambassador programs, so creators can find and apply to work they care about, all in one place.
          </p>
          <p>
            Our goal is simple: make it easier for creators to get paid. No cold DMs, no endless scrolling through social media looking for opportunities. Just browse, filter by your niche, and apply.
          </p>
          <p>
            We work with brands across beauty, fitness, food, tech, fashion, and more to surface real, vetted opportunities with clear budgets and requirements.
          </p>
          <p>
            Reputo is built by a small team that believes creators deserve better tools. If you have questions, feedback, or want to list a brand deal, reach out at{" "}
            <a href="mailto:contact@reputo.co" className="text-foreground underline">contact@reputo.co</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
