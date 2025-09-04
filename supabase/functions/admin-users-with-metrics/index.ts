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

    // Parse query parameters
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const search = url.searchParams.get('search') || ''
    const role = url.searchParams.get('role') || 'all'
    const activity = url.searchParams.get('activity') || 'all'
    const progressBand = url.searchParams.get('progressBand') || 'all'
    const hasGoals = url.searchParams.get('hasGoals') || 'all'
    const sortBy = url.searchParams.get('sortBy') || 'createdAt'
    const sortDir = url.searchParams.get('sortDir') || 'desc'

    const offset = (page - 1) * pageSize

    // Build base query for users with all metrics
    let query = `
      SELECT DISTINCT
        p.id,
        p.full_name as name,
        p.created_at,
        COALESCE(
          GREATEST(
            COALESCE(MAX(da.created_at), '1970-01-01'::timestamptz),
            COALESCE(MAX(cs.updated_at), '1970-01-01'::timestamptz),
            COALESCE(MAX(rs.session_start), '1970-01-01'::timestamptz),
            COALESCE(MAX(ss.created_at), '1970-01-01'::timestamptz)
          ),
          '1970-01-01'::timestamptz
        ) as last_active_at,
        COALESCE(SUM(
          CASE 
            WHEN da.activity_date >= DATE_TRUNC('week', CURRENT_DATE) 
            THEN da.duration_minutes * 60
            ELSE 0 
          END
        ), 0) as weekly_seconds,
        COUNT(DISTINCT e.id) as enrollment_count,
        COALESCE(AVG(
          COALESCE((e.progress->>'completion_percentage')::numeric, 0)
        ), 0) as avg_progress_percent,
        COUNT(DISTINCT CASE WHEN g.status = 'active' THEN g.id END) as goals_active,
        COUNT(DISTINCT CASE WHEN g.status = 'completed' THEN g.id END) as goals_completed
      FROM profiles p
      LEFT JOIN daily_activities da ON da.user_id = p.id
      LEFT JOIN chat_sessions cs ON cs.user_id = p.id  
      LEFT JOIN reading_sessions rs ON rs.user_id = p.id
      LEFT JOIN study_sessions ss ON ss.user_id = p.id
      LEFT JOIN enrollments e ON e.user_id = p.id
      LEFT JOIN goals g ON g.user_id = p.id
    `

    // Add organization filter for instructors
    if (isInstructor && !isAdmin) {
      query += `
        INNER JOIN org_members om ON om.user_id = p.id
        WHERE om.organization_id IN (
          SELECT organization_id FROM org_members 
          WHERE user_id = '${user.id}' AND role = 'owner'
        )
      `
    } else {
      query += ` WHERE 1=1 `
    }

    // Add search filter
    if (search) {
      query += ` AND (p.full_name ILIKE '%${search}%' OR p.display_name ILIKE '%${search}%') `
    }

    query += ` GROUP BY p.id, p.full_name, p.created_at `

    // Add HAVING clauses for aggregated filters
    const havingClauses = []
    
    if (activity === 'active_7d') {
      havingClauses.push(`MAX(COALESCE(da.created_at, cs.updated_at, rs.session_start, ss.created_at)) >= CURRENT_DATE - INTERVAL '7 days'`)
    } else if (activity === 'inactive_14d') {
      havingClauses.push(`MAX(COALESCE(da.created_at, cs.updated_at, rs.session_start, ss.created_at)) < CURRENT_DATE - INTERVAL '14 days' OR MAX(COALESCE(da.created_at, cs.updated_at, rs.session_start, ss.created_at)) IS NULL`)
    }

    if (progressBand !== 'all') {
      const [min, max] = progressBand.split('-').map(Number)
      if (max) {
        havingClauses.push(`AVG(COALESCE((e.progress->>'completion_percentage')::numeric, 0)) BETWEEN ${min} AND ${max}`)
      } else {
        havingClauses.push(`AVG(COALESCE((e.progress->>'completion_percentage')::numeric, 0)) >= ${min}`)
      }
    }

    if (hasGoals === 'yes') {
      havingClauses.push(`COUNT(DISTINCT g.id) > 0`)
    } else if (hasGoals === 'no') {
      havingClauses.push(`COUNT(DISTINCT g.id) = 0`)
    }

    if (havingClauses.length > 0) {
      query += ` HAVING ${havingClauses.join(' AND ')} `
    }

    // Add sorting
    const sortField = {
      'createdAt': 'p.created_at',
      'lastActive': 'last_active_at',
      'courses': 'enrollment_count',
      'avgProgress': 'avg_progress_percent',
      'timeWeek': 'weekly_seconds'
    }[sortBy] || 'p.created_at'

    query += ` ORDER BY ${sortField} ${sortDir.toUpperCase()} LIMIT ${pageSize} OFFSET ${offset}`

    console.log('Executing query:', query)

    // Execute the main query
    const { data: usersData, error: usersError } = await supabaseClient.rpc('execute_sql', { 
      query: query 
    })

    if (usersError) {
      console.error('Users query error:', usersError)
      // Fallback to simpler query if complex one fails
      const { data: profiles, error: profilesError } = await supabaseClient
        .from('profiles')
        .select('id, full_name, display_name, created_at')
        .limit(pageSize)
        .range(offset, offset + pageSize - 1)

      if (profilesError) {
        throw profilesError
      }

      // Get basic user data with simplified metrics
      const usersWithBasicMetrics = await Promise.all(
        profiles.map(async (profile) => {
          // Get user roles
          const { data: roles } = await supabaseClient
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id)

          // Get basic enrollment count
          const { count: enrollmentCount } = await supabaseClient
            .from('enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.id)

          // Get basic goal counts
          const { data: goals } = await supabaseClient
            .from('goals')
            .select('status')
            .eq('user_id', profile.id)

          const goalsActive = goals?.filter(g => g.status === 'active').length || 0
          const goalsCompleted = goals?.filter(g => g.status === 'completed').length || 0

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
            lastActiveAt: null, // Will need to implement
            weeklySeconds: 0,
            enrollmentCount: enrollmentCount || 0,
            avgProgressPercent: 0,
            goalsActive,
            goalsCompleted
          }
        })
      )

      return new Response(
        JSON.stringify({
          users: usersWithBasicMetrics,
          pagination: {
            page,
            pageSize,
            total: profiles.length,
            totalPages: Math.ceil(profiles.length / pageSize)
          }
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Process the results and get additional user data
    const users: UserWithMetrics[] = await Promise.all(
      usersData.map(async (userData: any) => {
        // Get user roles
        const { data: roles } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', userData.id)

        // Try to get auth user email
        let email = `${userData.name?.toLowerCase().replace(/\s+/g, '.')}@fpkuniversity.com`
        try {
          const { data: authUser } = await supabaseClient.auth.admin.getUserById(userData.id)
          if (authUser?.user?.email) {
            email = authUser.user.email
          }
        } catch (e) {
          console.log('Could not get auth email for user', userData.id)
        }

        return {
          id: userData.id,
          name: userData.name || 'Unknown User',
          email,
          roles: roles?.map(r => r.role) || [],
          createdAt: userData.created_at,
          lastActiveAt: userData.last_active_at === '1970-01-01T00:00:00+00:00' ? null : userData.last_active_at,
          weeklySeconds: parseInt(userData.weekly_seconds) || 0,
          enrollmentCount: parseInt(userData.enrollment_count) || 0,
          avgProgressPercent: Math.round(parseFloat(userData.avg_progress_percent) || 0),
          goalsActive: parseInt(userData.goals_active) || 0,
          goalsCompleted: parseInt(userData.goals_completed) || 0
        }
      })
    )

    // Filter by role if specified
    const filteredUsers = role === 'all' 
      ? users 
      : users.filter(user => user.roles.includes(role))

    // Get total count for pagination
    const { count: totalCount } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    return new Response(
      JSON.stringify({
        users: filteredUsers,
        pagination: {
          page,
          pageSize,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / pageSize)
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