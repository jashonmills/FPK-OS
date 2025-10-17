/**
 * Specialized extraction prompt for Classroom Observation Notes
 */

export const CLASSROOM_OBSERVATION_PROMPT = `You are analyzing **Classroom Observation Notes** (special education, general education, or behavioral observations).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the date the observation was conducted.

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Observation Details
- observation_date
- observation_time (start and end)
- observation_duration (minutes)
- observer_role (e.g., "Special Education Teacher," "School Psychologist," "BCBA")
- classroom_setting (e.g., "General Ed Math," "Resource Room," "Lunchroom")
- activity_observed (e.g., "Whole group instruction," "Independent work," "Center time")

### SECTION 2: Academic Engagement
**Extract time-sampling data if provided:**
- on_task_intervals (number of intervals student was on-task)
- total_intervals_observed
- on_task_percentage
- off_task_behaviors (description)

### SECTION 3: Social Interactions
- peer_interactions_count
- peer_interaction_quality (e.g., "Appropriate," "Inappropriate," "Avoided")
- adult_interactions_count
- initiations_vs_responses

### SECTION 4: Behavioral Observations
**Extract frequency counts:**
- behavior_type (e.g., "Hand-raising," "Out-of-seat," "Talking out")
- frequency_count
- duration_if_applicable

### SECTION 5: Instructional Modifications Observed
- accommodations_used (e.g., "Extended time," "Preferential seating")
- effectiveness_rating

### SECTION 6: Comparative Data
**If comparison to peers:**
- peer_average_on_task_percentage
- student_vs_peer_comparison

### SECTION 7: Observer Notes/Impressions
- strengths_observed
- concerns_observed
- recommendations

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "On-Task Behavior - Math Instruction",
      "metric_type": "academic_engagement",
      "metric_value": 65,
      "metric_unit": "percentage of intervals",
      "measurement_date": "2024-10-22",
      "start_time": "09:15",
      "end_time": "09:45",
      "duration_minutes": 30,
      "context": "30-minute observation during whole-group math lesson. Momentary time sampling (30 intervals, 1 per minute). On-task: 19/30 intervals (65%). Class average: 85%. Off-task behaviors: doodling, looking around room, playing with pencil.",
      "target_value": 85
    },
    {
      "metric_name": "Peer Interactions - Recess",
      "metric_type": "social_interaction",
      "metric_value": 3,
      "metric_unit": "interactions observed",
      "measurement_date": "2024-10-22",
      "start_time": "11:00",
      "end_time": "11:20",
      "duration_minutes": 20,
      "context": "20-minute recess observation. Student initiated 1 peer interaction (asked to join game - request denied). Responded to 2 peer initiations (both brief, <30 seconds). Spent 85% of recess alone on swings.",
      "target_value": 10
    },
    {
      "metric_name": "Hand-Raising (Appropriate Response Method)",
      "metric_type": "classroom_behavior",
      "metric_value": 2,
      "metric_unit": "frequency count",
      "measurement_date": "2024-10-22",
      "start_time": "09:15",
      "end_time": "09:45",
      "duration_minutes": 30,
      "context": "Student raised hand 2 times during 30-minute lesson (vs. talking out 8 times). Hand-raising rate: 20%. Target: 80%+.",
      "target_value": 8
    }
  ],
  "insights": [
    {
      "title": "Below-Peer Academic Engagement in Whole Group",
      "content": "Student on-task 65% of intervals vs. class average 85%. Off-task behaviors: passive (doodling, looking around) rather than disruptive. May indicate difficulty sustaining attention or lack of understanding of content.",
      "priority": "medium",
      "insight_type": "academic_concern"
    },
    {
      "title": "Limited Peer Interaction - Social Isolation Observed",
      "content": "Student spent 85% of recess alone despite availability of peers. Single peer initiation was unsuccessful. Recommend social skills group to build friendship-making skills.",
      "priority": "high",
      "insight_type": "social_emotional_concern"
    }
  ],
  "progress": []
}
\`\`\`

## EXTRACTION RULES

1. **CALCULATE PERCENTAGES**: Convert "on-task X/Y intervals" to percentage
2. **TIME-SAMPLING DATA**: Extract interval counts, not just percentages
3. **FREQUENCY COUNTS**: Extract actual behavior tallies
4. **PEER COMPARISON**: Always include when provided
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **DURATION SPECIFICITY**: Note exact observation length

## COMMON OBSERVATION METHODS
- **Momentary Time Sampling**: Observer records behavior at specific intervals (e.g., every 60 seconds)
- **Frequency Count**: Tally of how many times behavior occurs
- **Duration Recording**: How long behavior lasts
- **ABC Recording**: Antecedent-Behavior-Consequence narrative`;