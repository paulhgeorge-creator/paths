/* Young-cat stage content. Exemplar breed: Persian (polycystic kidney
   disease / PKD). UMD-style export, matching frailty-model.js.

   Research finding this content is built around: PKD in Persians is real
   and well-documented (prevalence studies in the 25-37% range), but average
   symptomatic-onset age is ~7 years (middle-age, not young) and cysts
   aren't reliably ultrasound-detectable before ~10 months. So this stage
   deliberately does NOT add a kidney-symptom question - that would ask a
   young-cat owner about something that mostly hasn't happened yet. Instead
   the breed-risk note below frames PKD as a genetic-testing/screening-
   history topic, which IS relevant now (screening can happen young even
   though symptoms mostly can't). No new scored question was added here -
   this stays within the CEO-review-approved scope (only senior-dog
   cognition and senior-cat mobility got net-new scored modules).

   MECE note: p2_cognition/p2_cognition_detail excluded, same reasoning as
   young-dog.js - no developmental relevance to a young cat. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else { root.PawlStageContent = root.PawlStageContent || {}; root.PawlStageContent["young-cat"] = factory(); }
})(typeof self !== "undefined" ? self : this, function () {

const sources = [
  {id:"pkd-mexico", title:"Prevalence of the PKD1 10063C>A SNP in Persian and Persian-related cats (western Mexico)", author:"see URL", year:2019, url:"https://pubmed.ncbi.nlm.nih.gov/31531040/"},
  {id:"pkd-iran", title:"Sonographic screening for polycystic kidney disease in Persian and Persian-related cats", author:"see URL", year:2019, url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC10812362/"},
];

const questions = [
  "mob_gate", "p1_activity", "p1_exhaustion", "p3_exercise_tolerance", "p3_muscle",
  "p2_vision", "p2_hearing", "p2_sleep", "p2_interaction", "p1_vitality",
  {id:"appetite_weight_gate", text:{both:"Any change in appetite, or weight gain from a mostly indoor/sedentary routine?"}},
  "appetite_weight_detail",
  {id:"coat_dental_skin_gate", text:{both:"Early dental tartar building up, or any coat/skin changes?"}},
  "coat_dental_skin_detail",
  "water_urination_continence_gate", "water_detail",
  "p3_digestion",
  "p3_breathing",
  "temperature_pain_gate", "discomfort_detail",
  "p4_gate", "p4_diagnoses", "p4_medications", "p4_vet_visits", "p4_dental_history",
  "p4_surgical_history", "p4_bloodwork", "p4_organ_findings", "p4_owner_concern",
];

const watchFor = [
  "Whether a genetic test or kidney ultrasound has ever been done - worth asking your vet about now, even though symptoms themselves are rare at this age",
  "Noisy or labored breathing, snoring, or reduced heat/exercise tolerance in flat-faced breeds",
  "Litter-box habits or scratching patterns forming the wrong way early on",
];

/* Breed-conditional net-new modules - only asked for flat-faced cats
   (Persian and similar), not every young cat. The PKD item is a
   screening-history question (round 4, alongside the other opt-in vet-
   history items) rather than a symptom question - matches the research
   finding that PKD is mostly asymptomatic at this age, so asking "have you
   screened" is the honest, actionable question here, not "any symptoms". */
const breedConditionalQuestions = [
  {tags:["brachycephalic"], questions:[
    {id:"pkd_screening_history", round:4, text:{both:"Has a vet ever run a kidney ultrasound or PKD genetic test on this cat?"}, opts:[{v:0,label:"Yes, tested/screened"},{v:1,label:"No / not sure"}]},
    {id:"facial_fold_tear_staining", round:3, text:{both:"Persistent tear staining, or irritation in facial skin folds?"}},
    {id:"boas_noisy_breathing_cat", round:3, text:{both:"Noisy breathing or snoring, especially in warm weather?"}},
  ]},
];

// Round-themed variants (mobility/senses/body/history) for the brachycephalic
// (PKD) and generic tags - 2026-07-20, same rationale as young-dog.js's
// breedRiskNotes header comment. chondrodystrophic stays a single note
// (that tag never actually matches any real cat breed - petBreedTags() is
// dog-only for it - so it's unreachable content; not worth the effort of
// expanding something that can never render).
const breedRiskNotes = [
  {tags:["brachycephalic"], round:"body",
    text:"Persians and other flat-faced cat breeds can carry real, well-documented polycystic kidney disease risk - genetic testing or an ultrasound screen is worth asking your vet about now, even though symptoms themselves typically don't show up until later (average onset around age 7). Flat-faced breathing signs (noisy breathing, reduced heat tolerance) are worth watching separately from the kidney question.",
    sourceIds:["pkd-mexico","pkd-iran"]},
  {tags:["brachycephalic"], round:"mobility",
    text:"No specific PKD-related mobility concern applies at this young life stage - kidney symptoms typically don't emerge until around age 7, so the general mobility & energy questions this round still apply the same way they would for any young cat.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"senses",
    text:"Once symptoms do eventually start (typically not until middle age), increased thirst or more trips to the water bowl/litter box tends to be the first noticeable sign - worth knowing what to watch for later, even though there's nothing to flag yet at this age.",
    sourceIds:["pkd-mexico"]},
  {tags:["brachycephalic"], round:"history",
    text:"Ask your vet about genetic testing or an ultrasound screen now, even though symptoms won't show for years - having a screening result on record in their medical history before anything becomes symptomatic is exactly the kind of thing worth doing early.",
    sourceIds:["pkd-mexico","pkd-iran"]},

  {tags:["chondrodystrophic"],
    text:"Chondrodystrophic-pattern breeds are rarer among cats than dogs, but if applicable, sudden reluctance to jump or a hunched posture at any age is worth a same-day vet call rather than a wait-and-see.",
    sourceIds:[]},

  {tags:["generic"], round:"mobility",
    text:"No specific breed-risk flagged for this pet - the general mobility & energy questions in this round still cover the most common young-cat concerns.",
    sourceIds:[]},
  {tags:["generic"], round:"senses",
    text:"No specific breed-risk flagged for this pet - the senses, mind & behavior questions in this round still cover the most common young-cat concerns.",
    sourceIds:[]},
  {tags:["generic"], round:"body",
    text:"No specific breed-risk flagged for this pet - the breathing and body-condition questions in this round still cover the most common young-cat concerns.",
    sourceIds:[]},
  {tags:["generic"], round:"history",
    text:"No specific breed-risk flagged for this pet - the medical & vet-history questions in this round still cover the most common young-cat concerns.",
    sourceIds:[]},
];

return {species:"cat", stage:"young", exemplarBreed:"Persian", questions, watchFor, breedRiskNotes, breedConditionalQuestions, sources};

});
