from __future__ import annotations

from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class Feature:
    id: str
    label: str
    family: str
    patterns: tuple[str, ...]
    source_basis: tuple[str, ...]
    interpretation: str
    automatic_status: str = "candidate"

    def public(self) -> dict:
        item = asdict(self)
        item.pop("patterns")
        return item


FUNCTIONS: tuple[Feature, ...] = (
    Feature("meaning_access", "Access to disciplinary meanings", "function", (
        r"\bis defined as\b", r"\brefers to\b", r"\bis called\b", r"\bknown as\b",
        r"\bin other words\b", r"\bthat is\b", r"\bmeans that\b",
    ), ("MIWAE", "Mauranen et al. 2016"), "Definitions, glosses, and local reformulations."),
    Feature("orientation", "Orientation and navigation", "function", (
        r"\bin this chapter\b", r"\bin this section\b", r"\bwe will (?:discuss|examine|consider)\b",
        r"\bin the next section\b", r"\bin summary\b", r"\bto summarize\b",
    ), ("MIWAE", "Björkman 2013"), "Signals the route, purpose, or stage of an explanation."),
    Feature("rhetorical_relation", "Rhetorical relations and importance", "function", (
        r"\bhowever\b", r"\bin contrast\b", r"\bon the other hand\b", r"\btherefore\b",
        r"\bconsequently\b", r"\bnote that\b", r"\bthe key point is\b", r"\bthis suggests\b",
    ), ("MIWAE", "Björkman 2013"), "Marks contrast, cause, consequence, qualification, or importance."),
    Feature("background_knowledge", "Background knowledge support", "function", (
        r"\bas you may (?:know|recall|be aware)\b", r"\bmay not be familiar with\b",
        r"\bcommonly known as\b", r"\bfor those who (?:do not|don't) know\b",
    ), ("MIWAE", "Seidlhofer 2011"), "Makes potentially non-shared knowledge locally accessible."),
    Feature("conceptual_continuity", "Conceptual continuity", "function", (
        r"\brecall that\b", r"\bas discussed earlier\b", r"\bas noted earlier\b",
        r"\bearlier in this (?:chapter|book|section)\b", r"\bfrom (?:chapter|section)\s+\d+\b",
    ), ("MIWAE", "Mauranen et al. 2016"), "Reactivates prior concepts at a new dependency."),
    Feature("reader_engagement", "Reader engagement and self-monitoring", "function", (
        r"\bconsider the following\b", r"\bcheck your understanding\b", r"\bsuppose that\b",
        r"\bwhat if\b", r"\bdiscussion question\b", r"\bpause and (?:consider|think)\b",
    ), ("MIWAE", "Björkman 2013"), "Invites the reader to test, predict, or reflect."),
    Feature("multimodal_scaffolding", "Multimodal and numeric scaffolding", "function", (
        r"\bfig(?:ure)?\.?\s*\d+", r"\btable\s*\d+", r"\bshown in (?:the )?(?:figure|table)\b",
        r"\bas illustrated\b", r"\bthe graph shows\b",
    ), ("MIWAE", "discipline-sensitive extension"), "Coordinates prose with figures, tables, graphs, or notation."),
)


FORMS: tuple[Feature, ...] = (
    Feature("modal_auxiliary", "Modal auxiliaries", "grammar", (r"\b(?:can|could|may|might|must|shall|should|will|would)\b",), ("Quirk et al. 1985", "Biber et al. 1999"), "Modal meanings and stance resources."),
    Feature("epistemic_hedge", "Epistemic hedges", "grammar", (r"\b(?:perhaps|possibly|probably|apparently|roughly|approximately)\b", r"\b(?:may|might|could)\b", r"\b(?:seems?|appears?) to\b"), ("Biber et al. 1999",), "Tentativeness or limited commitment."),
    Feature("booster", "Boosters and emphasis", "grammar", (r"\b(?:clearly|obviously|certainly|indeed|undoubtedly|always|never)\b",), ("Biber et al. 1999",), "Strong commitment or emphasis."),
    Feature("passive_candidate", "Passive candidates", "grammar", (r"\b(?:am|is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b",), ("Quirk et al. 1985", "Biber et al. 1999"), "Heuristic passive-voice candidates; parser or manual check recommended."),
    Feature("conditional_clause", "Conditional clauses", "grammar", (r"\bif\b", r"\bunless\b", r"\bprovided that\b", r"\bas long as\b"), ("Quirk et al. 1985", "English Grammar Profile mapping supplied by user"), "Conditions and hypothetical relations."),
    Feature("concessive_clause", "Concessive clauses", "grammar", (r"\balthough\b", r"\bthough\b", r"\beven though\b", r"\bwhereas\b", r"\bwhile\b"), ("Quirk et al. 1985", "Biber et al. 1999"), "Concession and contrast."),
    Feature("causal_clause", "Causal and result clauses", "grammar", (r"\bbecause\b", r"\bsince\b", r"\bso that\b", r"\btherefore\b", r"\bthus\b"), ("Quirk et al. 1985",), "Cause, reason, purpose, and result."),
    Feature("relative_clause_candidate", "Relative-clause candidates", "grammar", (r"\b(?:who|whom|whose|which)\b", r"\bthat\s+(?:is|are|was|were|has|have|had|can|could|may|might|will|would|\w+s?\b)"), ("Quirk et al. 1985", "English Grammar Profile mapping supplied by user"), "Postmodification and information packaging; candidate detector."),
    Feature("that_complement_candidate", "That-clause candidates", "grammar", (r"\b(?:show|shows|showed|suggest|suggests|indicate|indicates|assume|assumes|mean|means|note|notes)\s+that\b", r"\bthe fact that\b"), ("Biber et al. 1999",), "Complement-clause candidates in academic exposition."),
    Feature("to_infinitive", "To-infinitive constructions", "grammar", (r"\bto\s+[a-z]+\b",), ("Quirk et al. 1985", "English Grammar Profile mapping supplied by user"), "Non-finite infinitival packaging; lexical false positives possible."),
    Feature("ing_form_candidate", "-ing form candidates", "grammar", (r"\b[a-z]{3,}ing\b",), ("Quirk et al. 1985", "Biber et al. 1999"), "Participial, gerund, or progressive candidates; parser check recommended."),
    Feature("existential_there", "Existential there", "grammar", (r"\bthere (?:is|are|was|were|has been|have been)\b",), ("Quirk et al. 1985",), "Introduces entities or situations into discourse."),
    Feature("extraposition_it", "Extraposition with it", "grammar", (r"\bit (?:is|was) (?:important|possible|necessary|clear|likely|unlikely|useful|essential) (?:that|to)\b",), ("Quirk et al. 1985", "Biber et al. 1999"), "Stance and information packaging."),
    Feature("negation", "Negation", "grammar", (r"\b(?:not|never|no|neither|nor|without)\b",), ("Quirk et al. 1985",), "Negative polarity and qualification."),
    Feature("interrogative", "Interrogatives", "grammar", (r"[^?]{0,160}\?",), ("Quirk et al. 1985",), "Questions used for information or reader engagement."),
    Feature("nominalisation_candidate", "Nominalisation candidates", "grammar", (r"\b[a-z]{4,}(?:tion|sion|ment|ity|ness|ance|ence|al)\b",), ("Biber et al. 1999",), "Dense nominal information packaging; heuristic suffix detector."),
    Feature("coordination", "Coordination", "grammar", (r"\b(?:and|or|but|nor|yet)\b",), ("Quirk et al. 1985", "Biber et al. 1999"), "Coordination across words, phrases, or clauses."),
    Feature("endophoric_reference", "Endophoric and cross-reference forms", "grammar", (r"\b(?:figure|table|chapter|section|equation|appendix)\s+\d+(?:\.\d+)*\b", r"\b(?:above|below|earlier|previous|following)\b"), ("Biber et al. 1999", "MIWAE"), "Links a passage to other locations or objects in the text."),
    Feature("reader_reference", "Reader reference", "grammar", (r"\b(?:you|your|we|our|let us|let's)\b",), ("Biber et al. 1999", "MIWAE"), "Explicit writer-reader or inclusive reference."),
)


ALL_FEATURES = FUNCTIONS + FORMS
FEATURE_BY_ID = {feature.id: feature for feature in ALL_FEATURES}

