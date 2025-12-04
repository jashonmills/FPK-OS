import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SubmitTimesheetRequest {
  startDate: string;
  endDate: string;
}

Deno.serve(async (req) => {
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
    );

    // Get the user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { startDate, endDate }: SubmitTimesheetRequest = await req.json();

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'Start date and end date are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Submitting timesheet for user ${user.id} from ${startDate} to ${endDate}`);

    // Fetch all time entries for the user in the date range with 'open' or 'rejected' status
    const { data: entries, error: fetchError } = await supabaseClient
      .from('time_entries')
      .select('id, hours_logged, status')
      .eq('user_id', user.id)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .in('status', ['open', 'rejected']);

    if (fetchError) {
      console.error('Error fetching time entries:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch time entries' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!entries || entries.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No open or rejected time entries found for this period',
          totalHours: 0,
          entryCount: 0
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate total hours
    const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours_logged), 0);
    const entryIds = entries.map(e => e.id);

    console.log(`Found ${entries.length} entries totaling ${totalHours} hours`);

    // Update all entries to 'submitted' status
    const { error: updateError } = await supabaseClient
      .from('time_entries')
      .update({ status: 'submitted' })
      .in('id', entryIds);

    if (updateError) {
      console.error('Error updating time entries:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit timesheet' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Successfully submitted timesheet with ${entries.length} entries`);

    // Return success with summary
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Timesheet submitted successfully',
        totalHours,
        entryCount: entries.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
