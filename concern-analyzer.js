/* Pluggable owner-concern free-text analyzer, same interface convention as
   age-estimator.js: one function the rest of the app depends on, real
   backing service (concern-service/), graceful "no highlights" on any
   failure - never blocks or breaks the questionnaire.

   Unlike age-estimator.js's photo model (real service, no trained weights),
   this one is fully wired end to end - the only gate is whether
   ANTHROPIC_API_KEY is configured server-side, see concern-service/README.md. */
(function (root) {

  const DEFAULT_ENDPOINT = "http://localhost:5002/analyze-concern";
  const TIMEOUT_MS = 8000;

  function unavailable(reason){
    return {highlights: [], status: reason};
  }

  async function analyzeConcern(text, {species, endpoint} = {}){
    if (!text || !text.trim()) return unavailable("empty");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(endpoint || DEFAULT_ENDPOINT, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({text, species}),
        signal: controller.signal,
      });
      if (!res.ok) return unavailable("service-error");

      const data = await res.json();
      const highlights = Array.isArray(data.highlights) ? data.highlights : [];
      return {highlights, status: data.status || "ok"};
    } catch (err) {
      // Network error, timeout, CORS, service not running, no API key
      // configured server-side - all treated the same: no highlights,
      // rest of the round continues exactly as if this were a plain
      // unanalyzed text field.
      return unavailable("unreachable");
    } finally {
      clearTimeout(timer);
    }
  }

  root.PawlConcernAnalyzer = { analyzeConcern };

})(typeof window !== "undefined" ? window : globalThis);
