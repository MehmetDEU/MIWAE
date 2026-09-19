from __future__ import annotations

from typing import Any


SAFE_FLAT_KEYS = (
    "book_id", "discipline", "title", "stratum", "pdf_page", "sample_words", "sample_id",
    "english_type", "cefr", "token_count", "sentence_count", "avg_sentence_words",
    "words_3plus_syllables_pct", "flesch_reading_ease", "flesch_kincaid_grade", "gunning_fog",
    "vocd", "mtld", "academic_words_tokens_pct", "evp_a1_tokens_pct", "evp_a2_tokens_pct",
    "evp_b1_tokens_pct", "evp_b2_tokens_pct", "evp_c1_tokens_pct", "evp_c2_tokens_pct",
    "evp_unlisted_tokens_pct", "metadiscourse_total_tokens_pct", "logical_connectives_tokens_pct",
    "hedges_tokens_pct", "endophoric_tokens_pct", "sequencing_tokens_pct", "person_markers_tokens_pct",
)


def _pick(source: dict[str, Any], keys: tuple[str, ...]) -> dict[str, Any]:
    return {key: source[key] for key in keys if key in source and source[key] is not None}


def normalize_textinspector(payload: dict[str, Any]) -> dict[str, Any]:
    """Normalize an authorized Text Inspector export without retaining PII or submitted text."""
    flat = payload.get("flat") if isinstance(payload.get("flat"), dict) else {}
    normalized = _pick(flat, SAFE_FLAT_KEYS)

    summary = payload.get("summary") if isinstance(payload.get("summary"), dict) else {}
    statistics = payload.get("statistics") if isinstance(payload.get("statistics"), dict) else {}
    readability = payload.get("readability") if isinstance(payload.get("readability"), dict) else {}
    diversity = payload.get("diversity") if isinstance(payload.get("diversity"), dict) else {}

    fallbacks = {
        "cefr": summary.get("cefr"),
        "token_count": statistics.get("wordCount"),
        "sentence_count": statistics.get("sentenceCount"),
        "avg_sentence_words": statistics.get("averageSentenceLength"),
        "words_3plus_syllables_pct": statistics.get("wordsWithMoreThan2SyllablesPercentage"),
        "flesch_reading_ease": readability.get("flesch_reading"),
        "flesch_kincaid_grade": readability.get("flesch_kincaid"),
        "gunning_fog": readability.get("gunning_fog"),
        "vocd": diversity.get("vocd"),
        "mtld": diversity.get("mtld"),
    }
    for key, value in fallbacks.items():
        if key not in normalized and value is not None:
            normalized[key] = value

    return {
        "provider": "Text Inspector",
        "integration_mode": "authorized_export_import",
        "metrics": normalized,
        "privacy": "User identifiers, timestamps, internal IDs, and submitted text are omitted.",
        "claim_boundary": "Imported metrics retain the provider's definitions and should be cited accordingly.",
    }
