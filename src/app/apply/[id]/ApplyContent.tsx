"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon, ArrowLeftIcon, CopyIcon, CheckIcon, ExternalLinkIcon, MailIcon } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";
import type { ServerUser } from "@/lib/server-auth";
import type { Job } from "@/lib/jobs";

function generateEmailTemplate(job: Job, user: ServerUser) {
  const firstName = user.displayName.split(" ")[0];
  const contactFirst = job.contactName?.split(" ")[0] || "there";
  return `Hi ${contactFirst},

I'm ${firstName}, I create ${job.contentType.toLowerCase()} content on ${job.platform} mostly in the ${job.tags[0]?.toLowerCase() || "lifestyle"} niche. I came across ${job.brand} recently and honestly really liked what you guys are putting out, especially the way you work with creators.

I've done similar ${job.type === "UGC" ? "UGC" : "content"} work for other brands in the space and I think I could put together something solid for you. Happy to send over some examples of my past work if that helps.

Would you be open to exploring a collab? I'm pretty flexible on terms and timeline.

Thanks,
${firstName}`;
}

export default function ApplyContent({ job, user }: { job: Job; user: ServerUser }) {
  const { dark, toggle } = useTheme();
  const op = useOpenPanel();
  const [copied, setCopied] = useState<string | null>(null);

  const emailTemplate = generateEmailTemplate(job, user);
  const subject = `${job.type} Collaboration with ${job.brand}`;

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const gmailLink = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(job.contactEmail)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailTemplate)}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
              <Link href="/account">
                <Image src={user.avatarUrl} alt="" width={28} height={28} className="rounded-full" />
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="w-full flex-1 mx-auto max-w-[640px] px-4 sm:px-6 pt-8 sm:pt-12 pb-16">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[14px] text-foreground hover:underline no-underline mb-8">
          <ArrowLeftIcon size={14} />
          Back to jobs
        </Link>

        {/* Brand Info */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-[24px] sm:text-[28px] font-normal tracking-[-0.02em] text-foreground">{job.role}</h1>
          </div>
          <a href={job.brandUrl} target="_blank" rel="noopener" className="text-[16px] text-foreground hover:underline no-underline">{job.brand}</a>
        </div>

        {/* About the brand */}
        <div className="border border-border rounded-xl bg-card p-4 mb-3">
          <p className="text-[16px] text-foreground mb-1.5">About {job.brand}</p>
          <p className="text-[14px] text-foreground leading-relaxed">{job.brandDescription}</p>
        </div>

        {/* Opportunity details */}
        <div className="border border-border rounded-xl bg-card p-4 mb-3">
          <p className="text-[16px] text-foreground mb-3">Opportunity</p>
          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[14px]">
            <div>
              <p className="text-foreground mb-0.5">Budget</p>
              <p className="text-foreground">{job.budget}</p>
            </div>
            <div>
              <p className="text-foreground mb-0.5">Type</p>
              <p className="text-foreground">{job.type}</p>
            </div>
            <div>
              <p className="text-foreground mb-0.5">Platform</p>
              <p className="text-foreground">{job.platform}</p>
            </div>
            <div>
              <p className="text-foreground mb-0.5">Format</p>
              <p className="text-foreground">{job.contentType}</p>
            </div>
            <div>
              <p className="text-foreground mb-0.5">Location</p>
              <p className="text-foreground">{job.location}</p>
            </div>
            <div>
              <p className="text-foreground mb-0.5">Deadline</p>
              <p className="text-foreground">{job.deadline}</p>
            </div>
          </div>
        </div>

        {/* What they're looking for */}
        <div className="border border-border rounded-xl bg-card p-4 mb-3">
          <p className="text-[16px] text-foreground mb-3">What they&apos;re looking for</p>
          <p className="text-[14px] text-foreground leading-relaxed mb-3">{job.description}</p>
          <div className="space-y-1.5">
            {job.requirements.map((req, i) => (
              <div key={i} className="flex items-start gap-2 text-[14px] text-foreground">
                <span className="text-foreground mt-0.5">&#8226;</span>
                {req}
              </div>
            ))}
          </div>
        </div>

        {/* Contact info */}
        <div className="border border-border rounded-xl bg-card p-4 mb-3">
          <p className="text-[16px] text-foreground mb-3">Contact</p>
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[14px] text-foreground">{job.contactName}</p>
              <p className="text-[14px] text-foreground">{job.contactEmail}</p>
            </div>
            <button
              onClick={() => { copyToClipboard(job.contactEmail, "email"); op.track("copy_email", { brand: job.brand }); }}
              className="h-8 px-3 rounded-full border border-border bg-transparent text-foreground text-[14px] cursor-pointer hover:border-foreground/30 transition-colors flex items-center gap-1.5"
            >
              {copied === "email" ? <CheckIcon size={13} /> : <CopyIcon size={13} />}
              {copied === "email" ? "Copied" : "Copy email"}
            </button>
          </div>
        </div>

        {/* Email template */}
        <div className="border border-border rounded-xl bg-card p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[16px] text-foreground">Email template</p>
            <button
              onClick={() => { copyToClipboard(emailTemplate, "template"); op.track("copy_template", { brand: job.brand }); }}
              className="h-7 px-2.5 rounded-full border border-border bg-transparent text-foreground text-[14px] cursor-pointer hover:border-foreground/30 transition-colors flex items-center gap-1.5"
            >
              {copied === "template" ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
              {copied === "template" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="text-[14px] text-foreground mb-3 border-b border-border pb-3">
            <span className="text-foreground">Subject: </span>{subject}
          </div>
          <pre className="text-[14px] text-foreground leading-relaxed whitespace-pre-wrap font-[inherit]">
            {emailTemplate}
          </pre>
        </div>

        {/* Tip */}
        <div className="border border-border rounded-xl bg-card p-4 mb-6">
          <p className="text-[16px] text-foreground mb-2">Tip</p>
          <p className="text-[14px] text-foreground leading-relaxed">
            Avoid including any URLs in your first email, they trigger spam filters. Share portfolio links only after they reply. Use an older Gmail account for better deliverability.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={gmailLink}
            target="_blank"
            rel="noopener"
            onClick={() => op.track("open_gmail", { brand: job.brand })}
            className="h-10 px-4 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center gap-2 no-underline"
          >
            <MailIcon size={15} />
            Open in Gmail
          </a>
          <a
            href={job.brandUrl}
            target="_blank"
            rel="noopener"
            onClick={() => op.track("visit_brand", { brand: job.brand })}
            className="h-10 px-4 rounded-full border border-border bg-transparent text-foreground text-[14px] cursor-pointer hover:border-foreground/30 transition-colors flex items-center gap-2 no-underline"
          >
            <ExternalLinkIcon size={14} />
            Visit {job.brand}
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
