"""
Read all CSV/XLSX files in pipeline/data/, normalize headers, clean % strings,
output a tidy Parquet table (or CSV fallback) at pipeline/tidy.parquet.
Run: python ingest.py
"""
import os
import re
import glob
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
OUT_FILE = os.path.join(os.path.dirname(__file__), "tidy.parquet")

# Editable alias map: raw column name -> canonical name
HEADER_ALIASES = {
    "bank": "bank",
    "bank name": "bank",
    "member bank": "bank",
    "role": "role",
    "approved %": "approved_pct",
    "approved": "approved_pct",
    "approval %": "approved_pct",
    "business decline %": "bd_pct",
    "business decline": "bd_pct",
    "bd %": "bd_pct",
    "technical decline %": "td_pct",
    "technical decline": "td_pct",
    "td %": "td_pct",
    "volume (mn)": "volume_mn",
    "volume": "volume_mn",
    "txn volume (mn)": "volume_mn",
    "no. of transactions (mn)": "volume_mn",
}

MONTH_PATTERNS = [
    # 2025-08.csv or 2025-08.xlsx
    (re.compile(r"(\d{4})-(\d{2})"), lambda m: f"{m.group(1)}-{m.group(2)}"),
    # Aug-2025.csv or Aug_2025.xlsx
    (re.compile(r"([A-Za-z]{3})[-_](\d{4})"), lambda m: pd.to_datetime(f"{m.group(1)} {m.group(2)}", format="%b %Y").strftime("%Y-%m")),
]


def parse_month(filename: str) -> str:
    base = os.path.splitext(os.path.basename(filename))[0]
    for pattern, formatter in MONTH_PATTERNS:
        match = pattern.search(base)
        if match:
            return formatter(match)
    raise ValueError(f"Cannot parse month from filename: {filename}")


def clean_pct(val):
    if isinstance(val, str):
        val = val.replace("%", "").strip()
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def normalize_headers(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = [c.strip().lower() for c in df.columns]
    rename = {}
    for col in df.columns:
        canonical = HEADER_ALIASES.get(col)
        if canonical:
            rename[col] = canonical
    df = df.rename(columns=rename)
    return df


def load_file(path: str) -> pd.DataFrame:
    ext = os.path.splitext(path)[1].lower()
    if ext == ".csv":
        df = pd.read_csv(path, dtype=str)
    elif ext in (".xlsx", ".xls"):
        df = pd.read_excel(path, dtype=str)
    else:
        raise ValueError(f"Unsupported file type: {ext}")
    return df


def ingest() -> pd.DataFrame:
    files = sorted(glob.glob(os.path.join(DATA_DIR, "*.csv")) +
                   glob.glob(os.path.join(DATA_DIR, "*.xlsx")) +
                   glob.glob(os.path.join(DATA_DIR, "*.xls")))
    if not files:
        raise FileNotFoundError(f"No data files found in {DATA_DIR}")

    frames = []
    for path in files:
        month = parse_month(path)
        df = load_file(path)
        df = normalize_headers(df)

        required = {"bank", "td_pct"}
        missing = required - set(df.columns)
        if missing:
            print(f"  SKIP {path}: missing columns {missing}")
            continue

        # Defaults for optional columns
        for col in ("role", "approved_pct", "bd_pct", "volume_mn"):
            if col not in df.columns:
                df[col] = None

        df["month"] = month
        df = df[["month", "bank", "role", "approved_pct", "bd_pct", "td_pct", "volume_mn"]]

        for col in ("approved_pct", "bd_pct", "td_pct", "volume_mn"):
            df[col] = df[col].apply(clean_pct)

        df = df.dropna(subset=["bank", "td_pct"])
        df["bank"] = df["bank"].str.strip()
        df["role"] = df["role"].str.strip().str.lower() if df["role"].notna().any() else "remitter"

        frames.append(df)
        print(f"  loaded {path} ({len(df)} rows, month={month})")

    if not frames:
        raise ValueError("No valid data loaded.")

    tidy = pd.concat(frames, ignore_index=True)
    tidy = tidy.sort_values(["month", "bank", "role"]).reset_index(drop=True)

    try:
        tidy.to_parquet(OUT_FILE, index=False)
        print(f"\nSaved tidy data to {OUT_FILE} ({len(tidy)} rows)")
    except ImportError:
        csv_out = OUT_FILE.replace(".parquet", ".csv")
        tidy.to_csv(csv_out, index=False)
        print(f"\nSaved tidy data to {csv_out} (pyarrow not available, used CSV fallback)")

    return tidy


if __name__ == "__main__":
    ingest()
