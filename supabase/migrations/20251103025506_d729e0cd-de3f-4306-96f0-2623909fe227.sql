-- Seed ai_persona_triggers with comprehensive trigger phrases
-- Priority levels: 100=escape_hatch, 95=greeting, 90=clarification, 85=socratic, 80=platform, 75=procedural

-- ===== BETTY (Socratic Guide) Triggers =====

-- Conversation Openers (Priority 95)
INSERT INTO public.ai_persona_triggers (persona, intent, category, trigger_phrase, weight, priority) VALUES
('BETTY', 'conversation_opener', 'greeting', 'hi', 1.0, 95),
('BETTY', 'conversation_opener', 'greeting', 'hey', 1.0, 95),
('BETTY', 'conversation_opener', 'greeting', 'hello', 1.0, 95),
('BETTY', 'conversation_opener', 'greeting', 'yo', 0.8, 95),
('BETTY', 'conversation_opener', 'greeting', 'sup', 0.8, 95),
('BETTY', 'conversation_opener', 'greeting', 'good morning', 1.0, 95),
('BETTY', 'conversation_opener', 'greeting', 'good afternoon', 1.0, 95),
('BETTY', 'conversation_opener', 'greeting', 'good evening', 1.0, 95),
('BETTY', 'conversation_opener', 'readiness_signal', 'ready', 1.2, 95),
('BETTY', 'conversation_opener', 'readiness_signal', 'let''s start', 1.5, 95),
('BETTY', 'conversation_opener', 'readiness_signal', 'can you help', 1.2, 95),
('BETTY', 'conversation_opener', 'readiness_signal', 'you ready', 1.2, 95),
('BETTY', 'conversation_opener', 'readiness_signal', 'wanna study', 1.5, 95),
('BETTY', 'conversation_opener', 'readiness_signal', 'want to learn', 1.5, 95);

-- Socratic Guidance Triggers (Priority 85)
INSERT INTO public.ai_persona_triggers (persona, intent, category, trigger_phrase, weight, priority) VALUES
('BETTY', 'socratic_guidance', 'inquiry', 'why', 1.0, 85),
('BETTY', 'socratic_guidance', 'inquiry', 'how', 1.0, 85),
('BETTY', 'socratic_guidance', 'inquiry', 'explain', 1.2, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'break it down', 1.5, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'break down', 1.5, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'help me understand', 1.8, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'not sure', 1.5, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'unsure', 1.5, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'confused', 1.8, 85),
('BETTY', 'socratic_guidance', 'confusion_signal', 'don''t get', 1.5, 85),
('BETTY', 'socratic_guidance', 'request_pattern', 'could you', 1.0, 85),
('BETTY', 'socratic_guidance', 'request_pattern', 'can you', 1.0, 85),
('BETTY', 'socratic_guidance', 'request_pattern', 'tell me more', 1.2, 85),
('BETTY', 'socratic_guidance', 'request_pattern', 'elaborate', 1.2, 85),
('BETTY', 'socratic_guidance', 'request_pattern', 'what do you mean', 1.5, 85),
('BETTY', 'socratic_guidance', 'request_pattern', 'clarify', 1.5, 85);

-- ===== AL (Direct Expert) Triggers =====

-- Escape Hatch (Priority 100 - HIGHEST)
INSERT INTO public.ai_persona_triggers (persona, intent, category, trigger_phrase, weight, priority) VALUES
('AL', 'escape_hatch', 'exit_socratic', 'just tell me', 2.0, 100),
('AL', 'escape_hatch', 'exit_socratic', 'give me the answer', 2.0, 100),
('AL', 'escape_hatch', 'exit_socratic', 'stop asking', 2.0, 100),
('AL', 'escape_hatch', 'exit_socratic', 'i don''t know', 1.5, 100),
('AL', 'escape_hatch', 'exit_socratic', 'no clue', 1.5, 100),
('AL', 'escape_hatch', 'exit_socratic', 'not interested', 1.8, 100),
('AL', 'escape_hatch', 'exit_socratic', 'skip this', 1.5, 100);

-- Direct Answer Requests (Priority 85)
INSERT INTO public.ai_persona_triggers (persona, intent, category, trigger_phrase, weight, priority) VALUES
('AL', 'request_for_information', 'definition', 'what is', 1.2, 85),
('AL', 'request_for_information', 'definition', 'what does', 1.2, 85),
('AL', 'request_for_information', 'definition', 'define', 1.5, 85),
('AL', 'request_for_information', 'definition', 'definition of', 1.5, 85),
('AL', 'request_for_information', 'definition', 'don''t know what', 1.5, 85),
('AL', 'request_for_information', 'definition', 'never heard of', 1.5, 85);

-- Platform Questions (Priority 80)
INSERT INTO public.ai_persona_triggers (persona, intent, category, trigger_phrase, weight, priority) VALUES
('AL', 'platform_question', 'progress_query', 'how am i doing', 1.5, 80),
('AL', 'platform_question', 'progress_query', 'my progress', 1.5, 80),
('AL', 'platform_question', 'navigation', 'how do i', 1.2, 80),
('AL', 'platform_question', 'navigation', 'dashboard', 1.2, 80),
('AL', 'platform_question', 'navigation', 'settings', 1.2, 80);

-- Procedural Guidance (Priority 75)
INSERT INTO public.ai_persona_triggers (persona, intent, category, trigger_phrase, weight, priority) VALUES
('AL', 'procedural_guidance', 'step_by_step', 'recipe', 1.5, 75),
('AL', 'procedural_guidance', 'step_by_step', 'step', 1.2, 75),
('AL', 'procedural_guidance', 'step_by_step', 'instructions', 1.5, 75),
('AL', 'procedural_guidance', 'step_by_step', 'how to make', 1.5, 75),
('AL', 'procedural_guidance', 'step_by_step', 'procedure', 1.5, 75);

COMMENT ON TABLE public.ai_persona_triggers IS 'Seeded with 60+ trigger phrases across all intents for flexible persona routing';