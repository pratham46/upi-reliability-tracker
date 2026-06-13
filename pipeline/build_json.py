"""
Read tidy.parquet (or tidy.csv), compute per-bank stats, write:
  web/public/data/banks.json
  web/public/data/meta.json
Run: python build_json.py
"""
import os
import json
import math
import datetime
import numpy as np
import pandas as pd

PIPELINE_DIR = os.path.dirname(__file__)
TIDY_PARQUET = os.path.join(PIPELINE_DIR, "tidy.parquet")
TIDY_CSV = os.path.join(PIPELINE_DIR, "tidy.csv")

WEB_DATA_DIR = os.path.join(PIPELINE_DIR, "..", "web", "public", "data")
os.makedirs(WEB_DATA_DIR, exist_ok=True)


def load_tidy() -> pd.DataFrame:
    if os.path.exists(TIDY_PARQUET):
        return pd.read_parquet(TIDY_PARQUET)
    if os.path.exists(TIDY_CSV):
        return pd.read_csv(TIDY_CSV)
    raise FileNotFoundError("Run ingest.py first to produce tidy.parquet or tidy.csv")


def linear_slope(values: list[float]) -> float:
    if len(values) < 2:
        return 0.0
    x = np.arange(len(values), dtype=float)
    y = np.array(values, dtype=float)
    if np.std(y) == 0:
        return 0.0
    slope = np.polyfit(x, y, 1)[0]
    return float(slope)


def classify(mean_td: float, std_td: float, max_td: float) -> str:
    if mean_td < 0.6 and std_td < 0.4:
        return "rock_solid"
    if mean_td >= 1.5 and std_td < 1.0:
        return "chronically_weak"
    if mean_td < 1.5 and max_td >= 3 * mean_td and max_td > 4:
        return "one_off_incident"
    if std_td >= 0.4:
        return "volatile"
    # nearest bucket
    if mean_td < 1.0:
        return "rock_solid"
    return "chronically_weak"


def build() -> None:
    df = load_tidy()
    all_months = sorted(df["month"].unique().tolist())
    all_roles = sorted(df["role"].dropna().unique().tolist())

    bank_records = []

    for (bank, role), grp in df.groupby(["bank", "role"]):
        grp = grp.sort_values("month")
        series = []
        for _, row in grp.iterrows():
            series.append({
                "month": row["month"],
                "td_pct": round(float(row["td_pct"]), 3) if not math.isnan(row["td_pct"]) else None,
                "bd_pct": round(float(row["bd_pct"]), 3) if (row["bd_pct"] is not None and not math.isnan(float(row["bd_pct"] or "nan"))) else None,
                "approved_pct": round(float(row["approved_pct"]), 3) if (row["approved_pct"] is not None and not math.isnan(float(row["approved_pct"] or "nan"))) else None,
                "volume_mn": round(float(row["volume_mn"]), 1) if (row["volume_mn"] is not None and not math.isnan(float(row["volume_mn"] or "nan"))) else None,
            })

        td_vals = [s["td_pct"] for s in series if s["td_pct"] is not None]
        vol_vals = [s["volume_mn"] for s in series if s["volume_mn"] is not None]

        if not td_vals:
            continue

        mean_td = float(np.mean(td_vals))
        std_td = float(np.std(td_vals, ddof=0))
        max_td = float(np.max(td_vals))
        latest_td = td_vals[-1]
        mean_volume = float(np.mean(vol_vals)) if vol_vals else 0.0
        impact_score = round((mean_td / 100) * mean_volume, 4)
        slope = linear_slope(td_vals)
        if abs(slope) < 0.01:
            trend = "flat"
        elif slope < 0:
            trend = "improving"
        else:
            trend = "worsening"

        classification = classify(mean_td, std_td, max_td)

        bank_records.append({
            "bank": bank,
            "role": role,
            "series": series,
            "stats": {
                "mean_td": round(mean_td, 4),
                "std_td": round(std_td, 4),
                "max_td": round(max_td, 4),
                "latest_td": round(latest_td, 4),
                "months": len(td_vals),
                "classification": classification,
                "impact_score": impact_score,
                "trend": trend,
                "mean_volume_mn": round(mean_volume, 1),
            },
        })

    bank_records.sort(key=lambda r: r["stats"]["mean_td"], reverse=True)

    banks_path = os.path.join(WEB_DATA_DIR, "banks.json")
    with open(banks_path, "w", encoding="utf-8") as f:
        json.dump(bank_records, f, indent=2, ensure_ascii=False)
    print(f"Wrote {banks_path} ({len(bank_records)} bank-role entries)")

    meta = {
        "last_updated": datetime.date.today().isoformat(),
        "months": all_months,
        "roles": all_roles,
        "source": "NPCI UPI Ecosystem Statistics",
        "notes": "TD = Technical Decline = bank/system fault (not user). BD = Business Decline = user fault (wrong PIN, low balance). Monthly data.",
    }
    meta_path = os.path.join(WEB_DATA_DIR, "meta.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)
    print(f"Wrote {meta_path}")


if __name__ == "__main__":
    build()
