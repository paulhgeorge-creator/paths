"""Owner-concern analysis service. Real Flask server, real Claude API call -
see README.md for model choice and cost rationale. Same "real endpoint
contract, honest about what's not configured yet" convention as
age-service/app.py."""
import os
import time
from collections import defaultdict, deque

from flask import Flask, request, jsonify
from flask_cors import CORS

from analyzer import ConcernAnalyzer

app = Flask(__name__)

# Origin allowlist (2026-07-20, security hardening pass): this service is
# meant to be called only from this app's own index.html - opened as a
# local file (browsers send Origin: null for fetch() from file://) or from
# a couple common local static-server ports, not from an arbitrary site.
# Override via CONCERN_SERVICE_ALLOWED_ORIGINS (comma-separated) if this
# ever needs to be served from somewhere else.
_default_origins = "null,http://localhost:5500,http://127.0.0.1:5500,http://localhost:8000,http://127.0.0.1:8000"
ALLOWED_ORIGINS = os.environ.get("CONCERN_SERVICE_ALLOWED_ORIGINS", _default_origins).split(",")
CORS(app, resources={r"/analyze-concern": {"origins": ALLOWED_ORIGINS}})

analyzer = ConcernAnalyzer()

# Minimal in-memory rate limit (2026-07-20, security hardening pass) - this
# is a local, single-user dev service with no auth in front of it, so
# without SOME limit any process that can reach the port could spend the
# developer's Claude API budget. A plain per-IP sliding window in memory is
# the right-sized fix here (no Redis/flask-limiter dependency for a
# single-process local tool) - ponytail: resets on restart, not shared
# across multiple worker processes; add a real store if this ever runs
# with >1 worker or needs to survive restarts.
RATE_LIMIT_MAX = 20
RATE_LIMIT_WINDOW_S = 60
_request_log = defaultdict(deque)


def _rate_limited(ip):
    now = time.time()
    log = _request_log[ip]
    while log and now - log[0] > RATE_LIMIT_WINDOW_S:
        log.popleft()
    if len(log) >= RATE_LIMIT_MAX:
        return True
    log.append(now)
    return False


@app.get("/health")
def health():
    return jsonify(status="ok", configured=analyzer.is_configured)


@app.post("/analyze-concern")
def analyze_concern():
    if _rate_limited(request.remote_addr):
        return jsonify(highlights=[], status="rate-limited"), 429

    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify(highlights=[], status="empty"), 400

    result = analyzer.analyze(text, species=data.get("species"))
    return jsonify(**result)


if __name__ == "__main__":
    app.run(port=5002, debug=False)
