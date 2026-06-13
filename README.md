# UPI Bank Reliability Tracker

A free, fully static web dashboard that visualizes which Indian banks are most/least reliable on UPI, using NPCI's monthly per-bank **Technical Decline (TD%)** data.

**Live features:**
- Bank × Month heatmap (chronic underperformers vs one-off outages)
- Reliability scatter map (4 quadrants: Rock Solid / Chronically Weak / Volatile / One-Off)
- Bank detail: TD trend, BD vs TD stacked area, volume, outage markers
- Compare: overlay 2–3 banks on one chart
- Methodology explainer

**Architecture:** Python pipeline → JSON → React SPA. No backend, no database, no paid API.

---

## Quick Start (local)

### 1. Run the data pipeline

```bash
cd pipeline
pip install -r requirements.txt
python seed_demo.py      # generates 18 months of realistic demo data
python ingest.py         # parses CSVs → tidy.parquet
python build_json.py     # tidy data → web/public/data/{banks,meta}.json
```

### 2. Start the frontend

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173 — the dashboard loads immediately from the JSON files.

---

## Deploy to Cloudflare Pages (free, no card)

1. Push this repo to GitHub.
2. Go to **Cloudflare Pages → Create a project → Connect to Git**.
3. Select your repo and use these build settings:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `web` |

4. Click **Save and Deploy**. Done — no environment variables needed.

### Alternative free hosts (no card required)

| Host | Steps |
|---|---|
| **Netlify** | Drag-and-drop `web/dist` or connect GitHub. Build: `npm run build`, publish: `web/dist`. |
| **Vercel** | Import repo, set root to `web`, Vite preset auto-detected. |
| **GitHub Pages** | Enable Pages in repo settings, use `gh-pages` branch or GitHub Actions to push `web/dist`. |
| **Render** | Static site, build command `cd web && npm install && npm run build`, publish dir `web/dist`. |

---

## Using real NPCI data

NPCI publishes monthly bank-wise UPI data at [npci.org.in](https://www.npci.org.in/what-we-do/upi/upi-ecosystem-statistics).

1. Download the monthly bank-wise CSV/XLSX file.
2. Rename it to `YYYY-MM.csv` (e.g. `2025-08.csv`) and place it in `pipeline/data/`.
3. Re-run the pipeline:
   ```bash
   cd pipeline
   python ingest.py
   python build_json.py
   ```
4. Commit `web/public/data/banks.json` and `web/public/data/meta.json`.
5. Cloudflare Pages (or your host) will auto-redeploy.

The `pipeline/ingest.py` file has an editable **`HEADER_ALIASES`** map at the top — if NPCI changes column names, add the new name there.

---

## Automated monthly refresh (GitHub Actions)

`.github/workflows/refresh-data.yml` runs on the 5th of every month (after NPCI typically publishes). It:
- Runs the pipeline (or seeds demo data if no real CSVs exist)
- Commits the updated JSON
- Cloudflare Pages picks up the push and redeploys automatically

Enable it by adding real CSV files to `pipeline/data/` and pushing.

---

## Project structure

```
upi-reliability-tracker/
├── pipeline/
│   ├── data/           ← monthly NPCI CSVs go here (YYYY-MM.csv)
│   ├── seed_demo.py    ← generates 18 months of demo data
│   ├── ingest.py       ← CSV/XLSX → tidy.parquet
│   ├── build_json.py   ← tidy data → web/public/data/*.json
│   └── requirements.txt
├── web/                ← Vite + React + TS + Tailwind SPA
│   ├── public/data/    ← banks.json, meta.json (pipeline output)
│   ├── src/
│   │   ├── components/ ← Heatmap, BankCard, Controls, CountUp, …
│   │   ├── pages/      ← Overview, ReliabilityMap, BankDetail, Compare, About
│   │   └── lib/        ← types, data helpers, useData hook
│   └── …
└── .github/workflows/refresh-data.yml
```

---

## Key concept: TD vs BD

| Metric | Meaning | Whose fault? |
|---|---|---|
| **Technical Decline (TD%)** | Bank/NPCI systems failed | **Bank's fault** — use this to rank reliability |
| **Business Decline (BD%)** | Wrong PIN, low balance, etc. | **User's fault** — excluded from ranking |

The impact score `mean_td / 100 × mean_volume_mn` estimates how many million transactions fail per month due to the bank's own systems.
