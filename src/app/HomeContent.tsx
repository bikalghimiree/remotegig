"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SunIcon, MoonIcon, SearchIcon, MapPinIcon, SlidersHorizontalIcon, InstagramIcon, CheckCircleIcon, XIcon, ArrowRightIcon } from "lucide-react";
import { useOpenPanel } from "@openpanel/nextjs";
import { authClient } from "@/lib/auth/client";
import { useTheme } from "@/hooks/use-theme";
import Footer from "@/components/Footer";
import UpgradeModal from "@/components/UpgradeModal";
import type { ServerUser } from "@/lib/server-auth";
import type { Job, FilterOptions } from "@/lib/jobs";

const GoogleIcon = () => (
  <svg width={16} height={16} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);


function formatFollowers(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return n.toString();
}

// Parse filters from URL search params
function parseFiltersFromParams(params: URLSearchParams): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  for (const [key, value] of params.entries()) {
    if (key === "q") continue; // search query handled separately
    const values = value.split(",").filter(Boolean);
    if (values.length > 0) filters[key] = values;
  }
  return filters;
}

// Serialize filters to URL search params string
function serializeFiltersToParams(filters: Record<string, string[]>, search: string): string {
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  for (const [group, values] of Object.entries(filters)) {
    if (values.length > 0) params.set(group, values.join(","));
  }
  const str = params.toString();
  return str ? `?${str}` : "/";
}

export default function HomeContent({ user, plan, appliedCount, jobs, filterOptions }: { user: ServerUser | null; plan: "pro" | "free"; appliedCount: number; jobs: Job[]; filterOptions: FilterOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [signingIn, setSigningIn] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const canApply = plan === "pro" || appliedCount < 0;

  async function handleGoogleSignIn() {
    setSigningIn(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/" });
    } catch {
      setSigningIn(false);
    }
  }
  const { dark, toggle } = useTheme();
  const op = useOpenPanel();
  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Derive state from URL params
  const search = searchParams.get("q") || "";
  const filters = parseFiltersFromParams(searchParams);
  const activeCount = Object.values(filters).flat().length;

  // Push URL changes
  const updateURL = useCallback((newFilters: Record<string, string[]>, newSearch: string) => {
    const url = serializeFiltersToParams(newFilters, newSearch);
    router.push(url, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (user) {
      op.identify({
        profileId: user.id,
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ").slice(1).join(" ") || "",
        email: user.email,
        avatar: user.avatarUrl || undefined,
      });
    }
  }, [user, op]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterOpen]);

  function toggleFilter(group: string, value: string) {
    op.track("filter_used", { group, value });
    const current = filters[group] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    const newFilters = { ...filters };
    if (next.length === 0) {
      delete newFilters[group];
    } else {
      newFilters[group] = next;
    }
    updateURL(newFilters, search);
  }

  function clearAllFilters() {
    updateURL({}, "");
  }

  function setSearch(value: string) {
    if (value.length > 2) op.track("search_query", { query: value });
    updateURL(filters, value);
  }

  const filtered = jobs.filter((job) => {
    const matchesSearch =
      !search ||
      job.brand.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    if (activeCount === 0) return matchesSearch;

    const matchesType = !filters.Type?.length || filters.Type.includes(job.type);
    const matchesCategory = !filters.Category?.length || filters.Category.some((c) => job.tags.includes(c));
    const matchesFormat = !filters.Format?.length || filters.Format.some((f) => job.contentType.includes(f));
    const matchesPlatform = !filters.Platform?.length || filters.Platform.some((p) => job.platform.includes(p));

    return matchesSearch && matchesType && matchesCategory && matchesFormat && matchesPlatform;
  });

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
            {user ? (
              <Link href="/account">
                {user.avatarUrl && (
                  <Image src={user.avatarUrl} alt="" width={28} height={28} className="rounded-full" />
                )}
              </Link>
            ) : (
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="h-8 px-4 rounded-full bg-foreground text-background text-[14px] font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer border-0 disabled:opacity-50"
              >
                <GoogleIcon />
                {signingIn ? "Signing in..." : "Login"}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1350px] px-4 sm:px-6 pt-8 sm:pt-12 flex-1">
        {/* Hero */}
        <h1 className="text-[28px] sm:text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] mb-3 text-left sm:text-center max-w-[900px] sm:mx-auto uppercase">
          <span className="text-foreground">APPLY 2.5K+ UGC GIGS INSTANTLY</span>
        </h1>
        <p className="text-[14px] sm:text-[16px] text-muted-foreground text-left sm:text-center mb-2 max-w-[600px] sm:mx-auto leading-relaxed">
          We scrape the entire internet and bring you every gig brands are hiring for.<br className="hidden sm:block" /> Updated every 12 hours.
        </p>

        {/* Search + Filter */}
        <div className="max-w-[600px] mx-auto mb-6 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 h-11 rounded-full border border-border bg-card">
            <SearchIcon size={16} className="text-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands, roles, or niches..."
              className="flex-1 bg-transparent border-0 outline-none text-[16px] text-foreground placeholder:text-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer p-0.5"
              >
                <XIcon size={14} />
              </button>
            )}
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-1.5 px-4 h-11 rounded-full border bg-card text-[14px] cursor-pointer transition-colors ${
                activeCount > 0
                  ? "border-foreground/30 text-foreground"
                  : "border-border text-foreground hover:border-foreground/30"
              }`}
            >
              <SlidersHorizontalIcon size={14} />
              Filter{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            {filterOpen && (
              <>
                {/* Desktop dropdown */}
                <div className="hidden sm:block absolute right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-border bg-card shadow-lg p-5 w-[540px]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px] font-medium text-foreground">Filter by</span>
                    {activeCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="text-[13px] text-foreground hover:underline cursor-pointer bg-transparent border-0"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                  <div className="space-y-5">
                    {Object.entries(filterOptions).map(([group, values]) => (
                      <div key={group}>
                        <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2.5 font-medium">{group}</p>
                        <div className="flex flex-wrap gap-2">
                          {values.map((v) => {
                            const isActive = filters[group]?.includes(v);
                            return (
                              <button
                                key={v}
                                onClick={() => toggleFilter(group, v)}
                                className={`px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border ${
                                  isActive
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-transparent text-foreground border-border hover:border-foreground/40 hover:bg-foreground/[0.04]"
                                }`}
                              >
                                {v}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Mobile full-screen overlay */}
                <div className="sm:hidden fixed inset-0 z-50 bg-background/60 backdrop-blur-sm" onClick={() => setFilterOpen(false)}>
                  <div className="bg-card border border-border rounded-2xl m-3 mt-16 p-5 shadow-2xl max-h-[calc(100vh-100px)] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[15px] font-medium text-foreground">Filter by</span>
                      <div className="flex items-center gap-3">
                        {activeCount > 0 && (
                          <button
                            onClick={clearAllFilters}
                            className="text-[13px] text-foreground hover:underline cursor-pointer bg-transparent border-0"
                          >
                            Clear all
                          </button>
                        )}
                        <button onClick={() => setFilterOpen(false)} className="text-foreground bg-transparent border-0 cursor-pointer p-1 text-[16px]">✕</button>
                      </div>
                    </div>
                    <div className="space-y-5">
                      {Object.entries(filterOptions).map(([group, values]) => (
                        <div key={group}>
                          <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2.5 font-medium">{group}</p>
                          <div className="flex flex-wrap gap-2">
                            {values.map((v) => {
                              const isActive = filters[group]?.includes(v);
                              return (
                                <button
                                  key={v}
                                  onClick={() => toggleFilter(group, v)}
                                  className={`px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border ${
                                    isActive
                                      ? "bg-foreground text-background border-foreground"
                                      : "bg-transparent text-foreground border-border hover:border-foreground/40 hover:bg-foreground/[0.04]"
                                  }`}
                                >
                                  {v}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setFilterOpen(false)}
                      className="w-full mt-5 h-10 rounded-full bg-foreground text-background text-[14px] font-medium cursor-pointer border-0 hover:opacity-90 transition-opacity"
                    >
                      Show {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>



        {/* Two Column Layout: Masonry Cards + Detail */}
        <div className="flex gap-6 pb-12" style={{ minHeight: "calc(100vh - 300px)" }}>
          {/* Left: Job Cards - Masonry-style flexible grid */}
          <div className="w-full lg:w-[420px] lg:shrink-0 space-y-2">
            {filtered.map((job) => (
              <button
                key={job.id}
                onClick={() => { setSelectedJob(job); setMobileDetailOpen(true); op.track("job_card_click", { brand: job.brand, role: job.role }); }}
                className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? "border-foreground/30 bg-foreground/[0.04]"
                    : "border-border bg-card hover:border-foreground/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-[16px] font-bold text-foreground leading-snug">{job.role}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full font-semibold" style={{ background: '#006145', color: '#fff' }}>{job.budget}</span>
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>{job.posted}</span>
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>{job.location}</span>
                </div>
                <p className="text-[13px] text-muted-foreground leading-snug line-clamp-2">{job.description}</p>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-[14px] text-foreground">No jobs match your search.</p>
              </div>
            )}
          </div>

          {/* Right: Job Detail - Desktop */}
          <div className="hidden lg:block flex-1 border border-border rounded-xl bg-card p-6 sticky top-4 self-start max-h-[calc(100vh-32px)] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {selectedJob ? (<>
            <div className="flex items-start justify-between mb-1">
              <h2 className="text-[22px] font-normal tracking-[-0.02em] text-foreground">{selectedJob.role}</h2>
            </div>

            <a href={selectedJob.brandUrl} target="_blank" rel="noopener noreferrer" className="text-[16px] text-foreground mb-4 hover:underline cursor-pointer w-fit block no-underline">{selectedJob.brand}</a>

            <div className="flex items-center gap-4 text-[16px] text-foreground mb-4">
              <span className="flex items-center gap-1.5">
                {selectedJob.budget}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPinIcon size={14} />
                {selectedJob.location}
              </span>
              <span>{selectedJob.posted}</span>
            </div>

            {/* Apply Button - Top */}
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
              {user ? (
                canApply ? (
                  <Link href={`/apply/${selectedJob.slug}`} onClick={() => op.track("apply_button_click", { brand: selectedJob.brand, role: selectedJob.role })} className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 no-underline" style={{ background: '#006145', color: '#fff' }}>
                    Apply now <ArrowRightIcon size={15} />
                  </Link>
                ) : (
                  <button
                    onClick={() => { setShowUpgradeModal(true); op.track("upgrade_modal_shown", { brand: selectedJob.brand }); }}
                    className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: '#006145', color: '#fff' }}
                  >
                    Apply now <ArrowRightIcon size={15} />
                  </button>
                )
              ) : (
                <button
                  onClick={() => { op.track("login_clicked", { source: "apply_button" }); handleGoogleSignIn(); }}
                  disabled={signingIn}
                  className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: '#006145', color: '#fff' }}
                >
                  <GoogleIcon />
                  {signingIn ? "Signing in..." : "Login To Apply"}
                </button>
              )}
              <button className="size-9 flex items-center justify-center rounded-full whitespace-nowrap border border-border bg-transparent text-foreground cursor-pointer hover:bg-foreground/[0.04] transition-colors">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              {selectedJob.instagramFollowers > 0 && (
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>
                  <InstagramIcon size={13} />
                  {formatFollowers(selectedJob.instagramFollowers)} followers
                </span>
              )}
              {selectedJob.hasRespondedPositively && (
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>
                  <CheckCircleIcon size={13} />
                  Responds to creators
                </span>
              )}
              {selectedJob.compensationTypes.map((c) => (
                <span key={c} className="text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>
                  {c === 'Cash' ? 'Pays Cash' : c === 'Products' ? 'Provides Products' : c === 'Affiliate' ? 'Open for Affiliate' : c === 'TikTok Shop' ? 'TikTok Shop' : c}
                </span>
              ))}
            </div>


            <div className="mb-5">
              <h3 className="text-[16px] font-medium text-foreground mb-2">About this opportunity</h3>
              <p className="text-[16px] text-foreground leading-relaxed">{selectedJob.description}</p>
            </div>

            <div className="mb-5">
              <h3 className="text-[16px] font-medium text-foreground mb-2">Requirements</h3>
              <ul className="space-y-1.5">
                {selectedJob.requirements.map((req, i) => (
                  <li key={i} className="text-[16px] text-foreground flex items-start gap-2">
                    <span className="text-foreground mt-0.5">&#8226;</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-[16px] font-medium text-foreground mb-2">Details</h3>
              <ul className="space-y-1.5">
                <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Language: {selectedJob.language}</li>
                <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Format: {selectedJob.contentType}</li>
                <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Platform: {selectedJob.platform}</li>
                <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Deadline: {selectedJob.deadline}</li>
              </ul>
            </div>
          </>) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-[16px] text-foreground">No deals available yet.</p>
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Mobile Detail Popup */}
      {mobileDetailOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileDetailOpen(false)}>
          <div
            className="bg-card border border-border rounded-2xl m-3 w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-[20px] font-normal tracking-[-0.02em] text-foreground">{selectedJob.role}</h2>
                <button onClick={() => setMobileDetailOpen(false)} className="text-foreground bg-transparent border-0 cursor-pointer p-1">
                  ✕
                </button>
              </div>

              <a href={selectedJob.brandUrl} target="_blank" rel="noopener noreferrer" className="text-[15px] text-foreground mb-3 hover:underline cursor-pointer w-fit block no-underline">{selectedJob.brand}</a>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-[14px] text-foreground">{selectedJob.posted}</span>
              </div>

               <div className="flex flex-wrap items-center gap-3 text-[14px] text-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  {selectedJob.budget}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon size={14} />
                  {selectedJob.location}
                </span>
                <span>{selectedJob.platform}</span>
              </div>

              {/* Apply Button - Top */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                {user ? (
                  canApply ? (
                    <Link href={`/apply/${selectedJob.slug}`} onClick={() => op.track("apply_button_click", { brand: selectedJob.brand, role: selectedJob.role, source: "mobile" })} className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 no-underline" style={{ background: '#006145', color: '#fff' }}>
                      Apply now <ArrowRightIcon size={15} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => { setShowUpgradeModal(true); op.track("upgrade_modal_shown", { brand: selectedJob.brand, source: "mobile" }); }}
                      className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center gap-2" style={{ background: '#006145', color: '#fff' }}
                    >
                      Apply now <ArrowRightIcon size={15} />
                    </button>
                  )
                ) : (
                  <button
                    onClick={() => { op.track("login_clicked", { source: "mobile_apply" }); handleGoogleSignIn(); }}
                    disabled={signingIn}
                    className="h-10 px-6 rounded-lg text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50" style={{ background: '#006145', color: '#fff' }}
                  >
                    <GoogleIcon />
                    {signingIn ? "Signing in..." : "Login To Apply"}
                  </button>
                )}
                <button className="size-9 flex items-center justify-center rounded-lg border border-border bg-transparent text-foreground cursor-pointer hover:bg-foreground/[0.04] transition-colors">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                {selectedJob.instagramFollowers > 0 && (
                  <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>
                    <InstagramIcon size={13} />
                    {formatFollowers(selectedJob.instagramFollowers)} followers
                  </span>
                )}
                {selectedJob.hasRespondedPositively && (
                  <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>
                    <CheckCircleIcon size={13} />
                    Responds to creators
                  </span>
                )}
                {selectedJob.compensationTypes.map((c) => (
                  <span key={c} className="text-[13px] px-2.5 py-1 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>
                    {c === 'Cash' ? 'Pays Cash' : c === 'Products' ? 'Provides Products' : c === 'Affiliate' ? 'Open for Affiliate' : c === 'TikTok Shop' ? 'TikTok Shop' : c}
                  </span>
                ))}
              </div>

              <div className="mb-4">
                <h3 className="text-[15px] font-medium text-foreground mb-2">About this opportunity</h3>
                <p className="text-[14px] text-foreground leading-relaxed">{selectedJob.description}</p>
              </div>

              <div className="mb-4">
                <h3 className="text-[15px] font-medium text-foreground mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="text-[14px] text-foreground flex items-start gap-2">
                      <span className="text-foreground mt-0.5">&#8226;</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <h3 className="text-[15px] font-medium text-foreground mb-2">Details</h3>
                <ul className="space-y-1.5">
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Language: {selectedJob.language}</li>
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Format: {selectedJob.contentType}</li>
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Platform: {selectedJob.platform}</li>
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Deadline: {selectedJob.deadline}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpgradeModal && <UpgradeModal variant="apply" onClose={() => setShowUpgradeModal(false)} />}

      <Footer />
    </div>
  );
}
