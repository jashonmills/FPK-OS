
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BackfillResult {
  user_id: string;
  before_xp: number;
  after_xp: number;
  before_level: number;
  after_level: number;
  events_created: number;
  badges_awarded: string[];
  activities_processed: {
    flashcards: number;
    study_sessions: number;
    notes: number;
    goals: number;
    reading_sessions: number;
    file_uploads: number;
  };
}

interface ActivitySummary {
  flashcards: any[];
  study_sessions: any[];
  notes: any[];
  goals: any[];
  reading_sessions: any[];
  file_uploads: any[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { action, dry_run = false, user_id = null } = await req.json()

    switch (action) {
      case 'backfill_xp':
        return await backfillUserXP(supabaseClient, user_id || user.id, dry_run)
      case 'backfill_all_users':
        return await backfillAllUsers(supabaseClient, dry_run)
      case 'rollback_backfill':
        return await rollbackBackfill(supabaseClient, user_id || user.id)
      case 'get_backfill_report':
        return await getBackfillReport(supabaseClient, user_id || user.id)
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('XP Backfill Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function backfillUserXP(supabaseClient: any, userId: string, dryRun: boolean = false): Promise<Response> {
  console.log(`Starting XP backfill for user ${userId}, dry_run: ${dryRun}`)

  // Get user's current XP state
  const { data: currentXP } = await supabaseClient
    .from('user_xp')
    .select('*')
    .eq('user_id', userId)
    .single()

  const beforeXP = currentXP?.total_xp || 0
  const beforeLevel = currentXP?.level || 1

  // Collect all historical activities
  const activities = await collectUserActivities(supabaseClient, userId)
  console.log(`Collected activities for user ${userId}:`, {
    flashcards: activities.flashcards.length,
    study_sessions: activities.study_sessions.length,
    notes: activities.notes.length,
    goals: activities.goals.length,
    reading_sessions: activities.reading_sessions.length,
    file_uploads: activities.file_uploads.length
  })

  // Generate XP events (idempotent)
  const xpEvents = await generateXPEvents(supabaseClient, userId, activities, dryRun)
  console.log(`Generated ${xpEvents.length} XP events for user ${userId}`)

  if (dryRun) {
    // Calculate what the totals would be
    const totalBackfillXP = xpEvents.reduce((sum, event) => sum + event.event_value, 0)
    const projectedTotalXP = beforeXP + totalBackfillXP
    
    const { data: levelData } = await supabaseClient.rpc('calculate_level_from_xp', {
      total_xp: projectedTotalXP
    })
    const projectedLevel = levelData?.[0]?.level || 1

    return new Response(JSON.stringify({
      dry_run: true,
      user_id: userId,
      before_xp: beforeXP,
      projected_after_xp: projectedTotalXP,
      before_level: beforeLevel,
      projected_after_level: projectedLevel,
      events_to_create: xpEvents.length,
      backfill_xp: totalBackfillXP,
      activities_found: {
        flashcards: activities.flashcards.length,
        study_sessions: activities.study_sessions.length,
        notes: activities.notes.length,
        goals: activities.goals.length,
        reading_sessions: activities.reading_sessions.length,
        file_uploads: activities.file_uploads.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Insert XP events
  if (xpEvents.length > 0) {
    const { error: insertError } = await supabaseClient
      .from('xp_events')
      .insert(xpEvents)

    if (insertError) {
      console.error('Error inserting XP events:', insertError)
      throw insertError
    }
  }

  // Recalculate user totals
  const { data: totalXPResult } = await supabaseClient
    .from('xp_events')
    .select('event_value')
    .eq('user_id', userId)

  const newTotalXP = totalXPResult?.reduce((sum: number, event: any) => sum + event.event_value, 0) || 0

  // Calculate new level
  const { data: levelData } = await supabaseClient.rpc('calculate_level_from_xp', {
    total_xp: newTotalXP
  })

  const newLevel = levelData?.[0]?.level || 1
  const nextLevelXP = levelData?.[0]?.next_level_xp || 100

  // Update user XP record
  await supabaseClient
    .from('user_xp')
    .upsert({
      user_id: userId,
      total_xp: newTotalXP,
      level: newLevel,
      next_level_xp: nextLevelXP
    })

  // Update profile for compatibility
  await supabaseClient
    .from('profiles')
    .update({ total_xp: newTotalXP })
    .eq('id', userId)

  // Check and award retroactive badges
  const newBadges = await checkAndAwardRetroactiveBadges(supabaseClient, userId, activities)

  const result: BackfillResult = {
    user_id: userId,
    before_xp: beforeXP,
    after_xp: newTotalXP,
    before_level: beforeLevel,
    after_level: newLevel,
    events_created: xpEvents.length,
    badges_awarded: newBadges.map(b => b.name),
    activities_processed: {
      flashcards: activities.flashcards.length,
      study_sessions: activities.study_sessions.length,
      notes: activities.notes.length,
      goals: activities.goals.length,
      reading_sessions: activities.reading_sessions.length,
      file_uploads: activities.file_uploads.length
    }
  }

  console.log('Backfill completed for user:', result)

  return new Response(JSON.stringify(result), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function collectUserActivities(supabaseClient: any, userId: string): Promise<ActivitySummary> {
  const [
    flashcardsResponse,
    studySessionsResponse,
    notesResponse,
    goalsResponse,
    readingSessionsResponse,
    fileUploadsResponse
  ] = await Promise.all([
    supabaseClient.from('flashcards').select('*').eq('user_id', userId),
    supabaseClient.from('study_sessions').select('*').eq('user_id', userId).not('completed_at', 'is', null),
    supabaseClient.from('notes').select('*').eq('user_id', userId),
    supabaseClient.from('goals').select('*').eq('user_id', userId).eq('status', 'completed'),
    supabaseClient.from('reading_sessions').select('*').eq('user_id', userId),
    supabaseClient.from('file_uploads').select('*').eq('user_id', userId).eq('processing_status', 'completed')
  ])

  return {
    flashcards: flashcardsResponse.data || [],
    study_sessions: studySessionsResponse.data || [],
    notes: notesResponse.data || [],
    goals: goalsResponse.data || [],
    reading_sessions: readingSessionsResponse.data || [],
    file_uploads: fileUploadsResponse.data || []
  }
}

async function generateXPEvents(supabaseClient: any, userId: string, activities: ActivitySummary, dryRun: boolean): Promise<any[]> {
  const events: any[] = []

  // Check existing events to avoid duplicates
  const { data: existingEvents } = await supabaseClient
    .from('xp_events')
    .select('metadata')
    .eq('user_id', userId)

  const existingSourceIds = new Set(
    existingEvents?.map((e: any) => e.metadata?.source_id).filter(Boolean) || []
  )

  // Flashcard creation XP (5 XP each)
  for (const flashcard of activities.flashcards) {
    if (!existingSourceIds.has(`flashcard_${flashcard.id}`)) {
      events.push({
        user_id: userId,
        event_type: 'flashcard_created',
        event_value: 5,
        metadata: {
          source_id: `flashcard_${flashcard.id}`,
          flashcard_id: flashcard.id,
          description: 'Retroactive XP for flashcard creation',
          backfill: true
        },
        created_at: flashcard.created_at
      })
    }
  }

  // Study session XP (variable based on performance)
  for (const session of activities.study_sessions) {
    if (!existingSourceIds.has(`study_session_${session.id}`)) {
      const baseXP = Math.floor((session.correct_answers || 0) / 10) * 5
      const accuracyBonus = (session.correct_answers === session.total_cards) ? 10 : 0
      const speedBonus = (session.session_duration_seconds < 300) ? 5 : 0
      const totalXP = baseXP + accuracyBonus + speedBonus

      events.push({
        user_id: userId,
        event_type: 'flashcard_study',
        event_value: Math.max(totalXP, 5), // Minimum 5 XP per session
        metadata: {
          source_id: `study_session_${session.id}`,
          session_id: session.id,
          correct_answers: session.correct_answers,
          total_cards: session.total_cards,
          duration_seconds: session.session_duration_seconds,
          description: 'Retroactive XP for study session',
          backfill: true
        },
        created_at: session.completed_at || session.created_at
      })
    }
  }

  // Note creation XP (10 XP each)
  for (const note of activities.notes) {
    if (!existingSourceIds.has(`note_${note.id}`)) {
      events.push({
        user_id: userId,
        event_type: 'note_created',
        event_value: 10,
        metadata: {
          source_id: `note_${note.id}`,
          note_id: note.id,
          description: 'Retroactive XP for note creation',
          backfill: true
        },
        created_at: note.created_at
      })
    }
  }

  // Goal completion XP (30-50 XP based on priority)
  for (const goal of activities.goals) {
    if (!existingSourceIds.has(`goal_${goal.id}`)) {
      let xpValue = 30
      switch (goal.priority) {
        case 'high': xpValue = 50; break
        case 'medium': xpValue = 40; break
        case 'low': xpValue = 30; break
      }

      events.push({
        user_id: userId,
        event_type: 'goal_completed',
        event_value: xpValue,
        metadata: {
          source_id: `goal_${goal.id}`,
          goal_id: goal.id,
          priority: goal.priority,
          description: 'Retroactive XP for goal completion',
          backfill: true
        },
        created_at: goal.completed_at || goal.updated_at
      })
    }
  }

  // Reading session XP (time + page based)
  for (const session of activities.reading_sessions) {
    if (!existingSourceIds.has(`reading_session_${session.id}`)) {
      const timeXP = Math.floor((session.duration_seconds || 0) / 600) * 5 // 5 XP per 10 minutes
      const pageXP = (session.pages_read || 0) * 2 // 2 XP per page
      const totalXP = Math.max(timeXP + pageXP, 5) // Minimum 5 XP

      events.push({
        user_id: userId,
        event_type: 'reading_session',
        event_value: totalXP,
        metadata: {
          source_id: `reading_session_${session.id}`,
          session_id: session.id,
          duration_seconds: session.duration_seconds,
          pages_read: session.pages_read,
          description: 'Retroactive XP for reading session',
          backfill: true
        },
        created_at: session.session_end || session.created_at
      })
    }
  }

  // File upload XP (15 XP each)
  for (const upload of activities.file_uploads) {
    if (!existingSourceIds.has(`file_upload_${upload.id}`)) {
      events.push({
        user_id: userId,
        event_type: 'file_uploaded',
        event_value: 15,
        metadata: {
          source_id: `file_upload_${upload.id}`,
          upload_id: upload.id,
          file_name: upload.file_name,
          description: 'Retroactive XP for file upload',
          backfill: true
        },
        created_at: upload.updated_at
      })
    }
  }

  return events
}

async function checkAndAwardRetroactiveBadges(supabaseClient: any, userId: string, activities: ActivitySummary): Promise<any[]> {
  // Get all available badges
  const { data: allBadges } = await supabaseClient
    .from('badges')
    .select('*')

  // Get user's current badges
  const { data: userBadges } = await supabaseClient
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badge_id) || [])
  const newBadges = []

  for (const badge of allBadges || []) {
    if (earnedBadgeIds.has(badge.id)) continue

    const criteria = badge.criteria as any
    let earned = false

    switch (criteria.type) {
      case 'flashcard_created':
        earned = activities.flashcards.length >= criteria.count
        break

      case 'study_streak':
        // This would need more complex calculation based on study session dates
        // For now, skip streak badges in backfill
        break

      case 'module_completed':
        // Get module completions from enrollments
        const { data: completions } = await supabaseClient
          .from('enrollments')
          .select('progress')
          .eq('user_id', userId)
        
        const moduleCount = completions?.filter((e: any) => e.progress?.completed === true).length || 0
        earned = moduleCount >= criteria.count
        break

      case 'reading_time':
        const totalHours = activities.reading_sessions
          .reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / 3600
        earned = totalHours >= criteria.hours
        break
    }

    if (earned) {
      await supabaseClient
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badge.id })

      newBadges.push(badge)
    }
  }

  return newBadges
}

async function backfillAllUsers(supabaseClient: any, dryRun: boolean): Promise<Response> {
  // Get all users who have activities
  const { data: activeUsers } = await supabaseClient
    .from('profiles')
    .select('id')
    .not('id', 'is', null)

  const results: BackfillResult[] = []
  
  for (const user of activeUsers || []) {
    try {
      const userResult = await backfillUserXP(supabaseClient, user.id, dryRun)
      const userResultData = await userResult.json()
      results.push(userResultData)
    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error)
      results.push({
        user_id: user.id,
        before_xp: 0,
        after_xp: 0,
        before_level: 1,
        after_level: 1,
        events_created: 0,
        badges_awarded: [],
        activities_processed: {
          flashcards: 0,
          study_sessions: 0,
          notes: 0,
          goals: 0,
          reading_sessions: 0,
          file_uploads: 0
        }
      })
    }
  }

  const summary = {
    dry_run: dryRun,
    users_processed: results.length,
    total_xp_awarded: results.reduce((sum, r) => sum + (r.after_xp - r.before_xp), 0),
    total_events_created: results.reduce((sum, r) => sum + r.events_created, 0),
    total_badges_awarded: results.reduce((sum, r) => sum + r.badges_awarded.length, 0),
    results: results
  }

  return new Response(JSON.stringify(summary), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function rollbackBackfill(supabaseClient: any, userId: string): Promise<Response> {
  console.log(`Rolling back XP backfill for user ${userId}`)

  // Delete all backfill XP events
  const { data: deletedEvents, error: deleteError } = await supabaseClient
    .from('xp_events')
    .delete()
    .eq('user_id', userId)
    .contains('metadata', { backfill: true })
    .select()

  if (deleteError) {
    throw deleteError
  }

  // Recalculate totals after rollback
  const { data: remainingEvents } = await supabaseClient
    .from('xp_events')
    .select('event_value')
    .eq('user_id', userId)

  const newTotalXP = remainingEvents?.reduce((sum: number, event: any) => sum + event.event_value, 0) || 0

  // Calculate new level
  const { data: levelData } = await supabaseClient.rpc('calculate_level_from_xp', {
    total_xp: newTotalXP
  })

  const newLevel = levelData?.[0]?.level || 1
  const nextLevelXP = levelData?.[0]?.next_level_xp || 100

  // Update user XP record
  await supabaseClient
    .from('user_xp')
    .upsert({
      user_id: userId,
      total_xp: newTotalXP,
      level: newLevel,
      next_level_xp: nextLevelXP
    })

  // Update profile
  await supabaseClient
    .from('profiles')
    .update({ total_xp: newTotalXP })
    .eq('id', userId)

  return new Response(JSON.stringify({
    user_id: userId,
    events_deleted: deletedEvents?.length || 0,
    new_total_xp: newTotalXP,
    new_level: newLevel,
    message: 'Backfill rollback completed successfully'
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function getBackfillReport(supabaseClient: any, userId: string): Promise<Response> {
  const { data: userXP } = await supabaseClient
    .from('user_xp')
    .select('*')
    .eq('user_id', userId)
    .single()

  const { data: xpEvents } = await supabaseClient
    .from('xp_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const { data: userBadges } = await supabaseClient
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId)

  const backfillEvents = xpEvents?.filter((e: any) => e.metadata?.backfill === true) || []
  const regularEvents = xpEvents?.filter((e: any) => e.metadata?.backfill !== true) || []

  return new Response(JSON.stringify({
    user_id: userId,
    current_xp: userXP?.total_xp || 0,
    current_level: userXP?.level || 1,
    total_events: xpEvents?.length || 0,
    backfill_events: backfillEvents.length,
    regular_events: regularEvents.length,
    backfill_xp: backfillEvents.reduce((sum: number, e: any) => sum + e.event_value, 0),
    regular_xp: regularEvents.reduce((sum: number, e: any) => sum + e.event_value, 0),
    badges_earned: userBadges?.length || 0,
    recent_events: xpEvents?.slice(0, 10) || []
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
