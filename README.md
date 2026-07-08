# Frailty Onboarding — Pawl Physiological Age Questionnaire

A 4-part, owner-input frailty questionnaire that estimates a pet's *physiological age* (how old their body is behaving) versus chronological age. No hardware, no vet visit required to start. Single self-contained HTML file — open `index.html` in a browser, no build step. A separate optional Flask service (`age-service/`) backs photo-based age estimation — see below; the questionnaire works fully without it.

Deficit-accumulation model adapted from Banzato et al. 2019 (33-item canine Frailty Index) and the Loyal Canine Frailty Index. Wellness instrument, not a diagnostic one — no lifespan or prognosis claims.

## How it works

Two numbers drive everything:

1. **Chronological age** — a single fused value, never a life-stage category. See "Onboarding flow & age fusion" below.
2. **Observed FI** (Frailty Index) — Σ(scores of answered deficits) ÷ (items answered). Each deficit is scored 0 (absent), 0.5 (mild), or 1 (severe/present).

Observed FI is compared against the **expected FI for that age** — a continuous curve anchored at young ≈ 0.08, middle-aged ≈ 0.11, senior ≈ 0.23 (Banzato et al. 2019's actual reported mean FI by age band — young 2-6y, middle 7-10y, old 10+y — not placeholder guesses), interpolated by age-as-a-fraction-of-life-stage (no discontinuity at bracket edges). Banzato also reports an approximately linear FI-vs-age relationship across their sample, which is why piecewise-linear interpolation between anchors is a literature-consistent shape rather than an invented curve.

A brachycephalic-breed modifier raises the expected-FI baseline for breeds with breed-typical breathing/skin-fold traits (bulldogs, pugs, etc.), and a separate chondrodystrophic-breed modifier does the same for breeds with FGF4-driven early spinal-disc degeneration (dachshunds, corgis, basset hounds), so those findings don't inflate the score the way a new deficit would elsewhere. Breeds in both lists (Shih Tzu, Pekingese) take the larger of the two modifiers, not the sum. Size-adjusted aging (giant breeds age on a compressed timeline) falls out of the same size-based senior-onset cutoffs already used for life-stage bucketing — now set to real benchmarks (small 11 / medium 9 / large 7.5 / giant 5.5 yr, midpoints of small 10-12 / medium 8-10 / large 7-8 / giant 5-6). The direction of that size ordering is also backed by the fact that larger dogs lose roughly one month of lifespan per 2kg of body mass — cited as qualitative support only, since that's a lifespan-shortening rate, not a senior-onset-age rate, and turning it into a formula would be false precision. The same size-based lookup (`seniorGuessAge`) now also drives the "looks senior, DOB unknown" age guess, replacing an earlier flat 8-year guess that ignored size/species entirely.

Cats get no independently-calibrated FI-age curve — no quantitative feline FI-by-age literature exists yet (current feline frailty research is phenotype/qualitative, not a numeric index). Rather than assume the dog-derived anchors transfer 1:1, cat deltas are dampened toward "typical" (`CAT_DELTA_DAMPENING`) as an honest lower-confidence stand-in for real feline calibration data.

```
physiological_age = chronological_age + β × (observed_FI − expected_FI_for_age)
```

clamped so no estimate can swing more than a defined max years below/above chronological age, and floored at a small positive number. This additive form replaced an earlier multiplicative formula that could send a healthy senior's estimate collapsing toward a very young age. `β`, the clamp, both breed modifiers, and the cat dampening factor all live as named placeholder constants in `frailty-model.js`'s `FRAILTY_MODEL_CONFIG` — flagged with a `ponytail:` comment as interim, pending real calibration data (see Sources note below); the FI anchors and senior-onset ages are the parts of this pass with an actual literature source behind the numbers.

The headline result is an **approximate single figure** (e.g. "~9 yrs"), with the underlying low–high range shown as a secondary line — a deliberate, product-directed softening of an earlier "never a bare point-value age" guardrail, not a silent removal of it (the range, narrowing bands, and all wellness framing stay). The band narrows as more items get answered — more data means a tighter estimate (standard error scales roughly ~1/√n). The four parts exist to feed progressively more deficits into that same formula, recomputing the estimate each time. Skipped items simply don't count toward the denominator — no penalty for stopping early. Every result shows a plain-language explanation line and an "aging slower/typical/faster" comparison expressed as a **percentage of chronological age** (`deltaPercentOfAge` — e.g. "aging about 15% faster than typical"), per a later product-direction change that replaced the earlier qualitative-only framing. No lifecycle labels (kitten/adult/senior) are shown anywhere in the UI — `lifeStage()` still exists internally to drive the expected-FI curve, but the single fused age in years is the only age-ish thing a user sees.

FI zones (wellness-framed, never clinical): **Thriving** (FI < 0.12) · **Steady** (0.12–0.24) · **Needs attention** (0.25–0.4) · **Talk to your vet** (> 0.4, always routes to a vet prompt, never a prognosis).

Species: dog and cat share one shell. Species-specific items (e.g. stairs vs. jumping to a perch) are swapped automatically. Cat outputs carry a wider uncertainty band (feline aging science lags dogs) and use the Cambridge 2017 formula (`human_years ≈ 4.14 × cat_age + 15`) for a human-year equivalent; dogs now get the same treatment via the Wang et al. 2020 formula (`human_years ≈ 16 × ln(dog_age) + 31`) — previously only cats had a human-year figure.

## Onboarding flow & age fusion

Baseline collects: species, name, breed, weight (kg or lb — stored canonically in kg, `KG_PER_LB` conversion, display-only toggle), sex/neuter status, date of birth as three separate month/day/year fields (no more one `<input type=date>`), and an optional photo. If DOB is unknown, a plain "age in years" number field replaces it — no lifecycle-labeled dropdown (puppy/young adult/adult/looks-senior) exists anymore.

**`computeFinalAge()`** (in `index.html`) fuses whatever signals are available via `fuseAge()` (in `frailty-model.js`), a confidence-weighted average — never a single model or category deciding alone:

| Signal | Confidence |
|---|---|
| Exact DOB | 1.0 |
| Owner's years-only guess (DOB unknown) | 0.5 |
| Photo-based estimate | the model's own reported confidence (`0` today — see below) |
| Size-based population prior | 0.1 (last-resort floor so fusion is never empty) |

A signal with confidence 0 contributes nothing to the weighted average — this is how "don't rely on image-based estimation alone" is enforced in code, not just in copy.

### Photo-based age estimation

`age-estimator.js` exposes the one pluggable seam, `estimateAgeFromPhoto(file, {species})`, which POSTs to a local Flask service (`age-service/`, default `http://localhost:5001`) and resolves to `{years, confidence, status}` — network errors, timeouts, or the service not running all resolve to `confidence: 0`, never throw, and never block the rest of onboarding.

**The service has no trained model behind it yet, on purpose, not by oversight.** `szmazurek/Age_recognition_Cyfrovet` (the referenced repo) was inspected: it's a TensorFlow *training pipeline*, not a packaged model — no shipped weights, no LICENSE file (real legal risk to copy its code into this project without contacting the author), a 3-bucket age classification (not continuous years), dog-only (no cats), and the author's own README says results are "still not satisfying." `age-service/README.md` has the full breakdown and the real path to wiring in a trained model later. Until then the service honestly returns `confidence: 0` / `status: "untrained"`, which `fuseAge()` treats as no signal.

### Body condition chart

`BCS_CHART` in `frailty-model.js` is a real 9-point WSAVA/Purina-style body-condition scale (both dog and cat, ideal band at 4–5) with a short description per point — not generic placeholder text. Its own onboarding step (between baseline and Part 1) shows the description live as the owner drags a 1–9 slider, plus a `.bcs-photo-slot` placeholder box keyed by `imageHook` (e.g. `bcs-dog-5`) for each point — a clear, non-broken hook point for real reference photos to be dropped in later (no `<img src>` pointing at a file that doesn't exist).

### Weight-based percentile ranking

`overweightPercentile(species, bcs)` returns a "Top N% most overweight" figure shown as a pill on the result card when BCS ≥ 6. Anchored on real cited prevalence stats: BCS 8 → 22% (dogs) / 33% (cats) obese; BCS 6 → 59% (dogs) / 61% (cats) overweight-or-obese. BCS 7 and 9 are linearly interpolated/extrapolated between those anchors — flagged in code, not independently sourced. BCS ≤ 5 (ideal or underweight) returns `null` — no percentile shown where a pet isn't in the overweight tail.

### Extensible activity-minutes thresholds

`getActivityMinutesThreshold(species, weightKg, breed)` checks a breed-override table (`ACTIVITY_BREED_OVERRIDES`, sourced from general breed-energy-level characterizations) before falling back to the existing size-class default. Adding a real per-breed number later is a one-line addition to that object — no logic changes needed. Still flagged as illustrative (see Status below) — no public source gives real size/breed-stratified activity minutes.

## Validation notes

- The `fiZone` Steady/Needs-attention boundary (FI 0.24) lines up closely with a cited FI > 0.25 "elevated mortality risk" threshold — the boundary is validated by that number, not derived from it.
- Frailty-phenotype survival-time data (frail dogs ≈ 10.5mo, pre-frail ≈ 35.4mo, non-frail ≈ 42.5mo median survival) supports why the "Talk to your vet" zone exists at all, but those survival numbers are never surfaced in UI copy — the original spec's guardrail against lifespan/prognosis claims stands.
- `bcsToDeficit`'s thresholds are validated after the fact by the Purina lifetime calorie-restriction study: the control group's BCS (6.7, a 2.2-point deviation from ideal) already scores as "severe" under the existing thresholds, and the calorie-restricted group's BCS (4.6, 0.1 off ideal) scores as "ideal" — no threshold change needed.

## The four sections

### Part 1 — Core (8 items) → initial estimate
Mobility, activity/energy, exhaustion, stiffness/gait, appetite change, coat/grooming, overall vitality (owner gestalt), and body condition score. Activity is asked as a countable daily-minutes figure (system judges adequacy against species/breed/size thresholds, not the owner's own sense of "normal") and stiffness is asked as an objective yes/no-ish observation ("needs a moment to get up after resting") — both replace earlier "...than usual" comparative wording that let owners under- or over-report based on their own baseline assumptions. Other comparative items (exhaustion, coat, later social withdrawal, temperature sensitivity) were left as-is — no good countable substitute exists without disproportionate added friction.

**Reveals:** a same-day, cross-system snapshot — deliberately not just "easy" mobility questions, so the early number isn't skewed toward one body system.
**Adds value:** a 90-second payoff — a shareable estimate card that hooks the return-visit loop. Band: ± ~3 years.

### Part 2 — Senses, mind & surface (8 items) → first refinement
Vision, hearing, disorientation/cognition, sleep changes, social withdrawal or clinginess, oral/dental signs, skin lumps, weight trend.

**Reveals:** age-linked deficits that are slower to notice — things owners see day-to-day but don't usually connect to aging (especially early cognitive decline).
**Adds value:** tightens the band to ± ~2 years.

### Part 3 — Internal & systemic signals (9 items) → second refinement
Water intake, urination, continence, digestion, breathing, exercise tolerance, muscle condition, temperature sensitivity, pain signals.

**Reveals:** organ-system aging (kidney, heart, GI, musculoskeletal) — signs owners observe but rarely link to a single underlying cause.
**Adds value:** band tightens to ± ~1.2 years; highest medical relevance, most likely section to surface a "needs attention" flag.

### Part 4 — History & clinical context (8 items) → final refinement
Chronic diagnoses, current medications, recent vet visits, dental history, surgical/injury history, and optional vet-supplied bloodwork/organ findings, plus a free-text owner concern. All clinical items are opt-in — never required, never inferred.

**Reveals:** cumulative deficit burden that owner-observation alone misses — things already caught by a vet.
**Adds value:** final band ± ~0.8 years on the full 33-item FI — most accurate number, but slowest, which is why it's gated behind three rounds of buy-in.

## Status / known simplifications

- `EXPECTED_FI_ANCHORS` (young/middle/senior) and `DOG_SENIOR_ONSET` (size-based senior ages) are now literature-backed (Banzato et al. 2019; real senior-onset benchmarks) — no longer placeholders.
- `BETA`, `MAX_DELTA_YEARS`, `BRACHY_BREED_FI_MODIFIER`, `CHONDRO_BREED_FI_MODIFIER`, `CAT_DELTA_DAMPENING`, and `ACTIVITY_MINUTES_TABLE` remain illustrative placeholders — checked against public literature for this pass and confirmed that no source gives a numeric FI-delta-to-years coefficient, breed-modifier magnitude, size-stratified activity-minutes standard, or feline FI-age curve. Flagged inline with `ponytail:` comments; the model is isolated in one function/config block so these can be swapped in cleanly once real calibration data exists.
- **Citation note:** this README (and the original code comments) cited "Teng et al. 2024" for the calibration source; a later product-review pass referenced "McMillan et al. 2024" for the same claim. Neither could be verified as a real canine/feline frailty-index paper via public search in this pass — still unresolved, calibrating off Banzato et al. 2019 in the meantime rather than guessing.
- Reproductive status detail (intact + age, a life-table modifier per the spec) isn't broken out as its own field yet; sex/neuter status is captured at baseline.
- Cat model is explicitly dog-derived-plus-confidence-dampened (`CAT_DELTA_DAMPENING`), not independently calibrated — no quantitative feline FI-by-age data exists publicly yet. Wider uncertainty bands and the Cambridge 2017 human-year formula are implemented; labeled as estimates in the UI.
- The brachycephalic- and chondrodystrophic-breed lists and activity-minutes thresholds (including the new `ACTIVITY_BREED_OVERRIDES`) are substring/lookup-matched against free-text breed input and illustrative thresholds — not a structured breed database.
- The single headline age is a rounded, `~`-prefixed approximation shown alongside the underlying range, not a fully precise point value — a deliberate, product-directed change from "range only," not a removal of the wellness-framing guardrails.
- `age-service/` has no trained model — a real, running Flask service with a real endpoint contract, but `confidence: 0` until real weights exist. See "Photo-based age estimation" above and `age-service/README.md` for exactly why and what's needed to change that (licensing, dataset, GPU training time — none of which happen inside a coding session).
- `overweightPercentile`'s BCS 7/9 values are interpolated/extrapolated, not independently sourced (BCS 6/8 are the real cited anchors).
- Reference photos for the body-condition chart are placeholder hook points (`.bcs-photo-slot`, keyed by `imageHook`) — no images ship yet, by design, pending real photo assets.

## Testing

Pure scoring logic lives in `frailty-model.js` (no DOM dependency), tested with a zero-dependency Node script:

```
node test/frailty-model.test.js
```

Covers named fixtures: a bulldog with breed-typical findings (should not read prematurely old), a dachshund whose low activity is objectively surfaced by the minutes question and whose chondrodystrophic modifier is smaller than the bulldog's brachy modifier, a shih tzu (in both breed lists, gets the max modifier not the sum), a genuinely-declining great dane (proves the fix isn't one-directional), healthy senior dogs/cat (should not collapse toward a young estimate), cat-vs-dog delta dampening on identical inputs, size-based senior-guess ages, dog/cat human-year parity (Wang 2020 / Cambridge 2017), a young unhealthy dog (exercises the delta clamp), an unknown-DOB cat (confirms the size-based age-guess fallback lands in the correct life-stage bucket), breed-override activity thresholds, prevalence-anchored overweight percentiles, confidence-weighted age fusion (including the zero-confidence-signal-contributes-nothing case), the delta-as-percentage helper, and BCS chart data shape.

`age-service/` has its own zero-dependency-beyond-Flask test suite:

```
cd age-service && python test_app.py
```

Covers the health check and the `/estimate-age` contract (missing image, invalid image, and the honest untrained-model response shape).

## Run it

No build step. Either:

```
open index.html
```

or serve locally:

```
python -m http.server 8420
```

then visit `http://localhost:8420/index.html`.

Photo-based age estimation additionally needs `age-service/` running (`cd age-service && pip install -r requirements.txt && python app.py`, serves on port 5001) — optional; the questionnaire degrades gracefully to its other age signals if the service isn't running.

## Sources

Banzato et al. 2019 (*Sci. Rep.*, FI-by-age anchors); Loyal Canine Frailty Index; Montoya et al. 2023 (*Front. Vet. Sci.*, life expectancy / size-stratified senior-onset ages — not FI); Teng et al. 2024 / "McMillan et al. 2024" (unresolved citation, see Status note above); Cambridge 2017 (feline human-year formula); Wang et al. 2020 (canine human-year formula); AAHA/AAFP Life-Stage Guidelines; canine frailty-phenotype survival-time data (cited for internal validation of the vet-flag zone only, not shown in UI copy per the no-prognosis guardrail); Purina lifetime calorie-restriction study and general dog/cat obesity-prevalence stats (BCS deficit thresholds and `overweightPercentile` anchors); `szmazurek/Age_recognition_Cyfrovet` (evaluated as the requested photo-age-estimation source — see `age-service/README.md` for why it's an abstraction/interface today, not a running model).
