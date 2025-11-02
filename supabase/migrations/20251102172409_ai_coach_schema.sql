-- AI COMMAND CENTER SCHEMA
-- Simplified version for integration with existing FPK platform

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- AI COACH CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS ai_coach_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_conversations_user_id ON ai_coach_conversations(user_id);

-- AI COACH MESSAGES TABLE
CREATE TABLE IF NOT EXISTS ai_coach_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_coach_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    persona TEXT CHECK (persona IN ('betty', 'al', 'nite_owl')),
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_messages_conversation_id ON ai_coach_messages(conversation_id);
CREATE INDEX idx_ai_coach_messages_created_at ON ai_coach_messages(created_at);

-- AI COACH STUDY MATERIALS TABLE
CREATE TABLE IF NOT EXISTS ai_coach_study_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_study_materials_user_id ON ai_coach_study_materials(user_id);

-- AI COACH KNOWLEDGE BASE TABLE (for RAG)
CREATE TABLE IF NOT EXISTS ai_coach_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_knowledge_base_embedding ON ai_coach_knowledge_base 
USING ivfflat (embedding vector_cosine_ops);

-- AI COACH ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS ai_coach_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_date DATE NOT NULL DEFAULT CURRENT_DATE,
    study_time_minutes INTEGER DEFAULT 0,
    messages_sent INTEGER DEFAULT 0,
    topics_explored TEXT[],
    comprehension_score INTEGER CHECK (comprehension_score >= 0 AND comprehension_score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_analytics_user_id ON ai_coach_analytics(user_id);
CREATE INDEX idx_ai_coach_analytics_session_date ON ai_coach_analytics(session_date);

-- AI COACH STUDY PLANS TABLE
CREATE TABLE IF NOT EXISTS ai_coach_study_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    estimated_hours INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_coach_study_plans_user_id ON ai_coach_study_plans(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE ai_coach_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_coach_study_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_coach_conversations
CREATE POLICY "Users can view their own conversations"
    ON ai_coach_conversations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own conversations"
    ON ai_coach_conversations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own conversations"
    ON ai_coach_conversations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own conversations"
    ON ai_coach_conversations FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for ai_coach_messages
CREATE POLICY "Users can view messages in their conversations"
    ON ai_coach_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM ai_coach_conversations
            WHERE ai_coach_conversations.id = ai_coach_messages.conversation_id
            AND ai_coach_conversations.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in their conversations"
    ON ai_coach_messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM ai_coach_conversations
            WHERE ai_coach_conversations.id = ai_coach_messages.conversation_id
            AND ai_coach_conversations.user_id = auth.uid()
        )
    );

-- RLS Policies for ai_coach_study_materials
CREATE POLICY "Users can view their own study materials"
    ON ai_coach_study_materials FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study materials"
    ON ai_coach_study_materials FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study materials"
    ON ai_coach_study_materials FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for ai_coach_analytics
CREATE POLICY "Users can view their own analytics"
    ON ai_coach_analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analytics"
    ON ai_coach_analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
    ON ai_coach_analytics FOR UPDATE
    USING (auth.uid() = user_id);

-- RLS Policies for ai_coach_study_plans
CREATE POLICY "Users can view their own study plans"
    ON ai_coach_study_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans"
    ON ai_coach_study_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans"
    ON ai_coach_study_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans"
    ON ai_coach_study_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Knowledge base is public read (for RAG), admin write
CREATE POLICY "Anyone can read knowledge base"
    ON ai_coach_knowledge_base FOR SELECT
    USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_ai_coach_conversations_updated_at BEFORE UPDATE ON ai_coach_conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_coach_analytics_updated_at BEFORE UPDATE ON ai_coach_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_coach_study_plans_updated_at BEFORE UPDATE ON ai_coach_study_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
