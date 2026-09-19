from __future__ import annotations

import csv
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from miwae_api.analysis.pipeline import analyse_corpus  # noqa: E402
from miwae_api.models import CorpusRequest, DocumentInput, SegmentInput  # noqa: E402


SOURCE = Path("/Users/mehmetaltay/Desktop/MIWAE Project/TextInspector analysis/sampled_passages.csv")
OUTPUT = ROOT / "demo_outputs"


def load_documents() -> list[DocumentInput]:
    grouped: dict[str, dict] = {}
    with SOURCE.open(encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            book_id = row["book_id"]
            entry = grouped.setdefault(book_id, {"title": row["title"], "discipline": row["discipline"], "segments": []})
            entry["segments"].append(SegmentInput(
                id=f"{book_id}:stratum-{row['stratum']}",
                text=row["text"],
                metadata={"stratum": row["stratum"], "pdf_page": row["pdf_page"]},
            ))
    return [
        DocumentInput(
            id=book_id,
            title=value["title"],
            segments=value["segments"],
            metadata={"discipline": value["discipline"], "sampling": "five stratified passages"},
        )
        for book_id, value in grouped.items()
    ]


def main() -> None:
    OUTPUT.mkdir(exist_ok=True)
    # Summary output intentionally excludes source excerpts so the repository
    # does not redistribute textbook text.
    result = analyse_corpus(CorpusRequest(documents=load_documents(), include_hits=False, max_hits_per_feature=0))
    (OUTPUT / "miwae_50_passages.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")

    with (OUTPUT / "book_feature_summary.csv").open("w", encoding="utf-8", newline="") as handle:
        fields = ["book_id", "discipline", "title", "family", "feature_id", "feature_label", "count", "rate_per_10k_words", "segment_coverage_pct", "dispersion_evenness"]
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for document in result["documents"]:
            distribution = {item["feature_id"]: item for item in document["distribution"]}
            for feature in document["functions"] + document["grammatical_forms"]:
                dist = distribution[feature["feature_id"]]
                writer.writerow({
                    "book_id": document["document"]["id"],
                    "discipline": document["document"]["metadata"].get("discipline"),
                    "title": document["document"]["title"],
                    "family": feature["family"],
                    "feature_id": feature["feature_id"],
                    "feature_label": feature["label"],
                    "count": feature["count"],
                    "rate_per_10k_words": feature["rate_per_10k_words"],
                    "segment_coverage_pct": dist["segment_coverage_pct"],
                    "dispersion_evenness": dist["dispersion_evenness"],
                })


if __name__ == "__main__":
    main()
