from miwae_api.adapters.references import normalize_reference_rows
from miwae_api.adapters.textinspector import normalize_textinspector
from miwae_api.models import ReferenceMappingRow


def test_textinspector_adapter_strips_private_fields_and_text():
    source = {
        "flat": {"book_id": "B1", "cefr": "C1", "textinspector_uid": "private"},
        "user": {"email": "private@example.com"},
        "sample_text": "private source text",
    }
    output = normalize_textinspector(source)
    serialized = str(output)
    assert output["metrics"]["cefr"] == "C1"
    assert "private@example.com" not in serialized
    assert "private source text" not in serialized
    assert "textinspector_uid" not in serialized


def test_reference_adapter_rejects_unknown_feature_ids():
    output = normalize_reference_rows([
        ReferenceMappingRow(feature_id="conditional_clause", cefr_level="B2"),
        ReferenceMappingRow(feature_id="invented_feature", cefr_level="C1"),
    ])
    assert len(output["accepted"]) == 1
    assert output["unknown_feature_ids"] == ["invented_feature"]
