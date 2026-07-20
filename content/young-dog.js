/* Young-dog stage content. Exemplar breed: French Bulldog (BOAS).
   UMD-style export, matching frailty-model.js - works as
   <script src="content/young-dog.js"> and via require() from Node tests.

   `questions` entries are one of three things: a plain string (an existing
   PART1-4 question id, unchanged text - the loader resolves it against those
   arrays), an override object `{id, text}` (same id, so identical
   opts/dependsOn/scoring - "the same calculations" - just reworded for this
   stage/breed), or a full net-new question object (none needed for this
   stage). Overrides below reword breathing/skin/weight questions toward
   BOAS/brachycephalic-relevant framing and soften mob_gate away from
   aging-decline language that doesn't fit a young dog.

   MECE note: p2_cognition/p2_cognition_detail are deliberately excluded -
   canine cognitive dysfunction is an age-related syndrome (Salvin et al.
   2011; Madari et al. 2015) with no developmental relevance to young dogs,
   so asking about it here would be the exact "don't ask a puppy owner about
   senior stuff" problem this whole project pass exists to fix. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else { root.PawlStageContent = root.PawlStageContent || {}; root.PawlStageContent["young-dog"] = factory(); }
})(typeof self !== "undefined" ? self : this, function () {

const sources = [
  {id:"oneill2023osa", title:"Dog breeds and conformations predisposed to osteosarcoma in the UK: a VetCompass study", author:"O'Neill DG et al.", year:2023, url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC10294386/"},
  {id:"boas-fbdog", title:"BOAS prevalence and owner/veterinary-diagnosis gap in French Bulldogs (peer-reviewed prevalence study)", author:"see URL - specific author list not independently re-verified this pass", year:2022, url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC10702215/"},
  {id:"fgf4-chondro", title:"FGF4 retrogene insertion (12-FGF4RG) and disc calcification risk in chondrodystrophic breeds including French Bulldog", author:"Reunanen VLJ et al.", year:2025, url:"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12577395/"},
  {id:"gruenheid2018anesthesia", title:"Risk of anesthesia-related complications in brachycephalic dogs", author:"Gruenheid M et al.", year:2018, url:"https://pubmed.ncbi.nlm.nih.gov/30020004/"},
  {id:"glickman2000gdv", title:"Multiple risk factors for the gastric dilatation-volvulus syndrome in dogs", author:"Glickman LT et al.", year:2000, url:"https://doi.org/10.2460/javma.2000.216.40"},
  {id:"mayhew2004ivddrecurrence", title:"Risk factors for recurrence of clinical signs associated with thoracolumbar intervertebral disk herniation in dogs: 229 cases (1994-2000)", author:"Mayhew PD et al.", year:2004, url:"https://pubmed.ncbi.nlm.nih.gov/15521446/"},
];

const questions = [
  {id:"mob_gate", text:{both:"Any reluctance to keep up on runs or hikes, or stiffness after an active day?"}},
  "p1_activity", "p1_exhaustion", "p3_exercise_tolerance", "p3_muscle",
  "p2_vision", "p2_hearing", "p2_sleep", "p2_interaction", "p1_vitality",
  {id:"appetite_weight_gate", text:{both:"Weight creeping up now that growth has slowed but portions haven't, or any other appetite change?"}},
  "appetite_weight_detail",
  {id:"coat_dental_skin_gate", text:{both:"New skin-fold irritation, or dental tartar starting to build up?"}},
  "coat_dental_skin_detail",
  "water_urination_continence_gate", "water_detail",
  "p3_digestion",
  {id:"p3_breathing", text:{both:"Noisy or labored breathing, snoring, or reduced tolerance for heat and exercise?"}},
  {id:"temperature_pain_gate", text:{both:"New sensitivity to heat, flinching when touched, or vocalizing?"}},
  "discomfort_detail",
  "p4_gate", "p4_diagnoses", "p4_medications", "p4_vet_visits", "p4_dental_history",
  "p4_surgical_history", "p4_bloodwork", "p4_organ_findings", "p4_owner_concern",
];

const watchFor = [
  "Noisy or labored breathing, snoring, or reduced tolerance for heat/exercise - common brachycephalic-breed signs that show up well before a formal diagnosis",
  "Sudden reluctance to jump, yelping, or a hunched back - an early chondrodystrophic-breed spinal-disc signal worth a same-day vet call, not a wait-and-see",
  "Dental tartar building up unnoticed - easy to miss at this age since it rarely causes an obvious symptom yet",
];

/* Breed-conditional net-new modules (not asked at all unless the pet's
   breed/weight actually matches - a non-brachy young Labrador never sees
   the BOAS module). Phrased for a YOUNG dog specifically: BOAS signs framed
   as often just emerging, growth-plate risk framed around still-growing
   joints - a middle-aged or senior dog of the same breed gets differently-
   framed versions of these in middle-dog.js/senior-dog.js, not a copy-paste. */
const breedConditionalQuestions = [
  {tags:["brachycephalic"], questions:[
    {id:"boas_noisy_breathing", round:3, text:{both:"Loud snoring, snorting, or noisy breathing - even at rest or while asleep?"}},
    {id:"boas_heat_exercise", round:3, text:{both:"Gets more out of breath, or needs to stop, in warm weather or after only modest exercise?"}},
    {id:"boas_gi_signs", round:3, text:{both:"Frequent regurgitation, gagging, or vomiting shortly after eating or exercise?"}},
  ]},
  {tags:["giant"], questions:[
    {id:"giant_growth_exercise", round:1, text:{both:"Any limping after hard running or jumping, before they're fully done growing?"}},
  ]},
];

// Each tag below now carries up to 4 round-themed variants (mobility/senses/
// body/history, matching PART_META) instead of one fact repeated on every
// Results page - 2026-07-20, direct request. Same underlying condition per
// tag, a genuinely different real angle on it per round. Where research
// couldn't turn up a distinct, real, citable angle for a given round (see
// pawlonboarding.md's research pass), the note says so honestly instead of
// inventing one - same discipline this app already applies to calibration
// constants and the BCS-image licensing blocker.
const breedRiskNotes = [
  {tags:["brachycephalic"], round:"body",
    text:"Watch for noisy or labored breathing, snoring, or reduced heat/exercise tolerance. One peer-reviewed prevalence study found 64% of French Bulldogs showed owner-observable BOAS signs, but only 13% had a formal vet diagnosis - a real diagnostic gap this kind of question is meant to help close.",
    sourceIds:["boas-fbdog"]},
  {tags:["brachycephalic"], round:"mobility",
    text:"Reluctance to keep going on a walk, or needing to stop and rest sooner than you'd expect, is often the first practical sign of a narrowed airway working harder than it should - sometimes noticeable before the breathing itself sounds obviously abnormal.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"senses",
    text:"Sleep-disordered breathing - snoring with pauses, restless or interrupted sleep - is a well-recognized part of the same airway picture in flat-faced breeds, not just a nighttime nuisance noise.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"history",
    text:"Worth flagging to your vet before any sedation or anesthesia, even for something routine like a dental cleaning: one study found brachycephalic dogs had a postanesthetic complication rate of 13.9%, versus 3.6% in matched non-brachycephalic dogs.",
    sourceIds:["gruenheid2018anesthesia"]},

  {tags:["chondrodystrophic"], round:"mobility",
    text:"Chondrodystrophic breeds (Dachshunds, Corgis, Basset Hounds, French Bulldogs themselves) carry a real, breed-typical early spinal-disc risk (FGF4 retrogene-driven). Sudden reluctance to jump, yelping, or a hunched back at any age is worth a same-day vet call.",
    sourceIds:["fgf4-chondro"]},
  {tags:["chondrodystrophic"], round:"body",
    text:"Keeping body condition lean matters even more for these breeds than most - extra weight adds mechanical load onto a spine that's already structurally more disc-vulnerable, so drift on the body-condition score here isn't just a general weight issue.",
    sourceIds:[]},
  {tags:["chondrodystrophic"], round:"senses",
    text:"Early disc pain doesn't always look like limping - standard veterinary guidance is that reluctance to be picked up or handled, new irritability, or hiding can be the first sign, before any obvious mobility change shows up.",
    sourceIds:[]},
  {tags:["chondrodystrophic"], round:"history",
    text:"If there's ever been an episode before, recurrence is a real, documented risk worth tracking in their medical history - one study found about 19% of dogs had a recurrence after surgery overall, rising to roughly 25% specifically in Dachshunds, with 96% of recurrences happening within 3 years.",
    sourceIds:["mayhew2004ivddrecurrence"]},

  {tags:["giant"], round:"mobility",
    text:"Giant-breed puppies/young adults grow fast on a body frame that reaches full size quickly - keep an eye on any persistent limping or reluctance to exercise rather than assuming it's normal growing pains.",
    sourceIds:[]},
  {tags:["giant"], round:"body",
    text:"Panosteitis - a real, self-limiting bone inflammation sometimes called \"growing pains\" - shows up disproportionately in large/giant-breed puppies around 6-18 months old. It resolves on its own, but it's worth naming to your vet rather than assuming it's just clumsiness.",
    sourceIds:[]},
  {tags:["giant"], round:"senses",
    text:"No specific research links giant-breed size to senses or behavior changes at this young life stage - the general senses & behavior questions this round still apply the same way they would for any young dog.",
    sourceIds:[]},
  {tags:["giant"], round:"history",
    text:"Worth asking your vet about now, not later: giant, deep-chested breeds carry a real elevated lifetime risk of gastric dilatation-volvulus (bloat) - one study put lifetime risk in Great Danes at roughly 42%. Many vets discuss a preventive gastropexy at spay/neuter time for exactly this reason.",
    sourceIds:["glickman2000gdv"]},

  {tags:["generic"], round:"mobility",
    text:"No specific breed-risk flagged for this pet - the mobility & energy questions in this round still cover the most common young-dog concerns at this life stage.",
    sourceIds:[]},
  {tags:["generic"], round:"senses",
    text:"No specific breed-risk flagged for this pet - the senses, mind & behavior questions in this round still cover the most common young-dog concerns at this life stage.",
    sourceIds:[]},
  {tags:["generic"], round:"body",
    text:"No specific breed-risk flagged for this pet - the body-condition and breathing questions in this round still cover the most common young-dog concerns at this life stage.",
    sourceIds:[]},
  {tags:["generic"], round:"history",
    text:"No specific breed-risk flagged for this pet - the medical & vet-history questions in this round still cover the most common young-dog concerns at this life stage.",
    sourceIds:[]},
];

return {species:"dog", stage:"young", exemplarBreed:"French Bulldog", questions, watchFor, breedRiskNotes, breedConditionalQuestions, sources};

});
