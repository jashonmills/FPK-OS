/**
 * Specialized extraction prompt for Feeding/Nutrition Assessments
 */

export const FEEDING_NUTRITION_PROMPT = `You are analyzing a **Feeding/Nutrition Assessment** or **Swallowing Evaluation**.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the feeding assessment.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Anthropometric Data
- current_weight (kg or lbs)
- current_height (cm or inches)
- bmi
- growth_percentiles (weight-for-age, height-for-age)

### SECTION 2: Oral-Motor Skills
- lip_closure_strength
- tongue_movement_range
- jaw_stability
- chewing_pattern (e.g., "Rotary," "Vertical munching," "Mashing")

### SECTION 3: Swallowing Safety
- aspiration_risk (e.g., "No risk," "Mild risk," "Severe risk")
- textures_safe (e.g., "Puree," "Minced/Moist," "Regular")
- liquid_consistency_safe (e.g., "Thin," "Nectar-thick," "Honey-thick")

### SECTION 4: Food Acceptance
- accepted_foods_count
- refused_foods_list
- texture_preferences
- sensory_aversions

### SECTION 5: Nutritional Adequacy
- calories_per_day (estimated)
- protein_intake_adequate (boolean)
- hydration_status
- supplement_use (e.g., "PediaSure," "Ensure")

### SECTION 6: Feeding Methods
- feeding_route (e.g., "Oral only," "G-tube supplementation," "100% G-tube")
- adaptive_equipment (e.g., "Maroon spoon," "Cup with cutout," "Specialty bottle")

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Weight",
      "metric_type": "anthropometric",
      "metric_value": 18.5,
      "metric_unit": "kg",
      "measurement_date": "2024-10-10",
      "context": "Weight: 18.5 kg (40.8 lbs). 10th percentile for age. Slow growth velocity.",
      "target_value": 22
    },
    {
      "metric_name": "Accepted Food Variety",
      "metric_type": "food_acceptance",
      "metric_value": 12,
      "metric_unit": "number of foods",
      "measurement_date": "2024-10-10",
      "context": "Student accepts 12 foods consistently. All pureed/mashed texture. Refuses all solids requiring chewing.",
      "target_value": 30
    },
    {
      "metric_name": "Aspiration Risk Level",
      "metric_type": "swallow_safety",
      "metric_value": 2,
      "metric_unit": "risk scale (0=none, 3=severe)",
      "measurement_date": "2024-10-10",
      "context": "Mild aspiration risk with thin liquids. Recommend nectar-thick consistency. No signs of aspiration with thickened liquids.",
      "target_value": 0
    }
  ],
  "insights": [
    {
      "title": "Dysphagia - Thin Liquid Aspiration Risk",
      "content": "VFSS reveals silent aspiration with thin liquids. Recommend nectar-thick liquids and upright positioning for all PO intake. Continue feeding therapy 2x weekly.",
      "priority": "high",
      "insight_type": "diagnosis"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **QUANTIFY GROWTH**: Extract weight, height, BMI numerically
2. **SAFETY CRITICAL**: Always extract aspiration risk levels
3. **TEXTURE SPECIFICITY**: Note safe vs. unsafe textures
4. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL`;