from miwae_api.analysis.pipeline import analyse_document
from miwae_api.models import DocumentInput, SegmentInput


def test_distribution_reports_coverage_dispersion_and_opportunities():
    document = DocumentInput(
        id="demo",
        segments=[
            SegmentInput(id="s1", text="However, the result may change.", eligible_opportunities={"epistemic_hedge": 2}),
            SegmentInput(id="s2", text="The result may therefore change.", eligible_opportunities={"epistemic_hedge": 1}),
        ],
    )
    result = analyse_document(document)
    distribution = {item["feature_id"]: item for item in result["distribution"]}
    hedge = distribution["epistemic_hedge"]
    assert hedge["total_count"] == 2
    assert hedge["segments_with_feature"] == 2
    assert hedge["segment_coverage_pct"] == 100.0
    assert hedge["dispersion_evenness"] == 1.0
    assert hedge["eligible_opportunities"] == 3
    assert hedge["candidate_support_per_opportunity"] == 0.667


def test_function_and_form_profiles_are_distinct():
    result = analyse_document(DocumentInput(id="x", text="In this section, we consider what may happen."))
    function_ids = {item["feature_id"] for item in result["functions"]}
    form_ids = {item["feature_id"] for item in result["grammatical_forms"]}
    assert "orientation" in function_ids
    assert "modal_auxiliary" in form_ids
    assert function_ids.isdisjoint(form_ids)
