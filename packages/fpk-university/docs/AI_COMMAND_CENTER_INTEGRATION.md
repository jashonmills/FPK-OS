# AI Command Center Integration Guide

## Overview

This document describes the integration of the AI Command Center enhancements into the existing FPK Learner platform.

## What Was Added

### 1. Database Schema (✅ Deployed)

New tables created in Supabase:
- `ai_coach_conversations` - Stores chat conversations
- `ai_coach_messages` - Individual messages with persona tracking
- `ai_coach_study_materials` - Uploaded study materials
- `ai_coach_knowledge_base` - RAG-enabled knowledge base
- `ai_coach_analytics` - Learning analytics and metrics
- `ai_coach_study_plans` - AI-generated study plans

**Migration File**: `/supabase/migrations/20251102172409_ai_coach_schema.sql`

All tables have Row Level Security (RLS) enabled and proper indexes.

### 2. Frontend Components

**New Page**: `/src/pages/student/AICoach.tsx`
- Route: `/dashboard/learner/ai-command-center`
- Three-column responsive layout
- Integrates with existing AI coach system

**New Component**: `/src/components/AICoachCommandCenter.tsx`
- Main UI component with three-column layout
- Left: Context & History
- Center: AI Chat Interface
- Right: Insights & Analytics

**New Service**: `/src/services/aiService.ts`
- API integration layer
- Placeholder implementations for all features
- Ready for production data integration

**New Types**: `/src/types/aiCoach.ts`
- TypeScript definitions for all AI Coach interfaces

### 3. Existing AI Coach System (Preserved)

Your platform already has a sophisticated AI Coach system:
- **Edge Function**: `/supabase/functions/ai-coach-orchestrator/index.ts`
  - Betty (Socratic Guide)
  - Al (Direct Expert)
  - Nite Owl (Fun Facts)
  - RAG integration
  - Multi-session memory
  - Claude integration

- **Existing Components**: `/src/components/ai-coach-v2/`
  - CommandCenterChat.tsx
  - MessageBubble.tsx
  - CoachSelectionModal.tsx
  - And more...

## Integration Status

### ✅ Completed
1. Database schema deployed to Supabase
2. New tables created with RLS policies
3. Frontend components added to repository
4. Route configured in App.tsx
5. Types and services integrated

### ⚠️ Needs Configuration
1. **OpenAI API Key** - Set in Supabase Edge Function environment variables
2. **Connect UI to Backend** - Update aiService.ts to call your existing orchestrator
3. **Populate Integration Sockets** - Replace placeholder data with real queries

### 🔄 Recommended Next Steps

1. **Update aiService.ts** to call your existing `ai-coach-orchestrator` Edge Function
2. **Implement the 5 Integration Sockets**:
   - Analytics Data
   - Saved Chats
   - Study Materials
   - Study Plans
   - Practice Drills

3. **Test the Integration**:
   - Verify database tables are accessible
   - Test AI chat functionality
   - Confirm RLS policies work correctly

4. **Deploy to Production**:
   - Push to GitHub
   - Deploy via Vercel/Netlify
   - Configure environment variables

## Environment Variables

Required in Supabase Edge Functions:
```
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here (already set)
```

## API Integration

The new AI Command Center UI can integrate with your existing orchestrator:

```typescript
// In aiService.ts, update sendMessage to call your existing function:
const { data, error } = await supabase.functions.invoke('ai-coach-orchestrator', {
  body: {
    message,
    conversationId,
    conversationHistory,
  },
});
```

## Database Queries

Example queries for integration sockets:

### Fetch User Analytics
```sql
SELECT 
  SUM(study_time_minutes) as total_study_time,
  COUNT(DISTINCT session_date) as sessions_completed,
  ARRAY_AGG(DISTINCT topics_explored) as topics_studied,
  AVG(comprehension_score) as average_score
FROM ai_coach_analytics
WHERE user_id = $1
```

### Fetch Saved Chats
```sql
SELECT 
  c.id,
  c.title,
  c.updated_at,
  COUNT(m.id) as message_count
FROM ai_coach_conversations c
LEFT JOIN ai_coach_messages m ON m.conversation_id = c.id
WHERE c.user_id = $1
GROUP BY c.id
ORDER BY c.updated_at DESC
LIMIT 10
```

### Fetch Study Materials
```sql
SELECT 
  id,
  title,
  file_type,
  file_size,
  created_at
FROM ai_coach_study_materials
WHERE user_id = $1
ORDER BY created_at DESC
```

## Testing Checklist

- [ ] Navigate to `/dashboard/learner/ai-command-center`
- [ ] Verify three-column layout displays correctly
- [ ] Test responsive behavior on mobile
- [ ] Send a test message to AI coach
- [ ] Verify persona selection works (Betty, Al, Nite Owl)
- [ ] Check that RLS policies prevent unauthorized access
- [ ] Test analytics data display
- [ ] Test saved chats functionality
- [ ] Test study materials upload

## Support

For questions about this integration, refer to:
- `/docs/PERSONA_SYSTEM_PROMPTS.md` - AI persona specifications
- `/docs/ORCHESTRATION_LOGIC.md` - Orchestration details
- `/docs/INTEGRATION_GUIDE.md` - Full integration guide
- `/docs/DEPLOYMENT.md` - Deployment procedures

## Credits

This integration preserves and enhances your existing AI Coach system while adding:
- Enhanced three-column UI
- Dedicated database tables for AI coach data
- Comprehensive analytics tracking
- Study materials management
- AI-generated study plans
