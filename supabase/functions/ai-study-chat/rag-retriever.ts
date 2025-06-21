
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface PersonalKnowledgeItem {
  type: 'note' | 'flashcard' | 'goal';
  title: string;
  content: string;
  metadata: Record<string, any>;
}

export interface ExternalKnowledgeItem {
  source_name: string;
  content: string;
  url?: string;
  metadata: Record<string, any>;
}

export class RAGRetriever {
  async retrievePersonalKnowledge(userId: string, query?: string): Promise<PersonalKnowledgeItem[]> {
    console.log('🔍 Retrieving personal knowledge for user:', userId);
    
    try {
      const results: PersonalKnowledgeItem[] = [];

      // Fetch user's notes
      const { data: notes } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId)
        .limit(10);

      if (notes) {
        results.push(...notes.map(note => ({
          type: 'note' as const,
          title: note.title,
          content: note.content || '',
          metadata: {
            category: note.category,
            tags: note.tags,
            created_at: note.created_at
          }
        })));
      }

      // Fetch user's flashcards
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', userId)
        .limit(15);

      if (flashcards) {
        results.push(...flashcards.map(card => ({
          type: 'flashcard' as const,
          title: card.front_content,
          content: `Q: ${card.front_content}\nA: ${card.back_content}`,
          metadata: {
            difficulty_level: card.difficulty_level,
            times_reviewed: card.times_reviewed,
            times_correct: card.times_correct,
            last_reviewed_at: card.last_reviewed_at
          }
        })));
      }

      // Fetch user's goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId)
        .limit(5);

      if (goals) {
        results.push(...goals.map(goal => ({
          type: 'goal' as const,
          title: goal.title,
          content: goal.description || goal.title,
          metadata: {
            category: goal.category,
            status: goal.status,
            progress: goal.progress,
            target_date: goal.target_date,
            priority: goal.priority
          }
        })));
      }

      console.log(`✅ Retrieved ${results.length} personal knowledge items`);
      return results;
    } catch (error) {
      console.error('❌ Error retrieving personal knowledge:', error);
      return [];
    }
  }

  async retrieveExternalKnowledge(query: string): Promise<ExternalKnowledgeItem[]> {
    console.log('🌐 Retrieving external knowledge for query:', query);
    
    try {
      // For now, we'll return mock external knowledge
      // In production, this would integrate with external APIs
      const mockExternalKnowledge: ExternalKnowledgeItem[] = [
        {
          source_name: 'Educational Resources',
          content: `Based on your query about "${query}", here are some relevant educational concepts and strategies that can enhance your learning experience.`,
          metadata: {
            relevance_score: 0.8,
            source_type: 'educational',
            last_updated: new Date().toISOString()
          }
        }
      ];

      // Check if we have cached external knowledge
      const { data: cachedKnowledge } = await supabase
        .from('knowledge_cache')
        .select('*')
        .eq('source_type', 'external')
        .gt('expires_at', new Date().toISOString())
        .ilike('content', `%${query.split(' ').slice(0, 3).join('%')}%`)
        .limit(5);

      if (cachedKnowledge && cachedKnowledge.length > 0) {
        console.log(`📦 Found ${cachedKnowledge.length} cached external knowledge items`);
        return cachedKnowledge.map(item => ({
          source_name: item.metadata?.source_name || 'Cached Knowledge',
          content: item.content,
          metadata: item.metadata || {}
        }));
      }

      console.log(`✅ Retrieved ${mockExternalKnowledge.length} external knowledge items`);
      return mockExternalKnowledge;
    } catch (error) {
      console.error('❌ Error retrieving external knowledge:', error);
      return [];
    }
  }

  async storeKnowledgeCache(
    queryHash: string,
    content: string,
    sourceType: 'external' | 'personal' | 'hybrid',
    metadata: Record<string, any> = {},
    ttlHours: number = 24
  ): Promise<void> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + ttlHours);

      await supabase
        .from('knowledge_cache')
        .insert({
          query_hash: queryHash,
          content,
          source_type: sourceType,
          metadata,
          expires_at: expiresAt.toISOString()
        });

      console.log('💾 Knowledge cached successfully');
    } catch (error) {
      console.error('❌ Error caching knowledge:', error);
    }
  }
}
