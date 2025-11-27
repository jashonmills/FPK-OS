// Helper function to format the Student Knowledge Pack into readable text
export function formatKnowledgePack(knowledgePack: any): string {
  if (!knowledgePack) return '';
  
  let formatted = '# 🧠 Student Knowledge Pack\n\n';
  formatted += `*Generated at: ${knowledgePack.generated_at}*\n\n`;
  formatted += '---\n\n';
  
  // Active Courses
  if (knowledgePack.active_courses?.length > 0) {
    formatted += '## 🎓 Active Courses\n\n';
    knowledgePack.active_courses.forEach((course: any) => {
      formatted += `- **${course.course_title}** (${course.course_id})\n`;
      formatted += `  - Progress: ${course.progress}% complete\n`;
      formatted += `  - Time invested: ${course.time_spent_minutes} minutes\n`;
      formatted += `  - Status: ${course.status}\n`;
      if (course.last_accessed) {
        formatted += `  - Last studied: ${new Date(course.last_accessed).toLocaleDateString()}\n`;
      }
    });
    formatted += '\n';
  }
  
  // Recent Activity
  if (knowledgePack.recent_activity) {
    formatted += '## 📊 Recent Activity (Last 7 Days)\n\n';
    
    if (knowledgePack.recent_activity.recent_lessons?.length > 0) {
      formatted += '**Recently Completed Lessons:**\n';
      knowledgePack.recent_activity.recent_lessons.forEach((lesson: any) => {
        formatted += `- ${lesson.lesson_title} (${lesson.course_id}) - ${Math.round(lesson.time_spent_seconds / 60)}min\n`;
      });
    }
    
    if (knowledgePack.recent_activity.recent_socratic_sessions?.length > 0) {
      formatted += '\n**Recent Socratic Learning Sessions:**\n';
      knowledgePack.recent_activity.recent_socratic_sessions.forEach((session: any) => {
        formatted += `- Topic: ${session.topic || 'General'} | ${session.turns} turns\n`;
      });
    }
    
    formatted += `\n**Total Study Time:** ${knowledgePack.recent_activity.study_time_last_7_days} minutes\n\n`;
  }
  
  // Active Goals
  if (knowledgePack.active_goals?.length > 0) {
    formatted += '## 🎯 Active Goals\n\n';
    knowledgePack.active_goals.forEach((goal: any) => {
      formatted += `- **${goal.title}** (${goal.category})\n`;
      formatted += `  - Progress: ${goal.progress}%\n`;
      if (goal.target_date) {
        formatted += `  - Target: ${new Date(goal.target_date).toLocaleDateString()}\n`;
      }
    });
    formatted += '\n';
  }
  
  // Strengths & Weaknesses
  if (knowledgePack.strengths_weaknesses) {
    formatted += '## 💪 Strengths & Weaknesses\n\n';
    
    if (knowledgePack.strengths_weaknesses.strengths?.length > 0) {
      formatted += '**Known Strengths (Mastery ≥ 80%):**\n';
      knowledgePack.strengths_weaknesses.strengths.forEach((strength: string) => {
        formatted += `- ${strength}\n`;
      });
    }
    
    if (knowledgePack.strengths_weaknesses.weaknesses?.length > 0) {
      formatted += '\n**Areas Needing Attention (Mastery < 50%):**\n';
      knowledgePack.strengths_weaknesses.weaknesses.forEach((weakness: string) => {
        formatted += `- ${weakness}\n`;
      });
    }
    
    if (knowledgePack.strengths_weaknesses.average_mastery) {
      formatted += `\n**Overall Mastery Level:** ${knowledgePack.strengths_weaknesses.average_mastery}/1.0\n`;
    }
    formatted += '\n';
  }
  
  // Instructor Notes
  if (knowledgePack.instructor_notes?.length > 0) {
    formatted += '## 📝 Instructor Notes\n\n';
    knowledgePack.instructor_notes.forEach((note: any) => {
      formatted += `- **[${new Date(note.created_at).toLocaleDateString()}]** (${note.category}): ${note.note}\n`;
    });
    formatted += '\n**⚠️ IMPORTANT:** If relevant to the current conversation, gently guide the discussion to address these observations.\n\n';
  }
  
  // Learning Patterns
  if (knowledgePack.learning_patterns) {
    formatted += '## 🔄 Learning Patterns\n\n';
    formatted += `- **Current Study Streak:** ${knowledgePack.learning_patterns.current_streak || 0} days\n`;
    if (knowledgePack.learning_patterns.preferred_study_times?.length > 0) {
      formatted += `- **Preferred Study Times:** ${knowledgePack.learning_patterns.preferred_study_times.join(', ')}:00\n`;
    }
    if (knowledgePack.learning_patterns.avg_session_length_minutes) {
      formatted += `- **Average Session Length:** ${knowledgePack.learning_patterns.avg_session_length_minutes} minutes\n`;
    }
    if (knowledgePack.learning_patterns.learning_velocity) {
      formatted += `- **Learning Velocity:** ${knowledgePack.learning_patterns.learning_velocity.toFixed(2)} topics/week\n`;
    }
    formatted += '\n';
  }
  
  // Gamification
  if (knowledgePack.gamification) {
    formatted += '## 🏆 Gamification Status\n\n';
    formatted += `- **Level:** ${knowledgePack.gamification.current_level}\n`;
    formatted += `- **Total XP:** ${knowledgePack.gamification.total_xp}\n`;
    formatted += `- **Badges Earned:** ${knowledgePack.gamification.badges_earned}\n`;
    
    if (knowledgePack.gamification.recent_achievements?.length > 0) {
      formatted += '\n**Recent Achievements:**\n';
      knowledgePack.gamification.recent_achievements.forEach((achievement: any) => {
        formatted += `- ${achievement.name} (${achievement.type}) - ${achievement.xp_reward} XP\n`;
      });
    }
    formatted += '\n';
  }
  
  // Recent Struggles
  if (knowledgePack.recent_struggles?.length > 0) {
    formatted += '## ⚠️ Recent Struggles\n\n';
    formatted += 'The student has encountered some challenges recently:\n\n';
    knowledgePack.recent_struggles.forEach((struggle: any) => {
      formatted += `- **${struggle.severity}** issue with ${struggle.topic || 'general learning'}\n`;
      formatted += `  - Reason: ${struggle.reason}\n`;
    });
    formatted += '\n**💡 Coaching Tip:** Be extra encouraging and consider breaking down concepts into smaller steps.\n\n';
  }
  
  // AI Coach Insights
  if (knowledgePack.ai_coach_insights) {
    formatted += '## 🧠 AI Coach Insights\n\n';
    formatted += `- **Total Socratic Sessions:** ${knowledgePack.ai_coach_insights.total_socratic_sessions || 0}\n`;
    
    if (knowledgePack.ai_coach_insights.favorite_topics?.length > 0) {
      formatted += `- **Favorite Topics:** ${knowledgePack.ai_coach_insights.favorite_topics.join(', ')}\n`;
    }
    
    if (knowledgePack.ai_coach_insights.recent_learning_outcomes?.length > 0) {
      formatted += '\n**Recent Learning Outcomes:**\n';
      knowledgePack.ai_coach_insights.recent_learning_outcomes.forEach((outcome: any) => {
        formatted += `- ${outcome.outcome} (${outcome.topic}) - Mastery: ${outcome.mastery_level.toFixed(2)}/1.0\n`;
      });
    }
    
    if (knowledgePack.ai_coach_insights.memory_fragments?.length > 0) {
      formatted += '\n**Important Context to Remember:**\n';
      knowledgePack.ai_coach_insights.memory_fragments.forEach((memory: any) => {
        formatted += `- [${memory.memory_type}] ${memory.content}\n`;
      });
    }
    formatted += '\n';
  }
  
  // Organization Context
  if (knowledgePack.organization_context?.is_org_student) {
    formatted += '## 🏫 Organization Context\n\n';
    formatted += '**This student is part of an organization.**\n\n';
    
    if (knowledgePack.organization_context.org_memberships?.length > 0) {
      formatted += 'Member of: ';
      formatted += knowledgePack.organization_context.org_memberships
        .map((org: any) => `${org.org_name} (${org.role})`)
        .join(', ') + '\n';
    }
    
    formatted += `- Assigned Courses: ${knowledgePack.organization_context.assigned_courses || 0}\n`;
    
    if (knowledgePack.organization_context.group_memberships?.length > 0) {
      formatted += `- Group Memberships: ${knowledgePack.organization_context.group_memberships.map((g: any) => g.group_name).join(', ')}\n`;
    }
  } else if (knowledgePack.organization_context) {
    formatted += '## 🏫 Organization Context\n\n';
    formatted += '**This is an independent FPK University student** (not affiliated with an organization).\n';
  }
  
  formatted += '\n---\n\n';
  formatted += '## 🎯 How to Use This Knowledge Pack\n\n';
  formatted += '**For Betty (Socratic Guide):**\n';
  formatted += '- Reference active goals when asking probing questions\n';
  formatted += '- Use known strengths to build confidence before addressing weaknesses\n';
  formatted += '- If instructor notes are present and relevant, gently steer toward those areas\n\n';
  
  formatted += '**For Al (Direct Expert):**\n';
  formatted += '- When asked "what should I work on?", use recent activity, weaknesses, and active goals\n';
  formatted += '- Reference learning patterns (streaks, preferred times) to encourage consistent habits\n';
  formatted += '- Use gamification data to frame progress motivatingly\n\n';
  
  formatted += '**General Guidelines:**\n';
  formatted += '- Never overwhelm the student by referencing too much data at once\n';
  formatted += '- Be natural and conversational\n';
  formatted += '- If the student is struggling (see "Recent Struggles"), be extra supportive\n';
  
  return formatted;
}
