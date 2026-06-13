"""
Generate 18 months of realistic demo data for ~12 banks with distinct reliability personalities.
Run: python seed_demo.py
"""
import os
import csv
import random
from datetime import date

random.seed(42)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Bank personalities: (name, role, base_td, td_std, base_bd, volume_mn)
BANKS = [
    # Rock-solid private banks
    {"bank": "HDFC Bank",            "role": "remitter",    "base_td": 0.30, "td_noise": 0.08, "base_bd": 2.1, "volume_mn": 2800, "personality": "rock_solid"},
    {"bank": "ICICI Bank",           "role": "remitter",    "base_td": 0.45, "td_noise": 0.10, "base_bd": 2.4, "volume_mn": 2200, "personality": "rock_solid"},
    {"bank": "Axis Bank",            "role": "remitter",    "base_td": 0.55, "td_noise": 0.12, "base_bd": 2.0, "volume_mn": 1600, "personality": "rock_solid"},
    # SBI — moderate TD, massive volume
    {"bank": "State Bank of India",  "role": "remitter",    "base_td": 0.85, "td_noise": 0.20, "base_bd": 3.1, "volume_mn": 3800, "personality": "moderate"},
    # Chronically weak PSU banks
    {"bank": "Punjab National Bank", "role": "remitter",    "base_td": 2.10, "td_noise": 0.30, "base_bd": 4.2, "volume_mn":  820, "personality": "chronic"},
    {"bank": "Bank of Baroda",       "role": "remitter",    "base_td": 1.80, "td_noise": 0.25, "base_bd": 3.8, "volume_mn":  650, "personality": "chronic"},
    {"bank": "Canara Bank",          "role": "remitter",    "base_td": 1.60, "td_noise": 0.28, "base_bd": 3.5, "volume_mn":  540, "personality": "chronic"},
    # One-off incident bank (normally fine, one catastrophic month)
    {"bank": "Kotak Mahindra Bank",  "role": "remitter",    "base_td": 0.50, "td_noise": 0.10, "base_bd": 1.9, "volume_mn": 1100, "personality": "one_off", "spike_month_idx": 10},
    # Volatile
    {"bank": "IndusInd Bank",        "role": "remitter",    "base_td": 1.10, "td_noise": 0.55, "base_bd": 2.8, "volume_mn":  480, "personality": "volatile"},
    # Beneficiary role banks
    {"bank": "HDFC Bank",            "role": "beneficiary", "base_td": 0.25, "td_noise": 0.07, "base_bd": 0.5, "volume_mn": 2800, "personality": "rock_solid"},
    {"bank": "State Bank of India",  "role": "beneficiary", "base_td": 0.90, "td_noise": 0.22, "base_bd": 0.8, "volume_mn": 3800, "personality": "moderate"},
    {"bank": "Punjab National Bank", "role": "beneficiary", "base_td": 2.20, "td_noise": 0.35, "base_bd": 0.6, "volume_mn":  820, "personality": "chronic"},
]

# Generate 18 months starting 2024-09
months = []
y, m = 2024, 9
for _ in range(18):
    months.append(f"{y:04d}-{m:02d}")
    m += 1
    if m > 12:
        m = 1
        y += 1

COLUMNS = ["Bank", "Role", "Approved %", "Business Decline %", "Technical Decline %", "Volume (Mn)"]

for i, month_str in enumerate(months):
    rows = []
    for b in BANKS:
        td = b["base_td"] + random.gauss(0, b["td_noise"])
        # One-off spike
        if b.get("personality") == "one_off" and i == b.get("spike_month_idx", 10):
            td = random.uniform(6.0, 9.5)
        td = max(0.05, td)
        bd = b["base_bd"] + random.gauss(0, 0.15)
        bd = max(0.1, bd)
        approved = 100.0 - td - bd
        approved = max(85.0, min(99.5, approved))
        vol = b["volume_mn"] * random.uniform(0.92, 1.08)
        rows.append({
            "Bank": b["bank"],
            "Role": b["role"],
            "Approved %": round(approved, 2),
            "Business Decline %": round(bd, 2),
            "Technical Decline %": round(td, 2),
            "Volume (Mn)": round(vol, 1),
        })

    fname = os.path.join(DATA_DIR, f"{month_str}.csv")
    with open(fname, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    print(f"  wrote {fname}")

print(f"\nDone. Generated {len(months)} monthly CSV files in {DATA_DIR}/")
