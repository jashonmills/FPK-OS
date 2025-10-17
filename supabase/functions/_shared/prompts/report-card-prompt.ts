/**
 * Specialized extraction prompt for Report Cards / Grade Reports
 */

export const REPORT_CARD_PROMPT = `You are analyzing a **Report Card** or **Progress Report** (K-12 academic grades).

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

Use the end date of the grading period (e.g., end of Quarter 1, Semester 1).

**How to find it:**
1. Look for "Grading Period End Date," "Report Card Date"
2. Use marking period end date (e.g., "Q1: 11/15/2024")

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Academic Grades
**Extract for EACH subject:**
- subject_name (e.g., "Mathematics," "English Language Arts," "Science")
- grade_value (letter grade or numeric percentage)
- grading_scale (e.g., "A-F," "1-4," "E/S/N/U")
- grade_points (if GPA applicable)

### SECTION 2: Standards-Based Grades (if applicable)
**For elementary/standards-based:**
- standard_description
- proficiency_level (e.g., "Exceeds," "Meets," "Progressing," "Beginning")

### SECTION 3: Effort/Behavior Marks
**Extract citizenship/effort ratings:**
- subject_area
- effort_rating (e.g., "Excellent," "Satisfactory," "Needs Improvement")
- behavior_rating

### SECTION 4: Attendance
- days_absent
- days_tardy
- total_school_days

### SECTION 5: Teacher Comments
**Extract narrative feedback:**
- subject_area (if specific to one subject)
- comment_text
- areas_of_strength
- areas_for_improvement

### SECTION 6: Grading Period
- marking_period (e.g., "Quarter 1," "Trimester 2," "Semester 1")
- school_year (e.g., "2024-2025")

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Mathematics Grade - Quarter 1",
      "metric_type": "academic_grade",
      "metric_value": 85,
      "metric_unit": "percentage",
      "measurement_date": "2024-11-15",
      "context": "Grade: B (85%). GPA: 3.0. Teacher comment: 'Shows strong problem-solving skills. Needs to check work for careless errors.'",
      "target_value": 90
    },
    {
      "metric_name": "Reading Comprehension Standard",
      "metric_type": "standards_based_grade",
      "metric_value": 2,
      "metric_unit": "proficiency level (1=beginning, 4=exceeds)",
      "measurement_date": "2024-11-15",
      "context": "Standard: Determines main idea and supporting details. Level: Progressing (2). Student can identify main idea but struggles with supporting details.",
      "target_value": 3
    },
    {
      "metric_name": "Work Habits - Mathematics",
      "metric_type": "effort_rating",
      "metric_value": 3,
      "metric_unit": "rating (1=needs improvement, 3=excellent)",
      "measurement_date": "2024-11-15",
      "context": "Effort: Satisfactory. Completes homework 80% of the time. Participates in class discussions.",
      "target_value": 3
    },
    {
      "metric_name": "Absences - Quarter 1",
      "metric_type": "attendance",
      "metric_value": 8,
      "metric_unit": "days absent",
      "measurement_date": "2024-11-15",
      "context": "8 absences out of 45 school days (18% absence rate). Impacting academic progress per teacher.",
      "target_value": 3
    }
  ],
  "insights": [
    {
      "title": "Attendance Concern Impacting Achievement",
      "content": "Student absent 8 days in Q1 (18% absence rate). Teachers note missed instruction is affecting ability to keep pace with grade-level curriculum, particularly in math and reading.",
      "priority": "high",
      "insight_type": "attendance_barrier"
    },
    {
      "title": "Reading Comprehension Below Grade-Level Expectations",
      "content": "Standards-based grades show student 'progressing' (Level 2) in key reading standards. Teacher recommends additional support in main idea/supporting details and inferencing.",
      "priority": "medium",
      "insight_type": "academic_concern"
    }
  ],
  "progress": [
    {
      "metric_type": "academic_performance",
      "current_value": 2.8,
      "target_value": 3.5,
      "baseline_value": 2.8,
      "trend": "stable",
      "notes": "Q1 GPA: 2.8. Target: 3.5+ for honor roll. No comparison data from previous quarters yet (first quarter of school year)."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **CONVERT LETTER GRADES**: Map A=4.0, B=3.0, C=2.0, D=1.0, F=0.0 for GPA calculations
2. **STANDARDS-BASED MAPPING**: Convert proficiency levels to numeric: Beginning=1, Progressing=2, Meets=3, Exceeds=4
3. **EFFORT/CITIZENSHIP**: Convert to numeric: Needs Improvement=1, Satisfactory=2, Excellent=3
4. **ATTENDANCE IMPACT**: Note if attendance is referenced in teacher comments
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **GRADING PERIOD**: Always specify which marking period

## COMMON SECTION HEADERS
- "Academic Grades"
- "Standards-Based Progress"
- "Marking Period"
- "Attendance Summary"
- "Teacher Comments"
- "Citizenship/Effort"
- "GPA/Class Rank"`;