-- AI Governance Rules table
CREATE TABLE public.ai_governance_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Academic', 'Technical', 'Creative', 'Communication')),
  description TEXT,
  allowed BOOLEAN NOT NULL DEFAULT true,
  applicable_roles TEXT[] NOT NULL DEFAULT ARRAY['admin', 'instructor', 'student'],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Governance Approvals table
CREATE TABLE public.ai_governance_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  task TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  details TEXT,
  approved_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- AI Governance Model Configs table
CREATE TABLE public.ai_governance_model_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  model_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_type TEXT NOT NULL CHECK (model_type IN ('text', 'image', 'code', 'audio')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{"temperature": 0.7, "maxTokens": 2048, "topP": 1.0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Governance Settings table
CREATE TABLE public.ai_governance_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id UUID UNIQUE REFERENCES public.organizations(id) ON DELETE CASCADE,
  notifications JSONB NOT NULL DEFAULT '{"emailAlerts": true, "dailyReports": false, "criticalOnly": false}'::jsonb,
  security JSONB NOT NULL DEFAULT '{"requireApproval": false, "autoBlockSuspicious": true, "sessionTimeout": 30}'::jsonb,
  data_retention JSONB NOT NULL DEFAULT '{"activityLogs": 90, "approvalHistory": 365}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ai_governance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_governance_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_governance_model_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_governance_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_governance_rules
CREATE POLICY "Admins can manage governance rules" ON public.ai_governance_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() AND org_id = ai_governance_rules.org_id 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can read governance rules" ON public.ai_governance_rules
  FOR SELECT USING (
    org_id IS NULL OR
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() AND org_id = ai_governance_rules.org_id
    )
  );

-- RLS Policies for ai_governance_approvals
CREATE POLICY "Users can create approval requests" ON public.ai_governance_approvals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own approvals" ON public.ai_governance_approvals
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() AND org_id = ai_governance_approvals.org_id 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Admins can update approvals" ON public.ai_governance_approvals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() AND org_id = ai_governance_approvals.org_id 
      AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for ai_governance_model_configs
CREATE POLICY "Admins can manage model configs" ON public.ai_governance_model_configs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() AND org_id = ai_governance_model_configs.org_id 
      AND role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can read model configs" ON public.ai_governance_model_configs
  FOR SELECT USING (true);

-- RLS Policies for ai_governance_settings
CREATE POLICY "Admins can manage governance settings" ON public.ai_governance_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
    ) OR
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE user_id = auth.uid() AND org_id = ai_governance_settings.org_id 
      AND role IN ('owner', 'admin')
    )
  );

-- Triggers for updated_at
CREATE TRIGGER update_ai_governance_rules_updated_at
  BEFORE UPDATE ON public.ai_governance_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_governance_model_configs_updated_at
  BEFORE UPDATE ON public.ai_governance_model_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_governance_settings_updated_at
  BEFORE UPDATE ON public.ai_governance_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default global rules
INSERT INTO public.ai_governance_rules (org_id, name, category, description, allowed, applicable_roles) VALUES
  (NULL, 'Essay Writing Assistance', 'Academic', 'AI can help students with essay writing, providing suggestions and feedback', true, ARRAY['admin', 'instructor', 'student']),
  (NULL, 'Code Generation', 'Technical', 'AI can generate code snippets and help with programming tasks', true, ARRAY['admin', 'instructor', 'student']),
  (NULL, 'Math Problem Solving', 'Academic', 'AI can assist with mathematical calculations and explanations', true, ARRAY['admin', 'instructor', 'student']),
  (NULL, 'Image Generation', 'Creative', 'AI can generate images based on text descriptions', false, ARRAY['admin', 'instructor']),
  (NULL, 'Research Assistance', 'Academic', 'AI can help with research and information gathering', true, ARRAY['admin', 'instructor', 'student']),
  (NULL, 'Translation Services', 'Communication', 'AI can translate text between languages', true, ARRAY['admin', 'instructor', 'student']);

-- Seed default model configurations
INSERT INTO public.ai_governance_model_configs (org_id, model_id, model_name, provider, model_type, is_active, config) VALUES
  (NULL, 'gpt-4o', 'GPT-4o', 'OpenAI', 'text', true, '{"temperature": 0.7, "maxTokens": 4096, "topP": 1.0}'::jsonb),
  (NULL, 'gpt-4o-mini', 'GPT-4o Mini', 'OpenAI', 'text', true, '{"temperature": 0.7, "maxTokens": 2048, "topP": 1.0}'::jsonb),
  (NULL, 'claude-3-5-sonnet', 'Claude 3.5 Sonnet', 'Anthropic', 'text', true, '{"temperature": 0.7, "maxTokens": 4096, "topP": 1.0}'::jsonb),
  (NULL, 'dall-e-3', 'DALL-E 3', 'OpenAI', 'image', false, '{"quality": "standard", "size": "1024x1024"}'::jsonb),
  (NULL, 'llama-3', 'Llama 3', 'Meta', 'text', false, '{"temperature": 0.7, "maxTokens": 2048, "topP": 1.0}'::jsonb);