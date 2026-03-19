"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SunIcon, MoonIcon, SearchIcon, MapPinIcon, SlidersHorizontalIcon, XIcon, BriefcaseIcon, DollarSignIcon, ClockIcon, BuildingIcon, GlobeIcon, ArrowRightIcon, ZapIcon } from "lucide-react";

/* ── Mock Remote Jobs ── */
const MOCK_JOBS = [
  {
    id: "1", company: "Stripe", role: "Senior Frontend Engineer", salary: "$180K – $250K", location: "Remote (US)", type: "Full-time", posted: "2h ago", category: "Engineering",
    description: "Join our team to build the economic infrastructure of the internet. You'll work on complex payment flows, design systems, and real-time dashboards used by millions of businesses worldwide.",
    requirements: ["5+ years of frontend experience", "Strong TypeScript/React skills", "Experience with design systems", "Understanding of payment systems"],
    tags: ["React", "TypeScript", "Payments"],
  },
  {
    id: "2", company: "Notion", role: "Product Designer", salary: "$140K – $190K", location: "Remote (Worldwide)", type: "Full-time", posted: "4h ago", category: "Design",
    description: "Help shape the future of productivity tools. Design intuitive interfaces for millions of users. Collaborate with engineering and product teams to deliver polished experiences.",
    requirements: ["4+ years product design experience", "Strong Figma skills", "Portfolio demonstrating complex product work", "Experience with design systems"],
    tags: ["Figma", "Product Design", "SaaS"],
  },
  {
    id: "3", company: "Vercel", role: "DevRel Engineer", salary: "$150K – $200K", location: "Remote (US/EU)", type: "Full-time", posted: "6h ago", category: "Engineering",
    description: "Advocate for developers building on the Vercel platform. Create tutorials, speak at conferences, and build example projects that showcase Next.js and the modern web stack.",
    requirements: ["3+ years developer experience", "Public speaking experience", "Strong writing skills", "Experience with Next.js"],
    tags: ["Next.js", "DevRel", "JavaScript"],
  },
  {
    id: "4", company: "Figma", role: "Growth Marketing Manager", salary: "$130K – $170K", location: "Remote (US)", type: "Full-time", posted: "8h ago", category: "Marketing",
    description: "Drive user acquisition and retention for Figma's design platform. Own the growth funnel from awareness to activation, running experiments and analyzing data to optimize conversion.",
    requirements: ["5+ years growth marketing experience", "Strong analytics skills", "Experience with PLG products", "B2B SaaS background"],
    tags: ["Growth", "PLG", "Analytics"],
  },
  {
    id: "5", company: "Linear", role: "Full-Stack Engineer", salary: "$160K – $220K", location: "Remote (US/EU)", type: "Full-time", posted: "12h ago", category: "Engineering",
    description: "Build the fastest project management tool. Work on real-time collaboration, offline-first architecture, and performance optimization. Small team, high impact.",
    requirements: ["4+ years full-stack experience", "React + Node.js proficiency", "Experience with real-time systems", "Passion for developer tools"],
    tags: ["React", "Node.js", "Real-time"],
  },
  {
    id: "6", company: "Shopify", role: "Data Analyst", salary: "$110K – $145K", location: "Remote (Worldwide)", type: "Full-time", posted: "1d ago", category: "Data",
    description: "Analyze merchant data to surface insights that drive product decisions. Build dashboards, run A/B test analyses, and partner with product managers to grow the platform.",
    requirements: ["3+ years data analysis experience", "SQL proficiency", "Experience with Python/R", "Visualization tools (Looker, Tableau)"],
    tags: ["SQL", "Python", "Analytics"],
  },
  {
    id: "7", company: "GitLab", role: "Technical Writer", salary: "$90K – $130K", location: "Remote (Worldwide)", type: "Full-time", posted: "1d ago", category: "Writing",
    description: "Create and maintain documentation for GitLab's DevOps platform. Work with engineering teams to ensure accurate, clear, and helpful docs for developers worldwide.",
    requirements: ["3+ years technical writing experience", "Familiarity with Git workflows", "Strong English communication", "Experience documenting APIs"],
    tags: ["Documentation", "DevOps", "APIs"],
  },
  {
    id: "8", company: "Airbnb", role: "Senior iOS Engineer", salary: "$170K – $230K", location: "Remote (US)", type: "Full-time", posted: "1d ago", category: "Engineering",
    description: "Build the mobile experience for millions of travelers. Work on the Airbnb iOS app, optimizing performance, implementing new features, and collaborating with design and product.",
    requirements: ["5+ years iOS development", "Swift proficiency", "Experience with large-scale apps", "Understanding of mobile architecture patterns"],
    tags: ["iOS", "Swift", "Mobile"],
  },
  {
    id: "9", company: "Deel", role: "Customer Success Manager", salary: "$85K – $120K", location: "Remote (LATAM)", type: "Full-time", posted: "2d ago", category: "Customer Success",
    description: "Help global companies manage their distributed teams through Deel's platform. Onboard new customers, resolve issues, and ensure long-term success and retention.",
    requirements: ["3+ years in customer success", "Experience with HR/payroll platforms", "Fluent in English and Spanish", "Strong problem-solving skills"],
    tags: ["HR Tech", "Customer Success", "Global"],
  },
  {
    id: "10", company: "Coinbase", role: "Smart Contract Engineer", salary: "$200K – $280K", location: "Remote (US)", type: "Full-time", posted: "2d ago", category: "Engineering",
    description: "Build and audit smart contracts for Coinbase's DeFi products. Work at the intersection of finance and blockchain technology, ensuring security and efficiency of on-chain systems.",
    requirements: ["3+ years Solidity experience", "Understanding of DeFi protocols", "Security audit experience", "Strong computer science fundamentals"],
    tags: ["Solidity", "Web3", "DeFi"],
  },
];

const FILTER_OPTIONS: Record<string, string[]> = {
  Category: ["Engineering", "Design", "Marketing", "Data", "Writing", "Customer Success"],
  Type: ["Full-time", "Part-time", "Contract"],
  Location: ["Remote (US)", "Remote (Worldwide)", "Remote (US/EU)", "Remote (LATAM)"],
};

export default function Home() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [selectedJob, setSelectedJob] = useState(MOCK_JOBS[0]);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const activeCount = Object.values(filters).flat().length;

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
  }

  const filtered = MOCK_JOBS.filter((job) => {
    const matchesSearch = !search ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    if (activeCount === 0) return matchesSearch;
    const matchesCategory = !filters.Category?.length || filters.Category.includes(job.category);
    const matchesType = !filters.Type?.length || filters.Type.includes(job.type);
    const matchesLocation = !filters.Location?.length || filters.Location.includes(job.location);
    return matchesSearch && matchesCategory && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="bg-background">
        <div className="mx-auto max-w-[1350px] px-4 sm:px-6 h-[56px] flex items-center">
          <Link href="/" className="shrink-0 no-underline flex items-center gap-2">
            <span className="text-[18px] font-semibold tracking-tight text-foreground">REMOJOB</span>
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
            <button className="h-8 px-4 rounded-full bg-foreground text-background text-[14px] font-medium flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer border-0">
              Login
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1350px] px-4 sm:px-6 pt-8 sm:pt-12 flex-1">
        {/* Hero */}
        <h1 className="text-[28px] sm:text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em] mb-3 text-left sm:text-center max-w-[900px] sm:mx-auto uppercase">
          <span className="text-foreground">EVERY REMOTE JOB. ONE PLACE.</span>
        </h1>
        <p className="text-[14px] sm:text-[16px] text-muted-foreground text-left sm:text-center mb-2 max-w-[600px] sm:mx-auto leading-relaxed">
          We scrape 50+ sources every hour so you don&apos;t waste time on dead listings.<br className="hidden sm:block" /> Only verified, real remote positions. Updated every hour.
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-6 text-[13px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><BriefcaseIcon size={14} /> 2,847 jobs</span>
          <span className="flex items-center gap-1.5"><BuildingIcon size={14} /> 1,200+ companies</span>
          <span className="flex items-center gap-1.5"><ClockIcon size={14} /> Updated 3m ago</span>
        </div>

        {/* Search + Filter */}
        <div className="max-w-[600px] mx-auto mb-6 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-4 h-11 rounded-full border border-border bg-card">
            <SearchIcon size={16} className="text-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search companies, roles, or skills..."
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
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 rounded-xl border border-border bg-card shadow-lg p-5 w-[540px]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[14px] font-medium text-foreground">Filter by</span>
                  {activeCount > 0 && (
                    <button onClick={clearAllFilters} className="text-[13px] text-foreground hover:underline cursor-pointer bg-transparent border-0">
                      Clear all
                    </button>
                  )}
                </div>
                <div className="space-y-5">
                  {Object.entries(FILTER_OPTIONS).map(([group, values]) => (
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
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="flex gap-6 pb-12" style={{ minHeight: "calc(100vh - 300px)" }}>
          {/* Left: Job Cards */}
          <div className="w-full lg:w-[420px] lg:shrink-0 space-y-2">
            {filtered.map((job) => (
              <button
                key={job.id}
                onClick={() => { setSelectedJob(job); setMobileDetailOpen(true); }}
                className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedJob?.id === job.id
                    ? "border-foreground/30 bg-foreground/[0.04]"
                    : "border-border bg-card hover:border-foreground/20"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-[16px] font-semibold text-foreground leading-snug">{job.role}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[12px] px-2.5 py-0.5 rounded-full font-semibold" style={{ background: '#006145', color: '#fff' }}>{job.salary}</span>
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

              <p className="text-[16px] text-foreground mb-4">{selectedJob.company}</p>

              <div className="flex items-center gap-4 text-[16px] text-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <DollarSignIcon size={14} />
                  {selectedJob.salary}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPinIcon size={14} />
                  {selectedJob.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <ClockIcon size={14} />
                  {selectedJob.posted}
                </span>
              </div>

              {/* Apply Button */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
                <button className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: '#006145', color: '#fff' }}>
                  Apply now <ArrowRightIcon size={15} />
                </button>
                <button className="size-9 flex items-center justify-center rounded-full whitespace-nowrap border border-border bg-transparent text-foreground cursor-pointer hover:bg-foreground/[0.04] transition-colors">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>
                  <BriefcaseIcon size={13} />
                  {selectedJob.type}
                </span>
                <span className="flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>
                  <GlobeIcon size={13} />
                  {selectedJob.location}
                </span>
                {selectedJob.tags.map((t) => (
                  <span key={t} className="text-[13px] px-2.5 py-1 rounded-full whitespace-nowrap font-medium" style={{ background: '#006145', color: '#fff' }}>
                    {t}
                  </span>
                ))}
              </div>

              <div className="mb-5">
                <h3 className="text-[16px] font-medium text-foreground mb-2">About this role</h3>
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
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Category: {selectedJob.category}</li>
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Type: {selectedJob.type}</li>
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Compensation: {selectedJob.salary}</li>
                  <li className="text-[16px] text-foreground flex items-start gap-2"><span className="text-foreground mt-0.5">&#8226;</span>Location: {selectedJob.location}</li>
                </ul>
              </div>
            </>) : (
              <div className="flex items-center justify-center h-48">
                <p className="text-[16px] text-foreground">Select a job to view details.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Detail Popup */}
      {mobileDetailOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileDetailOpen(false)}>
          <div className="bg-card border border-border rounded-2xl m-3 w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="text-[20px] font-normal tracking-[-0.02em] text-foreground">{selectedJob.role}</h2>
                <button onClick={() => setMobileDetailOpen(false)} className="text-foreground bg-transparent border-0 cursor-pointer p-1">✕</button>
              </div>
              <p className="text-[15px] text-foreground mb-3">{selectedJob.company}</p>
              <div className="flex items-center gap-3 text-[14px] text-foreground mb-4">
                <span>{selectedJob.salary}</span>
                <span className="flex items-center gap-1.5"><MapPinIcon size={14} />{selectedJob.location}</span>
                <span>{selectedJob.posted}</span>
              </div>
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <button className="h-10 px-6 rounded-full whitespace-nowrap text-[14px] font-semibold cursor-pointer border-0 hover:opacity-90 transition-opacity flex items-center justify-center gap-2" style={{ background: '#006145', color: '#fff' }}>
                  Apply now <ArrowRightIcon size={15} />
                </button>
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
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-border py-6 mt-auto">
        <div className="mx-auto max-w-[1350px] px-4 sm:px-6 flex items-center justify-between text-[13px] text-muted-foreground">
          <span>© 2026 RemoJob</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors no-underline text-muted-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors no-underline text-muted-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
