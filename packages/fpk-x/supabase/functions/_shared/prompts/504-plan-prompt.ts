/**
 * Specialized extraction prompt for 504 Plans
 */

export const PLAN_504_PROMPT = `You are analyzing a **504 Plan** (Section 504 of the Rehabilitation Act). This document outlines accommodations for students with disabilities in general education.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

The \`measurement_date\` is the date of the 504 Plan meeting or plan effective date.

**How to find it:**
1. Look for "Meeting Date," "Plan Date," "Effective Date"
2. Use "Annual Review Date" if plan creation date not specified

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Disability/Condition
**Extract:**
- diagnosed_condition (e.g., "ADHD," "Type 1 Diabetes," "Anxiety Disorder")
- how_disability_affects_learning (summary statement)

### SECTION 2: Accommodations by Category
**Extract EVERY accommodation listed:**

**Academic Accommodations:**
- accommodation_description
- subject_area (if specific to certain classes)
- frequency (e.g., "All tests," "As needed")

**Testing Accommodations:**
- extended_time_percentage (e.g., "50% extended time" → 1.5)
- separate_setting (boolean)
- read_aloud (boolean)
- scribe_provided (boolean)
- calculator_use (boolean)
- breaks_allowed (boolean)

**Behavioral/Social-Emotional Accommodations:**
- accommodation_description
- implementation_setting

**Environmental Accommodations:**
- preferential_seating (boolean)
- reduced_distractions (boolean)
- sensory_supports

**Medical Accommodations:**
- medication_administration (if applicable)
- emergency_protocols
- health_monitoring

### SECTION 3: Modifications (if any)
**Distinguish from accommodations:**
- modification_description
- subject_area

### SECTION 4: Plan Details
**Extract:**
- effective_date
- review_frequency (e.g., "Annually," "Every 3 years")
- next_review_date
- plan_duration

### SECTION 5: Responsible Parties
**Extract team members:**
- team_member_role (e.g., "504 Coordinator," "General Education Teacher")
- implementation_responsibility

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Extended Time for Tests and Assignments",
      "metric_type": "testing_accommodation",
      "metric_value": 1.5,
      "metric_unit": "time multiplier",
      "measurement_date": "2024-09-10",
      "context": "50% extended time (time-and-a-half) for all tests, quizzes, and lengthy assignments across all subjects.",
      "target_value": null
    },
    {
      "metric_name": "Preferential Seating",
      "metric_type": "environmental_accommodation",
      "metric_value": 1,
      "metric_unit": "active (1=yes, 0=no)",
      "measurement_date": "2024-09-10",
      "context": "Seat student near teacher, away from distractions (windows, doors, high-traffic areas). All classrooms.",
      "target_value": null
    },
    {
      "metric_name": "Separate Testing Environment",
      "metric_type": "testing_accommodation",
      "metric_value": 1,
      "metric_unit": "active (1=yes, 0=no)",
      "measurement_date": "2024-09-10",
      "context": "Testing in separate, quiet room to reduce distractions and allow for movement breaks. All major assessments.",
      "target_value": null
    },
    {
      "metric_name": "Scheduled Movement Breaks",
      "metric_type": "behavioral_accommodation",
      "metric_value": 4,
      "metric_unit": "breaks per day",
      "measurement_date": "2024-09-10",
      "context": "Student may request sensory/movement breaks as needed, approximately 4 per day. 2-3 minute duration.",
      "target_value": null
    }
  ],
  "insights": [
    {
      "title": "ADHD Accommodations - Focus and Attention Support",
      "content": "504 Plan addresses ADHD-related difficulties with sustained attention, task completion, and test-taking. Key accommodations: 50% extended time, preferential seating, separate testing room, and movement breaks.",
      "priority": "high",
      "insight_type": "accommodation_summary"
    },
    {
      "title": "Environmental Modifications Critical for Success",
      "content": "Student requires reduced-distraction environment for optimal performance. Preferential seating and separate testing setting are essential accommodations consistently implemented across all classes.",
      "priority": "medium",
      "insight_type": "intervention_recommendation"
    }
  ],
  "progress": [
    {
      "metric_type": "accommodation_plan",
      "current_value": 100,
      "target_value": 100,
      "baseline_value": 100,
      "trend": "stable",
      "notes": "504 Plan in effect as of 9/10/2024. Annual review scheduled for September 2025. All accommodations actively implemented."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ACCOMMODATIONS VS. MODIFICATIONS**: Accommodations change HOW student learns (no curriculum change). Modifications change WHAT student learns (curriculum adjusted).
2. **QUANTIFY WHERE POSSIBLE**: Convert "extended time" to numeric multiplier, "frequent breaks" to approximate number
3. **BOOLEAN FLAGS**: Use 1/0 for yes/no accommodations
4. **NO HALLUCINATIONS**: Only extract accommodations explicitly listed
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **CAPTURE IMPLEMENTATION DETAILS**: Store "when," "where," "how often" in context field

## COMMON SECTION HEADERS
- "Student Information"
- "Nature of Disability"
- "How Disability Affects Learning"
- "Accommodations"
- "Testing Accommodations"
- "Classroom Accommodations"
- "Behavioral Supports"
- "Physical/Environmental Supports"
- "Assistive Technology"
- "Review Schedule"
- "Team Members"`;