from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

from .analysis.pipeline import analyse_corpus, analyse_document
from .io.readers import read_bytes
from .models import CorpusRequest, DocumentInput, SegmentInput


def write_json(value: dict, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding="utf-8")


def analyze_file(args: argparse.Namespace) -> None:
    path = Path(args.input)
    document = read_bytes(path.name, path.read_bytes())
    write_json(analyse_document(document, not args.no_hits, args.max_hits), Path(args.output))


def analyze_csv(args: argparse.Namespace) -> None:
    grouped: dict[str, dict] = {}
    with Path(args.input).open(encoding="utf-8-sig", newline="") as source:
        for number, row in enumerate(csv.DictReader(source), 1):
            group = row.get(args.group_column) or f"group-{number}"
            text = (row.get(args.text_column) or "").strip()
            if not text:
                continue
            entry = grouped.setdefault(group, {"title": row.get("title") or group, "segments": [], "metadata": {}})
            entry["segments"].append(SegmentInput(
                id=f"{group}:{row.get(args.id_column) or row.get('stratum') or number}",
                text=text,
                metadata={key: value for key, value in row.items() if key != args.text_column and value not in (None, "")},
            ))
            if row.get("discipline"):
                entry["metadata"]["discipline"] = row["discipline"]
    documents = [
        DocumentInput(id=key, title=value["title"], segments=value["segments"], metadata=value["metadata"])
        for key, value in grouped.items()
    ]
    request = CorpusRequest(documents=documents, include_hits=not args.no_hits, max_hits_per_feature=args.max_hits)
    write_json(analyse_corpus(request), Path(args.output))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="miwae", description="Run the MIWAE corpus analysis prototype")
    commands = parser.add_subparsers(dest="command", required=True)

    file_parser = commands.add_parser("analyze-file", help="Analyze a TXT, Markdown, PDF, or DOCX file")
    file_parser.add_argument("--input", required=True)
    file_parser.add_argument("--output", required=True)
    file_parser.add_argument("--max-hits", type=int, default=5)
    file_parser.add_argument("--no-hits", action="store_true")
    file_parser.set_defaults(handler=analyze_file)

    csv_parser = commands.add_parser("analyze-csv", help="Analyze grouped text segments from a CSV file")
    csv_parser.add_argument("--input", required=True)
    csv_parser.add_argument("--output", required=True)
    csv_parser.add_argument("--group-column", default="book_id")
    csv_parser.add_argument("--id-column", default="sample_id")
    csv_parser.add_argument("--text-column", default="text")
    csv_parser.add_argument("--max-hits", type=int, default=3)
    csv_parser.add_argument("--no-hits", action="store_true")
    csv_parser.set_defaults(handler=analyze_csv)
    return parser


def main() -> None:
    args = build_parser().parse_args()
    args.handler(args)


if __name__ == "__main__":
    main()
