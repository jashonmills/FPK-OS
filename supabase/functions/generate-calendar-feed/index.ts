import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get token from URL query parameter
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return new Response('Missing token', { status: 400, headers: corsHeaders });
    }

    // Initialize Supabase client with service role key for this operation
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the subscription by token
    const { data: subscription, error: subError } = await supabase
      .from('calendar_subscriptions')
      .select('user_id, filter_settings')
      .eq('token', token)
      .single();

    if (subError || !subscription) {
      console.error('Subscription lookup error:', subError);
      return new Response('Invalid token', { status: 404, headers: corsHeaders });
    }

    // Build query based on filter settings
    let query = supabase
      .from('tasks')
      .select('id, title, description, due_date, start_date, project_id, status, priority')
      .not('due_date', 'is', null);

    // Apply filters from subscription settings
    const filters = subscription.filter_settings || {};
    
    if (filters.project_id) {
      query = query.eq('project_id', filters.project_id);
    }
    
    if (filters.my_tasks_only) {
      query = query.eq('assignee_id', subscription.user_id);
    }

    const { data: tasks, error: tasksError } = await query;

    if (tasksError) {
      console.error('Tasks query error:', tasksError);
      return new Response('Error fetching tasks', { status: 500, headers: corsHeaders });
    }

    // Generate iCalendar format
    const icsLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FPK Pulse//Calendar Feed//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'X-WR-CALNAME:FPK Pulse Tasks',
      'X-WR-TIMEZONE:UTC',
    ];

    // Add each task as an event
    for (const task of tasks || []) {
      const startDate = task.start_date ? new Date(task.start_date) : new Date(task.due_date);
      const endDate = new Date(task.due_date);
      
      // Format dates as YYYYMMDDTHHMMSSZ
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      const now = formatDate(new Date());
      
      icsLines.push('BEGIN:VEVENT');
      icsLines.push(`UID:${task.id}@fpkpulse.app`);
      icsLines.push(`DTSTAMP:${now}`);
      icsLines.push(`DTSTART:${formatDate(startDate)}`);
      icsLines.push(`DTEND:${formatDate(endDate)}`);
      icsLines.push(`SUMMARY:${escapeICalText(task.title)}`);
      
      if (task.description) {
        icsLines.push(`DESCRIPTION:${escapeICalText(task.description)}`);
      }
      
      icsLines.push(`STATUS:${task.status.toUpperCase()}`);
      icsLines.push(`PRIORITY:${getPriority(task.priority)}`);
      icsLines.push('END:VEVENT');
    }

    icsLines.push('END:VCALENDAR');

    const icsContent = icsLines.join('\r\n');

    return new Response(icsContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="fpk-pulse-tasks.ics"',
      },
    });
  } catch (error) {
    console.error('Error in generate-calendar-feed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Helper function to escape special characters in iCal text
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}

// Map priority to iCal priority (1=high, 5=medium, 9=low)
function getPriority(priority: string): string {
  const priorityMap: { [key: string]: string } = {
    high: '1',
    medium: '5',
    low: '9',
  };
  return priorityMap[priority] || '5';
}
