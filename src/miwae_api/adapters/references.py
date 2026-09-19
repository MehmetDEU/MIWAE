from __future__ import annotations

from typing import Any

from ..analysis.catalog import FEATURE_BY_ID
from ..models import ReferenceMappingRow


def normalize_reference_rows(rows: list[ReferenceMappingRow]) -> dict[str, Any]:
    accepted: list[dict[str, Any]] = []
    unknown: list[str] = []
    for row in rows:
        if row.feature_id not in FEATURE_BY_ID:
            unknown.append(row.feature_id)
            continue
        accepted.append({
            "feature_id": row.feature_id,
            "feature_label": FEATURE_BY_ID[row.feature_id].label,
            "cefr_level": row.cefr_level,
            "source_reference": row.source_reference,
            "note": row.note,
        })
    return {
        "integration_mode": "user_supplied_reference_mapping",
        "accepted": accepted,
        "unknown_feature_ids": sorted(set(unknown)),
        "claim_boundary": "The API does not redistribute EVP/EGP databases; users supply mappings they are licensed to use.",
    }
