
import { CLAUDE_MODEL, MAX_TOKENS, TIMEOUT_MS } from './constants.ts';
import { TOOL_DEFINITIONS, executeToolCall } from './tools.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

export async function callClaude(messages: any[]): Promise<any> {
  if (!anthropicApiKey) {
    throw new Error('Anthropic API key not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    console.log('🤖 Calling Claude 4 with enhanced tool handling...');
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': anthropicApiKey,
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: MAX_TOKENS,
        tools: TOOL_DEFINITIONS,
        tool_choice: { type: "auto" },
        messages
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📨 Claude 4 response received:', { 
      hasContent: !!data.content, 
      contentLength: data.content?.length,
      stopReason: data.stop_reason,
      hasToolUse: data.content?.some((block: any) => block.type === 'tool_use')
    });
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('💥 Error calling Claude 4:', error);
    throw error;
  }
}

export async function handleToolCalls(data: any, userId: string): Promise<any[]> {
  console.log('🛠️ Processing Claude 4 tool requests');
  
  const toolResults: any[] = [];
  
  for (const contentBlock of data.content) {
    if (contentBlock.type === 'tool_use') {
      const toolName = contentBlock.name;
      let toolArgs = contentBlock.input;
      
      // Ensure userId is included for personal tools
      if (['get_recent_flashcards', 'get_user_flashcards', 'get_study_stats'].includes(toolName)) {
        toolArgs = { ...toolArgs, userId };
      }
      
      console.log(`🔧 Executing tool: ${toolName}`, toolArgs);
      const toolResult = await executeToolCall(toolName, toolArgs);
      
      toolResults.push({
        type: "tool_result",
        tool_use_id: contentBlock.id,
        content: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult)
      });
    }
  }

  return toolResults;
}
