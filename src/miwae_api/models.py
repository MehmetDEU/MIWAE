from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field, model_validator


class SegmentInput(BaseModel):
    id: str
    text: str = Field(min_length=1)
    metadata: dict[str, Any] = Field(default_factory=dict)
    eligible_opportunities: dict[str, int] = Field(default_factory=dict)


class DocumentInput(BaseModel):
    id: str
    title: str | None = None
    text: str | None = None
    segments: list[SegmentInput] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    external_profiles: dict[str, Any] = Field(default_factory=dict)

    @model_validator(mode="after")
    def require_content(self) -> "DocumentInput":
        if not (self.text and self.text.strip()) and not self.segments:
            raise ValueError("Provide either text or at least one segment")
        return self


class CorpusRequest(BaseModel):
    documents: list[DocumentInput] = Field(min_length=1)
    include_hits: bool = True
    max_hits_per_feature: int = Field(default=5, ge=0, le=50)


class TextInspectorImportRequest(BaseModel):
    payload: dict[str, Any]


class ReferenceMappingRow(BaseModel):
    feature_id: str
    cefr_level: str | None = None
    source_reference: str | None = None
    note: str | None = None


class ReferenceMappingRequest(BaseModel):
    rows: list[ReferenceMappingRow]

