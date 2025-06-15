
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: any;
}

export async function callClaude(messages: ClaudeMessage[], model?: string, chatMode?: string) {
  // Use latest Claude 4 models for better performance
  const selectedModel = chatMode === 'general' 
    ? model || 'claude-3-opus-20240229' // Use Opus for general knowledge (more capable for research)
    : model || 'claude-3-5-sonnet-20241022'; // Keep Sonnet for personal data (efficient)
  
  console.log(`🤖 Calling Claude with model: ${selectedModel}, mode: ${chatMode}`);
  
  // Define tool sets based on chat mode
  const personalTools = [
    {
      name: "get_recent_flashcards",
      description: "Get the user's recently studied flashcards with performance data. Use this when users ask for recent, latest, newest, or last flashcards they created.",
      input_schema: {
        type: "object",
        properties: {
          limit: {
            type: "number",
            description: "Number of recent flashcards to retrieve (default: 5)"
          }
        }
      }
    },
    {
      name: "get_user_flashcards",
      description: "Get all user flashcards with optional filtering by topic or difficulty",
      input_schema: {
        type: "object",
        properties: {
          topic_filter: {
            type: "string",
            description: "Optional topic to filter flashcards"
          },
          difficulty_filter: {
            type: "string",
            description: "Optional difficulty level (easy, medium, hard)"
          }
        }
      }
    },
    {
      name: "get_study_stats",
      description: "Get comprehensive study statistics and performance metrics for the user",
      input_schema: {
        type: "object",
        properties: {
          days: {
            type: "number",
            description: "Number of days to look back for stats (default: 30)"
          }
        }
      }
    }
  ];

  const generalTools = [
    {
      name: "retrieve_knowledge",
      description: "Search external knowledge sources including Wikipedia, research papers, and educational content",
      input_schema: {
        type: "object",
        properties: {
          topic: {
            type: "string",
            description: "The topic to search for in external knowledge sources"
          }
        },
        required: ["topic"]
      }
    }
  ];

  // Select tools based on chat mode
  const tools = chatMode === 'general' ? generalTools : personalTools;
  
  console.log(`🔧 Using ${tools.length} tools for ${chatMode || 'personal'} mode:`, tools.map(t => t.name));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: selectedModel,
      max_tokens: 2000,
      temperature: 0.7,
      tools: tools,
      messages: messages.map(msg => ({
        role: msg.role,
        content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content)
      }))
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Claude API error:', errorText);
    throw new Error(`Claude API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

export async function handleToolCalls(data: any, userId: string, chatMode?: string) {
  console.log('🔧 Processing tool calls for mode:', chatMode);
  
  const toolResults = [];
  
  if (data.content) {
    for (const content of data.content) {
      if (content.type === 'tool_use') {
        console.log(`🛠️ Tool call: ${content.name}`, content.input);
        
        try {
          let result;
          
          // Handle personal mode tools
          if (chatMode === 'personal' || !chatMode) {
            switch (content.name) {
              case 'get_recent_flashcards':
                console.log('📚 Calling get_recent_flashcards with enhanced error handling');
                result = await callEdgeFunction('get-recent-flashcards', {
                  userId: userId,
                  limit: content.input.limit || 5
                });
                
                // Enhanced logging for flashcard retrieval
                console.log('📚 Recent flashcards result:', {
                  hasFlashcards: result?.flashcards?.length > 0,
                  count: result?.flashcards?.length || 0,
                  message: result?.message
                });
                break;
              
              case 'get_user_flashcards':
                result = await callEdgeFunction('get-user-flashcards', {
                  user_id: userId,
                  topic_filter: content.input.topic_filter,
                  difficulty_filter: content.input.difficulty_filter
                });
                break;
              
              case 'get_study_stats':
                result = await callEdgeFunction('get-study-stats', {
                  user_id: userId,
                  days: content.input.days || 30
                });
                break;
              
              default:
                console.warn(`Unknown personal tool: ${content.name}`);
                result = { error: `Tool ${content.name} not available in personal mode` };
            }
          } 
          // Handle general mode tools
          else if (chatMode === 'general') {
            switch (content.name) {
              case 'retrieve_knowledge':
                result = await callEdgeFunction('retrieve-knowledge', {
                  topic: content.input.topic
                });
                break;
              
              default:
                console.warn(`Unknown general tool: ${content.name}`);
                result = { error: `Tool ${content.name} not available in general mode` };
            }
          }
          
          toolResults.push({
            type: 'tool_result',
            tool_use_id: content.id,
            content: JSON.stringify(result || { error: 'No result' })
          });
          
        } catch (error) {
          console.error(`Error calling tool ${content.name}:`, error);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: content.id,
            content: JSON.stringify({ error: error.message })
          });
        }
      }
    }
  }
  
  return toolResults;
}

export function postProcessResponse(response: string, chatMode: string): string {
  if (chatMode !== 'general') {
    return response;
  }

  // Remove any visible thinking or reasoning blocks
  let cleanedResponse = response;
  
  // Remove <thinking> blocks
  cleanedResponse = cleanedResponse.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
  
  // Remove tool call syntax if any leaked through
  cleanedResponse = cleanedResponse.replace(/```json[\s\S]*?```/gi, '');
  cleanedResponse = cleanedResponse.replace(/\[Tool call:[\s\S]*?\]/gi, '');
  cleanedResponse = cleanedResponse.replace(/\{[\s\S]*?"tool_use"[\s\S]*?\}/gi, '');
  
  // Remove any debugging statements
  cleanedResponse = cleanedResponse.replace(/\[DEBUG:[\s\S]*?\]/gi, '');
  cleanedResponse = cleanedResponse.replace(/\[INTERNAL:[\s\S]*?\]/gi, '');
  
  // Clean up extra whitespace
  cleanedResponse = cleanedResponse.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleanedResponse = cleanedResponse.trim();
  
  // Ensure the response follows the structured format for general knowledge
  if (!cleanedResponse.includes('**') && !cleanedResponse.includes('•')) {
    // If the response doesn't have structure, try to add some basic formatting
    const sentences = cleanedResponse.split('. ');
    if (sentences.length > 3) {
      const summary = sentences.slice(0, 2).join('. ') + '.';
      const details = sentences.slice(2).map(s => `• ${s}`).join('\n');
      cleanedResponse = `**Summary:** ${summary}\n\n**Key Points:**\n${details}`;
    }
  }
  
  return cleanedResponse;
}

async function callEdgeFunction(functionName: string, payload: any) {
  console.log(`📡 Calling edge function: ${functionName}`);
  
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const response = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Edge function ${functionName} failed: ${response.status}`);
  }

  return await response.json();
}
