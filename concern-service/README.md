# Pawl owner-concern analysis service

Real Flask backend behind `concern-analyzer.js`'s `analyzeConcern()`. Unlike
`age-service/` (real endpoint, no trained model), this one is fully wired -
it's a real Claude API call, gated only on whether `ANTHROPIC_API_KEY` is set.

## What it does

`POST /analyze-concern` takes the owner's free-text medical-history concern
(Round 4's optional textarea, separate from the scored `p4_owner_concern`
scale question) and returns a short list of plain-language highlights
extracted from it. It does not diagnose, rate severity, or suggest a
condition or cause - same non-clinical, non-diagnostic framing as the rest
of this app (see the main README's "Wellness estimate only" guardrail).

## Model choice: Haiku 4.5

This is a short-input extraction/summarization task (paraphrase distinct
concerns out of one paragraph), not agentic or reasoning-heavy, and it's a
low-volume, per-submission feature - one owner, one paragraph, once - not a
high-throughput pipeline. `claude-haiku-4-5` is the cheapest current Claude
model and the right fit for this shape of work.

## Cost / caching

No prompt caching is configured. Caching only pays off on a stable, large,
reused prompt prefix - here the system prompt is a short paragraph and every
request's user content (the owner's text) is unique, so there's no shared
prefix to cache. Revisit if this ever becomes high-volume with a much larger
shared system prompt.

## Configuration

Needs `ANTHROPIC_API_KEY` set in the environment - never hardcoded, never
committed. Without it, `/analyze-concern` returns
`{"highlights": [], "status": "not-configured"}` - the same honesty
convention as `age-service/`'s `"untrained"` status when no model weights
are configured. `concern-analyzer.js` (the client) treats `not-configured`,
`error`, and "service not running" identically: no highlights are shown,
nothing else in the questionnaire is affected - the owner's typed text is
still saved either way, it just won't get AI-extracted highlights.

**Hardening (2026-07-20)**: `/analyze-concern` is CORS-restricted to an
origin allowlist (default: `null` for `file://` plus a couple common local
static-server ports - override with `CONCERN_SERVICE_ALLOWED_ORIGINS`,
comma-separated) and rate-limited to 20 requests/minute per IP via a plain
in-memory sliding window (no Redis/flask-limiter - this is a local,
single-worker dev service; the limiter resets on restart and isn't shared
across multiple workers, which is fine for that shape of deployment but
worth knowing if that ever changes).

## Run it

```
cd concern-service
pip install -r requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...
python app.py
```

Serves on `http://localhost:5002`. `POST /analyze-concern` (JSON `{text,
species?}`) → `{highlights, status}`. `GET /health` reports whether an API
key is configured.

## Why this app now has a real (optional) network dependency

Everything else in this app runs with no backend and no network call. This
service is the one deliberate exception, added per direct request after the
2026-07-19 blocker discussion (public-repo static-HTML apps can't safely
embed an API key client-side - see the main README's calibration/status
notes for that reasoning). It's strictly additive and optional: the
questionnaire works fully without it running.
