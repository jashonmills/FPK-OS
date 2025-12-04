-- =============================================
-- Phase 5 Sprint 5-7: Learning Path Mapping
-- Knowledge Graph Foundation
-- =============================================

-- 1. Phoenix Learning Concepts Table
-- Master curriculum of all learnable concepts
CREATE TABLE IF NOT EXISTS public.phoenix_learning_concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_name TEXT NOT NULL UNIQUE,
  concept_slug TEXT NOT NULL UNIQUE,
  domain TEXT NOT NULL, -- e.g., 'mathematics', 'programming', 'science'
  difficulty_level INTEGER NOT NULL DEFAULT 1 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  description TEXT,
  estimated_time_hours NUMERIC(5,2) DEFAULT 1.0,
  tags JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_phoenix_concepts_domain ON public.phoenix_learning_concepts(domain);
CREATE INDEX idx_phoenix_concepts_difficulty ON public.phoenix_learning_concepts(difficulty_level);
CREATE INDEX idx_phoenix_concepts_slug ON public.phoenix_learning_concepts(concept_slug);

-- 2. Phoenix Concept Prerequisites Table
-- Defines relationships and dependencies between concepts
CREATE TABLE IF NOT EXISTS public.phoenix_concept_prerequisites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_id UUID NOT NULL REFERENCES public.phoenix_learning_concepts(id) ON DELETE CASCADE,
  prerequisite_id UUID NOT NULL REFERENCES public.phoenix_learning_concepts(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN (
    'required',      -- Must learn prerequisite first
    'recommended',   -- Helpful but not required
    'related'        -- Connected concepts, no order
  )),
  strength NUMERIC(3,2) DEFAULT 1.0 CHECK (strength >= 0 AND strength <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(concept_id, prerequisite_id)
);

CREATE INDEX idx_phoenix_prereqs_concept ON public.phoenix_concept_prerequisites(concept_id);
CREATE INDEX idx_phoenix_prereqs_prerequisite ON public.phoenix_concept_prerequisites(prerequisite_id);
CREATE INDEX idx_phoenix_prereqs_type ON public.phoenix_concept_prerequisites(relationship_type);

-- 3. Add concept_id to phoenix_learning_outcomes
-- Links learning outcomes to specific concepts in the graph
ALTER TABLE public.phoenix_learning_outcomes 
ADD COLUMN IF NOT EXISTS concept_id UUID REFERENCES public.phoenix_learning_concepts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_phoenix_outcomes_concept ON public.phoenix_learning_outcomes(concept_id);

-- 4. RLS Policies for phoenix_learning_concepts
ALTER TABLE public.phoenix_learning_concepts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active concepts"
  ON public.phoenix_learning_concepts
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage concepts"
  ON public.phoenix_learning_concepts
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 5. RLS Policies for phoenix_concept_prerequisites
ALTER TABLE public.phoenix_concept_prerequisites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view prerequisites"
  ON public.phoenix_concept_prerequisites
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage prerequisites"
  ON public.phoenix_concept_prerequisites
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- 6. Function to get user's learning path
CREATE OR REPLACE FUNCTION public.get_user_learning_path(
  p_user_id UUID,
  p_domain TEXT DEFAULT NULL
)
RETURNS TABLE(
  concept_id UUID,
  concept_name TEXT,
  concept_slug TEXT,
  domain TEXT,
  difficulty_level INTEGER,
  mastery_level NUMERIC,
  status TEXT,
  prerequisites JSONB,
  related_concepts JSONB,
  last_interaction TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH user_mastery AS (
    SELECT 
      plo.concept_id,
      AVG(plo.mastery_level) as avg_mastery,
      MAX(plo.created_at) as last_interaction
    FROM phoenix_learning_outcomes plo
    WHERE plo.user_id = p_user_id
    AND plo.concept_id IS NOT NULL
    GROUP BY plo.concept_id
  ),
  concept_prereqs AS (
    SELECT 
      pcp.concept_id,
      jsonb_agg(
        jsonb_build_object(
          'id', plc.id,
          'name', plc.concept_name,
          'slug', plc.concept_slug,
          'type', pcp.relationship_type,
          'strength', pcp.strength
        )
      ) as prereqs
    FROM phoenix_concept_prerequisites pcp
    JOIN phoenix_learning_concepts plc ON plc.id = pcp.prerequisite_id
    GROUP BY pcp.concept_id
  ),
  related_concepts AS (
    SELECT 
      pcp.prerequisite_id as concept_id,
      jsonb_agg(
        jsonb_build_object(
          'id', plc.id,
          'name', plc.concept_name,
          'slug', plc.concept_slug
        )
      ) as related
    FROM phoenix_concept_prerequisites pcp
    JOIN phoenix_learning_concepts plc ON plc.id = pcp.concept_id
    WHERE pcp.relationship_type = 'related'
    GROUP BY pcp.prerequisite_id
  )
  SELECT 
    plc.id as concept_id,
    plc.concept_name,
    plc.concept_slug,
    plc.domain,
    plc.difficulty_level,
    COALESCE(um.avg_mastery, 0) as mastery_level,
    CASE 
      WHEN um.avg_mastery IS NULL THEN 'not_started'
      WHEN um.avg_mastery >= 0.8 THEN 'mastered'
      WHEN um.avg_mastery >= 0.5 THEN 'in_progress'
      ELSE 'learning'
    END as status,
    COALESCE(cp.prereqs, '[]'::jsonb) as prerequisites,
    COALESCE(rc.related, '[]'::jsonb) as related_concepts,
    um.last_interaction
  FROM phoenix_learning_concepts plc
  LEFT JOIN user_mastery um ON um.concept_id = plc.id
  LEFT JOIN concept_prereqs cp ON cp.concept_id = plc.id
  LEFT JOIN related_concepts rc ON rc.concept_id = plc.id
  WHERE plc.is_active = true
  AND (p_domain IS NULL OR plc.domain = p_domain)
  ORDER BY 
    CASE 
      WHEN um.avg_mastery IS NOT NULL THEN 1
      ELSE 2
    END,
    plc.difficulty_level,
    plc.concept_name;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_learning_path(UUID, TEXT) TO authenticated;

-- 7. Function to recommend next concepts
CREATE OR REPLACE FUNCTION public.get_recommended_concepts(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 5
)
RETURNS TABLE(
  concept_id UUID,
  concept_name TEXT,
  concept_slug TEXT,
  domain TEXT,
  difficulty_level INTEGER,
  recommendation_score NUMERIC,
  reason TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH user_mastery AS (
    SELECT 
      plo.concept_id,
      AVG(plo.mastery_level) as mastery_level
    FROM phoenix_learning_outcomes plo
    WHERE plo.user_id = p_user_id
    AND plo.concept_id IS NOT NULL
    GROUP BY plo.concept_id
    HAVING AVG(plo.mastery_level) >= 0.7
  ),
  available_concepts AS (
    SELECT 
      plc.id,
      plc.concept_name,
      plc.concept_slug,
      plc.domain,
      plc.difficulty_level,
      COUNT(pcp.prerequisite_id) FILTER (WHERE um.concept_id IS NOT NULL) as met_prereqs,
      COUNT(pcp.prerequisite_id) as total_prereqs
    FROM phoenix_learning_concepts plc
    LEFT JOIN phoenix_concept_prerequisites pcp 
      ON pcp.concept_id = plc.id 
      AND pcp.relationship_type = 'required'
    LEFT JOIN user_mastery um ON um.concept_id = pcp.prerequisite_id
    WHERE plc.is_active = true
    AND NOT EXISTS (
      SELECT 1 FROM user_mastery um2 WHERE um2.concept_id = plc.id
    )
    GROUP BY plc.id, plc.concept_name, plc.concept_slug, plc.domain, plc.difficulty_level
  )
  SELECT 
    ac.id as concept_id,
    ac.concept_name,
    ac.concept_slug,
    ac.domain,
    ac.difficulty_level,
    CASE 
      WHEN ac.total_prereqs = 0 THEN 1.0
      ELSE (ac.met_prereqs::NUMERIC / ac.total_prereqs::NUMERIC)
    END as recommendation_score,
    CASE 
      WHEN ac.total_prereqs = 0 THEN 'New topic to explore'
      WHEN ac.met_prereqs = ac.total_prereqs THEN 'Ready to learn - all prerequisites met'
      ELSE format('Prerequisites: %s of %s completed', ac.met_prereqs, ac.total_prereqs)
    END as reason
  FROM available_concepts ac
  WHERE ac.met_prereqs = ac.total_prereqs OR ac.total_prereqs = 0
  ORDER BY recommendation_score DESC, ac.difficulty_level
  LIMIT p_limit;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_recommended_concepts(UUID, INTEGER) TO authenticated;

-- 8. Seed some initial concepts for testing (Python basics)
INSERT INTO public.phoenix_learning_concepts (concept_name, concept_slug, domain, difficulty_level, description, estimated_time_hours) VALUES
('Python Basics', 'python-basics', 'programming', 1, 'Introduction to Python programming language', 2.0),
('Variables and Data Types', 'variables-data-types', 'programming', 1, 'Understanding variables, integers, floats, strings, and booleans', 1.5),
('Control Flow', 'control-flow', 'programming', 2, 'If statements, loops, and conditional logic', 2.0),
('Functions', 'functions', 'programming', 2, 'Defining and calling functions, parameters, return values', 2.5),
('Lists and Tuples', 'lists-tuples', 'programming', 2, 'Working with ordered collections of data', 2.0),
('Dictionaries', 'dictionaries', 'programming', 3, 'Key-value pairs and hash maps', 2.0),
('Object-Oriented Programming', 'oop', 'programming', 4, 'Classes, objects, inheritance, and polymorphism', 4.0),
('File I/O', 'file-io', 'programming', 3, 'Reading and writing files', 1.5)
ON CONFLICT (concept_slug) DO NOTHING;

-- 9. Seed prerequisite relationships
INSERT INTO public.phoenix_concept_prerequisites (concept_id, prerequisite_id, relationship_type, strength) 
SELECT 
  c1.id,
  c2.id,
  'required',
  1.0
FROM 
  (SELECT id, concept_slug FROM phoenix_learning_concepts) c1,
  (SELECT id, concept_slug FROM phoenix_learning_concepts) c2
WHERE 
  (c1.concept_slug = 'variables-data-types' AND c2.concept_slug = 'python-basics') OR
  (c1.concept_slug = 'control-flow' AND c2.concept_slug = 'variables-data-types') OR
  (c1.concept_slug = 'functions' AND c2.concept_slug = 'control-flow') OR
  (c1.concept_slug = 'lists-tuples' AND c2.concept_slug = 'variables-data-types') OR
  (c1.concept_slug = 'dictionaries' AND c2.concept_slug = 'lists-tuples') OR
  (c1.concept_slug = 'oop' AND c2.concept_slug = 'functions') OR
  (c1.concept_slug = 'oop' AND c2.concept_slug = 'dictionaries') OR
  (c1.concept_slug = 'file-io' AND c2.concept_slug = 'functions')
ON CONFLICT (concept_id, prerequisite_id) DO NOTHING;