from fastapi.testclient import TestClient

from miwae_api.app import app


client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_analyze_text():
    response = client.post("/v1/analyze/text", json={"id": "demo", "text": "However, it may change."})
    assert response.status_code == 200
    body = response.json()
    assert body["statistics"]["word_count"] == 4
    assert any(item["feature_id"] == "epistemic_hedge" and item["count"] == 1 for item in body["grammatical_forms"])


def test_text_file_upload():
    response = client.post("/v1/analyze/file", files={"file": ("sample.txt", b"In this section we consider a circuit.")})
    assert response.status_code == 200
    assert response.json()["document"]["title"] == "sample.txt"
