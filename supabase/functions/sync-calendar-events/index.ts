import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const clientId = Deno.env.get('GOOGLE_CALENDAR_CLIENT_ID');
    const clientSecret = Deno.env.get('GOOGLE_CALENDAR_CLIENT_SECRET');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { family_id, integration_id } = await req.json();

    if (!family_id || !integration_id) {
      throw new Error('Missing required parameters');
    }

    // Get the integration
    const { data: integration, error: integrationError } = await supabase
      .from('external_integrations')
      .select('*')
      .eq('id', integration_id)
      .eq('family_id', family_id)
      .eq('provider', 'google_calendar')
      .single();

    if (integrationError || !integration) {
      throw new Error('Integration not found');
    }

    let accessToken = integration.access_token;

    // Check if token needs refresh
    const expiresAt = new Date(integration.token_expires_at);
    if (expiresAt <= new Date()) {
      console.log('Token expired, refreshing...');
      
      const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId!,
          client_secret: clientSecret!,
          refresh_token: integration.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh token');
      }

      const tokens = await refreshResponse.json();
      accessToken = tokens.access_token;
      const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000);

      // Update the integration with new token
      await supabase
        .from('external_integrations')
        .update({
          access_token: accessToken,
          token_expires_at: newExpiresAt.toISOString(),
        })
        .eq('id', integration_id);
    }

    // Fetch calendar events (last 7 days + next 30 days)
    const timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 7);
    const timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 30);

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${timeMin.toISOString()}&timeMax=${timeMax.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    );

    if (!calendarResponse.ok) {
      const error = await calendarResponse.text();
      console.error('Calendar API error:', error);
      throw new Error('Failed to fetch calendar events');
    }

    const calendarData = await calendarResponse.json();
    const events = calendarData.items || [];

    console.log(`Fetched ${events.length} events from Google Calendar`);

    // Prepare events for insertion
    const eventsToInsert = events.map((event: any) => ({
      family_id,
      integration_id,
      event_title: event.summary || 'Untitled Event',
      event_description: event.description || null,
      start_time: event.start.dateTime || event.start.date,
      end_time: event.end.dateTime || event.end.date,
      is_all_day: !event.start.dateTime,
      location: event.location || null,
      attendees: event.attendees ? event.attendees.map((a: any) => ({
        email: a.email,
        name: a.displayName || a.email,
        status: a.responseStatus,
      })) : [],
      original_event_id: event.id,
      provider: 'google_calendar',
    }));

    // Delete existing events for this integration (to avoid duplicates)
    await supabase
      .from('calendar_events')
      .delete()
      .eq('integration_id', integration_id);

    // Insert new events
    const { error: insertError } = await supabase
      .from('calendar_events')
      .insert(eventsToInsert);

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    // Update last sync time
    await supabase
      .from('external_integrations')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('id', integration_id);

    console.log('Calendar sync completed successfully');

    return new Response(
      JSON.stringify({ success: true, events_synced: events.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in sync-calendar-events:', error);
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
