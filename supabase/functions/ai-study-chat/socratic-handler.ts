// Socratic Session Handler for AI Study Chat
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Cleans AI responses to ensure no internal reasoning is exposed
 * Strips JSON formatting, thought fields, and meta-commentary
 */
function cleanAIResponse(rawResponse: string): string {
  let cleaned = rawResponse.trim();
  
  console.log('🧹 Cleaning AI response:', cleaned.substring(0, 200));
  
  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.response) {
      console.log('✅ Extracted response from JSON');
      return parsed.response.trim();
    }
    if (parsed.text) {
      return parsed.text.trim();
    }
    if (parsed.content) {
      return parsed.content.trim();
    }
  } catch {
    // Not valid JSON, continue with regex approach
  }
  
  // Fallback: Use regex to extract JSON with multiline support
  const jsonMatch = cleaned.match(/\{[\s\S]*"response"\s*:\s*"([^"]+(?:\\.[^"]*)*)"[\s\S]*\}/);
  if (jsonMatch && jsonMatch[1]) {
    console.log('✅ Extracted response via regex');
    return jsonMatch[1]
      .replace(/\\n/g, ' ')
      .replace(/\\"/g, '"')
      .trim();
  }
  
  // Remove meta-phrases if no JSON found
  const metaPhrases = [
    /^I'm thinking.*/im,
    /^I need to.*/im,
    /^Perhaps I should.*/im,
    /^Let me consider.*/im,
    /^Based on (?:their|the student's) response.*/im,
    /^I will now.*/im,
    /^My reasoning is.*/im,
    /^The user is.*/im,
    /^The student is.*/im,
    /^\{.*"thought".*\}/s,
    /^The user wants to learn about.*/im
  ];
  
  for (const pattern of metaPhrases) {
    cleaned = cleaned.replace(pattern, '').trim();
  }
  
  console.log('⚠️ No JSON found, returning cleaned text');
  return cleaned;
}

export interface SocraticRequest {
  sessionId?: string;
  userId: string;
  orgId?: string;
  intent: 'start' | 'respond' | 'hint' | 'complete';
  topic?: string;
  objective?: string;
  studentResponse?: string;
  promotedFromFreeChat?: boolean; // Flag for warm handoff
  source?: string; // Track data source for isolation
}

export interface SocraticResponse {
  sessionId: string;
  question?: string;
  feedback?: string;
  score?: number;
  state: string;
  isComplete: boolean;
  averageScore?: number;
}

export async function handleSocraticSession(
  request: SocraticRequest,
  geminiCall: (prompt: string) => Promise<string>
): Promise<SocraticResponse> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { intent, sessionId, userId, orgId, topic, objective, studentResponse } = request;

  // START: Create new Socratic session
  if (intent === 'start') {
    if (!topic || !objective) {
      throw new Error('Topic and objective required to start session');
    }

    // Accept source from request (defaults to 'fpk_university' for backward compatibility)
    const source = request.source || 'fpk_university';

    // Create session with source tracking
    const { data: session, error } = await supabase
      .from('socratic_sessions')
      .insert({
        user_id: userId,
        org_id: orgId || null,
        topic,
        objective,
        state: 'ASK',
        source  // CRITICAL: Track data source for isolation
      })
      .select()
      .single();

    if (error) throw error;

    // Generate first message using the Socratic v3 prompt structure
    // The system prompt (SOCRATIC_STRUCTURED_PROMPT) already contains the IF/THEN logic
    const questionPrompt = request.promotedFromFreeChat
      ? `The session is starting because it was promoted from a Free Chat. Topic: "${topic}".

CRITICAL: Respond with ONLY plain text. Do NOT use JSON format. Do NOT include "thought" or "response" fields.

You MUST generate a complete "Overview and Orient" message with these two parts:
(1) Acknowledge the session start and provide a 1-2 sentence, high-level overview of "${topic}".
(2) Ask the user to choose a specific direction or sub-topic to explore first, providing 2-3 concrete examples.

Remember: Output ONLY the text the student should see. No JSON formatting.`
      : `The session is a manual start. Topic: "${topic}". Learning Objective: "${objective}".

CRITICAL: Respond with ONLY plain text. Do NOT use JSON format. Do NOT include "thought" or "response" fields.

Acknowledge both the topic and objective, then begin with a broad opening question about "${topic}".

Remember: Output ONLY the text the student should see. No JSON formatting.`;

    const question = cleanAIResponse(await geminiCall(questionPrompt));

    // Emergency cleaning pass before saving
    let finalQuestion = question;
    try {
      const parsed = JSON.parse(question);
      if (parsed.response) finalQuestion = parsed.response;
    } catch {
      // Already clean, use as-is
    }

    // Save question as turn
    await supabase.from('socratic_turns').insert({
      session_id: session.id,
      role: 'coach',
      content: finalQuestion
    });

    // Post-save verification
    if (finalQuestion.includes('"thought"') || finalQuestion.includes('"response"')) {
      console.error('❌ WARNING: JSON structure still present in saved content!');
    }

    // Update session
    await supabase
      .from('socratic_sessions')
      .update({ state: 'WAIT', current_question: question })
      .eq('id', session.id);

    return {
      sessionId: session.id,
      question,
      state: 'WAIT',
      isComplete: false
    };
  }

  // RESPOND: Handle student response and evaluate
  if (intent === 'respond') {
    if (!sessionId || !studentResponse) {
      throw new Error('SessionId and studentResponse required');
    }

    // Load session
    const { data: session, error: sessionError } = await supabase
      .from('socratic_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError) throw sessionError;

    // Save student response
    await supabase.from('socratic_turns').insert({
      session_id: sessionId,
      role: 'student',
      content: studentResponse
    });

    // Evaluate response
    const evaluationPrompt = `Evaluate this student response using the 0-3 rubric:
0 = Off-topic or blank
1 = Partial understanding with major gaps (contains some correct ideas but significant misconceptions)
2 = Mostly correct with minor gaps (understands the core concept but lacks precision)
3 = Fully correct and ready to advance (demonstrates clear understanding and can explain why)

Topic: ${session.topic}
Objective: ${session.objective}
Current Question: ${session.current_question}
Student Response: "${studentResponse}"

IMPORTANT: Your evaluation should consider:
- What is CORRECT in their thinking (even if incomplete)?
- What specific misconception or gap prevents full understanding?
- What logical next step would build on their correct ideas?

CRITICAL: Return ONLY valid JSON with this EXACT format. NO additional text, thoughts, or commentary:
{"score": <0-3>, "misconception": "<brief explanation if score < 3, or empty string>", "correct_part": "<what they got right, even if partial>"}`;

    const evalText = await geminiCall(evaluationPrompt);
    
    // Parse evaluation (handle potential markdown wrapping)
    let evaluation: { score: number; misconception?: string; correct_part?: string };
    try {
      const jsonMatch = evalText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : evalText;
      evaluation = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse evaluation:', evalText);
      evaluation = { score: 1, misconception: 'Unable to evaluate response', correct_part: '' };
    }

    const score = Math.max(0, Math.min(3, Math.round(evaluation.score)));
    const scoreHistory = [...(session.score_history || []), score];

    // Save evaluation
    await supabase.from('socratic_turns').insert({
      session_id: sessionId,
      role: 'system',
      content: JSON.stringify(evaluation),
      score,
      misconception: evaluation.misconception || null,
      correct_part: evaluation.correct_part || null,
      tag: 'evaluation'
    });

    // Determine next action
    const nudgeCount = session.nudge_count || 0;
    const avgScore = scoreHistory.reduce((a, b) => a + b, 0) / scoreHistory.length;

    let nextQuestion: string;
    let nextState: string;

    if (score >= 3) {
      // Advance to next concept
      nextState = 'NEXT';
      const nextPrompt = `The student has mastered the previous concept (score 3/3). 

**Use the AVCQ Loop to transition:**
1. ACKNOWLEDGE their correct answer: "${studentResponse}"
2. VALIDATE what they got right
3. CONNECT their understanding to the next concept
4. QUESTION with a new challenge that builds on their knowledge

Topic: ${session.topic}
Objective: ${session.objective}
Previous Question: ${session.current_question}
Score History: ${scoreHistory.join(', ')}

CRITICAL: Respond with ONLY plain text following AVCQ. No JSON. Max 40 words total.`;

      nextQuestion = cleanAIResponse(await geminiCall(nextPrompt));
    } else if (nudgeCount >= 3) {
      // Too many nudges, provide stronger hint and move on
      const moveOnPrompt = `The student is struggling after ${nudgeCount} attempts.

**Use the AVCQ Loop with a Level 3 (Direct Clue) hint:**
1. ACKNOWLEDGE their effort: "${studentResponse}"
2. VALIDATE any correct thinking (find SOMETHING right in their answer)
3. CONNECT with a strong direct hint about the answer
4. QUESTION with a much simpler version of the concept

Topic: ${session.topic}
Current Question: ${session.current_question}
Student's Difficulty: ${evaluation.misconception}
What They Got Right: ${evaluation.correct_part || 'their effort to engage'}

Format: "[Acknowledge] [Validate correct part] [Strong hint] [Simpler question]"

CRITICAL: Respond with ONLY plain text. No JSON. Max 45 words.`;

      nextQuestion = cleanAIResponse(await geminiCall(moveOnPrompt));
      nextState = 'NUDGE';
    } else {
      // Provide nudge/hint
      nextState = 'NUDGE';
      const nudgePrompt = `The student needs help (score ${score}/3, attempt ${nudgeCount + 1}/3).

**Use the AVCQ Loop with a Level ${nudgeCount + 1} hint:**
1. ACKNOWLEDGE their answer: "${studentResponse}"
2. VALIDATE the correct part: "${evaluation.correct_part || 'their engagement'}"
3. CONNECT & DIFFERENTIATE (explain how their answer relates but differs)
4. QUESTION with a ${['sensory', 'analogous scenario', 'direct clue'][nudgeCount]} hint

Topic: ${session.topic}
Original Question: ${session.current_question}
Student's Difficulty: ${evaluation.misconception}

Hint Level ${nudgeCount + 1}:
- Level 1 = Sensory hint (feel, see, hear, touch)
- Level 2 = Analogous scenario (relate to everyday experience)
- Level 3 = Direct clue (almost give away the answer)

CRITICAL: Respond with ONLY plain text following AVCQ. No JSON. Max 40 words.`;

      nextQuestion = cleanAIResponse(await geminiCall(nudgePrompt));
    }

    // Emergency cleaning pass before saving
    let finalNextQuestion = nextQuestion;
    try {
      const parsed = JSON.parse(nextQuestion);
      if (parsed.response) finalNextQuestion = parsed.response;
    } catch {
      // Already clean, use as-is
    }

    // AVCQ Compliance Logging
    console.log('📊 AVCQ Check:', {
      hasAcknowledge: finalNextQuestion.toLowerCase().includes(studentResponse.substring(0, 15).toLowerCase()),
      hasValidate: finalNextQuestion.match(/right|correct|good|yes|true/i) !== null,
      questionLength: finalNextQuestion.length,
      nudgeLevel: nudgeCount + 1
    });

    // Save next question
    await supabase.from('socratic_turns').insert({
      session_id: sessionId,
      role: 'coach',
      content: finalNextQuestion
    });

    // Post-save verification
    if (finalNextQuestion.includes('"thought"') || finalNextQuestion.includes('"response"')) {
      console.error('❌ WARNING: JSON structure still present in saved content!');
    }

    // Update session
    await supabase
      .from('socratic_sessions')
      .update({
        state: nextState,
        current_question: nextQuestion,
        score_history: scoreHistory,
        nudge_count: nextState === 'NUDGE' ? nudgeCount + 1 : 0
      })
      .eq('id', sessionId);

    return {
      sessionId,
      question: nextQuestion,
      feedback: score >= 3 ? 'Excellent! Moving to the next concept.' : evaluation.misconception,
      score,
      state: nextState,
      isComplete: false,
      averageScore: avgScore
    };
  }

  // COMPLETE: End the session
  if (intent === 'complete') {
    if (!sessionId) throw new Error('SessionId required');

    await supabase
      .from('socratic_sessions')
      .update({
        state: 'COMPLETED',
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    return {
      sessionId,
      state: 'COMPLETED',
      isComplete: true
    };
  }

  throw new Error(`Unknown intent: ${intent}`);
}
