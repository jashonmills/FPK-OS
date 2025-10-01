// Socratic Session Handler for AI Study Chat
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface SocraticRequest {
  sessionId?: string;
  userId: string;
  orgId?: string;
  intent: 'start' | 'respond' | 'hint' | 'complete';
  topic?: string;
  objective?: string;
  studentResponse?: string;
  promotedFromFreeChat?: boolean; // Flag for warm handoff
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

    // Create session
    const { data: session, error } = await supabase
      .from('socratic_sessions')
      .insert({
        user_id: userId,
        org_id: orgId || null,
        topic,
        objective,
        state: 'ASK'
      })
      .select()
      .single();

    if (error) throw error;

    // Generate first message using the Socratic v3 prompt structure
    // The system prompt (SOCRATIC_STRUCTURED_PROMPT) already contains the IF/THEN logic
    const questionPrompt = request.promotedFromFreeChat
      ? `The session is starting because it was promoted from a Free Chat. Topic: "${topic}". Generate your "Overview and Orient" message following the instructions in BLOCK 3.`
      : `The session is a manual start. Topic: "${topic}". Learning Objective: "${objective}". Generate your opening message following the instructions in BLOCK 3.`;

    const question = await geminiCall(questionPrompt);

    // Save question as turn
    await supabase.from('socratic_turns').insert({
      session_id: session.id,
      role: 'coach',
      content: question
    });

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
1 = Partial understanding with major gaps
2 = Mostly correct with minor gaps
3 = Fully correct and ready to advance

Topic: ${session.topic}
Objective: ${session.objective}
Student Response: "${studentResponse}"

Return ONLY a JSON object with this exact format:
{"score": <0-3>, "misconception": "<brief explanation if score < 3, or empty string>"}`;

    const evalText = await geminiCall(evaluationPrompt);
    
    // Parse evaluation (handle potential markdown wrapping)
    let evaluation: { score: number; misconception?: string };
    try {
      const jsonMatch = evalText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : evalText;
      evaluation = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse evaluation:', evalText);
      evaluation = { score: 1, misconception: 'Unable to evaluate response' };
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
      const nextPrompt = `The student has mastered the previous concept. Generate the NEXT Socratic question (max 20 words) to progress toward the objective:

Topic: ${session.topic}
Objective: ${session.objective}
Score History: ${scoreHistory.join(', ')}
Average Score: ${avgScore.toFixed(1)}

Generate only the question, no explanations.`;

      nextQuestion = await geminiCall(nextPrompt);
    } else if (nudgeCount >= 3) {
      // Too many nudges, provide stronger hint and move on
      const moveOnPrompt = `The student is struggling after ${nudgeCount} attempts. Provide ONE clear hint (max 30 words) and then ask a slightly easier question about the same concept:

Topic: ${session.topic}
Current Question: ${session.current_question}
Misconception: ${evaluation.misconception}

Format: "Hint: <brief hint>. Now: <simpler question>"`;

      nextQuestion = await geminiCall(moveOnPrompt);
      nextState = 'NUDGE';
    } else {
      // Provide nudge/hint
      nextState = 'NUDGE';
      const nudgePrompt = `The student needs help. Re-ask the SAME question in simpler words and add ONE short hint (max 25 words total):

Original Question: ${session.current_question}
Student's Difficulty: ${evaluation.misconception}
Attempt: ${nudgeCount + 1}/3

Generate only the simplified question with hint, no explanations.`;

      nextQuestion = await geminiCall(nudgePrompt);
    }

    // Save next question
    await supabase.from('socratic_turns').insert({
      session_id: sessionId,
      role: 'coach',
      content: nextQuestion
    });

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
