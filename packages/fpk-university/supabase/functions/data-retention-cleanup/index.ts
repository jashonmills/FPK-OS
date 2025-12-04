import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Database {
  public: {
    Tables: {
      data_retention_policies: {
        Row: {
          id: string
          table_name: string
          retention_period_days: number
          legal_basis: string
          is_active: boolean
        }
      }
      audit_log: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
        }
        Insert: {
          user_id?: string | null
          action: string
          table_name: string
          new_values?: any
          legal_basis?: string
          purpose?: string
        }
      }
    }
    Functions: {
      cleanup_expired_data: {
        Returns: Array<{
          table_name: string
          records_deleted: number
          cleanup_date: string
        }>
      }
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

    console.log('Starting automated data retention cleanup...')

    // Run the cleanup function
    const { data: cleanupResults, error: cleanupError } = await supabase.rpc('cleanup_expired_data')

    if (cleanupError) {
      console.error('Cleanup error:', cleanupError)
      throw cleanupError
    }

    console.log('Cleanup results:', cleanupResults)

    // Log the cleanup operation
    const { error: auditError } = await supabase
      .from('audit_log')
      .insert({
        user_id: null,
        action: 'automated_cleanup',
        table_name: 'data_retention_system',
        new_values: {
          cleanup_results: cleanupResults,
          total_tables_processed: cleanupResults?.length || 0,
          timestamp: new Date().toISOString()
        },
        legal_basis: 'legal_obligation',
        purpose: 'Automated data retention policy enforcement'
      })

    if (auditError) {
      console.error('Audit logging error:', auditError)
    }

    // Check for overdue data subject requests
    const { data: overdueRequests, error: requestError } = await supabase
      .from('data_subject_requests')
      .select('*')
      .lt('due_date', new Date().toISOString())
      .neq('status', 'completed')

    if (requestError) {
      console.error('Request check error:', requestError)
    } else if (overdueRequests && overdueRequests.length > 0) {
      console.log(`Found ${overdueRequests.length} overdue data subject requests`)
      
      // Log overdue requests for admin attention
      await supabase
        .from('audit_log')
        .insert({
          user_id: null,
          action: 'overdue_alert',
          table_name: 'data_subject_requests',
          new_values: {
            overdue_count: overdueRequests.length,
            overdue_requests: overdueRequests.map(r => ({
              id: r.id,
              type: r.request_type,
              due_date: r.due_date
            }))
          },
          legal_basis: 'legal_obligation',
          purpose: 'GDPR compliance monitoring - overdue request alert'
        })
    }

    const response = {
      success: true,
      message: 'Data retention cleanup completed successfully',
      cleanup_results: cleanupResults,
      overdue_requests: overdueRequests?.length || 0,
      timestamp: new Date().toISOString()
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})