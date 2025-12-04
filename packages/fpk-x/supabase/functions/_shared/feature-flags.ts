/**
 * PHASE 1D: Feature Flag System for Client Model Migration
 * 
 * This module provides utilities to check feature flags and determine
 * whether to use the new client_id model or the legacy student_id model.
 */

export interface FeatureFlags {
  use_new_client_model: boolean;
}

/**
 * Check if a feature flag is enabled for a given family
 * 
 * @param supabase - Supabase client instance
 * @param familyId - The family ID to check
 * @param flagKey - The feature flag key to check
 * @returns boolean indicating if the flag is enabled
 */
export async function isFlagEnabled(
  supabase: any,
  familyId: string,
  flagKey: keyof FeatureFlags
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('families')
      .select('metadata')
      .eq('id', familyId)
      .single();

    if (error || !data) {
      console.log(`⚠️ Could not fetch family metadata for flag check: ${error?.message}`);
      return false; // Default to OFF if we can't determine
    }

    const metadata = data.metadata || {};
    const flags = metadata.feature_flags || {};
    
    const isEnabled = flags[flagKey] === true;
    console.log(`🚩 Feature flag '${flagKey}' for family ${familyId}: ${isEnabled ? 'ON' : 'OFF'}`);
    
    return isEnabled;
  } catch (err) {
    console.error(`❌ Error checking feature flag: ${err}`);
    return false; // Default to OFF on error
  }
}

/**
 * Check if a feature flag is enabled for a given organization
 * 
 * @param supabase - Supabase client instance
 * @param organizationId - The organization ID to check
 * @param flagKey - The feature flag key to check
 * @returns boolean indicating if the flag is enabled
 */
export async function isFlagEnabledForOrg(
  supabase: any,
  organizationId: string,
  flagKey: keyof FeatureFlags
): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('metadata')
      .eq('id', organizationId)
      .single();

    if (error || !data) {
      console.log(`⚠️ Could not fetch org metadata for flag check: ${error?.message}`);
      return false;
    }

    const metadata = data.metadata || {};
    const flags = metadata.feature_flags || {};
    
    const isEnabled = flags[flagKey] === true;
    console.log(`🚩 Feature flag '${flagKey}' for org ${organizationId}: ${isEnabled ? 'ON' : 'OFF'}`);
    
    return isEnabled;
  } catch (err) {
    console.error(`❌ Error checking feature flag: ${err}`);
    return false;
  }
}

/**
 * Verify that a user has access to a specific client
 * 
 * @param supabase - Supabase client instance
 * @param userId - The user's ID
 * @param clientId - The client ID to check access for
 * @returns boolean indicating if the user has access
 */
export async function userCanAccessClient(
  supabase: any,
  userId: string,
  clientId: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('user_can_access_client', {
      p_user_id: userId,
      p_client_id: clientId
    });

    if (error) {
      console.error(`❌ Error checking client access: ${error.message}`);
      return false;
    }

    console.log(`🔐 User ${userId} access to client ${clientId}: ${data ? 'GRANTED' : 'DENIED'}`);
    return data === true;
  } catch (err) {
    console.error(`❌ Exception checking client access: ${err}`);
    return false;
  }
}

/**
 * Get the context (family_id or organization_id) for a client
 * Returns which accessor the client belongs to
 * 
 * @param supabase - Supabase client instance
 * @param clientId - The client ID
 * @returns Object containing family_id or organization_id
 */
export async function getClientContext(
  supabase: any,
  clientId: string
): Promise<{ family_id: string | null; organization_id: string | null } | null> {
  try {
    const { data, error } = await supabase
      .from('client_access')
      .select('family_id, organization_id, access_level')
      .eq('client_id', clientId)
      .eq('status', 'active')
      .order('granted_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`❌ Error fetching client context: ${error.message}`);
      return null;
    }

    if (!data) {
      console.warn(`⚠️ No active access record found for client ${clientId}`);
      return null;
    }

    console.log(`📍 Client ${clientId} context: ${
      data.family_id ? `Family ${data.family_id}` : `Org ${data.organization_id}`
    }`);

    return {
      family_id: data.family_id,
      organization_id: data.organization_id
    };
  } catch (err) {
    console.error(`❌ Exception fetching client context: ${err}`);
    return null;
  }
}
