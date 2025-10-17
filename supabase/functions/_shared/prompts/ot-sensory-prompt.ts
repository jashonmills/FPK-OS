/**
 * Specialized extraction prompt for OT Sensory Profiles
 * Extracts ALL 7 sensory modality scores with seeking/avoiding patterns
 */

export const OT_SENSORY_PROFILE_PROMPT = `You are analyzing an **Occupational Therapy Sensory Profile** or **Sensory Processing Assessment**. This requires extraction of scores for ALL 7 sensory modalities.

## CRITICAL: THE 7 SENSORY MODALITIES (MUST EXTRACT ALL)

You MUST look for scores/levels for each of these modalities:

1. **Auditory (Sound Processing)**
   - Seeking: Likes loud noises, makes vocal sounds
   - Avoiding: Covers ears, distressed by noise
   - Score/Level: Extract numeric score OR descriptor ("Typical," "More Than Others," "Much More Than Others," "Less Than Others," "Much Less Than Others")

2. **Visual (Sight Processing)**
   - Seeking: Stares at lights, prefers bright colors
   - Avoiding: Avoids eye contact, bothered by bright lights
   - Score/Level

3. **Tactile (Touch Processing)**
   - Seeking: Touches everything, likes messy play
   - Avoiding: Dislikes certain textures, refuses to get hands dirty
   - Score/Level

4. **Vestibular (Movement/Balance)**
   - Seeking: Always moving, loves spinning/swinging
   - Avoiding: Fears movement, becomes nauseated easily
   - Score/Level

5. **Proprioceptive (Body Awareness)**
   - Seeking: Crashes into things, seeks deep pressure
   - Avoiding: Avoids physical activity, appears "floppy"
   - Score/Level

6. **Gustatory (Taste Processing)**
   - Seeking: Chews on non-food items, prefers strong flavors
   - Avoiding: Extremely picky eater, limited food repertoire
   - Score/Level

7. **Olfactory (Smell Processing)**
   - Seeking: Smells everything, attracted to strong scents
   - Avoiding: Bothered by smells others don't notice
   - Score/Level

## COMMON SENSORY PROFILE TESTS

### Sensory Profile 2 (SP-2)
**Scores are T-scores (mean=50, SD=10):**
- Typical Performance: T=40-60
- More Than Others: T=61-69
- Much More Than Others: T≥70
- Less Than Others: T=31-39
- Much Less Than Others: T≤30

**Extract:**
- quadrant_scores: Seeking, Avoiding, Sensitivity, Registration
- sensory_section_scores: For each modality listed above
- behavioral_section_scores (if provided)

### Sensory Processing Measure (SPM)
**Scores are T-scores:**
- Typical: T<60
- Some Problems: T=60-69
- Definite Dysfunction: T≥70

### Adolescent/Adult Sensory Profile
**Uses descriptive categories:**
- Low Registration, Sensation Seeking, Sensory Sensitivity, Sensation Avoiding

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Auditory Processing",
      "metric_type": "sensory_profile",
      "metric_value": 68,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: More Than Others (T=61-69). Child is auditory-seeking - makes vocal sounds, enjoys loud music.",
      "target_value": 50
    },
    {
      "metric_name": "Visual Processing",
      "metric_type": "sensory_profile",
      "metric_value": 52,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: Typical Performance. No concerns noted.",
      "target_value": null
    },
    {
      "metric_name": "Tactile Processing",
      "metric_type": "sensory_profile",
      "metric_value": 28,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: Much Less Than Others (T≤30). Child is tactile-avoiding - refuses to touch messy textures, distressed by clothing tags.",
      "target_value": 50
    },
    {
      "metric_name": "Vestibular Processing",
      "metric_type": "sensory_profile",
      "metric_value": 72,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: Much More Than Others (T≥70). Child is vestibular-seeking - constantly in motion, loves swinging and spinning.",
      "target_value": 50
    },
    {
      "metric_name": "Proprioceptive Processing",
      "metric_type": "sensory_profile",
      "metric_value": 75,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: Much More Than Others. Child seeks deep pressure, crashes into furniture, chews on objects.",
      "target_value": 50
    },
    {
      "metric_name": "Gustatory Processing",
      "metric_type": "sensory_profile",
      "metric_value": 32,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: Less Than Others. Limited food repertoire - avoids mixed textures and strong flavors.",
      "target_value": 50
    },
    {
      "metric_name": "Olfactory Processing",
      "metric_type": "sensory_profile",
      "metric_value": 48,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Range: Typical Performance. No concerns noted.",
      "target_value": null
    },
    {
      "metric_name": "Sensation Seeking Quadrant",
      "metric_type": "sensory_quadrant",
      "metric_value": 70,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Child demonstrates high sensation seeking - actively looks for sensory input (movement, sound, touch).",
      "target_value": 50
    },
    {
      "metric_name": "Sensation Avoiding Quadrant",
      "metric_type": "sensory_quadrant",
      "metric_value": 65,
      "metric_unit": "T-score",
      "measurement_date": "2025-01-15",
      "context": "Sensory Profile 2. Child demonstrates moderate sensation avoiding - particularly with tactile and gustatory input.",
      "target_value": 50
    }
  ],
  "insights": [
    {
      "title": "Mixed Sensory Profile: Seeking + Avoiding",
      "content": "Child displays a mixed sensory profile - high seeking for vestibular/proprioceptive input (T=72-75) but avoidance of tactile/gustatory input (T=28-32). This creates challenges in daily routines (dressing, mealtimes) while child constantly seeks movement.",
      "priority": "high",
      "insight_type": "sensory_pattern"
    },
    {
      "title": "Recommended Sensory Diet",
      "content": "OT recommends sensory diet including: (1) Heavy work activities every 90 minutes (pushing, pulling, carrying), (2) Fidget tools for proprioceptive input, (3) Gradual tactile desensitization program, (4) Food chaining approach to expand diet.",
      "priority": "high",
      "insight_type": "intervention_recommendation"
    }
  ],
  "progress": [
    {
      "metric_type": "sensory_regulation",
      "current_value": 3,
      "target_value": 7,
      "baseline_value": 3,
      "trend": "stable",
      "notes": "Baseline established. Child demonstrates difficulty with sensory modulation - both seeking and avoiding patterns present. Goal: improve regulation to allow participation in daily activities with minimal distress."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ALL 7 MODALITIES ARE MANDATORY**: If the document doesn't provide a score for a modality, note it in insights as "Data not available for [modality]"
2. **EXTRACT EXACT SCORES**: T-scores, raw scores, percentiles - whatever is provided. NUMERIC VALUES ONLY in metric_value field.
3. **INCLUDE SEEKING/AVOIDING DESCRIPTOR**: "Seeking," "Avoiding," "Sensitive," "Low Registration" in context field ONLY
4. **QUADRANT SCORES MATTER**: Extract Seeking, Avoiding, Sensitivity, Registration if provided
5. **BEHAVIORAL IMPACTS**: If the report describes how sensory issues affect daily life (eating, dressing, school), extract as insights
6. **RECOMMENDED STRATEGIES**: OT sensory profiles ALWAYS include intervention recommendations - extract these as insights
7. **DO NOT INFER SCORES**: If the report says "Child has tactile defensiveness" but doesn't provide a numeric score, create a qualitative insight, not a fake metric
8. **STRICT NUMERIC ENFORCEMENT**: metric_value and target_value MUST be pure numbers (integers or decimals) or NULL. Text values like "Much More Than Others" MUST go in context field only. Database will reject text in numeric fields.

## COMMON SECTION HEADERS
- "Sensory Profile Results"
- "Sensory Processing Patterns"
- "Quadrant Analysis" (Seeking, Avoiding, Sensitivity, Registration)
- "Sensory Modulation"
- "Behavioral Responses to Sensory Input"
- "Sensory-Based Recommendations"
- "Sensory Diet Recommendations"
- "Environmental Modifications"`;
