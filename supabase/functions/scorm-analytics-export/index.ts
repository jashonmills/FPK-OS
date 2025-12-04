import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  view: 'packages' | 'learners' | 'trends'
  packageId?: string
  dateFrom?: string
  dateTo?: string
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

    const request: ExportRequest = await req.json()
    let csvData: string
    let filename: string

    switch (request.view) {
      case 'packages':
        csvData = await exportPackagePerformance(supabase, request)
        filename = `scorm-packages-${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'learners':
        csvData = await exportLearnerProgress(supabase, request)
        filename = `scorm-learners-${new Date().toISOString().split('T')[0]}.csv`
        break
      case 'trends':
        csvData = await exportTrends(supabase, request)
        filename = `scorm-trends-${new Date().toISOString().split('T')[0]}.csv`
        break
      default:
        throw new Error('Invalid export view')
    }

    return new Response(csvData, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      },
    })

  } catch (error) {
    console.error('Export error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function exportPackagePerformance(supabase: any, request: ExportRequest) {
  // Get all package performance data
  let query = supabase
    .from('scorm_packages')
    .select(`
      id,
      title,
      created_at,
      scorm_enrollments!inner(id, created_at),
      scorm_scos!inner(id, is_launchable)
    `)
    .eq('status', 'ready')

  if (request.packageId) {
    query = query.eq('id', request.packageId)
  }

  const { data: packages } = await query

  const headers = [
    'Package Title',
    'Total Enrollments', 
    'Completions',
    'Completion Rate (%)',
    'Average Score',
    'Created Date'
  ].join(',')

  const rows = await Promise.all(
    packages?.map(async (pkg: any) => {
      const { data: completionStats } = await supabase.rpc('get_package_completion_stats', {
        package_id: pkg.id,
        date_from: request.dateFrom,
        date_to: request.dateTo
      })

      const { data: avgScoreData } = await supabase.rpc('get_package_avg_score', {
        package_id: pkg.id,
        date_from: request.dateFrom,
        date_to: request.dateTo
      })

      const enrollments = pkg.scorm_enrollments.length
      const completions = completionStats?.[0]?.completions || 0
      const completionRate = Math.round((completions / Math.max(enrollments, 1)) * 100)
      const avgScore = Math.round(avgScoreData?.[0]?.avg_score || 0)

      return [
        `"${pkg.title.replace(/"/g, '""')}"`,
        enrollments,
        completions,
        completionRate,
        avgScore,
        new Date(pkg.created_at).toLocaleDateString()
      ].join(',')
    }) || []
  )

  return [headers, ...rows].join('\n')
}

async function exportLearnerProgress(supabase: any, request: ExportRequest) {
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

  const { data } = await query.order('last_activity', { ascending: false })

  const headers = [
    'Learner Name',
    'Package Title',
    'Progress (%)',
    'SCOs Completed',
    'Total SCOs',
    'Last Activity'
  ].join(',')

  const rows = data?.map((item: any) => {
    const learnerName = item.profiles?.full_name || item.profiles?.display_name || 'Unknown'
    const progressPct = Math.round(100 * item.scos_completed / Math.max(item.scos_total, 1))
    
    return [
      `"${learnerName.replace(/"/g, '""')}"`,
      `"${item.scorm_packages.title.replace(/"/g, '""')}"`,
      progressPct,
      item.scos_completed,
      item.scos_total,
      item.last_activity ? new Date(item.last_activity).toLocaleDateString() : 'Never'
    ].join(',')
  }) || []

  return [headers, ...rows].join('\n')
}

async function exportTrends(supabase: any, request: ExportRequest) {
  const { data: trendsData } = await supabase.rpc('get_analytics_trends', {
    package_id: request.packageId,
    date_from: request.dateFrom,
    date_to: request.dateTo
  })

  const headers = [
    'Date',
    'New Enrollments',
    'Active Learners',
    'Average Score',
    'Completion Rate (%)'
  ].join(',')

  const rows = trendsData?.map((item: any) => [
    new Date(item.date).toLocaleDateString(),
    item.enrollments || 0,
    item.active_learners || 0,
    Math.round(item.avg_score || 0),
    Math.round((item.completion_rate || 0) * 100)
  ].join(',')) || []

  return [headers, ...rows].join('\n')
}