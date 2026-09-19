from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, Query, UploadFile

from .adapters.references import normalize_reference_rows
from .adapters.textinspector import normalize_textinspector
from .analysis.catalog import FORMS, FUNCTIONS
from .analysis.pipeline import analyse_corpus, analyse_document
from .io.readers import read_bytes
from .models import CorpusRequest, DocumentInput, ReferenceMappingRequest, TextInspectorImportRequest


app = FastAPI(
    title="MIWAE Corpus Analysis API",
    version="0.1.0",
    description=(
        "A transparent research prototype for candidate-level profiling of textbook functions, "
        "grammatical forms, and distribution across corpus segments."
    ),
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": app.version}


@app.get("/v1/features")
def features() -> dict:
    return {
        "functions": [feature.public() for feature in FUNCTIONS],
        "grammatical_forms": [feature.public() for feature in FORMS],
    }


@app.post("/v1/analyze/text")
def analyze_text(document: DocumentInput, include_hits: bool = True, max_hits: int = Query(5, ge=0, le=50)) -> dict:
    return analyse_document(document, include_hits, max_hits)


@app.post("/v1/analyze/corpus")
def analyze_corpus(request: CorpusRequest) -> dict:
    return analyse_corpus(request)


@app.post("/v1/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    include_hits: bool = True,
    max_hits: int = Query(5, ge=0, le=50),
) -> dict:
    try:
        document = read_bytes(file.filename or "upload.txt", await file.read())
        return analyse_document(document, include_hits, max_hits)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.post("/v1/adapters/textinspector")
def import_textinspector(request: TextInspectorImportRequest) -> dict:
    return normalize_textinspector(request.payload)


@app.post("/v1/adapters/reference-map")
def import_reference_map(request: ReferenceMappingRequest) -> dict:
    return normalize_reference_rows(request.rows)
