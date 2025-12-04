import { supabase } from "@/integrations/supabase/client";

export async function checkUserBanStatus(userId: string) {
  const { data: ban } = await supabase
    .from('user_bans')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();
  
  return ban;
}