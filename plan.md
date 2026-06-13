# UPI Bank Reliability Tracker — Full Project Plan

A free, static, beautifully-designed web dashboard that answers one sharp question:
**Which Indian banks are actually reliable on UPI — and which are chronically failing?**

Built from NPCI's published monthly decline data. Hosted for free on Cloudflare
Pages (no credit card, no purchase).

---

## 1. The idea in one paragraph

NPCI publishes monthly UPI statistics including, per bank, the **Technical Decline (TD)**
rate — failures caused by the *bank's / NPCI's* systems, not the user. The numbers exist
but are buried in separate monthly tables that nobody compares over time. This project
stacks many months together and turns them into an intuitive, striking dashboard that
reveals: who is *chronically* unreliable, who had a *one-off outage*, and — weighted by
transaction volume — whose failures actually affect the most people. The analysis runs
offline in Python and outputs static JSON; a static React dashboard renders it.

---

## 2. Why this works (and why earlier ideas didn't)

- **The data is real, public, and granular enough.** Per-bank TD% per month, going back
  years. This is the part that killed other ideas — here it's solid.
- **It fits free static hosting.** No live server needed: pre-compute JSON, ship a static
  site. Free on Cloudflare Pages with no card.
- **The angle is original.** Most "UPI" projects chart total transaction volume. Almost
  nobody does a *reliability* analysis that separates bank-fault from user-fault and
  distinguishes chronic weakness from one-off outages.

---

## 3. Goals & non-goals

**Goals**
- Rank banks by sustained UPI reliability (technical decline) over time.
- Visually separate *chronically weak* banks from *one-off outage* months.
- Show *volume-weighted impact* — whose failures hit the most transactions.
- Ship a "wow" but genuinely intuitive UI; usable on mobile.
- Cost: ₹0. No credit card, no paid tier, no purchase.

**Non-goals**
- No hour-of-day analysis. NPCI data is **monthly**, so "best time of day to pay" is
  *not* answerable. The project is about bank reliability across months.
- No real-time/live data. Monthly refresh is enough.
- No user accounts, no backend database, no paid APIs.

---

## 4. The data

### 4.1 Sources (all free)
1. **NPCI UPI Ecosystem Statistics** (canonical) — monthly bank-wise tables: per bank,
   *Approved %*, *Business Decline (BD) %*, *Technical Decline (TD) %*, for both
   **remitter** (payer-side) and **beneficiary** (payee-side) roles, plus app-wise volumes.
   - Current month: `https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics`
   - History: the same page's **Archives** link.
2. **NPCI "Declined (BD/TD) & Uptime"** — lists notable UPI outage *events* (decline count
   > ~3 lakh and duration > 30 min). Good for annotating outage months.
   - `https://www.npci.org.in/statistics/bd-td-and-uptime`
3. **dataful.in** (pre-cleaned, optional shortcut) — already publishes month-and-bank-wise
   UPI datasets as downloadable time series, so you can skip scraping monthly pages.

### 4.2 Key definitions (must respect these)
- **Technical Decline (TD)** = bank/NPCI infrastructure failure. *This is the metric the
  whole project ranks on.* Target < 1%.
- **Business Decline (BD)** = user-side (wrong PIN, low balance, limit hit). *Not the
  bank's fault.* Show it, but never rank reliability on it.
- **Remitter vs Beneficiary** = payer-side vs payee-side. Default the dashboard to
  **remitter** TD (the experience of the person sending money), with a toggle.

### 4.3 Caveats to surface in the UI (honesty = credibility)
- Monthly granularity only.
- A tiny bank at 5% TD affects far fewer people than SBI at 1% — hence volume weighting.
- Bank naming can vary slightly month to month; the pipeline normalizes names.

### 4.4 How data gets in (manual-but-trivial, no scraping fragility)
Download each month's bank-wise file from NPCI (or dataful.in) into `pipeline/data/`,
named with the month (e.g. `2025-08.csv`). The pipeline stacks them. A `seed_demo.py`
generates a realistic 18-month dataset so the site is fully functional before you've
downloaded anything real.

---

## 5. Architecture (static-first, because free hosting is static)

```
   ┌─────────────────────────┐        ┌──────────────────────────┐
   │  OFFLINE (your machine) │        │   STATIC SITE (the web)  │
   │                         │        │                          │
   │  NPCI files (CSV/XLSX)  │        │  React + Vite SPA        │
   │            │            │        │     │                    │
   │      ingest.py          │        │     │ fetch()            │
   │            │            │        │     ▼                    │
   │      build_json.py  ────┼──JSON──┼──► /public/data/*.json   │
   │            │            │        │     │                    │
   │   (or seed_demo.py)     │        │  charts + animations     │
   └─────────────────────────┘        └──────────────────────────┘
              commit JSON to git  ──►  Cloudflare Pages auto-builds & deploys
```

The Python never runs on the server. It runs locally (or in CI once a month), emits JSON,
you commit, Cloudflare Pages rebuilds the static site. Zero backend, zero cost.

---

## 6. Data pipeline (Python, offline)

```
pipeline/
├── data/                 # drop monthly NPCI files here (gitignored if large)
├── ingest.py             # monthly files -> one tidy table (SQLite or parquet)
├── build_json.py         # tidy table -> the exact JSON the frontend needs
├── seed_demo.py          # realistic 18-month demo dataset (so site works day 1)
└── requirements.txt      # pandas, numpy, openpyxl
```

**ingest.py** — normalize messy headers via an alias map; parse month from filename;
clean `%` strings to floats; output long/tidy rows: `(month, bank, role, approved_pct,
bd_pct, td_pct, volume_mn)`.

**build_json.py** — compute per-bank stats and write the frontend contract (section 8):
- `mean_td`, `std_td`, `max_td`, `latest_td`, month count
- **classification** into one of four buckets (the core insight):
  - `rock_solid` — low mean TD, low volatility
  - `chronically_weak` — high mean TD, low volatility (always bad)
  - `volatile` — high volatility (unpredictable)
  - `one_off_incident` — low mean but one extreme spike month
- `impact_score` = `mean_td% × mean_volume` ≈ avg failed transactions/month
- trend direction (improving / worsening) via simple slope over months.

---

## 7. Frontend — the dashboard

### 7.1 Tech stack
- **React + Vite + TypeScript** (fast static build; Cloudflare Pages-friendly).
- **Tailwind CSS** for styling.
- **Framer Motion** for animation.
- **Recharts** for line/bar charts; **custom SVG/D3** for the heatmap.
- No router needed beyond simple tabs/state, or `react-router` if multi-route.
- Data loaded at runtime via `fetch('/data/banks.json')` — no build-time coupling.

### 7.2 Pages / views
1. **Overview (hero)** — one punchy headline stat ("Just 5 banks account for X% of all
   UPI technical failures"), the signature **bank × month heatmap**, and a reliability
   leaderboard (best & worst). A plain-English takeaway sentence under every chart.
2. **Reliability Map (the money chart)** — scatter plot: x = mean TD%, y = volatility,
   bubble size = volume, color = classification. Four labeled quadrants. Hover = bank
   card. This single view tells the whole story.
3. **Bank detail** — click any bank → TD trend line over months, BD-vs-TD split, volume,
   outage-month annotations, and its classification badge.
4. **Compare** — pick 2–3 banks, overlay their TD trends.
5. **About / Methodology** — data source, TD vs BD explainer, caveats, last-updated date.

### 7.3 Controls (intuitive)
- Role toggle: Remitter / Beneficiary.
- Month-range slider.
- Bank search/filter.
- "Sort by: worst sustained / worst single month / biggest impact."
- Tooltips everywhere; every chart has a one-line human summary.

### 7.4 "Crazy but intuitive" design direction
- **Aesthetic:** dark "mission-control / fintech terminal" vibe. Deep charcoal background,
  one electric accent (cyan or violet), semantic green→amber→red reliability scale used
  *consistently* everywhere.
- **Motion:** numbers count up on load; heatmap cells stagger-fade in; smooth chart
  transitions; subtle parallax on the hero. Tasteful, never seizure-inducing.
- **Hierarchy:** big, confident type for the headline stat; generous spacing; glassy
  cards with soft shadows. One screen = one idea.
- **Intuitive guardrails:** color is *always* paired with a label/number (never color
  alone), so it's readable and accessible. Plain-language captions translate every chart
  ("Red = the bank's own systems failed; not your fault"). Empty/loading states handled.
- **Responsive:** mobile-first; heatmap becomes horizontally scrollable on small screens.
- **Accessibility:** keyboard navigable, ARIA labels, color-blind-safe palette
  (don't rely on red/green alone — add icons/shapes).

---

## 8. The JSON contract (frontend ⇄ pipeline)

`/public/data/meta.json`
```json
{
  "last_updated": "2026-06-13",
  "months": ["2024-09", "...", "2026-02"],
  "roles": ["remitter", "beneficiary"],
  "source": "NPCI UPI Ecosystem Statistics",
  "notes": "TD = bank/NPCI fault; BD = user fault. Monthly data."
}
```

`/public/data/banks.json`
```json
[
  {
    "bank": "State Bank of India",
    "role": "remitter",
    "series": [
      { "month": "2024-09", "td_pct": 0.82, "bd_pct": 3.1, "approved_pct": 96.08, "volume_mn": 3300 }
    ],
    "stats": {
      "mean_td": 0.85, "std_td": 0.2, "max_td": 1.4, "latest_td": 0.79,
      "months": 18, "classification": "rock_solid",
      "impact_score": 28050, "trend": "improving"
    }
  }
]
```

The frontend only ever reads these two files. This clean contract lets the pipeline and
UI be built independently.

---

## 9. Repository structure

```
upi-reliability-tracker/
├── pipeline/                 # Python, offline
│   ├── data/
│   ├── ingest.py
│   ├── build_json.py
│   ├── seed_demo.py
│   └── requirements.txt
├── web/                      # React + Vite static frontend
│   ├── public/
│   │   └── data/             # banks.json, meta.json (committed)
│   ├── src/
│   │   ├── components/       # Heatmap, ReliabilityScatter, TrendChart, BankCard, ...
│   │   ├── pages/            # Overview, ReliabilityMap, BankDetail, Compare, About
│   │   ├── lib/              # data loading, formatting, classification colors
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── .github/workflows/        # optional monthly auto-refresh
│   └── refresh-data.yml
├── README.md
└── plan.md
```

---

## 10. Build & deploy — Cloudflare Pages (free, no card)

1. Push the repo to GitHub.
2. In Cloudflare dash → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pick the repo. Set:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `web/dist`
   - **Root directory:** `web`
4. Deploy. Every `git push` auto-rebuilds. Unlimited bandwidth, free SSL, no card.

### Free hosting alternatives (all no-card; verify limits at deploy time)
| Host             | Bandwidth (free) | Static | Card needed | Notes |
|------------------|------------------|--------|-------------|-------|
| **Cloudflare Pages** | Unlimited      | ✅     | ❌          | Best pick; 500 builds/mo, DDoS, analytics |
| GitHub Pages     | ~100 GB (soft)   | ✅     | ❌          | Simplest; no analytics/DDoS |
| Netlify          | 100 GB/mo        | ✅     | ❌          | Great DX; form handling, functions |
| Vercel           | 100 GB/mo        | ✅     | ❌          | Best for Next.js; commercial use restricted on free |
| Render           | Free static      | ✅     | ❌          | Also offers free Postgres if you ever need it |

---

## 11. Optional: monthly auto-refresh (GitHub Actions)

A scheduled workflow can, once a month: run the pipeline against newly-added files (or a
dataful.in pull), regenerate the JSON, and commit — which triggers a Cloudflare rebuild.
Keep it optional; manual monthly update is perfectly fine and avoids scraper breakage.

---

## 12. Build phases / milestones

1. **Phase 0 — Skeleton:** Vite+React+Tailwind app deploys to Cloudflare Pages showing a
   "hello" page. Proves the free pipeline end to end.
2. **Phase 1 — Demo data:** `seed_demo.py` → `build_json.py` → JSON committed. Frontend
   renders the heatmap + leaderboard from demo data.
3. **Phase 2 — Core views:** Reliability scatter, bank detail, compare, controls.
4. **Phase 3 — Polish:** animations, responsive, accessibility, methodology page,
   plain-English captions.
5. **Phase 4 — Real data:** download a few real NPCI months, run `ingest.py`, swap in.
6. **Phase 5 — (optional)** GitHub Actions monthly refresh.

---

## 13. Stretch goals
- Annotate outage months from NPCI's BD/TD & Uptime page (callouts on the heatmap).
- App-wise view (GPay/PhonePe/Paytm volumes) as a second tab.
- "Share this bank" deep links.
- Downloadable PNG of any chart.

---

## 14. Risks & mitigations
- **NPCI layout/wording changes** → ingest uses an editable alias map; prefer manual
  download + commit over live scraping.
- **Over-claiming** → always separate TD from BD; label the volume caveat; show sample size.
- **UI flashy but unusable** → enforce "one screen, one idea" + plain-English captions +
  color-with-label rule.
- **Hosting limits** → static + Cloudflare's unlimited bandwidth removes this worry.

---

## 15. Definition of done
- Site live on a Cloudflare Pages URL, no card ever entered.
- Loads in < 2s, works on mobile, keyboard-navigable.
- Heatmap, reliability scatter, leaderboard, bank detail, compare, and about all work.
- Every chart has a one-line plain-English takeaway.
- Demo data works out of the box; real NPCI data swaps in via the pipeline.
- README explains: get data → run pipeline → commit JSON → auto-deploy.

---

> The ready-to-paste **Claude Code build prompt** is in `claude-code-prompt.md`.
```
