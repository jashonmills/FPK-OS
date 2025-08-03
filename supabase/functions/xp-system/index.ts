
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface XPEvent {
  event_type: string;
  event_value: number;
  metadata?: any;
}

interface BadgeCheck {
  badge_id: string;
  criteria: any;
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

    const { action, ...payload } = await req.json()

    switch (action) {
      case 'award_xp':
        return await awardXP(supabaseClient, user.id, payload)
      case 'get_user_stats':
        return await getUserStats(supabaseClient, user.id)
      case 'check_badges':
        return await checkAndAwardBadges(supabaseClient, user.id)
      case 'update_streak':
        return await updateStreak(supabaseClient, user.id, payload.streak_type)
      case 'get_leaderboard':
        return await getLeaderboard(supabaseClient, payload.limit || 10)
      case 'purchase_item':
        return await purchaseShopItem(supabaseClient, user.id, payload.item_id)
      default:
        return new Response('Invalid action', { status: 400, headers: corsHeaders })
    }
  } catch (error) {
    console.error('XP System Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function awardXP(supabaseClient: any, userId: string, payload: XPEvent) {
  console.log(`Awarding ${payload.event_value} XP for ${payload.event_type}`)

  // Check for active quests and apply multipliers
  const { data: activeQuests } = await supabaseClient
    .from('quests')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString())
    .gte('end_date', new Date().toISOString())

  let multiplier = 1.0
  for (const quest of activeQuests || []) {
    const criteria = quest.criteria as any
    if (criteria.activity_types?.includes(payload.event_type)) {
      multiplier = Math.max(multiplier, quest.xp_multiplier)
    }
  }

  const finalXP = Math.round(payload.event_value * multiplier)

  // Record XP event
  const { error: eventError } = await supabaseClient
    .from('xp_events')
    .insert({
      user_id: userId,
      event_type: payload.event_type,
      event_value: finalXP,
      metadata: { ...payload.metadata, multiplier }
    })

  if (eventError) throw eventError

  // Get or create user XP record
  let { data: userXP, error: fetchError } = await supabaseClient
    .from('user_xp')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (fetchError && fetchError.code === 'PGRST116') {
    // Create new user XP record
    const { data: newUserXP, error: createError } = await supabaseClient
      .from('user_xp')
      .insert({ user_id: userId, total_xp: 0, level: 1, next_level_xp: 100 })
      .select()
      .single()

    if (createError) throw createError
    userXP = newUserXP
  } else if (fetchError) {
    throw fetchError
  }

  // Calculate new totals
  const newTotalXP = userXP.total_xp + finalXP
  
  // Calculate new level
  const { data: levelData } = await supabaseClient.rpc('calculate_level_from_xp', {
    total_xp: newTotalXP
  })

  const { level: newLevel, next_level_xp: xpToNext } = levelData[0]
  const leveledUp = newLevel > userXP.level

  // Update user XP
  const { error: updateError } = await supabaseClient
    .from('user_xp')
    .update({
      total_xp: newTotalXP,
      level: newLevel,
      next_level_xp: xpToNext
    })
    .eq('user_id', userId)

  if (updateError) throw updateError

  // Update profile total_xp for compatibility
  await supabaseClient
    .from('profiles')
    .update({ total_xp: newTotalXP })
    .eq('id', userId)

  // Check for new badges if leveled up
  let newBadges = []
  if (leveledUp) {
    const badgeResponse = await checkAndAwardBadges(supabaseClient, userId)
    const badgeData = await badgeResponse.json()
    newBadges = badgeData.newBadges || []
  }

  return new Response(JSON.stringify({
    success: true,
    xp_awarded: finalXP,
    total_xp: newTotalXP,
    level: newLevel,
    xp_to_next: xpToNext,
    leveled_up: leveledUp,
    multiplier: multiplier,
    new_badges: newBadges
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function getUserStats(supabaseClient: any, userId: string) {
  const [userXPResponse, badgesResponse, streaksResponse] = await Promise.all([
    supabaseClient.from('user_xp').select('*').eq('user_id', userId).single(),
    supabaseClient.from('user_badges').select('*, badges(*)').eq('user_id', userId),
    supabaseClient.from('streaks').select('*').eq('user_id', userId)
  ])

  const userXP = userXPResponse.data || { total_xp: 0, level: 1, next_level_xp: 100 }
  const badges = badgesResponse.data || []
  const streaks = streaksResponse.data || []

  return new Response(JSON.stringify({
    xp: userXP,
    badges: badges,
    streaks: streaks
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function checkAndAwardBadges(supabaseClient: any, userId: string) {
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
        const { count: flashcardCount } = await supabaseClient
          .from('flashcards')
          .select('id', { count: 'exact' })
          .eq('user_id', userId)
        earned = flashcardCount >= criteria.count
        break

      case 'study_streak':
        const { data: studyStreak } = await supabaseClient
          .from('streaks')
          .select('current_count')
          .eq('user_id', userId)
          .eq('streak_type', 'study')
          .single()
        earned = (studyStreak?.current_count || 0) >= criteria.count
        break

      case 'module_completed':
        const { count: moduleCount } = await supabaseClient
          .from('enrollments')
          .select('progress', { count: 'exact' })
          .eq('user_id', userId)
          .contains('progress', { completed: true })
        earned = moduleCount >= criteria.count
        break

      case 'reading_time':
        const { data: readingSessions } = await supabaseClient
          .from('reading_sessions')
          .select('duration_seconds')
          .eq('user_id', userId)
        const totalHours = (readingSessions || [])
          .reduce((sum, session) => sum + (session.duration_seconds || 0), 0) / 3600
        earned = totalHours >= criteria.hours
        break
    }

    if (earned) {
      await supabaseClient
        .from('user_badges')
        .insert({ user_id: userId, badge_id: badge.id })

      // Award badge XP
      if (badge.xp_reward > 0) {
        await awardXP(supabaseClient, userId, {
          event_type: 'badge_earned',
          event_value: badge.xp_reward,
          metadata: { badge_id: badge.badge_id }
        })
      }

      newBadges.push(badge)
    }
  }

  return new Response(JSON.stringify({ newBadges }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function updateStreak(supabaseClient: any, userId: string, streakType: string) {
  const today = new Date().toISOString().split('T')[0]
  
  let { data: streak, error } = await supabaseClient
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('streak_type', streakType)
    .single()

  if (error && error.code === 'PGRST116') {
    // Create new streak
    const { data: newStreak, error: createError } = await supabaseClient
      .from('streaks')
      .insert({
        user_id: userId,
        streak_type: streakType,
        start_date: today,
        current_count: 1,
        best_count: 1,
        last_activity_date: today
      })
      .select()
      .single()

    if (createError) throw createError
    
    // Award streak XP
    await awardXP(supabaseClient, userId, {
      event_type: 'streak_started',
      event_value: 5,
      metadata: { streak_type: streakType }
    })

    return new Response(JSON.stringify(newStreak), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (error) throw error

  const lastActivity = new Date(streak.last_activity_date)
  const todayDate = new Date(today)
  const diffDays = Math.floor((todayDate.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24))

  let newCount = streak.current_count
  let newBest = streak.best_count
  let newStart = streak.start_date

  if (diffDays === 0) {
    // Same day, no change
    return new Response(JSON.stringify(streak), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } else if (diffDays === 1) {
    // Consecutive day
    newCount += 1
    newBest = Math.max(newBest, newCount)
    
    // Award streak XP
    await awardXP(supabaseClient, userId, {
      event_type: 'streak_continued',
      event_value: Math.min(newCount, 10), // Cap at 10 XP per day
      metadata: { streak_type: streakType, count: newCount }
    })
  } else {
    // Streak broken
    newCount = 1
    newStart = today
    
    await awardXP(supabaseClient, userId, {
      event_type: 'streak_restarted',
      event_value: 5,
      metadata: { streak_type: streakType }
    })
  }

  const { data: updatedStreak, error: updateError } = await supabaseClient
    .from('streaks')
    .update({
      current_count: newCount,
      best_count: newBest,
      start_date: newStart,
      last_activity_date: today
    })
    .eq('id', streak.id)
    .select()
    .single()

  if (updateError) throw updateError

  return new Response(JSON.stringify(updatedStreak), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function getLeaderboard(supabaseClient: any, limit: number) {
  // Query user_xp with manual join to profiles since the relationship isn't direct
  const { data: userXpData, error: xpError } = await supabaseClient
    .from('user_xp')
    .select('user_id, total_xp, level')
    .order('total_xp', { ascending: false })
    .limit(limit)

  if (xpError) {
    console.error('Error fetching user XP:', xpError)
    throw xpError
  }

  if (!userXpData || userXpData.length === 0) {
    return new Response(JSON.stringify([]), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Get user profiles separately
  const userIds = userXpData.map(item => item.user_id)
  const { data: profilesData, error: profilesError } = await supabaseClient
    .from('profiles')
    .select('id, display_name, full_name, avatar_url')
    .in('id', userIds)

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError)
    // Continue without profiles if profiles fetch fails
  }

  // Combine the data
  const leaderboard = userXpData.map(xpItem => {
    const profile = profilesData?.find(p => p.id === xpItem.user_id) || {}
    return {
      user_id: xpItem.user_id,
      total_xp: xpItem.total_xp,
      level: xpItem.level,
      display_name: profile.display_name || profile.full_name || 'Anonymous',
      full_name: profile.full_name || '',
      avatar_url: profile.avatar_url || null
    }
  })

  return new Response(JSON.stringify(leaderboard), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

async function purchaseShopItem(supabaseClient: any, userId: string, itemId: string) {
  // Get user's current XP
  const { data: userXP, error: xpError } = await supabaseClient
    .from('user_xp')
    .select('total_xp')
    .eq('user_id', userId)
    .single()

  if (xpError) throw xpError

  // Get shop item
  const { data: item, error: itemError } = await supabaseClient
    .from('shop_items')
    .select('*')
    .eq('item_id', itemId)
    .eq('is_available', true)
    .single()

  if (itemError) throw itemError

  if (userXP.total_xp < item.xp_cost) {
    return new Response(JSON.stringify({ error: 'Insufficient XP' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  // Record purchase
  const { error: purchaseError } = await supabaseClient
    .from('user_purchases')
    .insert({
      user_id: userId,
      shop_item_id: item.id,
      xp_spent: item.xp_cost
    })

  if (purchaseError) throw purchaseError

  // Deduct XP
  const newTotalXP = userXP.total_xp - item.xp_cost
  const { error: updateError } = await supabaseClient
    .from('user_xp')
    .update({ total_xp: newTotalXP })
    .eq('user_id', userId)

  if (updateError) throw updateError

  return new Response(JSON.stringify({
    success: true,
    item_purchased: item,
    xp_spent: item.xp_cost,
    remaining_xp: newTotalXP
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}
