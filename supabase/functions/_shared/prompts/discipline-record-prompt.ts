/**
 * Specialized extraction prompt for Discipline Records / Suspension Notices
 */

export const DISCIPLINE_RECORD_PROMPT = `You are analyzing a **Discipline Record**, **Suspension Notice**, or **Behavioral Incident Report** (school discipline).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date of the incident.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Incident Details
- incident_date
- incident_time
- incident_location (e.g., "Classroom," "Cafeteria," "Hallway," "Bus")
- staff_reporting (name/role)

### SECTION 2: Behavior Description
- behavior_type (e.g., "Physical Aggression," "Defiance," "Disruption," "Profanity," "Bullying")
- detailed_description (narrative of what happened)
- severity_level (e.g., "Minor," "Major," "Severe")

### SECTION 3: Antecedents/Triggers
- what_happened_before (setting events, triggers)
- witnesses (number/roles)

### SECTION 4: Consequence/Action Taken
- consequence_type (e.g., "Office Referral," "In-School Suspension," "Out-of-School Suspension," "Expulsion")
- duration_days (for suspensions)
- start_date (of suspension)
- end_date (of suspension)
- alternative_placement (if applicable)

### SECTION 5: Parent Notification
- parent_contacted (boolean)
- contact_method (e.g., "Phone," "Email," "In-person meeting")
- contact_date

### SECTION 6: Follow-Up Actions
- reentry_meeting_scheduled (boolean)
- behavioral_intervention_plan_created (boolean)
- referral_to_counseling (boolean)
- other_supports

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Out-of-School Suspension - Physical Aggression",
      "metric_type": "disciplinary_action",
      "metric_value": 3,
      "metric_unit": "suspension days",
      "measurement_date": "2024-10-18",
      "start_time": "10:45",
      "context": "Incident: Student punched peer in cafeteria during lunch. Witness: lunch supervisor. Consequence: 3-day out-of-school suspension (10/21-10/23). Parent notified via phone 10/18 at 11:15am.",
      "intervention_used": "Suspension + reentry meeting required",
      "duration_minutes": null
    },
    {
      "metric_name": "Office Discipline Referral - Defiance",
      "metric_type": "disciplinary_action",
      "metric_value": 1,
      "metric_unit": "referral count",
      "measurement_date": "2024-09-25",
      "context": "Incident: Student refused to follow teacher directive to put away phone in math class. Argumentative when redirected. Consequence: Office referral + lunch detention.",
      "intervention_used": "Lunch detention",
      "duration_minutes": 30
    }
  ],
  "insights": [
    {
      "title": "Pattern of Physical Aggression - 3rd Incident This Year",
      "content": "This is student's 3rd physical aggression incident in 6 weeks (9/5, 9/20, 10/18). All occurred in unstructured settings (cafeteria, recess). Recommend FBA to identify function of aggression and develop BIP.",
      "priority": "high",
      "insight_type": "behavioral_pattern"
    },
    {
      "title": "Suspension May Not Address Root Cause",
      "content": "Out-of-school suspension addresses safety but does not teach replacement behaviors. Recommend proactive supports: social skills instruction, conflict resolution training, supervised lunch seating.",
      "priority": "high",
      "insight_type": "intervention_recommendation"
    }
  ],
  "progress": [
    {
      "metric_type": "discipline_frequency",
      "current_value": 5,
      "target_value": 0,
      "baseline_value": 5,
      "trend": "increasing",
      "notes": "5 office referrals in first 2 months of school (Sept-Oct). Trend increasing. Urgent need for behavioral intervention."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **QUANTIFY SUSPENSIONS**: Extract number of days as numeric value
2. **DISTINGUISH MINOR vs. MAJOR**: Office referrals vs. suspensions/expulsions
3. **PATTERN ANALYSIS**: Note if this is repeat behavior
4. **LOCATION CONTEXT**: Always capture where incident occurred
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL (use 1 for single office referral)
6. **DUE PROCESS**: Note parent notification and manifestation determination (if student has IEP/504)

## COMMON BEHAVIOR CATEGORIES
- **Level 1 (Minor)**: Disruption, dress code, tardy, inappropriate language
- **Level 2 (Major)**: Defiance, profanity toward staff, class cut, chronic disruption
- **Level 3 (Severe)**: Physical aggression, threats, bullying, harassment, vandalism
- **Level 4 (Extreme)**: Weapons, drugs, assault, illegal acts`;