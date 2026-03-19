"use client";

import { useState } from "react";
import { useOpenPanel } from "@openpanel/nextjs";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const op = useOpenPanel();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      op.track("contact_form_submitted", { email });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
      op.track("contact_form_error", { email });
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-[500px] px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-2">Contact Us</h1>
        <p className="text-[15px] text-muted-foreground mb-8">Have a question, feedback, or issue? We will get back to you within 24 hours.</p>

        {status === "sent" ? (
          <div className="rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-[16px] font-medium text-foreground mb-1">Message sent!</p>
            <p className="text-[14px] text-muted-foreground">We will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[14px] font-medium text-foreground block mb-1.5">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-card text-[15px] text-foreground placeholder:text-muted-foreground"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-[14px] font-medium text-foreground block mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-card text-[15px] text-foreground placeholder:text-muted-foreground"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-[14px] font-medium text-foreground block mb-1.5">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-border bg-card text-[15px] text-foreground placeholder:text-muted-foreground resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full h-11 rounded-lg text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ background: '#006145', color: '#fff' }}
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "error" && (
              <p className="text-[13px] text-destructive text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
