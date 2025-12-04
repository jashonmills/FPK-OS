import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserWithMetrics {
  id: string
  name: string
  email: string
  roles: string[]
  createdAt: string
  lastActiveAt: string | null
  weeklySeconds: number
  enrollmentCount: number
  avgProgressPercent: number
  goalsActive: number
  goalsCompleted: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get current user and check admin role
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)

    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Check if user has admin role
    const { data: userRoles } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    const isAdmin = userRoles?.some(r => r.role === 'admin')
    const isInstructor = userRoles?.some(r => r.role === 'instructor')

    if (!isAdmin && !isInstructor) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders })
    }

    // Parse query parameters from both URL and body
    const url = new URL(req.url)
    let params = {}
    
    if (req.method === 'POST') {
      params = await req.json()
    } else {
      // GET request - parse from URL
      params = {
        page: parseInt(url.searchParams.get('page') || '1'),
        pageSize: parseInt(url.searchParams.get('pageSize') || '20'),
        search: url.searchParams.get('search') || '',
        role: url.searchParams.get('role') || 'all',
        activity: url.searchParams.get('activity') || 'all',
        progressBand: url.searchParams.get('progressBand') || 'all',
        hasGoals: url.searchParams.get('hasGoals') || 'all',
        sortBy: url.searchParams.get('sortBy') || 'createdAt',
        sortDir: url.searchParams.get('sortDir') || 'desc'
      }
    }

    const {
      page = 1,
      pageSize = 20,
      search = '',
      role = 'all',
      activity = 'all',
      progressBand = 'all',
      hasGoals = 'all',
      sortBy = 'createdAt',
      sortDir = 'desc'
    } = params

    console.log('Processing request with params:', params)

    // Get ALL profiles first (without pagination) to properly filter and count
    let profilesQuery = supabaseClient
      .from('profiles')
      .select('id, full_name, display_name, created_at')

    // Add search filter if provided
    if (search) {
      profilesQuery = profilesQuery.or(`full_name.ilike.%${search}%,display_name.ilike.%${search}%`)
    }

    // Add organization filter for instructors
    if (isInstructor && !isAdmin) {
      const { data: orgMembers } = await supabaseClient
        .from('org_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('role', 'owner')

      if (orgMembers && orgMembers.length > 0) {
        const orgIds = orgMembers.map(om => om.organization_id)
        const { data: orgMemberUsers } = await supabaseClient
          .from('org_members')
          .select('user_id')
          .in('organization_id', orgIds)
          .eq('status', 'active')

        if (orgMemberUsers && orgMemberUsers.length > 0) {
          const userIds = orgMemberUsers.map(omu => omu.user_id)
          profilesQuery = profilesQuery.in('id', userIds)
        }
      }
    }

    // Apply sorting
    if (sortBy === 'createdAt') {
      profilesQuery = profilesQuery.order('created_at', { ascending: sortDir === 'asc' })
    } else {
      profilesQuery = profilesQuery.order('created_at', { ascending: false })
    }

    // Get all matching profiles first
    const { data: allProfiles, error: profilesError } = await profilesQuery

    if (profilesError) {
      console.error('Profiles query error:', profilesError)
      throw profilesError
    }

    if (!allProfiles || allProfiles.length === 0) {
      return new Response(
        JSON.stringify({
          users: [],
          pagination: { page, pageSize, total: 0, totalPages: 0 }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get detailed user data with metrics for each profile
    const users: UserWithMetrics[] = await Promise.all(
      allProfiles.map(async (profile) => {
        // Get user roles
        const { data: roles } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', profile.id)

        // Get enrollment count and avg progress
        const { data: enrollments } = await supabaseClient
          .from('enrollments')
          .select('progress')
          .eq('user_id', profile.id)

        let avgProgressPercent = 0
        if (enrollments && enrollments.length > 0) {
          const progressValues = enrollments
            .map(e => e.progress && typeof e.progress === 'object' && 'completion_percentage' in e.progress 
              ? Number(e.progress.completion_percentage) || 0 
              : 0)
          avgProgressPercent = Math.round(
            progressValues.reduce((sum, val) => sum + val, 0) / progressValues.length
          )
        }

        // Get goal counts
        const { data: goals } = await supabaseClient
          .from('goals')
          .select('status')
          .eq('user_id', profile.id)

        const goalsActive = goals?.filter(g => g.status === 'active').length || 0
        const goalsCompleted = goals?.filter(g => g.status === 'completed').length || 0

        // Get activity data for last active and weekly time
        const weekStart = new Date()
        weekStart.setDate(weekStart.getDate() - weekStart.getDay())
        
        const { data: dailyActivities } = await supabaseClient
          .from('daily_activities')
          .select('activity_date, duration_minutes, created_at')
          .eq('user_id', profile.id)
          .gte('activity_date', weekStart.toISOString().split('T')[0])

        const weeklySeconds = dailyActivities?.reduce(
          (sum, activity) => sum + (activity.duration_minutes * 60), 0
        ) || 0

        // Get latest activity timestamp
        const { data: latestChatSession } = await supabaseClient
          .from('chat_sessions')
          .select('updated_at')
          .eq('user_id', profile.id)
          .order('updated_at', { ascending: false })
          .limit(1)

        const { data: latestReadingSession } = await supabaseClient
          .from('reading_sessions')
          .select('session_start')
          .eq('user_id', profile.id)  
          .order('session_start', { ascending: false })
          .limit(1)

        const { data: latestStudySession } = await supabaseClient
          .from('study_sessions')
          .select('created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)

        const activityDates = [
          dailyActivities?.[0]?.created_at,
          latestChatSession?.[0]?.updated_at,
          latestReadingSession?.[0]?.session_start,
          latestStudySession?.[0]?.created_at
        ].filter(Boolean)

        const lastActiveAt = activityDates.length > 0 
          ? activityDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
          : null

        // Try to get auth user email
        let email = `${profile.full_name?.toLowerCase().replace(/\s+/g, '.')}@fpkuniversity.com`
        try {
          const { data: authUser } = await supabaseClient.auth.admin.getUserById(profile.id)
          if (authUser?.user?.email) {
            email = authUser.user.email
          }
        } catch (e) {
          console.log('Could not get auth email for user', profile.id)
        }

        return {
          id: profile.id,
          name: profile.full_name || profile.display_name || 'Unknown User',
          email,
          roles: roles?.map(r => r.role) || [],
          createdAt: profile.created_at,
          lastActiveAt,
          weeklySeconds,
          enrollmentCount: enrollments?.length || 0,
          avgProgressPercent,
          goalsActive,
          goalsCompleted
        }
      })
    )

    // Apply role filter
    let filteredUsers = users
    if (role !== 'all') {
      filteredUsers = users.filter(user => user.roles.includes(role))
    }

    // Apply activity filter
    if (activity === 'active_7d') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      filteredUsers = filteredUsers.filter(user => 
        user.lastActiveAt && new Date(user.lastActiveAt) >= sevenDaysAgo
      )
    } else if (activity === 'inactive_14d') {
      const fourteenDaysAgo = new Date()
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
      filteredUsers = filteredUsers.filter(user => 
        !user.lastActiveAt || new Date(user.lastActiveAt) < fourteenDaysAgo
      )
    }

    // Apply progress band filter
    if (progressBand !== 'all') {
      const [min, max] = progressBand.split('-').map(Number)
      if (max) {
        filteredUsers = filteredUsers.filter(user => 
          user.avgProgressPercent >= min && user.avgProgressPercent <= max
        )
      } else {
        filteredUsers = filteredUsers.filter(user => user.avgProgressPercent >= min)
      }
    }

    // Apply goals filter
    if (hasGoals === 'yes') {
      filteredUsers = filteredUsers.filter(user => 
        user.goalsActive > 0 || user.goalsCompleted > 0
      )
    } else if (hasGoals === 'no') {
      filteredUsers = filteredUsers.filter(user => 
        user.goalsActive === 0 && user.goalsCompleted === 0
      )
    }

    // Apply sorting (if not sorted by creation date already)
    if (sortBy !== 'createdAt') {
      filteredUsers.sort((a, b) => {
        const aVal = sortBy === 'lastActive' ? (a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0) :
                     sortBy === 'courses' ? a.enrollmentCount :
                     sortBy === 'avgProgress' ? a.avgProgressPercent :
                     sortBy === 'timeWeek' ? a.weeklySeconds : 0
        
        const bVal = sortBy === 'lastActive' ? (b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0) :
                     sortBy === 'courses' ? b.enrollmentCount :
                     sortBy === 'avgProgress' ? b.avgProgressPercent :
                     sortBy === 'timeWeek' ? b.weeklySeconds : 0
        
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal
      })
    }

    // Apply pagination after filtering
    const offset = (page - 1) * pageSize
    const paginatedUsers = filteredUsers.slice(offset, offset + pageSize)
    const totalFiltered = filteredUsers.length

    return new Response(
      JSON.stringify({
        users: paginatedUsers,
        pagination: {
          page,
          pageSize,
          total: totalFiltered,
          totalPages: Math.ceil(totalFiltered / pageSize)
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in admin-users-with-metrics:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})