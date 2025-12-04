/**
 * Specialized extraction prompt for Transition Plans (Post-Secondary)
 */

export const TRANSITION_PLAN_PROMPT = `You are analyzing a **Transition Plan** (for students 14+ preparing for post-secondary life). This document outlines goals and services for education, employment, and independent living after high school.

## CRITICAL: MEASUREMENT DATE EXTRACTION

**RULE #1: Every metric MUST have a measurement_date**

The \`measurement_date\` is the date of the IEP meeting where transition planning occurred.

**How to find it:**
1. Look for "IEP Meeting Date," "Transition Plan Date"
2. Use "Effective Date" if meeting date not specified

## MANDATORY EXTRACTION SECTIONS

### SECTION 1: Post-Secondary Goals (REQUIRED BY IDEA)

**Education/Training Goal:**
- goal_description (student's post-secondary education plan)
- setting (e.g., "4-year college," "Community college," "Vocational training," "No further education planned")
- timeline (e.g., "Within 1 year of graduation")

**Employment Goal:**
- goal_description (career/employment objective)
- job_type (e.g., "Competitive integrated employment," "Supported employment")
- timeline

**Independent Living Goal:**
- goal_description (living arrangement, community participation)
- supports_needed (e.g., "Supported living," "Independent apartment")

### SECTION 2: Present Levels of Performance
**Extract student's current skills in:**
- academic_functioning
- vocational_skills
- independent_living_skills
- self_advocacy_skills
- transportation_skills

### SECTION 3: Transition Services
**Extract EVERY service/activity:**
- service_description
- responsible_party (school/agency/family)
- start_date
- frequency

**Categories:**
- Instruction (academic preparation)
- Related Services (OT, PT, counseling for transition)
- Community Experiences (job shadowing, college visits)
- Employment/Post-School Adult Living (job coaching, apartment search)
- Daily Living Skills (if appropriate)
- Functional Vocational Evaluation

### SECTION 4: Course of Study
**Extract high school coursework aligned with goals:**
- diploma_type (e.g., "Standard Diploma," "Certificate of Completion")
- required_courses
- career_pathway (e.g., "Healthcare," "IT," "Hospitality")

### SECTION 5: Age of Majority Notification
**Extract (if student 17+):**
- notification_date
- rights_transfer_date (typically age 18)

### SECTION 6: Agency Linkages
**Extract outside agencies involved:**
- agency_name (e.g., "Vocational Rehabilitation," "Department of Developmental Disabilities")
- referral_status (e.g., "Referred," "Active case," "Pending")
- services_provided

## OUTPUT FORMAT

\`\`\`json
{
  "metrics": [
    {
      "metric_name": "Post-Secondary Education Goal",
      "metric_type": "transition_goal",
      "metric_value": 1,
      "metric_unit": "goal status (1=active, 0=not set)",
      "measurement_date": "2024-10-15",
      "context": "After graduation, student will enroll in a 2-year associate degree program in Graphic Design at community college. Timeline: Within 6 months of graduation (June 2025).",
      "target_value": null
    },
    {
      "metric_name": "Employment Goal - Competitive Integrated Employment",
      "metric_type": "transition_goal",
      "metric_value": 1,
      "metric_unit": "goal status",
      "measurement_date": "2024-10-15",
      "context": "Student will secure part-time employment (15-20 hours/week) in a retail or food service setting utilizing job coaching supports. Timeline: By graduation.",
      "target_value": null
    },
    {
      "metric_name": "Independent Living Goal",
      "metric_type": "transition_goal",
      "metric_value": 1,
      "metric_unit": "goal status",
      "measurement_date": "2024-10-15",
      "context": "Student will live in a shared apartment with one roommate and receive monthly visits from independent living coach. Timeline: Within 1 year of graduation.",
      "target_value": null
    },
    {
      "metric_name": "Job Coaching Services",
      "metric_type": "transition_service",
      "metric_value": 2,
      "metric_unit": "hours per week",
      "measurement_date": "2024-10-15",
      "context": "Vocational Rehabilitation will provide job coaching 2 hours/week at student's worksite. Service begins Spring 2025.",
      "intervention_used": "Job coaching via VR",
      "target_value": null
    }
  ],
  "insights": [
    {
      "title": "Post-Secondary Education and Employment Pathway Defined",
      "content": "Student has clear measurable goals for education (associate degree in Graphic Design), employment (part-time retail with job coaching), and independent living (shared apartment). All three domains required by IDEA are addressed.",
      "priority": "high",
      "insight_type": "transition_summary"
    },
    {
      "title": "Agency Coordination - Vocational Rehabilitation Active",
      "content": "VR referral completed. Student has active case with VR counselor. Services include: job coaching, pre-employment transition services, and college accommodations coordination. Strong interagency collaboration.",
      "priority": "medium",
      "insight_type": "service_coordination"
    }
  ],
  "progress": [
    {
      "metric_type": "transition_readiness",
      "current_value": 65,
      "target_value": 90,
      "baseline_value": 40,
      "trend": "increasing",
      "notes": "Student's transition readiness has increased from 40% to 65% over past year. Completed college application, job shadowing, and apartment search workshop. Target: 90% readiness by graduation."
    }
  ]
}
\`\`\`

## EXTRACTION RULES

1. **ALL 3 GOALS REQUIRED**: Education, Employment, Independent Living (federal law)
2. **MEASURABLE GOALS**: Extract specific timelines and criteria
3. **DISTINGUISH GOALS FROM SERVICES**: Goals = outcomes. Services = activities to reach outcomes.
4. **AGENCY INVOLVEMENT**: Capture all outside agencies and their roles
5. **NUMERIC FIELDS STRICT**: metric_value accepts ONLY numbers or NULL
6. **COURSE OF STUDY**: Link coursework to post-secondary goals

## COMMON SECTION HEADERS
- "Post-Secondary Goals"
- "Measurable Post-Secondary Goals"
- "Transition Assessments"
- "Present Levels - Transition"
- "Transition Services"
- "Course of Study"
- "Agency Involvement"
- "Age of Majority"
- "Transfer of Rights"
- "Student Preferences and Interests"`;