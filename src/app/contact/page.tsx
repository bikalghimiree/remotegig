"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const { dark, toggle } = useTheme();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

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

      <main className="w-full flex-1 mx-auto max-w-[600px] px-4 sm:px-6 pt-12 sm:pt-20 pb-20">
        <h1 className="text-[24px] sm:text-[28px] font-normal tracking-[-0.02em] text-foreground mb-2">
          Contact
        </h1>
        <p className="text-[16px] text-foreground mb-8">
          Have a question or need help? Send us a message or email{" "}
          <a href="mailto:contact@reputo.co" className="underline">contact@reputo.co</a>.
        </p>

        {status === "sent" ? (
          <div className="border border-border rounded-xl bg-card p-4">
            <p className="text-[15px] font-medium text-foreground">Message sent</p>
            <p className="text-[14px] text-foreground mt-0.5">We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[14px] text-foreground mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full h-11 px-4 rounded-lg border border-border bg-card text-[15px] text-foreground outline-none focus:border-foreground/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[14px] text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full h-11 px-4 rounded-lg border border-border bg-card text-[15px] text-foreground outline-none focus:border-foreground/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[14px] text-foreground mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-[15px] text-foreground outline-none focus:border-foreground/30 transition-colors resize-none placeholder:text-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="h-8 px-3 rounded-full bg-foreground text-background text-[14px] font-medium hover:opacity-90 transition-opacity cursor-pointer border-0 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "error" && (
              <p className="text-[14px] text-foreground">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
