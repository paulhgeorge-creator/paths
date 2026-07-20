/* Middle-dog stage content. Exemplar breed: Dachshund (IVDD).
   UMD-style export, matching frailty-model.js.

   MECE note: unlike young-dog, p2_cognition/p2_cognition_detail stay in the
   active set here - early cognitive decline can start pre-senior (see
   README's Round 2 framing), so excluding it at middle-age would create a
   gap rather than close one. The deeper, validated CADES/CCDR-style module
   is reserved for the senior-dog cell (see senior-dog.js) where cognitive
   decline is the dominant concern, not introduced early. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else { root.PawlStageContent = root.PawlStageContent || {}; root.PawlStageContent["middle-dog"] = factory(); }
})(typeof self !== "undefined" ? self : this, function () {

const sources = [
  {id:"fgf4-chondro", title:"FGF4 retrogene insertion (12-FGF4RG) and disc calcification risk in chondrodystrophic breeds", author:"Reunanen VLJ et al.", year:2025, url:"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12577395/"},
  {id:"oneill2023osa", title:"Dog breeds and conformations predisposed to osteosarcoma in the UK: a VetCompass study", author:"O'Neill DG et al.", year:2023, url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC10294386/"},
  {id:"gruenheid2018anesthesia", title:"Risk of anesthesia-related complications in brachycephalic dogs", author:"Gruenheid M et al.", year:2018, url:"https://pubmed.ncbi.nlm.nih.gov/30020004/"},
  {id:"glickman2000gdv", title:"Multiple risk factors for the gastric dilatation-volvulus syndrome in dogs", author:"Glickman LT et al.", year:2000, url:"https://doi.org/10.2460/javma.2000.216.40"},
  {id:"mayhew2004ivddrecurrence", title:"Risk factors for recurrence of clinical signs associated with thoracolumbar intervertebral disk herniation in dogs: 229 cases (1994-2000)", author:"Mayhew PD et al.", year:2004, url:"https://pubmed.ncbi.nlm.nih.gov/15521446/"},
];

const questions = [
  {id:"mob_gate", text:{both:"Any reluctance to jump, a hunched back, or sudden stiffness getting up?"}},
  "p1_activity", "p1_exhaustion", "p3_exercise_tolerance",
  {id:"p3_muscle", text:{both:"Visible loss of muscle over the back or hind legs, or dragging/wobbly rear legs?"}},
  "p2_vision", "p2_hearing", "p2_sleep", "p2_interaction", "p1_vitality",
  "p2_cognition", "p2_cognition_detail",
  {id:"appetite_weight_gate", text:{both:"Weight gain as metabolism has quietly started slowing, or any change in appetite?"}},
  "appetite_weight_detail",
  {id:"coat_dental_skin_gate", text:{both:"Dental tartar or gum changes building up, or new lumps/skin changes?"}},
  "coat_dental_skin_detail",
  "water_urination_continence_gate", "water_detail",
  "p3_digestion", "p3_breathing", "temperature_pain_gate", "discomfort_detail",
  "p4_gate", "p4_diagnoses", "p4_medications", "p4_vet_visits", "p4_dental_history",
  "p4_surgical_history", "p4_bloodwork", "p4_organ_findings", "p4_owner_concern",
];

const watchFor = [
  "Sudden back pain, reluctance to jump/climb, dragging or wobbly hind legs - an IVDD emergency sign in chondrodystrophic breeds, not a normal stiff-day",
  "Weight creeping up as metabolism quietly slows while feeding habits stay the same",
  "Early joint stiffness or reduced stamina on walks that wasn't there a year or two ago",
];

/* Breed-conditional net-new modules - only asked when the pet's breed
   actually matches. IVDD items go beyond mob_gate's reworded jump/hunch
   gate into specific neurologic signs (handling sensitivity, gait) that
   are the real vet-visit triggers per the FGF4/IVDD research. BOAS items
   reuse young-dog.js's module but framed as an established, ongoing
   condition ("still...") rather than an emerging one - the same breed
   trait reads differently depending on how long it's been going on. */
const breedConditionalQuestions = [
  {tags:["chondrodystrophic"], questions:[
    {id:"ivdd_handling", round:1, text:{both:"Crying out, flinching, or reluctance when picked up or touched along the back?"}},
    {id:"ivdd_gait", round:1, text:{both:"Front or hind legs dragging, knuckling under, or an unsteady/wobbly gait?"}},
  ]},
  {tags:["brachycephalic"], questions:[
    {id:"boas_noisy_breathing", round:3, text:{both:"Snoring or noisy breathing that's gotten louder or more frequent recently?"}},
    {id:"boas_heat_exercise", round:3, text:{both:"Still getting more out of breath in warm weather or after modest exercise, even if 'that's just how they've always been'?"}},
  ]},
];

// Round-themed variants (mobility/senses/body/history) per tag - 2026-07-20,
// same rationale as young-dog.js's breedRiskNotes header comment: a
// genuinely different real fact per Results page instead of one repeated.
const breedRiskNotes = [
  {tags:["chondrodystrophic"], round:"mobility",
    text:"Dachshunds and other chondrodystrophic breeds (Corgis, Basset Hounds, French Bulldogs) carry a real, breed-typical early spinal-disc risk (FGF4-driven). Sudden back pain, reluctance to jump, or dragging/wobbly hind legs is an IVDD emergency sign - same-day vet visit, not wait-and-see.",
    sourceIds:["fgf4-chondro"]},
  {tags:["chondrodystrophic"], round:"senses",
    text:"Early disc pain doesn't always look like limping - standard veterinary guidance is that reluctance to be handled, new irritability, or hiding can be the first sign, even before a limp or dragging leg shows up.",
    sourceIds:[]},
  {tags:["chondrodystrophic"], round:"body",
    text:"Keeping body condition lean matters more for these breeds than most at this age - metabolism naturally slows in the middle years, and extra weight adds mechanical load onto a spine that's already structurally more disc-vulnerable.",
    sourceIds:[]},
  {tags:["chondrodystrophic"], round:"history",
    text:"If there's ever been an episode before, recurrence is a real, documented risk worth tracking in their medical history - one study found about 19% of dogs had a recurrence after surgery overall, rising to roughly 25% specifically in Dachshunds, with 96% of recurrences happening within 3 years.",
    sourceIds:["mayhew2004ivddrecurrence"]},

  {tags:["brachycephalic"], round:"body",
    text:"Brachycephalic breeds (French Bulldogs, Pugs, Bulldogs) can still show BOAS-type breathing signs well into middle age, not just as puppies - noisy breathing, reduced heat tolerance, or exercise avoidance are worth mentioning at a checkup even if they've 'always been like that.'",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"mobility",
    text:"Reluctance to keep going on a walk, or needing to stop and rest sooner than a same-size non-brachycephalic dog would, can be a practical sign of an airway working harder than it should - easy to write off as just 'slowing down' at this age.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"senses",
    text:"Sleep-disordered breathing - snoring with pauses, restless or interrupted sleep - is a well-recognized part of the same airway picture in flat-faced breeds, and it's easy to mistake for just being an unusually loud sleeper.",
    sourceIds:[]},
  {tags:["brachycephalic"], round:"history",
    text:"Worth flagging to your vet before any sedation or anesthesia, even for something routine like a dental cleaning: one study found brachycephalic dogs had a postanesthetic complication rate of 13.9%, versus 3.6% in matched non-brachycephalic dogs.",
    sourceIds:["gruenheid2018anesthesia"]},

  {tags:["giant"], round:"body",
    text:"Giant breeds are already approaching their earlier senior-onset window at this stage (they age on a compressed timeline) - joint stiffness or reduced stamina that would be unremarkable in a small-breed middle-aged dog deserves a closer look here.",
    sourceIds:[]},
  {tags:["giant"], round:"mobility",
    text:"Reduced willingness to jump or take stairs can show up here earlier than it would in a smaller breed - a large frame's own body weight adds real joint load over time, independent of any specific injury.",
    sourceIds:[]},
  {tags:["giant"], round:"senses",
    text:"Giant breeds' whole life-stage timeline runs compressed relative to small breeds (shorter overall lifespan, earlier senior onset) - so behavior changes that would be unusual at this chronological age in a smaller dog aren't necessarily unusual here.",
    sourceIds:[]},
  {tags:["giant"], round:"history",
    text:"Worth confirming your vet is already aware: giant, deep-chested breeds carry a real elevated lifetime risk of gastric dilatation-volvulus (bloat) - one study put lifetime risk in Great Danes at roughly 42%. If a preventive gastropexy hasn't come up before, now's a reasonable time to ask.",
    sourceIds:["glickman2000gdv"]},

  {tags:["generic"], round:"mobility",
    text:"No specific breed-risk flagged for this pet - the mobility & energy questions in this round still cover the most common middle-age concerns.",
    sourceIds:[]},
  {tags:["generic"], round:"senses",
    text:"No specific breed-risk flagged for this pet - the senses, mind & behavior questions in this round still cover the most common middle-age concerns.",
    sourceIds:[]},
  {tags:["generic"], round:"body",
    text:"No specific breed-risk flagged for this pet - the general weight and organ-signal questions in this round still cover the most common middle-age concerns.",
    sourceIds:[]},
  {tags:["generic"], round:"history",
    text:"No specific breed-risk flagged for this pet - the medical & vet-history questions in this round still cover the most common middle-age concerns.",
    sourceIds:[]},
];

return {species:"dog", stage:"middle", exemplarBreed:"Dachshund", questions, watchFor, breedRiskNotes, breedConditionalQuestions, sources};

});
