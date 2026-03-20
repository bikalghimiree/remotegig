"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useOpenPanel } from "@openpanel/nextjs";
import { SearchIcon, MapPinIcon, SlidersHorizontalIcon, XIcon, BriefcaseIcon, DollarSignIcon, ClockIcon, GlobeIcon, ArrowRightIcon, CrownIcon, Loader2Icon } from "lucide-react";
import type { Job, FilterOptions } from "./page";

function timeAgo(date: string): string {
  // If already formatted (e.g. "2d ago"), return as-is
  if (date.includes("ago") || date === "Just now") return date;
  const diff = Date.now() - new Date(date).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function HomeContent({ initialJobs, plan, filterOptions, totalJobs }: { initialJobs: Job[]; plan: "pro" | "free"; filterOptions: FilterOptions; totalJobs: number }) {
  const op = useOpenPanel();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [salaryMin, setSalaryMin] = useState(0);
  const [selectedJob, setSelectedJob] = useState(initialJobs[0] || null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialJobs.length < totalJobs);
  const [total, setTotal] = useState(totalJobs);


  const loaderRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const isPro = plan === "pro";

  function handleApply(job: Job) {
    op.track("apply_clicked", { jobId: job.id, company: job.company, role: job.title });
    if (isPro) {
      window.open(job.apply_url, "_blank", "noopener,noreferrer");
    } else {
      setShowUpgrade(true);
    }
  }

  async function handleCheckout() {
    setCheckingOut(true);
    op.track("checkout_initiated", { source: "upgrade_modal" });
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        op.track("checkout_error", { error: "no_url" });
        setCheckingOut(false);
      }
    } catch {
      op.track("checkout_error", { error: "fetch_failed" });
      setCheckingOut(false);
    }
  }

  const activeCount = Object.values(filters).flat().length + (salaryMin > 0 ? 1 : 0);

  function toggleFilter(group: string, value: string) {
    const current = filters[group] || [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    const newFilters = { ...filters };
    if (next.length === 0) delete newFilters[group];
    else newFilters[group] = next;
    setFilters(newFilters);
  }

  function clearAllFilters() {
    setFilters({});
    setSearch("");
    setSalaryMin(0);
  }

  // Fetch jobs from API
  const fetchJobs = useCallback(async (offset: number, reset: boolean = false) => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set("offset", String(offset));
    params.set("limit", "50");
    if (search) params.set("q", search);
    if (filters.Category?.length) params.set("categories", filters.Category.join(","));
    if (filters.Type?.length) params.set("types", filters.Type.join(","));
    if (filters.Location?.length) params.set("locations", filters.Location.join(","));
    if (salaryMin > 0) params.set("salaryMin", String(salaryMin));

    try {
      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      const newJobs = (data.jobs as Job[]).map((j) => ({
        ...j,
        posted_at: timeAgo(j.posted_at),
      }));

      if (reset) {
        setJobs(newJobs);
        if (newJobs.length > 0) setSelectedJob(newJobs[0]);
      } else {
        setJobs((prev) => [...prev, ...newJobs]);
      }
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (e) {
      console.error("Failed to fetch jobs:", e);
    }
    setLoading(false);
  }, [search, filters, salaryMin]);

  // Re-fetch when filters/search change
  useEffect(() => {

    if (searchTimer.current) clearTimeout(searchTimer.current);

    searchTimer.current = setTimeout(() => {
      fetchJobs(0, true);
    }, (search || activeCount > 0) ? 300 : 0); // debounce search

    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search, filters, salaryMin, activeCount, fetchJobs]);

  // Infinite scroll observer
  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchJobs(jobs.length);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, jobs.length, fetchJobs]);

  // Build filter sections dynamically
  const filterSections = [
    { key: "Category", label: "CATEGORY", items: filterOptions.categories },
    { key: "Type", label: "JOB TYPE", items: filterOptions.types },
    { key: "Location", label: "LOCATION", items: filterOptions.locations },
  ];

  return (
    <div>
      <main className="mx-auto max-w-[1350px] px-4 sm:px-6 pt-8 sm:pt-12">
        {/* Hero */}
        <h1 className="text-[28px] sm:text-[44px] font-semibold leading-[1.1] tracking-[-0.03em] mb-3 text-left sm:text-center max-w-[900px] sm:mx-auto uppercase">
          <span className="text-foreground">EVERY REMOTE JOB. ONE PLACE.</span>
        </h1>
        <p className="text-[14px] sm:text-[16px] text-muted-foreground text-left sm:text-center mb-6 max-w-[600px] sm:mx-auto leading-relaxed">
          We scan thousands of company career pages so you don&apos;t have to.<br className="hidden sm:block" /> Only verified remote positions. Apply to any in one click.
        </p>

        {/* Search + Filter */}
        <div className="flex items-center gap-3 max-w-[900px] sm:mx-auto mb-6">
          <div className="flex-1 flex items-center gap-2 px-4 h-11 rounded-full border border-border bg-card">
            <SearchIcon size={16} className="text-foreground shrink-0" />
            <input
              type="text"
              placeholder="Search jobs, companies, skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-0 outline-none text-[16px] text-foreground placeholder:text-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground bg-transparent border-0 cursor-pointer p-0.5">
                <XIcon size={14} />
              </button>
            )}
          </div>
          <div className="relative">
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
                <div className="fixed inset-0 z-40" onClick={() => setFilterOpen(false)} />
                <div className="absolute right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-border bg-card shadow-lg p-5 w-[540px] max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-medium text-foreground">Filter by</span>
                  {activeCount > 0 && (
                    <button onClick={clearAllFilters} className="text-[13px] text-foreground hover:underline cursor-pointer bg-transparent border-0">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="space-y-5">
                  {filterSections.map(({ key, label, items }) => (
                    <div key={key}>
                      <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2.5 font-medium">{label}</p>
                      <div className="flex flex-wrap gap-2">
                        {items.map(({ value, count }) => {
                          const isActive = filters[key]?.includes(value);
                          return (
                            <button
                              key={value}
                              onClick={() => toggleFilter(key, value)}
                              className={`px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border ${
                                isActive
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-transparent text-foreground border-border hover:border-foreground/40 hover:bg-foreground/[0.04]"
                              }`}
                            >
                              {value} <span className="opacity-50 ml-0.5">{count}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Salary filter */}
                  <div>
                    <p className="text-[12px] uppercase tracking-wider text-muted-foreground mb-2.5 font-medium">MIN SALARY</p>
                    <div className="flex flex-wrap gap-2">
                      {filterOptions.salaryRanges.map(({ label, min }) => {
                        const isActive = salaryMin === min;
                        return (
                          <button
                            key={label}
                            onClick={() => setSalaryMin(min)}
                            className={`px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all border ${
                              isActive
                                ? "bg-foreground text-background border-foreground"
                                : "bg-transparent text-foreground border-border hover:border-foreground/40 hover:bg-foreground/[0.04]"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              </>
            )}
          </div>
        </div>



        {/* Two Column Layout */}
        <div className="flex gap-6 pb-12" style={{ minHeight: "calc(100vh - 300px)" }}>
          {/* Left: Job Cards */}
          <div className="w-full lg:w-[420px] lg:shrink-0 space-y-2">
            {jobs.map((job) => (
              <button
                key={job.id}
                onClick={() => { setSelectedJob(job); op.track('job_viewed', { jobId: job.id, company: job.company, role: job.title }); setMobileDetailOpen(true); }}
                className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? "border-foreground/30 bg-foreground/[0.04]"
                    : "border-border bg-card hover:border-foreground/20 hover:bg-foreground/[0.02]"
                }`}
              >
                <p className="text-[13px] text-muted-foreground mb-0.5">{job.company}</p>
                <h3 className="text-[15px] font-medium text-foreground mb-2">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  {job.salary_text && <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>{job.salary_text}</span>}
                  <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>{job.posted_at}</span>
                  <span className="text-[12px] px-2 py-0.5 rounded-full font-medium" style={{ background: '#006145', color: '#fff' }}>{job.job_type}</span>
                  <span className="text-[12px] px-2 py-0.5 rounded-full font-medium border border-border text-foreground">{job.category}</span>
                </div>
                <p className="text-[13px] text-muted-foreground line-clamp-2">{job.description}</p>
              </button>
            ))}

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="py-6 flex justify-center">
              {loading && (
                <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
                  <Loader2Icon size={16} className="animate-spin" />
                  Loading more jobs...
                </div>
              )}
              {!hasMore && jobs.length > 0 && (
                <p className="text-[13px] text-muted-foreground">All {total} jobs loaded</p>
              )}
            </div>

            {jobs.length === 0 && !loading && (
              <div className="py-12 text-center">
                <p className="text-[14px] text-foreground">No jobs match your filters.</p>
                <button onClick={clearAllFilters} className="mt-2 text-[13px] text-foreground hover:underline bg-transparent border-0 cursor-pointer">
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Right: Job Detail - Desktop */}
          <div className="hidden lg:block flex-1 border border-border rounded-xl bg-card p-6 sticky top-4 self-start max-h-[calc(100vh-32px)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            {selectedJob ? (<>
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-[22px] font-medium tracking-[-0.02em] text-foreground">{selectedJob.title}</h2>
              </div>
              <p className="text-[16px] text-foreground mb-4">{selectedJob.company}</p>
              <div className="flex items-center gap-4 text-[16px] text-foreground mb-4">
                {selectedJob.salary_text && <span className="flex items-center gap-1.5"><DollarSignIcon size={14} />{selectedJob.salary_text}</span>}
                <span className="flex items-center gap-1.5"><MapPinIcon size={14} />{selectedJob.location}</span>
                <span className="flex items-center gap-1.5"><ClockIcon size={14} />{selectedJob.posted_at}</span>
              </div>
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <button onClick={() => handleApply(selectedJob)} className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-medium cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: '#006145', color: '#fff' }}>
                  Apply now <ArrowRightIcon size={15} />
                </button>
                <button className="size-9 flex items-center justify-center rounded-full whitespace-nowrap border border-border bg-transparent text-foreground cursor-pointer hover:bg-foreground/[0.04] transition-colors">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}><BriefcaseIcon size={13} />{selectedJob.job_type}</span>
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}><GlobeIcon size={13} />{selectedJob.location}</span>
                {selectedJob.tags.map((t) => (<span key={t} className="text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>{t}</span>))}
              </div>
              <div className="mb-5">
                <h3 className="text-[16px] font-medium text-foreground mb-2">About this role</h3>
                <p className="text-[16px] text-foreground leading-relaxed">{selectedJob.description}</p>
              </div>
              <div className="mb-5">
                <h3 className="text-[16px] font-medium text-foreground mb-2">Requirements</h3>
                <ul className="space-y-1.5">{selectedJob.requirements.map((req, i) => (<li key={i} className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>{req}</li>))}</ul>
              </div>
              <div className="mb-6">
                <h3 className="text-[16px] font-medium text-foreground mb-2">Details</h3>
                <ul className="space-y-1.5">
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Category: {selectedJob.category}</li>
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Type: {selectedJob.job_type}</li>
                  {selectedJob.salary_text && <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Compensation: {selectedJob.salary_text}</li>}
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Location: {selectedJob.location}</li>
                </ul>
              </div>
            </>) : (
              <div className="flex items-center justify-center h-48 p-6">
                <p className="text-[16px] text-foreground">Select a job to view details.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Detail Popup */}
      {mobileDetailOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileDetailOpen(false)}>
          <div className="bg-card border border-border rounded-2xl m-3 w-full max-h-[95vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-[20px] font-medium tracking-[-0.02em] text-foreground">{selectedJob.title}</h2>
                <button onClick={() => setMobileDetailOpen(false)} className="text-foreground bg-transparent border-0 cursor-pointer p-1">✕</button>
              </div>
              <p className="text-[15px] text-foreground mb-3">{selectedJob.company}</p>
              <div className="flex items-center gap-3 text-[14px] text-foreground mb-4">
                {selectedJob.salary_text && <span className="flex items-center gap-1.5"><DollarSignIcon size={14} />{selectedJob.salary_text}</span>}
                <span className="flex items-center gap-1.5"><MapPinIcon size={14} />{selectedJob.location}</span>
                <span className="flex items-center gap-1.5"><ClockIcon size={14} />{selectedJob.posted_at}</span>
              </div>
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <button onClick={() => handleApply(selectedJob)} className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-medium cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: '#006145', color: '#fff' }}>
                  Apply now <ArrowRightIcon size={15} />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}><BriefcaseIcon size={13} />{selectedJob.job_type}</span>
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}><GlobeIcon size={13} />{selectedJob.location}</span>
                {selectedJob.tags.map((t) => (<span key={t} className="text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>{t}</span>))}
              </div>
              <div className="mb-4">
                <h3 className="text-[15px] font-medium text-foreground mb-2">About this role</h3>
                <p className="text-[14px] text-foreground leading-relaxed">{selectedJob.description}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-[15px] font-medium text-foreground mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="text-[14px] text-foreground flex items-start gap-2">
                      <span className="text-foreground mt-0.5">&#8226;</span>{req}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-4">
                <h3 className="text-[15px] font-medium text-foreground mb-2">Details</h3>
                <ul className="space-y-1.5">
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Category: {selectedJob.category}</li>
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Type: {selectedJob.job_type}</li>
                  {selectedJob.salary_text && <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Compensation: {selectedJob.salary_text}</li>}
                  <li className="text-[14px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Location: {selectedJob.location}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/60 backdrop-blur-md" onClick={() => setShowUpgrade(false)}>
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-[420px] w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium mb-4" style={{ background: '#006145', color: '#fff' }}>
              <CrownIcon size={14} />
              PRO PLAN
            </div>
            <h2 className="text-[20px] sm:text-[22px] font-medium mb-1 text-foreground">
              Unlock Unlimited Access
            </h2>
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-[20px] font-medium line-through text-muted-foreground">$19</span>
              <span className="text-[40px] font-medium leading-none" style={{ color: '#006145' }}>$9</span>
              <span className="text-[16px] font-medium text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {[
                "Unlimited applications to remote jobs",
                "Direct apply links to every listing",
                "Daily email alerts for new jobs",
                "Advanced salary & location filters",
                "Priority access to new listings",
                "Cancel anytime, no commitment",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14px] text-foreground">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="12" fill="rgba(0,97,69,0.15)" />
                    <path d="M7 12.5l3 3 7-7" stroke="#006145" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full h-11 rounded-xl text-[15px] font-medium cursor-pointer border-0 hover:opacity-90 transition-all disabled:opacity-50"
              style={{ background: '#006145', color: '#fff' }}
            >
              {checkingOut ? "Redirecting..." : "Upgrade Now"}
            </button>
            <p className="text-center mt-4 text-[12px] text-muted-foreground">
              Secure payment via Stripe. Cancel anytime with one click.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
