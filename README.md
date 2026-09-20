# MIWAE Corpus Analysis API

MIWAE is an open research prototype for profiling English-medium instruction (EMI) textbook passages through three linked lenses:

- **Functions:** candidate signals that help readers access meanings, follow explanations, connect ideas, engage with content, and use multimodal resources.
- **Forms:** transparent pattern-based candidates for grammatical and discourse features described in sources such as Quirk et al. (1985) and Biber et al. (1999).
- **Distribution:** frequency normalized per 10,000 words, segment coverage, evenness across segments, and—when supplied—support per eligible opportunity.

The output is evidence for human interpretation. It is **not** an automatic verdict on whether a book is ELFA-friendly.

## Quick start

```bash
python -m venv .venv
source .venv/bin/activate
pip install '.[dev]'
uvicorn miwae_api.app:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive OpenAPI interface.

## Analyze a text

```bash
curl -X POST 'http://127.0.0.1:8000/v1/analyze/text?max_hits=3' \
  -H 'Content-Type: application/json' \
  --data @examples/sample_request.json
```

Upload `.txt`, `.md`, text-based `.pdf`, or `.docx` files:

```bash
curl -X POST 'http://127.0.0.1:8000/v1/analyze/file' \
  -F 'file=@chapter.pdf'
```

Analyze grouped passages in CSV form:

```bash
miwae analyze-csv \
  --input passages.csv \
  --output analysis.json \
  --group-column book_id \
  --text-column text
```

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /health` | Version and service health |
| `GET /v1/features` | Public feature catalog and evidence basis |
| `POST /v1/analyze/text` | Analyze one document or supplied segments |
| `POST /v1/analyze/corpus` | Analyze several documents |
| `POST /v1/analyze/file` | Extract and analyze TXT, Markdown, PDF, or DOCX |
| `POST /v1/adapters/textinspector` | Normalize an authorized Text Inspector export while removing PII and submitted text |
| `POST /v1/adapters/reference-map` | Validate user-supplied EVP/EGP or other CEFR reference mappings |

## Text Inspector and English Profile

This repository does not scrape, reproduce, or redistribute proprietary resources. Its adapters accept:

1. metrics exported by a user who is authorized to use Text Inspector; and
2. EVP/EGP reference mappings supplied by a user under the relevant terms.

This is an extensible interoperability layer, not a claim of an official partnership or live API connection.

## Methodological limits

- Pattern matches are **candidates**. Polysemy, syntactic ambiguity, OCR noise, formulas, tables, and page furniture can create false positives or false negatives.
- Function categories require contextual coding and inter-coder checks in formal research.
- Raw counts should not be compared across books of different lengths; use normalized rates, segment coverage, and dispersion together.
- Opportunity-sensitive measures require a human-coded denominator. The API reports it only when supplied.
- The demonstration corpus is sampled. Claims apply to those sampled passages unless a complete book corpus is analyzed.

See [docs/methods.md](docs/methods.md) and [docs/presentation_claims.md](docs/presentation_claims.md).

## Conference materials

The editable presentation, presenter notes, printable framework handout, and PDF handout are archived in [docs/conference-2026](docs/conference-2026/README.md).

## Data and copyright

The repository excludes copyrighted books, private Text Inspector responses, and student data. Users are responsible for lawful access to source texts and external platforms.

## References informing the feature design

- Biber, D., Johansson, S., Leech, G., Conrad, S., & Finegan, E. (1999). *Longman Grammar of Spoken and Written English*.
- Quirk, R., Greenbaum, S., Leech, G., & Svartvik, J. (1985). *A Comprehensive Grammar of the English Language*.
- Mauranen, A., Hynninen, N., & Ranta, E. (2016). English as the academic lingua franca.

## License

MIT for the software. External texts, reference databases, and provider outputs retain their original rights and terms.
