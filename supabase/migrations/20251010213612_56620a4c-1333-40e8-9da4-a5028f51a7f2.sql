-- Create document_analysis_usage table
CREATE TABLE IF NOT EXISTS public.document_analysis_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  documents_analyzed INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(family_id, month_year)
);

-- Add RLS policies for document_analysis_usage
ALTER TABLE public.document_analysis_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view their usage"
  ON public.document_analysis_usage
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert usage"
  ON public.document_analysis_usage
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can update their usage"
  ON public.document_analysis_usage
  FOR UPDATE
  USING (is_family_member(auth.uid(), family_id));

-- Add index for fast lookups
CREATE INDEX idx_doc_usage_family_month ON public.document_analysis_usage(family_id, month_year);

-- Create alacarte_purchases table
CREATE TABLE IF NOT EXISTS public.alacarte_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('deep_dive', 'goal_generation', 'resource_pack')),
  stripe_payment_intent_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for alacarte_purchases
ALTER TABLE public.alacarte_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Family members can view their purchases"
  ON public.alacarte_purchases
  FOR SELECT
  USING (is_family_member(auth.uid(), family_id));

CREATE POLICY "Family members can insert purchases"
  ON public.alacarte_purchases
  FOR INSERT
  WITH CHECK (is_family_member(auth.uid(), family_id) AND user_id = auth.uid());

CREATE POLICY "Service role can update purchases"
  ON public.alacarte_purchases
  FOR UPDATE
  USING (true);

-- Add indexes
CREATE INDEX idx_alacarte_family ON public.alacarte_purchases(family_id);
CREATE INDEX idx_alacarte_payment_intent ON public.alacarte_purchases(stripe_payment_intent_id);
CREATE INDEX idx_alacarte_user ON public.alacarte_purchases(user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_document_analysis_usage_updated_at
  BEFORE UPDATE ON public.document_analysis_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alacarte_purchases_updated_at
  BEFORE UPDATE ON public.alacarte_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();