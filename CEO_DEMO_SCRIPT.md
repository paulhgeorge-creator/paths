# CEO Demo Script — Pawl (Pet Vitals)

Target: 6-8 min live walkthrough + buffer for questions. A 3-min tight cut is marked where you can skip.

## Before you walk in

- Open `index.html` fresh in a clean browser tab (no leftover state from testing). Full-screen the window.
- If you want to show the AI concern-analyzer (step 6, optional), start `concern-service` first: `cd concern-service && python app.py` with `ANTHROPIC_API_KEY` set. Skip step 6 entirely if you don't want to depend on a running service mid-demo.
- Know your one-sentence framing going in: **"A pet health check-up that's genuinely tailored per breed and life stage, presented the way WHOOP presents human recovery data — not another generic pet quiz."**

---

## 1. Open on the path chooser (30 sec)

Land on "Try a survey path." Don't click "manual setup" — the 6 presets exist specifically so you never have to type anything live.

**Say:** "Every path here pre-fills a real representative pet — same survey engine, same scoring, but the questions and breed content underneath are genuinely different per cell. Watch."

**Click: "Young Dog (French Bulldog)"**

## 2. The breed-specific guide — Aito (90 sec, the strongest single moment)

Click "Continue" on the BCS step. On Part 1, **actually answer the questions** — click "A little" on the question buttons and type a number like `25` into the activity-minutes field — then continue to Result 1.

**Important:** don't just click straight through without answering anything. With zero questions answered, the score defaults to a hollow "100/Thriving" (no data reads as "no deficits found," not as an incomplete assessment) — confusing to explain live. Answering even one round's worth of questions gives a real, credible result (verified live: comes out around 63/100, "Needs a little attention," amber ring) that's a much better demo moment anyway — it shows the score actually responding to input instead of looking suspiciously perfect.

**Say, pointing at the guide bubble:** "This is Aito. He only shows up on dog paths — there's a cat equivalent, Miso, who never appears here. He's not generic advice — he's citing a real peer-reviewed prevalence study specifically about French Bulldogs: 64% of owners spot labored breathing, but only 13% get it formally diagnosed. That's a real diagnostic gap, and the app is designed to help close it — not just flag a symptom, but explain *why it matters for this exact breed* with a source you can click."

This is the moment that separates "quiz app" from "product with a point of view." Let it land before moving on.

## 3. The results page itself (60 sec)

**Say:** "We rebuilt this page from a WHOOP teardown — did real research on how they communicate status, not just copied the look. One score, color-coded, front and center. Everything else — the breed guide, the trend, the category detail — stays visible, just organized so it doesn't read as a wall of text anymore."

Point at: the big color ring and zone label (color/label reflects whatever you actually answered — don't script the exact word, just point at it), the age-trend line chart underneath (mention it's tracking the physiological-age estimate sharpening as more rounds get answered), and the recommendation card actually referencing the real activity number you typed in — it's reacting to input live, not showing static copy.

## 4. Prove it generalizes — switch to a cat (60 sec)

Get back to the path chooser: there's no shortcut link from the Results page (that link only appears on the Dev Breakdown page, which you'll see in step 5) — simplest is to just reload the tab (Ctrl+R / Cmd+R), which always resets to the path chooser.

**Click: "Young Cat (Persian)"**, continue through BCS to Part 1. **This time click "Not at all"** on the mobility question (verified live: the middle "A little" option on this specific cat question tips into the red "Talk to your vet" zone with a warning banner — fine on its own, but not the moment you want live, so use the mildest option here specifically), fill the activity minutes with something like `15`, continue to Result 1.

**Say:** "Same architecture, completely different guide and completely different content — Miso, and a real PKD (polycystic kidney disease) citation specific to Persians. This isn't one hardcoded breed bit — it's a real matching pipeline across breed, weight, and life stage that we've now proven out on both species."

*(3-min cut: skip straight to step 5 from here if you're short on time.)*

## 5. The credibility card — Dev Breakdown (90 sec, second-strongest moment)

Click **"View full decision breakdown (developer)."**

**Say:** "This is the one I'd show if anyone in the room asks 'is this a black box?' It's not. Every category score, the actual curve the Longevity Score comes from — not a description of it, the literal function, plotted, with this pet's exact point marked on it. Age and breed feed a separate, clearly-labeled metric — the Health Multiplier — so we're not quietly mixing two different claims into one number. Full audit trail of every answer underneath."

This is the page that reads as *rigor*, not consumer gloss — good to have ready if the CEO or anyone technical pokes at "how do you actually compute this."

**Heads up, verified live**: the number in the "Final computed result" card at the bottom of this page can legitimately differ from the score you just saw on the Results page — the Results page shows a per-round score (just that round's category), while this page always pools *every* category answered so far, including the BCS step you did before Round 1 even started. Not a bug, but if anyone asks "wait, why don't these two numbers match," the answer is exactly that: one is "this round alone," the other is "everything answered so far." Simplest way to avoid the question entirely: don't dwell on the exact number on either page, gesture at the shapes/charts instead.

## 6. (Optional, if concern-service is running) The AI layer — 45 sec

Continue any path through to Round 4 (Part 4) — answer the medical-history gate question "yes" so the optional free-text field appears: "In your own words - anything else worrying you?" Type a quick concern like *"he's been drinking a lot more water lately and seems less interested in walks"* and show the extracted highlights.

**Say:** "This is a real Claude call, not a mockup — pulls out the distinct concerns from free text without ever diagnosing anything. It's optional and degrades silently if the service isn't running — nothing breaks the flow either way."

Skip this step entirely if you don't want a live dependency in the room. Also worth knowing: getting here live means clicking through Rounds 2 and 3 first (each has several question groups) — if you want this moment, it's much safer to have a **second browser tab pre-staged at Round 4 before the meeting starts** than to click through two full rounds live and risk fumbling.

## 7. Close (30 sec)

**Say:** "Every number in here traces back to something real — cited studies for the breed content, a documented, tested scoring model, and we've been explicit internally about exactly which constants are still placeholders pending real calibration data, rather than pretending everything's final. That's the posture I want this to have: ambitious on personalization, honest about where the science still needs to catch up."

---

## Anticipated questions

- **"Is the science real or made up?"** — Breed-risk content is cited (sources shown inline, clickable). Core scoring model has some placeholder constants, flagged explicitly in the codebase and README — not hidden. Point to the Dev Breakdown page as proof you're not hiding the math.
- **"What's the moat here?"** — The breed×life-stage content matrix (6 real distinct content sets, not templated), the guide-character personalization layer, and the transparency page together — most competitors do one of these, not all three.
- **"What's next?"** — Wearable integration UI already exists as a real placeholder (not wired to a live device yet), per-BCS-point reference photography is blocked on licensing (WSAVA permission process, not a technical gap), calibration constants need real veterinary partnership data.
- **"Does this need a backend?"** — No, by design. Fully static/offline except one optional AI feature (owner concern text), which fails gracefully with zero impact on the rest of the flow if it's not running.
