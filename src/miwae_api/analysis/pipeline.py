from __future__ import annotations

from collections import defaultdict
from typing import Any

from ..models import CorpusRequest, DocumentInput, SegmentInput
from .catalog import FORMS, FUNCTIONS
from .engine import analyse_feature, juilland_like_dispersion, lexical_summary, sentences, tokens


def _segments(document: DocumentInput) -> list[SegmentInput]:
    if document.segments:
        return document.segments
    assert document.text is not None
    paragraphs = [part.strip() for part in document.text.split("\n\n") if part.strip()]
    if len(paragraphs) <= 1:
        return [SegmentInput(id=f"{document.id}:full", text=document.text)]
    return [SegmentInput(id=f"{document.id}:p{index}", text=text) for index, text in enumerate(paragraphs, 1)]


def _profile_family(text: str, features: tuple, max_hits: int) -> list[dict]:
    stats = lexical_summary(text)
    return [
        analyse_feature(text, feature, stats["word_count"], stats["sentence_count"], max_hits)
        for feature in features
    ]


def analyse_document(document: DocumentInput, include_hits: bool = True, max_hits: int = 5) -> dict[str, Any]:
    segment_list = _segments(document)
    full_text = "\n\n".join(segment.text for segment in segment_list)
    effective_hits = max_hits if include_hits else 0
    function_profile = _profile_family(full_text, FUNCTIONS, effective_hits)
    form_profile = _profile_family(full_text, FORMS, effective_hits)

    segment_counts: dict[str, list[int]] = defaultdict(list)
    opportunity_totals: dict[str, int] = defaultdict(int)
    segment_details: list[dict] = []
    for segment in segment_list:
        word_count = len(tokens(segment.text))
        per_segment: dict[str, int] = {}
        for feature in FUNCTIONS + FORMS:
            result = analyse_feature(segment.text, feature, word_count, len(sentences(segment.text)), 0)
            count = result["count"]
            per_segment[feature.id] = count
            segment_counts[feature.id].append(count)
        for key, value in segment.eligible_opportunities.items():
            opportunity_totals[key] += value
        segment_details.append({
            "segment_id": segment.id,
            "word_count": word_count,
            "feature_counts": per_segment,
            "eligible_opportunities": segment.eligible_opportunities,
            "metadata": segment.metadata,
        })

    total_words = len(tokens(full_text))
    distribution = []
    for result in function_profile + form_profile:
        feature_id = result["feature_id"]
        counts = segment_counts[feature_id]
        covered = sum(1 for count in counts if count > 0)
        eligible = opportunity_totals.get(feature_id)
        distribution.append({
            "feature_id": feature_id,
            "family": result["family"],
            "total_count": result["count"],
            "rate_per_10k_words": round(result["count"] / total_words * 10_000, 3) if total_words else 0.0,
            "segments_total": len(segment_list),
            "segments_with_feature": covered,
            "segment_coverage_pct": round(covered / len(segment_list) * 100, 2) if segment_list else 0.0,
            "dispersion_evenness": juilland_like_dispersion(counts),
            "eligible_opportunities": eligible,
            "candidate_support_per_opportunity": round(result["count"] / eligible, 3) if eligible else None,
            "opportunity_note": "Human-supplied denominator" if eligible else "No eligible-opportunity denominator supplied",
        })

    return {
        "document": {"id": document.id, "title": document.title, "metadata": document.metadata},
        "engine": {
            "name": "miwae-transparent-pattern-engine",
            "version": "0.1.0",
            "claim_boundary": "Automatic results are candidates. Function and ambiguous grammar classifications require contextual verification.",
        },
        "statistics": lexical_summary(full_text),
        "functions": function_profile,
        "grammatical_forms": form_profile,
        "distribution": distribution,
        "segments": segment_details,
        "external_profiles": document.external_profiles,
    }


def analyse_corpus(request: CorpusRequest) -> dict[str, Any]:
    documents = [analyse_document(item, request.include_hits, request.max_hits_per_feature) for item in request.documents]
    return {
        "corpus": {
            "document_count": len(documents),
            "word_count": sum(item["statistics"]["word_count"] for item in documents),
        },
        "documents": documents,
    }
