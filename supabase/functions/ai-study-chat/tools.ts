
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function executeToolCall(toolName: string, args: any) {
  try {
    console.log(`🔧 Executing tool: ${toolName} with args:`, args);
    
    // Map tool names to actual function names
    const functionName = toolName.replace('_', '-');
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: args
    });

    if (error) {
      console.error(`❌ Tool ${toolName} error:`, error);
      throw error;
    }

    console.log(`✅ Tool ${toolName} response:`, data);
    return data;
  } catch (error) {
    console.error(`💥 Error executing tool ${toolName}:`, error);
    return { 
      error: `Failed to execute ${toolName}: ${error.message}`,
      flashcards: [],
      total: 0,
      message: 'Tool execution failed'
    };
  }
}

export const TOOL_DEFINITIONS = [
  // Personal data tools
  {
    name: 'get_recent_flashcards',
    description: 'Get the student\'s most recent flashcards. Use when they ask about recent cards, what they\'ve been studying, or want to review their latest flashcards.',
    input_schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'The user ID' },
        limit: { type: 'integer', description: 'Number of flashcards to return (default: 5)', default: 5 }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_user_flashcards',
    description: 'Advanced flashcard search with filters. Use when they want specific cards, struggling cards, or filtered results.',
    input_schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'The user ID' },
        filter: { 
          type: 'object', 
          description: 'Filter options',
          properties: {
            difficulty: { type: 'integer', description: 'Filter by difficulty level' },
            needsPractice: { type: 'boolean', description: 'Show cards that need practice' },
            searchTerm: { type: 'string', description: 'Search in card content' }
          }
        },
        limit: { type: 'integer', description: 'Number of flashcards to return (default: 10)', default: 10 },
        sortBy: { type: 'string', description: 'Sort field', default: 'created_at' },
        sortOrder: { type: 'string', description: 'Sort order: asc or desc', default: 'desc' }
      },
      required: ['userId']
    }
  },
  {
    name: 'get_study_stats',
    description: 'Get comprehensive study statistics and progress data. Use when they ask about performance, progress, achievements, streaks, or overall stats.',
    input_schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'The user ID' }
      },
      required: ['userId']
    }
  },
  // General knowledge tool
  {
    name: 'retrieve_knowledge',
    description: 'Retrieve external knowledge from academic sources like Wikipedia, research papers, and educational databases. Use for general knowledge questions about any topic.',
    input_schema: {
      type: 'object',
      properties: {
        topic: { type: 'string', description: 'The topic to research' }
      },
      required: ['topic']
    }
  }
];
