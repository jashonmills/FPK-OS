import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PayrollRunRequest {
  pay_period_start_date: string;
  pay_period_end_date: string;
  employee_ids: string[];
  notes?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();
    
    if (roleData?.role !== 'admin') {
      console.error('User is not admin:', user.id);
      throw new Error('Forbidden: Admin access required');
    }

    const body: PayrollRunRequest = await req.json();
    const { pay_period_start_date, pay_period_end_date, employee_ids, notes } = body;

    console.log('Generating payroll run for period:', pay_period_start_date, 'to', pay_period_end_date);
    console.log('Employee IDs:', employee_ids);

    const { data: timeData, error: timeError } = await supabase
      .from('vw_payroll_report')
      .select('*')
      .gte('entry_date', pay_period_start_date)
      .lte('entry_date', pay_period_end_date)
      .in('user_id', employee_ids);

    if (timeError) {
      console.error('Error fetching time data:', timeError);
      throw timeError;
    }

    console.log('Found time entries:', timeData?.length);

    const employeeAggregates = timeData.reduce((acc, entry) => {
      if (!acc[entry.user_id]) {
        acc[entry.user_id] = {
          user_id: entry.user_id,
          user_name: entry.user_name,
          total_hours: 0,
          hourly_rate: entry.hourly_rate,
          total_pay: 0,
        };
      }
      acc[entry.user_id].total_hours += parseFloat(entry.hours_logged);
      acc[entry.user_id].total_pay += parseFloat(entry.calculated_cost);
      return acc;
    }, {} as Record<string, any>);

    const lineItems = Object.values(employeeAggregates);
    const totalHours = lineItems.reduce((sum: number, item: any) => sum + item.total_hours, 0);
    const totalCost = lineItems.reduce((sum: number, item: any) => sum + item.total_pay, 0);

    console.log('Aggregated data - Total hours:', totalHours, 'Total cost:', totalCost);

    const { data: payrollRun, error: runError } = await supabase
      .from('payroll_runs')
      .insert({
        pay_period_start_date,
        pay_period_end_date,
        status: 'approved',
        total_hours: totalHours,
        total_cost: totalCost,
        processed_by_user_id: user.id,
        notes,
      })
      .select()
      .single();

    if (runError) {
      console.error('Error creating payroll run:', runError);
      throw runError;
    }

    console.log('Created payroll run:', payrollRun.id);

    const lineItemsToInsert = lineItems.map((item: any) => ({
      payroll_run_id: payrollRun.id,
      employee_user_id: item.user_id,
      total_hours: item.total_hours,
      hourly_rate: item.hourly_rate,
      total_pay: item.total_pay,
    }));

    const { error: lineItemsError } = await supabase
      .from('payroll_run_line_items')
      .insert(lineItemsToInsert);

    if (lineItemsError) {
      console.error('Error creating line items:', lineItemsError);
      throw lineItemsError;
    }

    console.log('Created', lineItems.length, 'line items');

    // Create notifications for each employee
    const notifications = lineItemsToInsert.map((item: any) => ({
      recipient_id: item.employee_user_id,
      sender_id: user.id,
      type: 'payroll_approved',
      content: 'Your payroll has been approved',
      metadata: {
        payroll_run_id: payrollRun.id,
        total_hours: item.total_hours,
        total_pay: item.total_pay,
        pay_period_start: pay_period_start_date,
        pay_period_end: pay_period_end_date,
      }
    }));

    const { error: notificationsError } = await supabase
      .from('notifications')
      .insert(notifications);

    if (notificationsError) {
      console.error('Error creating notifications:', notificationsError);
      // Don't fail the whole operation if notifications fail
    } else {
      console.log('Created notifications for', notifications.length, 'employees');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        payroll_run: payrollRun,
        line_items_count: lineItems.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-payroll-run:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
