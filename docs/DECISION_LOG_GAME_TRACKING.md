# Decision Log: Game Tracking Architecture

## Executive Summary

**Current Status:** The Games feature is **live and complete** for the initial launch.

- ✅ Games are accessible via the organization dashboard
- ✅ Games function via unauthenticated `<iframe>` embedding
- ✅ **This is intentional** - tracking implementation is deferred to a future phase

**Selected Architecture:** Unified Auth & Direct Database Writes (implementation pending)

---

## Architectural Options Evaluated

### 1. SCORM 1.2 Integration ❌ (Researched, Not Implemented)

**Description:** Standard e-learning content packaging format using XML manifests and JavaScript API wrappers.

**Pros:**
- Industry-standard approach
- LMS compatibility
- Established tracking protocols

**Cons:**
- Complex wrapper structure requiring multiple layers
- Requires external LMS infrastructure
- Overkill for our use case
- Difficult to maintain and debug

**Status:** Reference implementation preserved in `docs/future-reference/scorm-implementation/`

**Conclusion:** Valuable for LMS exports, but too heavyweight for our integrated platform.

---

### 2. postMessage API ❌ (Considered, Not Implemented)

**Description:** Native browser API for cross-origin iframe communication.

**Pros:**
- Native browser support (no dependencies)
- Real-time bidirectional communication
- Event-based architecture

**Cons:**
- Complex message protocol design required
- Each game needs custom integration code
- Security considerations for message validation
- No built-in authentication flow

**Status:** Deferred - not the right fit for our architecture

**Conclusion:** Too much custom integration work per game; doesn't leverage our existing Supabase infrastructure.

---

### 3. Unified Auth & Direct Database Writes ✅ (Selected Architecture)

**Description:** Games authenticate as the logged-in user and write progress data directly to our Supabase database tables.

**Pros:**
- **Leverages existing infrastructure:** Uses our Supabase auth and database
- **No middleware layers:** Games communicate directly with the database
- **Consistent with platform architecture:** Same patterns as the rest of the application
- **Secure by design:** Row Level Security (RLS) policies enforce access control
- **Real-time updates:** Progress reflects immediately in the dashboard
- **Simple maintenance:** One standardized auth package for all games

**Cons:**
- Requires creating a reusable authentication package
- Games must be updated to integrate the package
- Initial setup effort (one-time cost)

**Status:** **Selected approach - implementation pending authentication package**

**Why This Is The Best Choice:**
1. **Architectural Consistency:** Uses the same Supabase infrastructure as the entire platform
2. **Scalability:** No additional services or middleware to maintain
3. **Developer Experience:** Simple, predictable integration pattern
4. **User Experience:** Real-time progress tracking with no delays
5. **Security:** RLS policies ensure users can only write their own data

---

## Implementation Roadmap

### Prerequisites

Before implementing game tracking, we must create a **standardized authentication package** that can be embedded in all standalone games.

**The package must handle:**
- Supabase authentication token passing from parent window
- User context preservation (user ID, organization ID)
- Session management and token refresh
- RLS policy compliance
- Error handling and fallback states

### Implementation Phases

#### Phase 1: Create Reusable Auth Package
- Design the authentication package API
- Implement Supabase client initialization in games
- Handle token passing from parent window
- Test authentication flow

#### Phase 2: Database Schema for Game Progress
- Design `game_progress` table
- Implement RLS policies
- Create database functions for progress updates
- Add analytics and reporting queries

#### Phase 3: Integrate Auth Package into Games
- Update all 7 games with the standardized package
- Implement progress tracking calls in each game
- Test cross-origin authentication
- Verify RLS policies work correctly

#### Phase 4: Dashboard UI Updates
- Add progress visualization components
- Display completion status on Games page
- Show scores and achievements (if applicable)
- Add analytics and reporting for instructors

---

## Current State (Go-Live Configuration)

### What's Live:
- ✅ "Games" tab in organization dashboard (`/org/:id/games`)
- ✅ Games playable in iframe modal (desktop) or full-screen (mobile)
- ✅ Responsive layout with proper navigation
- ✅ Clean, functional user experience

### What's Intentionally NOT Included:
- ❌ User authentication in games
- ❌ Progress tracking
- ❌ Score recording
- ❌ Completion status
- ❌ Analytics or reporting

**This is the designed launch state.** Games are standalone educational tools without tracking. This allows us to:
- Launch the feature quickly
- Gather user feedback on game selection and UX
- Build the tracking infrastructure properly without rushing

---

## Technical Implementation Notes

### Key Files (Current Implementation):
- `src/pages/organizations/OrganizationGamesPage.tsx` - Main games dashboard
- `src/pages/FullScreenGamePage.tsx` - Full-screen game view (mobile)
- `src/components/GameCardModal.tsx` - Game modal component (desktop)

### Database Tables (Future):
```sql
-- To be created in Phase 2
CREATE TABLE game_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  organization_id UUID REFERENCES organizations NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB -- For game-specific data
);
```

### Authentication Flow (Future):
```javascript
// Parent window (FPK University app)
const gameUrl = new URL(game.url);
gameUrl.searchParams.set('auth_token', session.access_token);
gameUrl.searchParams.set('user_id', user.id);
gameUrl.searchParams.set('org_id', organization.id);

// Game receives and initializes Supabase
const params = new URLSearchParams(window.location.search);
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: {
    headers: {
      Authorization: `Bearer ${params.get('auth_token')}`
    }
  }
});
```

---

## Decision Timeline

- **Initial Exploration:** SCORM and postMessage evaluated
- **Architecture Decision:** Unified Auth & Direct DB selected (documented here)
- **Go-Live Decision:** Launch without tracking to ship faster
- **Future Implementation:** Pending standardized auth package

---

## Related Documentation

- **SCORM Reference Implementation:** `docs/future-reference/scorm-implementation/`
- **Game URLs:** Defined in `src/pages/organizations/OrganizationGamesPage.tsx`
- **Supabase Setup:** `src/integrations/supabase/`

---

## Success Criteria (Future Implementation)

When we implement tracking, it will be considered successful when:

1. ✅ Users can play games with their authenticated session
2. ✅ Progress is automatically saved to the database
3. ✅ Dashboard displays accurate completion status
4. ✅ Instructors can view student game analytics
5. ✅ All 7 games use the same standardized auth package
6. ✅ No game-specific custom integration code required
7. ✅ RLS policies prevent data leakage between users

---

**Last Updated:** 2025-10-12  
**Status:** Games feature live; tracking implementation deferred  
**Next Action:** Create standardized authentication package when ready to implement tracking
