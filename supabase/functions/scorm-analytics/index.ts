import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalyticsRequest {
  type: 'kpis' | 'package-performance' | 'learner-progress' | 'trends'
  packageId?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  search?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get auth header and verify user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    const request: AnalyticsRequest = await req.json()
    let result

    switch (request.type) {
      case 'kpis':
        result = await getKPIs(supabase, request)
        break
      case 'package-performance':
        result = await getPackagePerformance(supabase, request)
        break
      case 'learner-progress':
        result = await getLearnerProgress(supabase, request)
        break
      case 'trends':
        result = await getTrends(supabase, request)
        break
      default:
        throw new Error('Invalid analytics type')
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function getKPIs(supabase: any, request: AnalyticsRequest) {
  // Total Ready Packages
  const { data: packagesData } = await supabase
    .from('scorm_packages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'ready')

  // Active Enrollments
  const { data: enrollmentsData } = await supabase
    .from('scorm_enrollments')
    .select('id', { count: 'exact', head: true })

  // Global Average Score
  const { data: scoreData } = await supabase.rpc('get_global_avg_score')

  // Global Completion Rate
  const { data: completionData } = await supabase.rpc('get_global_completion_rate')

  return {
    totalPackages: packagesData?.length || 0,
    activeEnrollments: enrollmentsData?.length || 0,
    avgScore: scoreData?.[0]?.avg_score || 0,
    completionRate: completionData?.[0]?.completion_rate || 0
  }
}

async function getPackagePerformance(supabase: any, request: AnalyticsRequest) {
  let query = supabase
    .from('scorm_packages')
    .select(`
      id,
      title,
      scorm_enrollments!inner(id, created_at),
      scorm_scos!inner(id, is_launchable)
    `)
    .eq('status', 'ready')

  if (request.packageId) {
    query = query.eq('id', request.packageId)
  }

  const { data: packages, error } = await query

  if (error) throw error

  // Calculate performance metrics for each package
  const performance = await Promise.all(
    packages.map(async (pkg: any) => {
      // Get completion stats
      const { data: completionStats } = await supabase.rpc('get_package_completion_stats', {
        package_id: pkg.id,
        date_from: request.dateFrom,
        date_to: request.dateTo
      })

      // Get average score
      const { data: avgScoreData } = await supabase.rpc('get_package_avg_score', {
        package_id: pkg.id,
        date_from: request.dateFrom,
        date_to: request.dateTo
      })

      return {
        packageId: pkg.id,
        packageTitle: pkg.title,
        enrollments: pkg.scorm_enrollments.length,
        completions: completionStats?.[0]?.completions || 0,
        completionRate: completionStats?.[0]?.completion_rate || 0,
        avgScore: avgScoreData?.[0]?.avg_score || 0
      }
    })
  )

  return performance
}

async function getLearnerProgress(supabase: any, request: AnalyticsRequest) {
  let query = supabase
    .from('v_scorm_progress')
    .select(`
      *,
      scorm_packages!inner(title),
      profiles!inner(full_name, display_name)
    `)

  if (request.packageId) {
    query = query.eq('package_id', request.packageId)
  }

  if (request.dateFrom && request.dateTo) {
    query = query
      .gte('last_activity', request.dateFrom)
      .lte('last_activity', request.dateTo)
  }

  if (request.search) {
    query = query.or(`
      scorm_packages.title.ilike.%${request.search}%,
      profiles.full_name.ilike.%${request.search}%,
      profiles.display_name.ilike.%${request.search}%
    `)
  }

  const page = request.page || 1
  const pageSize = request.pageSize || 25
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  query = query.range(from, to).order('last_activity', { ascending: false })

  const { data, error, count } = await query

  if (error) throw error

  const progress = data?.map((item: any) => ({
    userId: item.user_id,
    packageId: item.package_id,
    packageTitle: item.scorm_packages.title,
    learnerName: item.profiles?.full_name || item.profiles?.display_name || 'Unknown',
    scosCompleted: item.scos_completed,
    scosTotal: item.scos_total,
    progressPct: Math.round(100 * item.scos_completed / Math.max(item.scos_total, 1)),
    lastActivity: item.last_activity
  })) || []

  return {
    data: progress,
    total: count,
    page,
    pageSize
  }
}

async function getTrends(supabase: any, request: AnalyticsRequest) {
  const { data: trendsData } = await supabase.rpc('get_analytics_trends', {
    package_id: request.packageId,
    date_from: request.dateFrom,
    date_to: request.dateTo
  })

  return trendsData || []
}