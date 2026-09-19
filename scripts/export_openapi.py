from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from miwae_api.app import app  # noqa: E402


(ROOT / "openapi.json").write_text(json.dumps(app.openapi(), indent=2), encoding="utf-8")
