from __future__ import annotations

import math
import re
from collections import Counter
from typing import Iterable

from .catalog import Feature

WORD_RE = re.compile(r"[A-Za-z]+(?:[-'][A-Za-z]+)*")
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")


def tokens(text: str) -> list[str]:
    return WORD_RE.findall(text)


def sentences(text: str) -> list[str]:
    cleaned = " ".join(text.split())
    if not cleaned:
        return []
    return [part.strip() for part in SENTENCE_RE.split(cleaned) if part.strip()]


def unique_matches(text: str, patterns: Iterable[str]) -> list[re.Match[str]]:
    matches: list[re.Match[str]] = []
    seen: set[tuple[int, int]] = set()
    for pattern in patterns:
        for match in re.finditer(pattern, text, flags=re.IGNORECASE):
            span = match.span()
            if span not in seen:
                seen.add(span)
                matches.append(match)
    return sorted(matches, key=lambda item: item.start())


def context(text: str, start: int, end: int, radius: int = 95) -> str:
    left = max(0, start - radius)
    right = min(len(text), end + radius)
    excerpt = " ".join(text[left:right].split())
    return excerpt


def analyse_feature(text: str, feature: Feature, word_count: int, sentence_count: int, max_hits: int) -> dict:
    found = unique_matches(text, feature.patterns)
    sentence_hits = 0
    sentence_list = sentences(text)
    if sentence_list:
        sentence_hits = sum(1 for sentence in sentence_list if unique_matches(sentence, feature.patterns))
    return {
        "feature_id": feature.id,
        "label": feature.label,
        "family": feature.family,
        "count": len(found),
        "rate_per_10k_words": round(len(found) / word_count * 10_000, 3) if word_count else 0.0,
        "sentence_coverage_pct": round(sentence_hits / sentence_count * 100, 2) if sentence_count else 0.0,
        "automatic_status": feature.automatic_status,
        "interpretation": feature.interpretation,
        "source_basis": list(feature.source_basis),
        "hits": [
            {
                "match": item.group(0),
                "start": item.start(),
                "end": item.end(),
                "context": context(text, item.start(), item.end()),
            }
            for item in found[:max_hits]
        ],
    }


def juilland_like_dispersion(counts: list[int]) -> float:
    """Return a transparent 0–1 evenness score across supplied segments.

    This is a Juilland-style normalized dispersion diagnostic. The API also
    returns raw segment coverage so the score is never the sole evidence.
    """
    n = len(counts)
    total = sum(counts)
    if n < 2 or total == 0:
        return 0.0
    mean = total / n
    variance = sum((value - mean) ** 2 for value in counts) / n
    sd = math.sqrt(variance)
    maximum = mean * math.sqrt(n - 1)
    return round(max(0.0, min(1.0, 1 - (sd / maximum if maximum else 0.0))), 4)


def lexical_summary(text: str) -> dict:
    word_list = [item.lower() for item in tokens(text)]
    sentence_list = sentences(text)
    counts = Counter(word_list)
    return {
        "word_count": len(word_list),
        "sentence_count": len(sentence_list),
        "type_count": len(counts),
        "type_token_ratio": round(len(counts) / len(word_list), 4) if word_list else 0.0,
        "average_sentence_words": round(len(word_list) / len(sentence_list), 2) if sentence_list else 0.0,
        "top_words": [{"word": word, "count": count} for word, count in counts.most_common(15)],
    }

