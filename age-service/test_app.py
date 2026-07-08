"""Zero-framework smoke test: the endpoint contract holds even with no
trained model behind it. Run with: python test_app.py"""
import io
from PIL import Image

from app import app


def _fake_png_bytes():
    buf = io.BytesIO()
    Image.new("RGB", (32, 32), color=(120, 120, 120)).save(buf, format="PNG")
    buf.seek(0)
    return buf


def test_health():
    client = app.test_client()
    res = client.get("/health")
    assert res.status_code == 200
    body = res.get_json()
    assert body["status"] == "ok"
    assert body["modelTrained"] is False, "no weights configured in this environment"


def test_estimate_age_untrained_contract():
    client = app.test_client()
    res = client.post(
        "/estimate-age",
        data={"image": (_fake_png_bytes(), "test.png"), "species": "dog"},
        content_type="multipart/form-data",
    )
    assert res.status_code == 200
    body = res.get_json()
    assert set(body.keys()) == {"ageYears", "confidence", "status"}
    assert body["ageYears"] is None
    assert body["confidence"] == 0.0
    assert body["status"] == "untrained"


def test_estimate_age_missing_image():
    client = app.test_client()
    res = client.post("/estimate-age", data={}, content_type="multipart/form-data")
    assert res.status_code == 400


def test_estimate_age_invalid_image():
    client = app.test_client()
    res = client.post(
        "/estimate-age",
        data={"image": (io.BytesIO(b"not an image"), "bad.png")},
        content_type="multipart/form-data",
    )
    assert res.status_code == 400


if __name__ == "__main__":
    tests = [v for k, v in list(globals().items()) if k.startswith("test_")]
    failed = 0
    for t in tests:
        try:
            t()
            print(f"ok  - {t.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"FAIL - {t.__name__}\n     {e}")
    print(f"\n{'All tests passed' if not failed else str(failed) + ' test(s) failed'}")
    raise SystemExit(1 if failed else 0)
