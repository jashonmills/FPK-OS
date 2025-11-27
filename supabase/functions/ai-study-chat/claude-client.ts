const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: any;
}

interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function callClaude(messages: ClaudeMessage[], model?: string, chatMode?: string) {
  const selectedModel = model || 'claude-3-5-sonnet-20241022';
  
  console.log(`🤖 Calling Claude with model: ${selectedModel}, mode: ${chatMode}`);
  
  // Personal mode tools only
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

  // Use tools only for personal mode
  const tools = chatMode === 'personal' ? personalTools : [];
  
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

export async function callOpenAI(messages: OpenAIMessage[], model?: string, chatMode?: string) {
  const selectedModel = model || 'gpt-4o';
  
  console.log(`🤖 Calling OpenAI with model: ${selectedModel}, mode: ${chatMode}`);
  
  // General knowledge tools only (for future implementation)
  const generalTools = [
    {
      type: "function",
      function: {
        name: "retrieve_knowledge",
        description: "Search external knowledge sources including Wikipedia, research papers, and educational content",
        parameters: {
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
    }
  ];

  // Use tools only for general mode (for future implementation)
  const tools = chatMode === 'general' ? [] : []; // Disable tools for now
  
  console.log(`🔧 Using ${tools.length} tools for ${chatMode || 'general'} mode`);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey!}`
    },
    body: JSON.stringify({
      model: selectedModel,
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
      ...(tools.length > 0 && { tools })
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenAI API error:', errorText);
    throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

export async function handleToolCalls(data: any, userId: string, chatMode?: string) {
  console.log('🔧 Processing tool calls for mode:', chatMode);
  console.log('🔍 Tool call data structure:', JSON.stringify(data, null, 2));
  
  const toolResults = [];
  
  if (data.content) {
    for (const content of data.content) {
      if (content.type === 'tool_use') {
        console.log(`🛠️ Tool call: ${content.name}`, content.input);
        
        try {
          let result;
          
          // Handle personal mode tools only
          if (chatMode === 'personal' || !chatMode) {
            switch (content.name) {
              case 'get_recent_flashcards':
                console.log('📚 Calling get_recent_flashcards with enhanced error handling');
                result = await callEdgeFunction('get-recent-flashcards', {
                  userId: userId,
                  limit: content.input.limit || 5
                });
                
                console.log('📚 Recent flashcards result structure:', {
                  hasFlashcards: result?.flashcards?.length > 0,
                  count: result?.flashcards?.length || 0,
                  message: result?.message,
                  success: result?.success,
                  isEmpty: result?.isEmpty,
                  fullResult: JSON.stringify(result, null, 2)
                });
                break;
              
              case 'get_user_flashcards':
                console.log('📚 Calling get_user_flashcards with correct userId parameter');
                result = await callEdgeFunction('get-user-flashcards', {
                  userId: userId,
                  topic_filter: content.input.topic_filter,
                  difficulty_filter: content.input.difficulty_filter
                });
                
                console.log('📚 User flashcards result structure:', {
                  hasFlashcards: result?.flashcards?.length > 0,
                  count: result?.flashcards?.length || 0,
                  message: result?.message,
                  success: result?.success,
                  isEmpty: result?.isEmpty
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
          } else {
            console.warn(`Tool calls not supported in ${chatMode} mode yet`);
            result = { error: `Tools not available in ${chatMode} mode` };
          }
          
          const formattedResult = {
            type: 'tool_result',
            tool_use_id: content.id,
            content: formatToolResultForClaude(result, content.name)
          };
          
          console.log(`✅ Tool result formatted for Claude:`, JSON.stringify(formattedResult, null, 2));
          toolResults.push(formattedResult);
          
        } catch (error) {
          console.error(`Error calling tool ${content.name}:`, error);
          toolResults.push({
            type: 'tool_result',
            tool_use_id: content.id,
            content: JSON.stringify({ 
              error: error.message,
              tool_name: content.name,
              user_message: "I encountered an issue retrieving your data. Please try again."
            })
          });
        }
      }
    }
  }
  
  console.log(`🔄 Returning ${toolResults.length} tool results to Claude`);
  return toolResults;
}

function formatToolResultForClaude(result: any, toolName: string): string {
  if (!result) {
    return JSON.stringify({ error: 'No result returned from tool' });
  }

  // Special formatting for flashcard tools
  if (toolName === 'get_recent_flashcards' || toolName === 'get_user_flashcards') {
    if (result.success && result.flashcards && result.flashcards.length > 0) {
      const formattedData = {
        success: true,
        flashcard_count: result.flashcards.length,
        flashcards: result.flashcards.map((card: any, index: number) => ({
          number: index + 1,
          id: card.id,
          question: card.question || card.front_content,
          answer: card.answer || card.back_content,
          title: card.title,
          snippet: card.snippet,
          created_at: card.created_at,
          stats: card.stats,
          performance: {
            correct: card.stats?.correct || 0,
            attempts: card.stats?.attempts || 0,
            success_rate: card.stats?.successRate || 0
          }
        })),
        message: `Found ${result.flashcards.length} flashcards for the user`,
        instruction_to_claude: `Please present these ${result.flashcards.length} flashcards in a numbered list format. Show the question/title and a brief snippet for each one. Ask if the user wants to review any specific cards.`
      };
      
      return JSON.stringify(formattedData);
    } else if (result.success && result.isEmpty) {
      return JSON.stringify({
        success: true,
        flashcard_count: 0,
        flashcards: [],
        message: "No flashcards found",
        instruction_to_claude: "Tell the user they don't have any flashcards yet and suggest they create some."
      });
    }
  }

  return JSON.stringify(result);
}

export function postProcessResponse(response: string, chatMode: string): string {
  if (chatMode !== 'general') {
    return response;
  }

  // Clean up any visible thinking or reasoning blocks for general mode
  let cleanedResponse = response;
  
  cleanedResponse = cleanedResponse.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
  cleanedResponse = cleanedResponse.replace(/```json[\s\S]*?```/gi, '');
  cleanedResponse = cleanedResponse.replace(/\[Tool call:[\s\S]*?\]/gi, '');
  cleanedResponse = cleanedResponse.replace(/\{[\s\S]*?"tool_use"[\s\S]*?\}/gi, '');
  cleanedResponse = cleanedResponse.replace(/\[DEBUG:[\s\S]*?\]/gi, '');
  cleanedResponse = cleanedResponse.replace(/\[INTERNAL:[\s\S]*?\]/gi, '');
  
  cleanedResponse = cleanedResponse.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleanedResponse = cleanedResponse.trim();
  
  // Ensure structured format for general knowledge
  if (!cleanedResponse.includes('**') && !cleanedResponse.includes('•')) {
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
  console.log(`📡 Calling edge function: ${functionName}`, payload);
  
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
    const errorText = await response.text();
    console.error(`Edge function ${functionName} failed:`, response.status, errorText);
    throw new Error(`Edge function ${functionName} failed: ${response.status}`);
  }

  return await response.json();
}
