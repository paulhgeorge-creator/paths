"""Owner-concern text analyzer - a single low-cost Claude API call.

Model choice: Haiku 4.5 (claude-haiku-4-5) - this is a short-input
extraction/summarization task (paraphrase distinct concerns out of one
owner-written paragraph), not agentic or reasoning-heavy, and it's a
low-volume, per-submission feature (one owner, one paragraph, once) - not a
high-throughput pipeline. Haiku 4.5 is the cheapest current Claude model and
the right fit for this shape of work; see README.md for the full rationale
(including why prompt caching isn't used here).
"""
import json
import os

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

SYSTEM_PROMPT = (
    "You help a pet owner see their own free-text medical-history note more "
    "clearly. Extract the distinct concerns mentioned as short, plain-language "
    "bullet points, in the owner's own terms. Do not diagnose, do not name or "
    "suggest a condition or cause, do not rate severity or urgency, and do not "
    "add anything the owner didn't say. If the text mentions nothing "
    "concerning, return an empty list."
)

HIGHLIGHTS_SCHEMA = {
    "type": "object",
    "properties": {
        "highlights": {
            "type": "array",
            "items": {"type": "string"},
            "description": "Short, plain-language bullet points paraphrasing distinct concerns from the owner's text - no diagnosis, no severity rating.",
        }
    },
    "required": ["highlights"],
    "additionalProperties": False,
}


class ConcernAnalyzer:
    def __init__(self, api_key=ANTHROPIC_API_KEY):
        self.api_key = api_key
        self._client = None
        if api_key:
            import anthropic  # ponytail: lazy import - only paid for once a key is configured
            self._client = anthropic.Anthropic(api_key=api_key)

    @property
    def is_configured(self):
        return self._client is not None

    def analyze(self, text, species=None):
        """text: non-empty owner-written string. Returns {highlights, status}.
        highlights is always [] when not configured or on any failure - never
        fabricated, same honesty convention as age-service/model.py's
        confidence:0 "untrained" status."""
        if not self.is_configured:
            return {"highlights": [], "status": "not-configured"}

        species_note = f" The pet is a {species}." if species else ""
        try:
            response = self._client.messages.create(
                model="claude-haiku-4-5",
                max_tokens=512,
                system=SYSTEM_PROMPT + species_note,
                output_config={"format": {"type": "json_schema", "schema": HIGHLIGHTS_SCHEMA}},
                messages=[{"role": "user", "content": text}],
            )
            parsed_text = next((b.text for b in response.content if b.type == "text"), "{}")
            data = json.loads(parsed_text)
            highlights = data.get("highlights", [])
            if not isinstance(highlights, list):
                highlights = []
            return {"highlights": highlights, "status": "ok"}
        except Exception:
            # Network/API failure of any kind - the client treats this
            # identically to "service not running": no highlights shown,
            # nothing else in the questionnaire is affected.
            return {"highlights": [], "status": "error"}
