-- Create collections system for course management
CREATE TABLE IF NOT EXISTS public.course_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  org_id UUID,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Course collection items junction table
CREATE TABLE IF NOT EXISTS public.course_collection_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.course_collections(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  added_by UUID NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(collection_id, course_id)
);

-- Course duplication/cloning table
CREATE TABLE IF NOT EXISTS public.course_duplicates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  original_course_id TEXT NOT NULL,
  duplicated_course_id TEXT NOT NULL,
  duplicated_by UUID NOT NULL,
  org_id UUID,
  attribution_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_duplicates ENABLE ROW LEVEL SECURITY;

-- Collections policies
CREATE POLICY "Users can view public collections or own/org collections" ON public.course_collections
FOR SELECT USING (
  is_public = true OR 
  created_by = auth.uid() OR 
  (org_id IS NOT NULL AND user_is_org_member_safe(org_id, auth.uid()))
);

CREATE POLICY "Users can create collections" ON public.course_collections
FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Collection creators can update their collections" ON public.course_collections
FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Collection creators can delete their collections" ON public.course_collections
FOR DELETE USING (created_by = auth.uid());

-- Collection items policies
CREATE POLICY "Users can view collection items they have access to" ON public.course_collection_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.course_collections cc 
    WHERE cc.id = collection_id AND (
      cc.is_public = true OR 
      cc.created_by = auth.uid() OR 
      (cc.org_id IS NOT NULL AND user_is_org_member_safe(cc.org_id, auth.uid()))
    )
  )
);

CREATE POLICY "Users can add courses to accessible collections" ON public.course_collection_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.course_collections cc 
    WHERE cc.id = collection_id AND (
      cc.created_by = auth.uid() OR 
      (cc.org_id IS NOT NULL AND user_is_org_member_safe(cc.org_id, auth.uid()))
    )
  )
);

CREATE POLICY "Users can remove items from accessible collections" ON public.course_collection_items
FOR DELETE USING (
  added_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.course_collections cc 
    WHERE cc.id = collection_id AND cc.created_by = auth.uid()
  )
);

-- Course duplicates policies
CREATE POLICY "Users can view their own duplicates or org duplicates" ON public.course_duplicates
FOR SELECT USING (
  duplicated_by = auth.uid() OR 
  (org_id IS NOT NULL AND user_is_org_member_safe(org_id, auth.uid()))
);

CREATE POLICY "Users can create duplicates" ON public.course_duplicates
FOR INSERT WITH CHECK (duplicated_by = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_course_collections_created_by ON public.course_collections(created_by);
CREATE INDEX IF NOT EXISTS idx_course_collections_org_id ON public.course_collections(org_id);
CREATE INDEX IF NOT EXISTS idx_course_collection_items_collection_id ON public.course_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_course_collection_items_course_id ON public.course_collection_items(course_id);
CREATE INDEX IF NOT EXISTS idx_course_duplicates_original_course_id ON public.course_duplicates(original_course_id);
CREATE INDEX IF NOT EXISTS idx_course_duplicates_duplicated_by ON public.course_duplicates(duplicated_by);