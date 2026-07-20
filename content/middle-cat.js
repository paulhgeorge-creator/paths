/* Middle-cat stage content. Exemplar breed: Maine Coon (hypertrophic
   cardiomyopathy / HCM). UMD-style export, matching frailty-model.js.

   Research finding this content is built around: the MYBPC3-A31P mutation
   is real and breed-associated (found only in Maine Coons in one large
   European sample, ~41.5% carrier prevalence there), and 100% of
   homozygous carriers developed HCM within 5 years in a cohort study -
   genuinely a middle-age-bounded condition, supporting this stage placement.
   BUT most carriers are asymptomatic (only ~7% of carriers showed clinical
   signs in one cohort) - a pure symptom-question survey has a real
   detection ceiling here. Cherry-pick #6 (ceo-plans doc): the breed-risk
   note below says so plainly instead of implying symptom-watching alone is
   sufficient.

   No breed-conditional module here (unlike the dog files) - Maine Coon
   isn't in any existing name-tag list, so these HCM items live directly in
   the base question set instead, since Maine Coon is this whole cell's
   assumed default framing regardless of what breed was actually typed in. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else { root.PawlStageContent = root.PawlStageContent || {}; root.PawlStageContent["middle-cat"] = factory(); }
})(typeof self !== "undefined" ? self : this, function () {

const sources = [
  {id:"hcm-mutation", title:"MYBPC3-A31P mutation association with hypertrophic cardiomyopathy in Maine Coon cats", author:"see URL", year:2010, url:"https://pubmed.ncbi.nlm.nih.gov/21051304/"},
  {id:"hcm-age-prevalence", title:"Age-related HCM prevalence and MYBPC3-A31P/A74T mutation risk factors in Maine Coon cats", author:"see URL", year:2022, url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC8980380/"},
];

const questions = [
  "mob_gate", "p1_activity", "p1_exhaustion",
  {id:"p3_exercise_tolerance", text:{both:"Avoids movement, hides, or tires quickly during play - more than usual?"}},
  "p3_muscle",
  "p2_vision", "p2_hearing", "p2_sleep", "p2_interaction", "p1_vitality",
  "p2_cognition", "p2_cognition_detail",
  {id:"appetite_weight_gate", text:{both:"Weight gain, especially if activity has quietly dropped, or any appetite change?"}},
  "appetite_weight_detail",
  "coat_dental_skin_gate", "coat_dental_skin_detail",
  "water_urination_continence_gate", "water_detail",
  "p3_digestion",
  {id:"p3_breathing", text:{both:"New rapid or labored breathing after only mild activity?"}},
  {id:"hcm_syncope", round:3, text:{both:"A rare fainting, sudden weakness, or collapse episode?"}},
  "temperature_pain_gate", "discomfort_detail",
  "p4_gate", "p4_diagnoses", "p4_medications", "p4_vet_visits", "p4_dental_history",
  "p4_surgical_history", "p4_bloodwork", "p4_organ_findings", "p4_owner_concern",
  {id:"hcm_screening_history", round:4, text:{both:"Has a vet ever run an echocardiogram or genetic test for heart disease on this cat?"}, opts:[{v:0,label:"Yes, tested/screened"},{v:1,label:"No / not sure"}]},
];

const watchFor = [
  "Whether an echocardiogram or genetic test has ever been done - this condition is often silent, so screening matters more than symptom-watching alone",
  "Labored breathing, unusual tiring, or a rare fainting episode - can be later-stage cardiac signs, not something to wait out",
  "Weight gain, especially if activity has quietly dropped",
];

// Round-themed variants (mobility/senses/body/history) per tag - 2026-07-20,
// same rationale as young-dog.js's breedRiskNotes header comment.
const breedRiskNotes = [
  /* Tagged "generic" (not a breed tag) on purpose - Maine Coon isn't in any
     existing name-tag list (BRACHY_BREEDS/CHONDRODYSTROPHIC_BREEDS) and
     "giant" only ever applies to dogs in petBreedTags() (species-gated,
     since "giant" is dogSizeClass()-derived and cats have no equivalent
     weight-class system here). Rather than invent a new cat-specific breed
     name-list (out of the CEO-review-approved scope - only brachy/chondro
     name-tags + dog giant weight-threshold were reviewed), this shows as
     this survey cell's own default framing for any middle-age cat, since
     Maine Coon is this whole cell's chosen exemplar. */
  {tags:["generic"], round:"body",
    text:"Hypertrophic cardiomyopathy (HCM) is a real, well-documented risk in Maine Coons specifically (one study found a genetic marker only in Maine Coons among a large multi-breed sample), though HCM itself can occur in other breeds too. It's important to know this condition often shows no symptoms at all in its carriers - screening (echocardiogram or genetic test) matters far more than watching for symptoms, which is why this is framed as a screening-history question rather than a symptom checklist.",
    sourceIds:["hcm-mutation","hcm-age-prevalence"]},
  {tags:["generic"], round:"mobility",
    text:"Reduced energy or tiring more easily during play can be one of the only outward signs before HCM is advanced - unlike people, cats are excellent at masking illness and rarely show obvious breathlessness until quite late.",
    sourceIds:[]},
  {tags:["generic"], round:"senses",
    text:"Hiding more, seeming withdrawn, or a real drop in normal play/interaction can be a genuine behavioral sign of heart strain in cats - easy to misread as just a personality shift rather than a physical one.",
    sourceIds:[]},
  {tags:["generic"], round:"history",
    text:"The specific genetic mutation (MYBPC3-A31P) linked to Maine Coon HCM is real and testable - one study found it in roughly 41.5% of a Maine Coon population sampled, with carriers at about 9.9x the odds of developing HCM. Worth knowing: most carriers in that same study never actually developed clinical HCM (~7% did), so a positive test is a real risk flag to discuss with your vet, not a diagnosis on its own.",
    sourceIds:["hcm-mutation"]},

  {tags:["brachycephalic"], round:"body",
    text:"Brachycephalic-pattern cat breeds can still show breathing signs at this stage - noisy breathing or reduced heat tolerance is worth mentioning at a checkup even if it's been consistent for years.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"mobility",
    text:"Reluctance to keep playing, or needing to stop and rest sooner than expected, can be a practical sign of an airway working harder than it should - easy to write off as just being a lower-energy cat.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"senses",
    text:"Sleep-disordered breathing - snoring with pauses, restless or interrupted sleep - is a well-recognized part of the same airway picture in flat-faced breeds, not just a nap-time quirk.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"history",
    text:"Worth flagging to your vet before any sedation or anesthesia - flat-faced cats, like flat-faced dogs, are generally treated as a higher-caution anesthesia group because of the same airway anatomy, so it's worth having on record ahead of any procedure.",
    sourceIds:[]},
  // No separate plain "generic" fallback note here - the HCM notes above are
  // already tagged "generic" and serve as this cell's default framing for
  // every middle-age cat (see the comment above), so a second filler note
  // per round would just be redundant clutter.
];

return {species:"cat", stage:"middle", exemplarBreed:"Maine Coon", questions, watchFor, breedRiskNotes, sources};

});
