# Phase 2: Database-Driven Trigger System

## Overview
Phase 2 replaces the hardcoded if/else intent detection logic with a flexible, scalable database-driven keyword scoring system.

## Architecture

### 1. Database Table: `ai_persona_triggers`
**Location:** `public.ai_persona_triggers`

**Schema:**
- `persona`: Target AI persona (BETTY, AL, NITE_OWL)
- `intent`: Intent to detect (conversation_opener, socratic_guidance, escape_hatch, etc.)
- `category`: Grouping (greeting, confusion_signal, exit_socratic, etc.)
- `trigger_phrase`: Keyword or regex pattern to match
- `weight`: Score multiplier (0.5 = weak signal, 2.0 = strong signal)
- `priority`: Order of importance (100 = escape_hatch, 95 = greeting, 85 = socratic)
- `is_regex`: Whether trigger_phrase is a regex pattern

**Seeded Data:**
- 60+ trigger phrases across all intents
- Comprehensive coverage of:
  - Greetings and conversation openers
  - Socratic guidance patterns
  - Escape hatch signals
  - Clarification requests
  - Platform questions
  - Procedural guidance

### 2. Helper Module: `triggerScoring.ts`
**Location:** `supabase/functions/ai-coach-orchestrator/helpers/triggerScoring.ts`

**Key Functions:**
- `fetchTriggers(supabaseClient)`: Loads all triggers from database (cached per request)
- `detectIntentFromTriggers(message, history, supabaseClient)`: Main detection function using keyword scoring
- `detectIntentFallback(message, history)`: Fallback to Phase 1 logic if database fails

**Scoring Algorithm:**
1. Load all trigger phrases from database
2. Check user message against each trigger (regex or substring matching)
3. Calculate score: `trigger.weight * (trigger.priority / 100)`
4. Aggregate scores per intent
5. Sort by priority then score
6. Return top intent with confidence based on score gap

### 3. Orchestrator Integration
**Location:** `supabase/functions/ai-coach-orchestrator/index.ts` (lines 1472-1532)

**Flow:**
1. **Database-Driven Detection** (primary):
   - Calls `detectIntentFromTriggers()`
   - Uses keyword scoring against all triggers
   - Returns intent, confidence, reasoning, and matched triggers

2. **Fallback Logic** (if database fails):
   - Catches errors and uses `detectIntentFallback()`
   - Implements Phase 1 hardcoded patterns
   - Ensures system never fails silently

3. **Context-Aware Overrides**:
   - Still applies session-state overrides
   - Example: Clarification requests during Betty sessions
   - Example: Platform questions in Betty context stay Socratic

## Benefits

### Flexibility
- **No Code Changes**: Add new triggers via SQL INSERT
- **A/B Testing**: Test different trigger weights/priorities in database
- **Live Tuning**: Adjust scoring without redeploying edge function

### Scalability
- **Extensible**: Add new intents without touching code
- **Maintainable**: All triggers in one table, easy to audit
- **Version Control**: Database migrations track trigger evolution

### Performance
- **Caching**: Triggers loaded once per request
- **Efficient**: Simple keyword matching, no AI calls
- **Fast Fallback**: Phase 1 logic ensures reliability

## Usage Examples

### Adding a New Trigger
```sql
INSERT INTO public.ai_persona_triggers 
(persona, intent, category, trigger_phrase, weight, priority)
VALUES
('BETTY', 'socratic_guidance', 'confusion_signal', 'stumped', 1.5, 85);
```

### Adjusting Trigger Weight
```sql
UPDATE public.ai_persona_triggers
SET weight = 2.0
WHERE trigger_phrase = 'help me understand';
```

### Viewing Top Triggers
```sql
SELECT intent, category, trigger_phrase, weight, priority
FROM public.ai_persona_triggers
ORDER BY priority DESC, weight DESC
LIMIT 20;
```

## Testing

### Test Conversation Opener
**Input:** "hey Betty you ready"
**Expected:** `conversation_opener` intent routed to Betty

### Test Socratic Guidance
**Input:** "I'm not sure about that, could you break it down?"
**Expected:** `socratic_guidance` intent with high confidence

### Test Escape Hatch
**Input:** "just tell me the answer"
**Expected:** `escape_hatch` intent routed to Al

### Test Fallback
- Temporarily break database connection
- Verify system uses Phase 1 fallback logic
- No user-facing errors

## Migration Path

### Current Status
✅ Phase 1 (Surgical Fixes): Complete
✅ Phase 2 (Database System): Complete

### Comparison

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| Intent Detection | Hardcoded if/else | Database keyword scoring |
| Trigger Count | ~20 patterns | 60+ phrases (expandable) |
| Adding Triggers | Code change + deploy | SQL INSERT (no deploy) |
| Testing Changes | Full redeploy | Database update |
| Fallback | None | Phase 1 logic |

## Future Enhancements

1. **Regex Triggers**: Enable `is_regex` flag for complex patterns
2. **User-Specific Overrides**: Per-user trigger weights for personalization
3. **Analytics Integration**: Track which triggers fire most frequently
4. **Dynamic Weighting**: Auto-adjust weights based on conversation outcomes
5. **Multi-Language**: Add trigger phrases for Spanish, French, etc.

## Maintenance

### Monitoring
- Check edge function logs for "[TRIGGER_SCORING]" entries
- Monitor database query performance on `ai_persona_triggers`
- Track fallback usage (should be rare)

### Optimization
- Add indexes if trigger table grows beyond 1000 rows
- Consider caching triggers in Redis for multi-function use
- Review and prune unused triggers quarterly
