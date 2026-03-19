# RemoteGig.pro — Product Plan

## Tagline
"Every remote job. One place. Updated every hour."

## Value Prop
We scrape 50+ sources every hour so you don't waste time on dead listings. Only verified, real remote positions.

---

## Pricing

### 🆓 Free
- Browse ALL jobs
- Basic search & category filters
- 3 full job detail views per day
- See job cards (title, company, salary preview, location)

### 💰 Pro — $9/mo
- Unlimited job detail views
- Salary filter (only show jobs with listed salary)
- "Posted today" filter (last 24-48h only)
- Email alerts (daily digest matching your criteria)
- Application tracker (where you applied + status)
- Ad-free experience

---

## Features to Build (Priority Order)

### Phase 1 — MVP (TODAY, ~5 hours)
1. Landing page with job listings (DONE)
2. Job cards + detail panel UI (DONE)
3. Search + filter bar (DONE)
4. Google login (reuse from Reputo)
5. Stripe checkout at $9/mo
6. Paywall on job detail views (3 free, then upgrade)
7. Neon DB setup (users table, subscriptions)
8. Deploy to Cloudflare Workers

### Phase 2 — Data (Day 2-3)
1. Job scraper — scrape RemoteOK, WeWorkRemotely, Himalayas, LinkedIn, Indeed
2. Scrape every hour via cron
3. Store jobs in Neon DB
4. Deduplication logic
5. Ghost job detection (remove jobs older than 30 days)
6. "Posted today" freshness badge

### Phase 3 — Retention (Week 1)
1. Email alerts — daily digest via ZeptoMail
2. Application tracker (simple table: job, status, notes, date)
3. Salary filter
4. Save/bookmark jobs

### Phase 4 — Growth (Week 2+)
1. X account @remotegig_ + auto-reply script
2. SEO pages (/remote-developer-jobs, /remote-marketing-jobs, etc.)
3. Ad-free tier enforcement (subtle ads on free)
4. Referral system

---

## What We're NOT Building (saves time)
- ❌ AI resume builder (ChatGPT exists)
- ❌ AI cover letter generator
- ❌ AI mock interviews
- ❌ Skills tests
- ❌ Career coaching
- ❌ Resume builder
- ❌ Company profiles

---

## Competitor Pricing Reference

| Platform | Price | Model |
|----------|-------|-------|
| FlexJobs | $9.95/mo | Verified jobs, career tools |
| WeWorkRemotely | $14.95/mo | Unlimited applies, alerts |
| Himalayas Plus | $9/mo | AI tools (resume, cover letter) |
| LinkedIn Premium | $29.99/mo | InMail, salary insights |
| RemoteOK | Free | Charges employers $299/post |
| Indeed | Free | Ad-supported |
| **RemoteGig** | **$9/mo** | Aggregator, fresh jobs, alerts |

---

## Revenue Targets

| Subscribers | MRR |
|-------------|-----|
| 556 | $5,000 |
| 1,112 | $10,000 |
| 2,778 | $25,000 |
| 5,556 | $50,000 |
| 11,112 | $100,000 |

---

## Tech Stack
- **Frontend:** Next.js 16 + Tailwind v4
- **Auth:** Neon Auth (Google OAuth)
- **Database:** Neon Postgres
- **Payments:** Stripe ($9/mo subscription)
- **Email:** ZeptoMail (alerts, transactional)
- **Deploy:** Cloudflare Workers (OpenNext)
- **Scraping:** Cron jobs hitting public APIs + career pages
- **Domain:** remotegig.pro

---

## X Marketing Strategy
- Account: @remotegig_
- 10 posts/day (job highlights, remote work tips, stats)
- Auto-reply to "who's hiring", "need remote job", "looking for work"
- Reply to comments, build community
- Pin tweet: "We scrape 50+ job boards every hour → remotegig.pro"
