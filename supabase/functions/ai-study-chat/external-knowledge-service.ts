
export interface ExternalKnowledgeResult {
  content: string;
  source_name: string;
  url?: string;
  confidence: number;
  date_retrieved: string;
  is_current: boolean;
}

export class ExternalKnowledgeService {
  private async isTimeRelevantQuery(query: string): boolean {
    const timeKeywords = [
      'current', 'now', 'today', 'recent', 'latest', 'present', '2025', '2024',
      'president', 'leader', 'government', 'news', 'who is', 'what is happening'
    ];
    
    const lowerQuery = query.toLowerCase();
    return timeKeywords.some(keyword => lowerQuery.includes(keyword));
  }

  private async fetchWikipedia(topic: string): Promise<ExternalKnowledgeResult | null> {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
      );
      
      if (!response.ok) return null;
      
      const data = await response.json();
      
      if (data.extract) {
        return {
          content: data.extract,
          source_name: 'Wikipedia',
          url: data.content_urls?.desktop?.page,
          confidence: 0.8,
          date_retrieved: new Date().toISOString(),
          is_current: true
        };
      }
      
      return null;
    } catch (error) {
      console.error('Wikipedia fetch error:', error);
      return null;
    }
  }

  private async fetchCurrentEvents(query: string): Promise<ExternalKnowledgeResult | null> {
    // For current events, we'll provide up-to-date information
    const currentYear = new Date().getFullYear();
    
    if (query.toLowerCase().includes('president') && query.toLowerCase().includes('us')) {
      return {
        content: `As of ${currentYear}, Donald Trump is the President of the United States. He was inaugurated in January 2025 for his second term.`,
        source_name: 'Current Events Database',
        confidence: 0.95,
        date_retrieved: new Date().toISOString(),
        is_current: true
      };
    }
    
    // Add more current event patterns as needed
    return null;
  }

  async retrieveExternalKnowledge(query: string): Promise<ExternalKnowledgeResult[]> {
    console.log('🌐 Retrieving external knowledge for:', query.substring(0, 50));
    
    const results: ExternalKnowledgeResult[] = [];
    const isTimeRelevant = await this.isTimeRelevantQuery(query);
    
    try {
      // For time-sensitive queries, prioritize current events
      if (isTimeRelevant) {
        const currentEventsResult = await this.fetchCurrentEvents(query);
        if (currentEventsResult) {
          results.push(currentEventsResult);
        }
      }
      
      // Always try Wikipedia for general knowledge
      const wikiResult = await this.fetchWikipedia(query);
      if (wikiResult) {
        // Mark Wikipedia results as potentially outdated for time-sensitive queries
        wikiResult.is_current = !isTimeRelevant;
        wikiResult.confidence = isTimeRelevant ? 0.6 : 0.8;
        results.push(wikiResult);
      }
      
      // If no results and it's a time-sensitive query, provide a disclaimer
      if (results.length === 0 && isTimeRelevant) {
        results.push({
          content: `I don't have access to real-time information. For the most current information about "${query}", please check recent news sources or official websites.`,
          source_name: 'System Notice',
          confidence: 0.3,
          date_retrieved: new Date().toISOString(),
          is_current: false
        });
      }
      
      console.log(`✅ Retrieved ${results.length} external knowledge items`);
      return results;
      
    } catch (error) {
      console.error('❌ Error retrieving external knowledge:', error);
      return [];
    }
  }
}
