import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const googleClientId = Deno.env.get('GOOGLE_CLIENT_ID');
const googleClientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // Verify the user
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      throw new Error('Invalid authorization');
    }

    const { action, code, goals } = await req.json();

    switch (action) {
      case 'oauth-callback':
        return await handleOAuthCallback(supabase, user.id, code);
      
      case 'get-auth-url':
        return await getAuthUrl();
      
      case 'sync-goals':
        return await syncGoalsToCalendar(supabase, user.id, goals);
      
      case 'disconnect':
        return await disconnectGoogleCalendar(supabase, user.id);
      
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in google-calendar-sync function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function getAuthUrl() {
  if (!googleClientId) {
    throw new Error('Google OAuth not configured');
  }

  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-calendar-sync`;
  const scope = 'https://www.googleapis.com/auth/calendar';
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${googleClientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent(scope)}&` +
    `response_type=code&` +
    `access_type=offline&` +
    `prompt=consent`;

  return new Response(JSON.stringify({ authUrl }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleOAuthCallback(supabase: any, userId: string, code: string) {
  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth not configured');
  }

  const redirectUri = `${Deno.env.get('SUPABASE_URL')}/functions/v1/google-calendar-sync`;
  
  // Exchange code for tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  const tokens = await tokenResponse.json();
  
  if (!tokens.access_token) {
    throw new Error('Failed to obtain access token');
  }

  // Store tokens in database
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);
  
  const { error } = await supabase
    .from('google_oauth_tokens')
    .upsert({
      user_id: userId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: expiresAt.toISOString(),
      scope: 'https://www.googleapis.com/auth/calendar',
    });

  if (error) {
    throw new Error(`Failed to store tokens: ${error.message}`);
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function syncGoalsToCalendar(supabase: any, userId: string, goals: any[]) {
  // Get user's OAuth tokens
  const { data: tokenData, error: tokenError } = await supabase
    .from('google_oauth_tokens')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (tokenError || !tokenData) {
    throw new Error('Google Calendar not connected');
  }

  // Check if token is expired and refresh if needed
  const accessToken = await getValidAccessToken(supabase, tokenData);

  const syncResults = [];
  
  for (const goal of goals) {
    if (!goal.target_date) continue;
    
    try {
      // Check if event already exists
      const { data: existingSync } = await supabase
        .from('synced_calendar_events')
        .select('google_event_id')
        .eq('user_id', userId)
        .eq('local_event_id', goal.id)
        .eq('local_event_type', 'goal')
        .single();

      if (existingSync) {
        // Update existing event
        await updateCalendarEvent(accessToken, existingSync.google_event_id, goal);
        syncResults.push({ goalId: goal.id, status: 'updated' });
      } else {
        // Create new event
        const eventId = await createCalendarEvent(accessToken, goal);
        
        // Store sync record
        await supabase
          .from('synced_calendar_events')
          .insert({
            user_id: userId,
            google_event_id: eventId,
            local_event_type: 'goal',
            local_event_id: goal.id,
            calendar_id: 'primary',
          });
        
        syncResults.push({ goalId: goal.id, status: 'created', eventId });
      }
    } catch (error) {
      console.error(`Failed to sync goal ${goal.id}:`, error);
      syncResults.push({ goalId: goal.id, status: 'error', error: error.message });
    }
  }

  return new Response(JSON.stringify({ syncResults }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getValidAccessToken(supabase: any, tokenData: any) {
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);
  
  if (now < expiresAt) {
    return tokenData.access_token;
  }
  
  // Token expired, refresh it
  if (!tokenData.refresh_token) {
    throw new Error('Refresh token not available');
  }
  
  const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: googleClientId!,
      client_secret: googleClientSecret!,
      refresh_token: tokenData.refresh_token,
      grant_type: 'refresh_token',
    }),
  });
  
  const refreshedTokens = await refreshResponse.json();
  
  if (!refreshedTokens.access_token) {
    throw new Error('Failed to refresh access token');
  }
  
  // Update stored tokens
  const newExpiresAt = new Date(Date.now() + refreshedTokens.expires_in * 1000);
  await supabase
    .from('google_oauth_tokens')
    .update({
      access_token: refreshedTokens.access_token,
      expires_at: newExpiresAt.toISOString(),
    })
    .eq('user_id', tokenData.user_id);
  
  return refreshedTokens.access_token;
}

async function createCalendarEvent(accessToken: string, goal: any) {
  const event = {
    summary: `Goal: ${goal.title}`,
    description: goal.description || '',
    start: {
      date: goal.target_date,
    },
    end: {
      date: goal.target_date,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 1 day before
        { method: 'popup', minutes: 60 }, // 1 hour before
      ],
    },
  };
  
  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(`Failed to create calendar event: ${result.error?.message || 'Unknown error'}`);
  }
  
  return result.id;
}

async function updateCalendarEvent(accessToken: string, eventId: string, goal: any) {
  const event = {
    summary: `Goal: ${goal.title}`,
    description: goal.description || '',
    start: {
      date: goal.target_date,
    },
    end: {
      date: goal.target_date,
    },
  };
  
  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw new Error(`Failed to update calendar event: ${result.error?.message || 'Unknown error'}`);
  }
}

async function disconnectGoogleCalendar(supabase: any, userId: string) {
  // Delete OAuth tokens
  const { error: tokenError } = await supabase
    .from('google_oauth_tokens')
    .delete()
    .eq('user_id', userId);

  // Delete sync records
  const { error: syncError } = await supabase
    .from('synced_calendar_events')
    .delete()
    .eq('user_id', userId);

  if (tokenError || syncError) {
    throw new Error('Failed to disconnect Google Calendar');
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}