from __future__ import annotations

from io import BytesIO
from pathlib import Path

from docx import Document
from pypdf import PdfReader

from ..models import DocumentInput, SegmentInput


SUPPORTED_EXTENSIONS = {".txt", ".md", ".pdf", ".docx"}
MAX_UPLOAD_BYTES = 20 * 1024 * 1024


def _nonempty(value: str) -> str:
    text = value.strip()
    if not text:
        raise ValueError("No extractable text was found")
    return text


def read_bytes(filename: str, data: bytes) -> DocumentInput:
    if len(data) > MAX_UPLOAD_BYTES:
        raise ValueError("File exceeds the 20 MB prototype limit")
    suffix = Path(filename).suffix.lower()
    if suffix not in SUPPORTED_EXTENSIONS:
        raise ValueError(f"Unsupported file type: {suffix or '(none)'}")
    doc_id = Path(filename).stem.replace(" ", "_") or "uploaded_document"

    if suffix in {".txt", ".md"}:
        text = _nonempty(data.decode("utf-8", errors="replace"))
        return DocumentInput(id=doc_id, title=filename, text=text, metadata={"source_type": suffix[1:]})

    if suffix == ".pdf":
        reader = PdfReader(BytesIO(data))
        segments = []
        for number, page in enumerate(reader.pages, 1):
            text = (page.extract_text() or "").strip()
            if text:
                segments.append(SegmentInput(id=f"{doc_id}:page-{number}", text=text, metadata={"page": number}))
        if not segments:
            raise ValueError("No extractable PDF text was found; scanned PDFs require OCR before upload")
        return DocumentInput(id=doc_id, title=filename, segments=segments, metadata={"source_type": "pdf"})

    source = Document(BytesIO(data))
    segments = [
        SegmentInput(id=f"{doc_id}:paragraph-{number}", text=paragraph.text.strip(), metadata={"paragraph": number})
        for number, paragraph in enumerate(source.paragraphs, 1)
        if paragraph.text.strip()
    ]
    if not segments:
        raise ValueError("No extractable DOCX text was found")
    return DocumentInput(id=doc_id, title=filename, segments=segments, metadata={"source_type": "docx"})
