"""Owner-concern analysis service. Real Flask server, real Claude API call -
see README.md for model choice and cost rationale. Same "real endpoint
contract, honest about what's not configured yet" convention as
age-service/app.py."""
from flask import Flask, request, jsonify
from flask_cors import CORS

from analyzer import ConcernAnalyzer

app = Flask(__name__)
CORS(app)

analyzer = ConcernAnalyzer()


@app.get("/health")
def health():
    return jsonify(status="ok", configured=analyzer.is_configured)


@app.post("/analyze-concern")
def analyze_concern():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify(highlights=[], status="empty"), 400

    result = analyzer.analyze(text, species=data.get("species"))
    return jsonify(**result)


if __name__ == "__main__":
    app.run(port=5002, debug=False)
