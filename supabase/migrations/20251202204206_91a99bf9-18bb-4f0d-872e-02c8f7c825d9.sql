-- Add new AI tools for comprehensive tracking across all AI interactions

-- Free Chat tool (for general conversations)
INSERT INTO public.ai_tools (id, display_name, description, system_prompt, is_active, credit_cost, icon_name, accent_color, sort_order)
VALUES (
  'ai-free-chat',
  'Free Chat',
  'General AI assistant for free-form learning conversations',
  'You are a helpful AI learning assistant.',
  true,
  1,
  'MessageCircle',
  '#3b82f6',
  100
) ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_active = true;

-- Socratic Coach tool (for structured learning sessions)
INSERT INTO public.ai_tools (id, display_name, description, system_prompt, is_active, credit_cost, icon_name, accent_color, sort_order)
VALUES (
  'socratic-coach',
  'Socratic Coach',
  'Structured learning through guided Socratic questioning',
  'Guide students through the Socratic method to discover concepts.',
  true,
  2,
  'GraduationCap',
  '#8b5cf6',
  101
) ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_active = true;

-- Phoenix AI Coach tool (for advanced coaching system)
INSERT INTO public.ai_tools (id, display_name, description, system_prompt, is_active, credit_cost, icon_name, accent_color, sort_order)
VALUES (
  'phoenix-ai-coach',
  'Phoenix AI Coach',
  'Advanced AI coaching system with Betty, Al, and Nite Owl personas',
  'Multi-persona educational AI system.',
  true,
  2,
  'Bird',
  '#f59e0b',
  102
) ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_active = true;

-- Widget Chat tool (for quick chat widget interactions)
INSERT INTO public.ai_tools (id, display_name, description, system_prompt, is_active, credit_cost, icon_name, accent_color, sort_order)
VALUES (
  'widget-chat',
  'Widget Chat',
  'Quick AI assistant widget for fast questions',
  'You are a helpful assistant in a chat widget.',
  true,
  1,
  'MessageSquare',
  '#10b981',
  103
) ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  is_active = true;