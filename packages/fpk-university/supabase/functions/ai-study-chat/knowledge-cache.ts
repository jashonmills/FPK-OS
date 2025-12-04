
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface CachedKnowledge {
  id: string;
  query_hash: string;
  content: string;
  source_type: 'external' | 'personal' | 'hybrid';
  metadata: Record<string, any>;
  expires_at: string;
  created_at: string;
}

export class KnowledgeCache {
  private defaultTTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  generateQueryHash(query: string, userId?: string, context?: any): string {
    const input = JSON.stringify({ query: query.toLowerCase().trim(), userId, context });
    return btoa(input).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  async get(queryHash: string): Promise<CachedKnowledge | null> {
    try {
      const { data, error } = await supabase
        .from('knowledge_cache')
        .select('*')
        .eq('query_hash', queryHash)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) return null;
      return data as CachedKnowledge;
    } catch (error) {
      console.error('Error retrieving from cache:', error);
      return null;
    }
  }

  async set(
    queryHash: string,
    content: string,
    sourceType: 'external' | 'personal' | 'hybrid',
    metadata: Record<string, any> = {},
    ttl?: number
  ): Promise<void> {
    try {
      const expiresAt = new Date(Date.now() + (ttl || this.defaultTTL)).toISOString();
      
      const { error } = await supabase
        .from('knowledge_cache')
        .insert({
          query_hash: queryHash,
          content,
          source_type: sourceType,
          metadata,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error caching knowledge:', error);
      }
    } catch (error) {
      console.error('Error in cache set:', error);
    }
  }

  async invalidate(queryHash: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('knowledge_cache')
        .delete()
        .eq('query_hash', queryHash);

      if (error) {
        console.error('Error invalidating cache:', error);
      }
    } catch (error) {
      console.error('Error in cache invalidation:', error);
    }
  }

  async cleanup(): Promise<void> {
    try {
      const { error } = await supabase
        .from('knowledge_cache')
        .delete()
        .lt('expires_at', new Date().toISOString());

      if (error) {
        console.error('Error cleaning up cache:', error);
      }
    } catch (error) {
      console.error('Error in cache cleanup:', error);
    }
  }

  async getStats(): Promise<{ total: number; expired: number; bySource: Record<string, number> }> {
    try {
      const { data: totalData } = await supabase
        .from('knowledge_cache')
        .select('id', { count: 'exact', head: true });

      const { data: expiredData } = await supabase
        .from('knowledge_cache')
        .select('id', { count: 'exact', head: true })
        .lt('expires_at', new Date().toISOString());

      const { data: sourceData } = await supabase
        .from('knowledge_cache')
        .select('source_type')
        .gt('expires_at', new Date().toISOString());

      const bySource: Record<string, number> = {};
      sourceData?.forEach(row => {
        bySource[row.source_type] = (bySource[row.source_type] || 0) + 1;
      });

      return {
        total: totalData?.length || 0,
        expired: expiredData?.length || 0,
        bySource
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return { total: 0, expired: 0, bySource: {} };
    }
  }
}
