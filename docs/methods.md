# Methods and interpretation

## Unit of analysis

A document can contain one full text or several segments, such as sampled passages or PDF pages. Segmenting the corpus makes it possible to ask whether a feature is concentrated in one location or distributed throughout a book.

## Functions

The current engine identifies lexical candidates for seven pedagogically relevant functions: meaning access, orientation, rhetorical relations, background-knowledge support, conceptual continuity, reader engagement, and multimodal/numeric scaffolding. These operational categories translate ELFA-informed concerns into textbook-observable evidence. They are not claimed as an exhaustive grammar of ELFA.

## Forms

The grammar catalog draws its category labels from Quirk et al. (1985), Biber et al. (1999), and MIWAE's discourse needs. Regex rules make the analysis inspectable and reproducible. Several labels explicitly contain “candidate” because reliable syntactic classification would require parsing and contextual adjudication.

## Distribution

The API reports four complementary views:

1. total count and rate per 10,000 words;
2. the number and percentage of segments containing the feature;
3. a transparent 0–1 evenness diagnostic across segments; and
4. candidate support per eligible opportunity, only when a human supplies the opportunity denominator.

A feature can be frequent but clustered, rare but evenly spread, or apparently absent because the corpus offered no relevant opportunity. These are substantively different findings.

## External evidence

Authorized Text Inspector exports can be normalized into a safe metric profile without retaining user identifiers or submitted text. User-supplied EVP/EGP mappings can annotate MIWAE features with CEFR-related references. Neither adapter bypasses provider access conditions.

## Validation workflow

For publishable research, draw a reproducible sample, preserve the sampling frame, manually review candidate hits, double-code a subset, report agreement, revise the codebook, and distinguish automated screening from the final adjudicated dataset.
