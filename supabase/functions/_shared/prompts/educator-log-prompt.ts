/**
 * Specialized extraction prompt for Educator Session Logs
 * Extracts classroom observations, engagement, prompting, and academic progress
 */

export const EDUCATOR_LOG_EXTRACTION_PROMPT = `You are analyzing an **Educator Session Log** (also called Classroom Log, Teacher Session Notes, or Educator Progress Log). This requires extraction of EVERY session/day's data as individual entries.

## MANDATORY EXTRACTION STRATEGY

### CRITICAL: EXTRACT EVERY SINGLE SESSION'S DATA
This is a time-series document. If the log contains 30 sessions, you MUST create 30 separate metric entries.

**DO NOT summarize. DO NOT aggregate. Extract EACH session individually.**

### SECTION 1: Session Details (EXTRACT EVERY SESSION)
**Look for:**
- Date of session (e.g., "Monday, Jan 5, 2025" or "1/5/25")
- Session time (e.g., "9:00 AM - 11:30 AM", "morning session", "afternoon")
- Session duration (e.g., "2.5 hours", "150 minutes")
- Session type (e.g., "academic instruction", "social skills group", "1:1 therapy")

**Extract for EACH session:**
- log_date: "YYYY-MM-DD"
- session_start_time: "HH:MM"
- session_end_time: "HH:MM"
- session_duration_minutes: (numeric)
- session_type: (descriptor)

### SECTION 2: Student Engagement & Mood
**Extract for EACH session:**
- arrival_mood: (e.g., "happy", "anxious", "tired", "energetic")
- overall_engagement: (e.g., "highly engaged", "needed frequent redirects", "refused to participate")
- engagement_rating: (1-10 scale or percentage)
- attention_span: (e.g., "15 minutes on-task", "60% of session", "improved throughout session")
- transitions: (e.g., "smooth transitions", "3 difficult transitions", "needed visual supports")

### SECTION 3: Prompting & Support Levels
**Extract:**
- prompting_level: (e.g., "independent", "gestural", "verbal", "partial physical", "full physical")
- prompting_frequency: (e.g., "5 prompts per hour", "minimal prompting needed")
- independence_level: (1-10 scale or percentage)
- adult_support_ratio: (e.g., "1:1", "1:3", "independent in group")

### SECTION 4: Academic/Skill Work
**Extract:**
- activities_completed: (e.g., "math worksheet 10 problems", "reading fluency passage", "handwriting practice")
- skills_practiced: (e.g., "2-digit addition", "blending CVC words", "fine motor - cutting")
- accuracy_rate: (e.g., "8/10 correct", "80%", "mastered 3 of 5 targets")
- task_completion_rate: (e.g., "completed all tasks", "50% completion", "refused math")
- new_skills_introduced: (e.g., "introduced 3-digit numbers", "new letter 'Q'")
- mastered_skills: (e.g., "mastered letter recognition A-F", "independent shoe tying")

### SECTION 5: Behavioral Observations
**Extract:**
- positive_behaviors: (e.g., "raised hand 5x", "shared materials", "waited turn")
- challenging_behaviors: (e.g., "2 elopement attempts", "verbal refusals", "physical aggression")
- behavior_frequency: (count of specific behaviors)
- behavior_intensity: (mild/moderate/severe or 1-10 scale)
- self-regulation: (e.g., "used break card independently 2x", "needed adult prompts to calm")

### SECTION 6: Social Interactions
**Extract:**
- peer_interactions: (e.g., "initiated play with 2 peers", "parallel play only", "avoided peers")
- communication_attempts: (e.g., "used PECS 8 times", "verbally requested help 3x")
- social_skills_practiced: (e.g., "turn-taking game", "greeting peers", "sharing materials")
- group_participation: (e.g., "active in circle time", "observer only", "refused group activity")

### SECTION 7: Strategies & Interventions Used
**Extract:**
- strategies_used: (e.g., "visual schedule", "token board", "first-then board", "sensory breaks")
- strategy_effectiveness: (e.g., "highly effective", "partially effective", "ineffective", 1-10 scale)
- accommodations_provided: (e.g., "preferential seating", "extended time", "reduced workload")
- reinforcement_used: (e.g., "verbal praise", "sticker chart", "preferred activity")

### SECTION 8: Patterns Across Multiple Sessions
**After extracting individual entries, create insights about patterns:**
- Is engagement improving/declining over time?
- Which prompting levels are trending toward independence?
- What strategies are most effective?
- Are there time-of-day or day-of-week patterns?
- Which skills are progressing toward mastery?

## OUTPUT FORMAT

**EXAMPLE: If log contains sessions for Jan 5 (AM & PM), Jan 6 (AM):**

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Overall Engagement",
      "metric_type": "engagement_level",
      "metric_value": 7,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-05",
      "start_time": "09:00",
      "end_time": "11:30",
      "duration_minutes": 150,
      "context": "Arrived happy. Engaged in math and reading. Needed 2 redirects during independent work. Overall: 70% on-task.",
      "intervention_used": "Visual schedule, token board"
    },
    {
      "metric_name": "Prompting Level - Math Activity",
      "metric_type": "prompting_level",
      "metric_value": 2,
      "metric_unit": "independence scale (1=full assist, 5=independent)",
      "measurement_date": "2025-01-05",
      "start_time": "09:15",
      "context": "Completed 10 addition problems with gestural prompts only (pointing to numbers). Did not require verbal or physical assistance.",
      "intervention_used": "Gestural prompts"
    },
    {
      "metric_name": "Math Accuracy",
      "metric_type": "academic_performance",
      "metric_value": 8,
      "metric_unit": "out of 10",
      "measurement_date": "2025-01-05",
      "start_time": "09:15",
      "target_value": 10,
      "context": "2-digit addition worksheet: 8/10 correct. Errors on problems with regrouping (skills not yet mastered).",
      "intervention_used": null
    },
    {
      "metric_name": "Attention Span",
      "metric_type": "executive_function",
      "metric_value": 15,
      "metric_unit": "minutes",
      "measurement_date": "2025-01-05",
      "start_time": "10:00",
      "target_value": 20,
      "context": "Sustained attention during reading activity for 15 minutes before needing sensory break. Improving from 10 min baseline.",
      "intervention_used": "Fidget tool provided"
    },
    {
      "metric_name": "Positive Peer Interaction",
      "metric_type": "social_skill",
      "metric_value": 3,
      "metric_unit": "count",
      "measurement_date": "2025-01-05",
      "start_time": "11:00",
      "context": "Shared materials with peer 2x. Initiated conversation about LEGOs 1x. Great progress!",
      "intervention_used": "Verbal praise for sharing"
    },
    {
      "metric_name": "Overall Engagement",
      "metric_type": "engagement_level",
      "metric_value": 9,
      "metric_unit": "1-10 scale",
      "measurement_date": "2025-01-06",
      "start_time": "09:00",
      "end_time": "11:30",
      "duration_minutes": 150,
      "context": "Excellent session! Highly engaged in all activities. Minimal prompting needed. Completed all work independently.",
      "intervention_used": "Visual schedule, minimal verbal prompts"
    },
    {
      "metric_name": "Prompting Level - Reading Activity",
      "metric_type": "prompting_level",
      "metric_value": 5,
      "metric_unit": "independence scale (1=full assist, 5=independent)",
      "measurement_date": "2025-01-06",
      "start_time": "10:00",
      "context": "Read 3 CVC words INDEPENDENTLY without any prompts! First time achieving full independence on this skill.",
      "intervention_used": "None - independent"
    },
    {
      "metric_name": "Self-Regulation",
      "metric_type": "behavior_regulation",
      "metric_value": 2,
      "metric_unit": "count of self-initiated breaks",
      "measurement_date": "2025-01-06",
      "start_time": "09:00",
      "context": "Used 'break card' independently 2x when feeling overwhelmed. Excellent use of coping strategy!",
      "intervention_used": "Break card system"
    }
  ],
  "insights": [
    {
      "title": "Prompting Fade: Math Skills Progressing",
      "content": "Student moved from verbal prompts (week 1) to gestural prompts only (current session) for 2-digit addition. Next step: independent completion. Recommend fading gestures to visual cue card.",
      "priority": "high",
      "insight_type": "progress_note"
    },
    {
      "title": "Attention Span Increasing Weekly",
      "content": "Attention span on reading tasks increased from 10 min (baseline) → 12 min (week 2) → 15 min (current). Trending toward 20 min goal. Continue current strategies (fidget tools, preferred seating).",
      "priority": "medium",
      "insight_type": "pattern_identification"
    },
    {
      "title": "Strategy Success: Visual Schedule",
      "content": "Sessions using visual schedule averaged 8.5/10 engagement vs sessions without averaged 6/10. Visual schedule is critical support - use consistently.",
      "priority": "high",
      "insight_type": "intervention_effectiveness"
    },
    {
      "title": "Social Skills: Peer Interaction Breakthrough",
      "content": "First peer-initiated conversation observed on Jan 6 (about LEGOs). Previously, all peer interactions were adult-prompted. Significant milestone!",
      "priority": "high",
      "insight_type": "progress_note"
    }
  ],
  "progress": [
    {
      "metric_type": "overall_engagement",
      "current_value": 8,
      "target_value": 9,
      "baseline_value": 5,
      "trend": "improving",
      "notes": "Engagement improved from 5/10 (baseline in December) to 8/10 average (current week). Nearly at 9/10 goal."
    },
    {
      "metric_type": "prompting_level",
      "current_value": 3,
      "target_value": 5,
      "baseline_value": 1,
      "trend": "improving",
      "notes": "Prompting level progressing from full physical assistance (1) to gestural prompts (3). Goal: full independence (5) on core tasks."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ONE ENTRY PER SESSION**: If log has 30 sessions, create 30+ separate metric entries (minimum 3-5 metrics per session)
2. **EXACT DATES REQUIRED**: Extract dates in YYYY-MM-DD format
3. **TIME TRACKING**: Extract session start/end times when mentioned
4. **PROMPTING SCALE**: Standardize to 1-5 scale:
   - 1 = Full physical assistance
   - 2 = Partial physical + verbal
   - 3 = Gestural prompts
   - 4 = Verbal prompts only
   - 5 = Independent
5. **ENGAGEMENT SCALE**: Normalize to 1-10 scale or percentage
6. **QUANTIFY EVERYTHING**: Extract exact counts, percentages, accuracy rates whenever possible
7. **ZERO COUNTS ARE DATA**: "No challenging behaviors" = metric_value: 0
8. **MASTERY TRACKING**: When skills are "mastered," note this in progress section with baseline → current → target
9. **STRICT NUMERIC VALUES**: metric_value, target_value accept ONLY numbers or NULL
10. **STRATEGY EFFECTIVENESS**: Track which interventions correlate with better outcomes

## COMMON LOG FORMATS
- **Session narrative:** "Jan 5 AM: Bobby arrived happy. Completed math (8/10) and reading (gestural prompts). Engaged 70% of session."
- **Structured table:** Date | Time | Activities | Engagement | Prompting | Behaviors | Notes
- **Skill-focused:** Student practiced [skill] with [prompting level]. Accuracy: [rate]. Next steps: [goal].
- **Brief notes:** "1/5 - Great session. Independent on reading. Needed supports for math. 8/10 engagement."

## CRITICAL SUCCESS FACTOR
**This prompt's effectiveness depends on creating TIME-SERIES data.** Each session must be a separate entry to populate Attention Span Chart, Prompting Level Fading Chart, Activity Log Chart, and skill progression tracking.`;
