export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          created_at: string
          id: string
          unlocked_at: string
          user_id: string
          xp_reward: number
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id: string
          xp_reward?: number
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id?: string
          xp_reward?: number
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          created_at: string | null
          event: string
          id: string
          metadata: Json | null
          org_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event?: string
          id?: string
          metadata?: Json | null
          org_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      adaptive_learning_paths: {
        Row: {
          created_at: string
          effectiveness_score: number | null
          id: string
          is_active: boolean | null
          learning_profile: Json
          path_recommendations: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean | null
          learning_profile?: Json
          path_recommendations?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effectiveness_score?: number | null
          id?: string
          is_active?: boolean | null
          learning_profile?: Json
          path_recommendations?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_coach_analytics: {
        Row: {
          comprehension_score: number | null
          created_at: string
          id: string
          messages_sent: number | null
          session_date: string
          study_time_minutes: number | null
          topics_explored: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comprehension_score?: number | null
          created_at?: string
          id?: string
          messages_sent?: number | null
          session_date: string
          study_time_minutes?: number | null
          topics_explored?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comprehension_score?: number | null
          created_at?: string
          id?: string
          messages_sent?: number | null
          session_date?: string
          study_time_minutes?: number | null
          topics_explored?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_coach_conversations: {
        Row: {
          created_at: string
          folder_id: string | null
          id: string
          org_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_id?: string | null
          id?: string
          org_id?: string | null
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          folder_id?: string | null
          id?: string
          org_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_coach_conversations_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_coach_conversations_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_coach_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          persona: string | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          persona?: string | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          persona?: string | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_coach_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "ai_coach_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_coach_study_materials: {
        Row: {
          created_at: string
          file_size: number | null
          file_type: string | null
          file_url: string
          folder_id: string | null
          id: string
          org_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          folder_id?: string | null
          id?: string
          org_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          folder_id?: string | null
          id?: string
          org_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_coach_study_materials_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_coach_study_materials_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_coach_study_plans: {
        Row: {
          created_at: string
          description: string | null
          estimated_hours: number | null
          id: string
          progress: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          progress?: number | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_hours?: number | null
          id?: string
          progress?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_credit_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          created_at: string
          id: string
          metadata: Json | null
          session_id: string | null
          source: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          balance_before: number
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          source?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          source?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_generation_history: {
        Row: {
          ai_model_used: string | null
          category_id: string | null
          completed_at: string | null
          completion_tokens: number | null
          created_at: string | null
          error_message: string | null
          focus_keyword: string | null
          generation_mode: string
          id: string
          outline_json: Json | null
          post_id: string | null
          prompt_tokens: number | null
          sources_used: Json | null
          status: string | null
          topic: string
          total_duration_ms: number | null
          user_id: string
        }
        Insert: {
          ai_model_used?: string | null
          category_id?: string | null
          completed_at?: string | null
          completion_tokens?: number | null
          created_at?: string | null
          error_message?: string | null
          focus_keyword?: string | null
          generation_mode: string
          id?: string
          outline_json?: Json | null
          post_id?: string | null
          prompt_tokens?: number | null
          sources_used?: Json | null
          status?: string | null
          topic: string
          total_duration_ms?: number | null
          user_id: string
        }
        Update: {
          ai_model_used?: string | null
          category_id?: string | null
          completed_at?: string | null
          completion_tokens?: number | null
          created_at?: string | null
          error_message?: string | null
          focus_keyword?: string | null
          generation_mode?: string
          id?: string
          outline_json?: Json | null
          post_id?: string | null
          prompt_tokens?: number | null
          sources_used?: Json | null
          status?: string | null
          topic?: string
          total_duration_ms?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_generation_history_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_generation_history_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_inbox: {
        Row: {
          confidence: number
          created_at: string
          cta: Json
          dismissed: boolean | null
          id: string
          org_id: string | null
          severity: string
          subtitle: string | null
          title: string
          type: string
          updated_at: string
          user_id: string | null
          why: Json | null
        }
        Insert: {
          confidence?: number
          created_at?: string
          cta?: Json
          dismissed?: boolean | null
          id?: string
          org_id?: string | null
          severity?: string
          subtitle?: string | null
          title: string
          type: string
          updated_at?: string
          user_id?: string | null
          why?: Json | null
        }
        Update: {
          confidence?: number
          created_at?: string
          cta?: Json
          dismissed?: boolean | null
          id?: string
          org_id?: string | null
          severity?: string
          subtitle?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string | null
          why?: Json | null
        }
        Relationships: []
      }
      ai_knowledge_cache: {
        Row: {
          cleaned_text_content: string
          content_hash: string | null
          created_at: string | null
          etag: string | null
          id: string
          last_scraped_at: string | null
          metadata: Json | null
          source_url: string
        }
        Insert: {
          cleaned_text_content: string
          content_hash?: string | null
          created_at?: string | null
          etag?: string | null
          id?: string
          last_scraped_at?: string | null
          metadata?: Json | null
          source_url: string
        }
        Update: {
          cleaned_text_content?: string
          content_hash?: string | null
          created_at?: string | null
          etag?: string | null
          id?: string
          last_scraped_at?: string | null
          metadata?: Json | null
          source_url?: string
        }
        Relationships: []
      }
      ai_knowledge_sources: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          source_name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          source_name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          source_name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_knowledge_sources_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_outputs: {
        Row: {
          approved_at: string | null
          content: Json
          created_at: string
          id: string
          lesson_id: string
          output_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          content: Json
          created_at?: string
          id?: string
          lesson_id: string
          output_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          content?: Json
          created_at?: string
          id?: string
          lesson_id?: string
          output_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_persona_triggers: {
        Row: {
          category: string
          created_at: string
          id: string
          intent: string
          is_regex: boolean
          persona: string
          priority: number
          trigger_phrase: string
          updated_at: string
          weight: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          intent: string
          is_regex?: boolean
          persona: string
          priority?: number
          trigger_phrase: string
          updated_at?: string
          weight?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          intent?: string
          is_regex?: boolean
          persona?: string
          priority?: number
          trigger_phrase?: string
          updated_at?: string
          weight?: number
        }
        Relationships: []
      }
      ai_recommendations: {
        Row: {
          applied_at: string | null
          created_at: string
          effectiveness_rating: number | null
          expires_at: string | null
          id: string
          recommendation_data: Json
          recommendation_type: string
          trigger_context: Json
          user_id: string
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          effectiveness_rating?: number | null
          expires_at?: string | null
          id?: string
          recommendation_data?: Json
          recommendation_type: string
          trigger_context?: Json
          user_id: string
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          effectiveness_rating?: number | null
          expires_at?: string | null
          id?: string
          recommendation_data?: Json
          recommendation_type?: string
          trigger_context?: Json
          user_id?: string
        }
        Relationships: []
      }
      analytics_metrics: {
        Row: {
          cohort_id: string | null
          confidence: number | null
          created_at: string
          id: string
          insight_type: string | null
          metadata: Json | null
          metric_name: string
          timestamp: string
          user_id: string
          value: number
        }
        Insert: {
          cohort_id?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          insight_type?: string | null
          metadata?: Json | null
          metric_name: string
          timestamp?: string
          user_id: string
          value: number
        }
        Update: {
          cohort_id?: string | null
          confidence?: number | null
          created_at?: string
          id?: string
          insight_type?: string | null
          metadata?: Json | null
          metric_name?: string
          timestamp?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      anomaly_alerts: {
        Row: {
          created_at: string
          id: string
          message: string
          metric_name: string
          resolved: boolean
          resolved_at: string | null
          severity: string
          threshold: number
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metric_name: string
          resolved?: boolean
          resolved_at?: string | null
          severity: string
          threshold: number
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metric_name?: string
          resolved?: boolean
          resolved_at?: string | null
          severity?: string
          threshold?: number
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      attempt_answers: {
        Row: {
          attempt_id: string
          correct_bool: boolean | null
          created_at: string
          id: string
          item_id: string
          points_awarded: number | null
          response_json: Json | null
        }
        Insert: {
          attempt_id: string
          correct_bool?: boolean | null
          created_at?: string
          id?: string
          item_id: string
          points_awarded?: number | null
          response_json?: Json | null
        }
        Update: {
          attempt_id?: string
          correct_bool?: boolean | null
          created_at?: string
          id?: string
          item_id?: string
          points_awarded?: number | null
          response_json?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "attempt_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "learning_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attempt_answers_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "quiz_items"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown
          legal_basis: string | null
          new_values: Json | null
          old_values: Json | null
          purpose: string | null
          record_id: string | null
          table_name: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown
          legal_basis?: string | null
          new_values?: Json | null
          old_values?: Json | null
          purpose?: string | null
          record_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown
          legal_basis?: string | null
          new_values?: Json | null
          old_values?: Json | null
          purpose?: string | null
          record_id?: string | null
          table_name?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          actor_email: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown
          justification: string | null
          organization_id: string | null
          resource_id: string | null
          resource_type: string
          status: string | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          actor_email?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          justification?: string | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type: string
          status?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          actor_email?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown
          justification?: string | null
          organization_id?: string | null
          resource_id?: string | null
          resource_type?: string
          status?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          badge_id: string
          created_at: string
          criteria: Json
          description: string | null
          icon: string | null
          id: string
          name: string
          rarity: string
          xp_reward: number
        }
        Insert: {
          badge_id: string
          created_at?: string
          criteria?: Json
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          rarity?: string
          xp_reward?: number
        }
        Update: {
          badge_id?: string
          created_at?: string
          criteria?: Json
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          rarity?: string
          xp_reward?: number
        }
        Relationships: []
      }
      behavioral_analytics: {
        Row: {
          behavior_data: Json
          behavior_type: string
          context_metadata: Json | null
          id: string
          pattern_indicators: Json | null
          session_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          behavior_data?: Json
          behavior_type: string
          context_metadata?: Json | null
          id?: string
          pattern_indicators?: Json | null
          session_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          behavior_data?: Json
          behavior_type?: string
          context_metadata?: Json | null
          id?: string
          pattern_indicators?: Json | null
          session_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      beta_feedback: {
        Row: {
          category: string | null
          contact_email: string | null
          context_data: Json | null
          created_at: string | null
          feedback_type: string
          id: string
          message: string
          rating: number | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          contact_email?: string | null
          context_data?: Json | null
          created_at?: string | null
          feedback_type: string
          id?: string
          message: string
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          contact_email?: string | null
          context_data?: Json | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          message?: string
          rating?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_analytics: {
        Row: {
          avg_time_on_page: number | null
          bounce_rate: number | null
          created_at: string | null
          date: string
          id: string
          post_id: string
          referrer_sources: Json | null
          unique_visitors: number | null
          views: number | null
        }
        Insert: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          created_at?: string | null
          date?: string
          id?: string
          post_id: string
          referrer_sources?: Json | null
          unique_visitors?: number | null
          views?: number | null
        }
        Update: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          created_at?: string | null
          date?: string
          id?: string
          post_id?: string
          referrer_sources?: Json | null
          unique_visitors?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_authors: {
        Row: {
          author_slug: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          credentials: string | null
          display_name: string
          id: string
          is_active: boolean | null
          is_ai_author: boolean | null
          social_links: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author_slug?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credentials?: string | null
          display_name: string
          id?: string
          is_active?: boolean | null
          is_ai_author?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author_slug?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          credentials?: string | null
          display_name?: string
          id?: string
          is_active?: boolean | null
          is_ai_author?: boolean | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_internal_links: {
        Row: {
          created_at: string | null
          id: string
          link_text: string | null
          source_post_id: string
          target_post_id: string | null
          target_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          link_text?: string | null
          source_post_id: string
          target_post_id?: string | null
          target_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          link_text?: string | null
          source_post_id?: string
          target_post_id?: string | null
          target_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_internal_links_source_post_id_fkey"
            columns: ["source_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_internal_links_target_post_id_fkey"
            columns: ["target_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_media_assets: {
        Row: {
          alt_text: string | null
          asset_type: string | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          file_size: number | null
          id: string
          mime_type: string | null
          storage_path: string
          title: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          asset_type?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          asset_type?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      blog_media_usage: {
        Row: {
          created_at: string | null
          id: string
          media_id: string | null
          reference_id: string
          usage_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_id?: string | null
          reference_id: string
          usage_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_id?: string | null
          reference_id?: string
          usage_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_media_usage_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "blog_media_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_categories: {
        Row: {
          category_id: string
          id: string
          post_id: string
        }
        Insert: {
          category_id: string
          id?: string
          post_id: string
        }
        Update: {
          category_id?: string
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_tags: {
        Row: {
          id: string
          post_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          post_id: string
          tag_id: string
        }
        Update: {
          id?: string
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          excerpt: string | null
          featured_image_alt: string | null
          featured_image_url: string | null
          focus_keyword: string | null
          id: string
          likes_count: number | null
          meta_description: string | null
          meta_title: string
          published_at: string | null
          read_time_minutes: number | null
          readability_score: number | null
          scheduled_for: string | null
          seo_score: number | null
          slug: string
          status: string
          title: string
          updated_at: string | null
          updated_by: string | null
          views_count: number | null
          word_count: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          focus_keyword?: string | null
          id?: string
          likes_count?: number | null
          meta_description?: string | null
          meta_title: string
          published_at?: string | null
          read_time_minutes?: number | null
          readability_score?: number | null
          scheduled_for?: string | null
          seo_score?: number | null
          slug: string
          status?: string
          title: string
          updated_at?: string | null
          updated_by?: string | null
          views_count?: number | null
          word_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          excerpt?: string | null
          featured_image_alt?: string | null
          featured_image_url?: string | null
          focus_keyword?: string | null
          id?: string
          likes_count?: number | null
          meta_description?: string | null
          meta_title?: string
          published_at?: string | null
          read_time_minutes?: number | null
          readability_score?: number | null
          scheduled_for?: string | null
          seo_score?: number | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          views_count?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_subscribers: {
        Row: {
          email: string
          id: string
          metadata: Json | null
          status: string
          subscribed_at: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          metadata?: Json | null
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          metadata?: Json | null
          status?: string
          subscribed_at?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      blog_tags: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          usage_count: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          usage_count?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      book_quiz_questions: {
        Row: {
          book_id: string
          chapter_index: number
          correct_answer: string
          created_at: string | null
          difficulty_level: number | null
          id: string
          question_text: string
          wrong_answers: string[]
        }
        Insert: {
          book_id: string
          chapter_index: number
          correct_answer: string
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          question_text: string
          wrong_answers: string[]
        }
        Update: {
          book_id?: string
          chapter_index?: number
          correct_answer?: string
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          question_text?: string
          wrong_answers?: string[]
        }
        Relationships: []
      }
      book_quiz_sessions: {
        Row: {
          book_id: string
          completed_at: string | null
          correct_answers: number
          created_at: string | null
          id: string
          max_chapter_index: number
          questions_answered: number
          session_score: number
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          book_id: string
          completed_at?: string | null
          correct_answers: number
          created_at?: string | null
          id?: string
          max_chapter_index: number
          questions_answered: number
          session_score: number
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          book_id?: string
          completed_at?: string | null
          correct_answers?: number
          created_at?: string | null
          id?: string
          max_chapter_index?: number
          questions_answered?: number
          session_score?: number
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          id: string
          role: string
          session_id: string
          timestamp: string
        }
        Insert: {
          content: string
          id?: string
          role: string
          session_id: string
          timestamp?: string
        }
        Update: {
          content?: string
          id?: string
          role?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          context_tag: string
          created_at: string
          id: string
          title: string
          topics: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          context_tag?: string
          created_at?: string
          id?: string
          title?: string
          topics?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          context_tag?: string
          created_at?: string
          id?: string
          title?: string
          topics?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_sessions: {
        Row: {
          created_at: string
          id: string
          session_data: Json | null
          session_title: string | null
          source: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_data?: Json | null
          session_title?: string | null
          source?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_data?: Json | null
          session_title?: string | null
          source?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      compliance_assessments: {
        Row: {
          action_items: Json | null
          assessment_date: string
          assessment_name: string
          assessment_type: string
          assessor_name: string | null
          created_at: string
          created_by: string
          findings: Json | null
          framework: string
          id: string
          next_assessment_due: string | null
          overall_score: number | null
          recommendations: Json | null
          risk_level: string | null
          scope: string
          status: string
          updated_at: string
        }
        Insert: {
          action_items?: Json | null
          assessment_date?: string
          assessment_name: string
          assessment_type: string
          assessor_name?: string | null
          created_at?: string
          created_by: string
          findings?: Json | null
          framework: string
          id?: string
          next_assessment_due?: string | null
          overall_score?: number | null
          recommendations?: Json | null
          risk_level?: string | null
          scope: string
          status?: string
          updated_at?: string
        }
        Update: {
          action_items?: Json | null
          assessment_date?: string
          assessment_name?: string
          assessment_type?: string
          assessor_name?: string | null
          created_at?: string
          created_by?: string
          findings?: Json | null
          framework?: string
          id?: string
          next_assessment_due?: string | null
          overall_score?: number | null
          recommendations?: Json | null
          risk_level?: string | null
          scope?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      compliance_policies: {
        Row: {
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          content: string
          created_at: string
          created_by: string
          effective_date: string
          id: string
          mandatory_training: boolean
          policy_category: string
          policy_name: string
          review_date: string | null
          updated_at: string
          version: string
        }
        Insert: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          content: string
          created_at?: string
          created_by: string
          effective_date: string
          id?: string
          mandatory_training?: boolean
          policy_category: string
          policy_name: string
          review_date?: string | null
          updated_at?: string
          version?: string
        }
        Update: {
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          content?: string
          created_at?: string
          created_by?: string
          effective_date?: string
          id?: string
          mandatory_training?: boolean
          policy_category?: string
          policy_name?: string
          review_date?: string | null
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          category: string
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      conversation_memory: {
        Row: {
          created_at: string
          id: string
          memory_data: Json
          memory_type: string
          session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          memory_data?: Json
          memory_type: string
          session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          memory_data?: Json
          memory_type?: string
          session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_memory_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_codes: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          description: string | null
          discount_percent: number | null
          duration_months: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_percent?: number | null
          duration_months?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          description?: string | null
          discount_percent?: number | null
          duration_months?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
        }
        Relationships: []
      }
      coupon_redemptions: {
        Row: {
          coupon_id: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          redeemed_at: string
          user_id: string | null
        }
        Insert: {
          coupon_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          redeemed_at?: string
          user_id?: string | null
        }
        Update: {
          coupon_id?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          redeemed_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupon_redemptions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      course_assets: {
        Row: {
          asset_type: string
          course_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          module_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          asset_type: string
          course_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          module_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          asset_type?: string
          course_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          module_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_assets_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_assets_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_collection_items: {
        Row: {
          added_at: string
          added_by: string
          collection_id: string
          course_id: string
          id: string
        }
        Insert: {
          added_at?: string
          added_by: string
          collection_id: string
          course_id: string
          id?: string
        }
        Update: {
          added_at?: string
          added_by?: string
          collection_id?: string
          course_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "course_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      course_collections: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          org_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          org_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          org_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      course_drafts: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          framework: string
          id: string
          level: string | null
          org_id: string
          source: string
          source_package_id: string | null
          status: string
          structure: Json
          title: string
          updated_at: string
          updated_by: string | null
          validation: Json | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          framework?: string
          id?: string
          level?: string | null
          org_id: string
          source: string
          source_package_id?: string | null
          status?: string
          structure?: Json
          title: string
          updated_at?: string
          updated_by?: string | null
          validation?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          framework?: string
          id?: string
          level?: string | null
          org_id?: string
          source?: string
          source_package_id?: string | null
          status?: string
          structure?: Json
          title?: string
          updated_at?: string
          updated_by?: string | null
          validation?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "course_drafts_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_drafts_source_package_id_fkey"
            columns: ["source_package_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "course_drafts_source_package_id_fkey"
            columns: ["source_package_id"]
            isOneToOne: false
            referencedRelation: "scorm_package_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_drafts_source_package_id_fkey"
            columns: ["source_package_id"]
            isOneToOne: false
            referencedRelation: "scorm_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      course_duplicates: {
        Row: {
          attribution_info: Json | null
          created_at: string
          duplicated_by: string
          duplicated_course_id: string
          id: string
          org_id: string | null
          original_course_id: string
        }
        Insert: {
          attribution_info?: Json | null
          created_at?: string
          duplicated_by: string
          duplicated_course_id: string
          id?: string
          org_id?: string | null
          original_course_id: string
        }
        Update: {
          attribution_info?: Json | null
          created_at?: string
          duplicated_by?: string
          duplicated_course_id?: string
          id?: string
          org_id?: string | null
          original_course_id?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          created_at: string
          est_minutes: number | null
          id: string
          module_id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          est_minutes?: number | null
          id?: string
          module_id: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          est_minutes?: number | null
          id?: string
          module_id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_media: {
        Row: {
          captions_url: string | null
          created_at: string
          duration_seconds: number | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          media_type: string
          metadata: Json | null
          mime_type: string | null
          module_id: string | null
          thumbnail_url: string | null
          updated_at: string
        }
        Insert: {
          captions_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          media_type: string
          metadata?: Json | null
          mime_type?: string | null
          module_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Update: {
          captions_url?: string | null
          created_at?: string
          duration_seconds?: number | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          media_type?: string
          metadata?: Json | null
          mime_type?: string | null
          module_id?: string | null
          thumbnail_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_media_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string
          created_at: string
          id: string
          order_index: number
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          id?: string
          order_index: number
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          id?: string
          order_index?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "native_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          course_id: string | null
          id: string
          org_id: string | null
          percent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id?: string | null
          id?: string
          org_id?: string | null
          percent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string | null
          id?: string
          org_id?: string | null
          percent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "org_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_progress_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          asset_path: string | null
          background_image: string
          content_component: string | null
          content_manifest: Json | null
          content_version: string | null
          course_visibility: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          discoverable: boolean | null
          duration_minutes: number | null
          featured: boolean | null
          framework_type: string | null
          grade_level_id: number | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          org_id: string | null
          organization_id: string | null
          price: number | null
          published_at: string | null
          sequence_order: number | null
          slug: string | null
          source: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          asset_path?: string | null
          background_image?: string
          content_component?: string | null
          content_manifest?: Json | null
          content_version?: string | null
          course_visibility?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          discoverable?: boolean | null
          duration_minutes?: number | null
          featured?: boolean | null
          framework_type?: string | null
          grade_level_id?: number | null
          id: string
          instructor_name?: string | null
          is_free?: boolean | null
          org_id?: string | null
          organization_id?: string | null
          price?: number | null
          published_at?: string | null
          sequence_order?: number | null
          slug?: string | null
          source?: string | null
          status?: string | null
          subject?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          asset_path?: string | null
          background_image?: string
          content_component?: string | null
          content_manifest?: Json | null
          content_version?: string | null
          course_visibility?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          discoverable?: boolean | null
          duration_minutes?: number | null
          featured?: boolean | null
          framework_type?: string | null
          grade_level_id?: number | null
          id?: string
          instructor_name?: string | null
          is_free?: boolean | null
          org_id?: string | null
          organization_id?: string | null
          price?: number | null
          published_at?: string | null
          sequence_order?: number | null
          slug?: string | null
          source?: string | null
          status?: string | null
          subject?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_grade_level_id_fkey"
            columns: ["grade_level_id"]
            isOneToOne: false
            referencedRelation: "grade_levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      curriculum_files: {
        Row: {
          content_extraction_status: string | null
          content_inventory: Json | null
          created_at: string
          extracted_activities: Json | null
          extracted_assessments: Json | null
          extracted_stories: Json | null
          extracted_teacher_scripts: Json | null
          extracted_vocabulary: Json | null
          extracted_worksheets: Json | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          lesson_building_status: string | null
          lessons_built_at: string | null
          mime_type: string | null
          parsed_content: Json | null
          processing_status: string
          structured_at: string | null
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          content_extraction_status?: string | null
          content_inventory?: Json | null
          created_at?: string
          extracted_activities?: Json | null
          extracted_assessments?: Json | null
          extracted_stories?: Json | null
          extracted_teacher_scripts?: Json | null
          extracted_vocabulary?: Json | null
          extracted_worksheets?: Json | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          lesson_building_status?: string | null
          lessons_built_at?: string | null
          mime_type?: string | null
          parsed_content?: Json | null
          processing_status?: string
          structured_at?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          content_extraction_status?: string | null
          content_inventory?: Json | null
          created_at?: string
          extracted_activities?: Json | null
          extracted_assessments?: Json | null
          extracted_stories?: Json | null
          extracted_teacher_scripts?: Json | null
          extracted_vocabulary?: Json | null
          extracted_worksheets?: Json | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          lesson_building_status?: string | null
          lessons_built_at?: string | null
          mime_type?: string | null
          parsed_content?: Json | null
          processing_status?: string
          structured_at?: string | null
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      curriculum_lessons: {
        Row: {
          assessments: Json | null
          content: Json
          created_at: string
          created_by: string | null
          curriculum_source: string | null
          id: string
          lesson_number: number | null
          status: string
          student_view: Json | null
          teacher_resources: Json | null
          title: string
          updated_at: string
          worksheets: Json | null
        }
        Insert: {
          assessments?: Json | null
          content?: Json
          created_at?: string
          created_by?: string | null
          curriculum_source?: string | null
          id?: string
          lesson_number?: number | null
          status?: string
          student_view?: Json | null
          teacher_resources?: Json | null
          title: string
          updated_at?: string
          worksheets?: Json | null
        }
        Update: {
          assessments?: Json | null
          content?: Json
          created_at?: string
          created_by?: string | null
          curriculum_source?: string | null
          id?: string
          lesson_number?: number | null
          status?: string
          student_view?: Json | null
          teacher_resources?: Json | null
          title?: string
          updated_at?: string
          worksheets?: Json | null
        }
        Relationships: []
      }
      daily_activities: {
        Row: {
          activity_date: string
          activity_type: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          sessions_count: number | null
          user_id: string
        }
        Insert: {
          activity_date?: string
          activity_type: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          sessions_count?: number | null
          user_id: string
        }
        Update: {
          activity_date?: string
          activity_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          sessions_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      data_breach_incidents: {
        Row: {
          affected_data_types: string[] | null
          affected_records_count: number | null
          created_at: string
          created_by: string | null
          description: string
          detection_method: string | null
          id: string
          incident_type: string
          notification_sent: boolean
          notification_sent_at: string | null
          regulatory_notification_required: boolean
          regulatory_notification_sent: boolean
          regulatory_notification_sent_at: string | null
          remediation_actions: string | null
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          affected_data_types?: string[] | null
          affected_records_count?: number | null
          created_at?: string
          created_by?: string | null
          description: string
          detection_method?: string | null
          id?: string
          incident_type: string
          notification_sent?: boolean
          notification_sent_at?: string | null
          regulatory_notification_required?: boolean
          regulatory_notification_sent?: boolean
          regulatory_notification_sent_at?: string | null
          remediation_actions?: string | null
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          affected_data_types?: string[] | null
          affected_records_count?: number | null
          created_at?: string
          created_by?: string | null
          description?: string
          detection_method?: string | null
          id?: string
          incident_type?: string
          notification_sent?: boolean
          notification_sent_at?: string | null
          regulatory_notification_required?: boolean
          regulatory_notification_sent?: boolean
          regulatory_notification_sent_at?: string | null
          remediation_actions?: string | null
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_processing_activities: {
        Row: {
          activity_name: string
          controller_contact: string
          controller_name: string
          created_at: string
          data_categories: string[]
          data_subjects: string[]
          dpo_contact: string | null
          id: string
          international_transfers: string[] | null
          is_active: boolean
          legal_basis: string
          purpose: string
          recipients: string[] | null
          retention_period: string
          security_measures: string[] | null
          updated_at: string
        }
        Insert: {
          activity_name: string
          controller_contact: string
          controller_name: string
          created_at?: string
          data_categories: string[]
          data_subjects: string[]
          dpo_contact?: string | null
          id?: string
          international_transfers?: string[] | null
          is_active?: boolean
          legal_basis: string
          purpose: string
          recipients?: string[] | null
          retention_period: string
          security_measures?: string[] | null
          updated_at?: string
        }
        Update: {
          activity_name?: string
          controller_contact?: string
          controller_name?: string
          created_at?: string
          data_categories?: string[]
          data_subjects?: string[]
          dpo_contact?: string | null
          id?: string
          international_transfers?: string[] | null
          is_active?: boolean
          legal_basis?: string
          purpose?: string
          recipients?: string[] | null
          retention_period?: string
          security_measures?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      data_retention_policies: {
        Row: {
          created_at: string
          deletion_criteria: Json | null
          id: string
          is_active: boolean
          legal_basis: string
          retention_period_days: number
          table_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deletion_criteria?: Json | null
          id?: string
          is_active?: boolean
          legal_basis: string
          retention_period_days: number
          table_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deletion_criteria?: Json | null
          id?: string
          is_active?: boolean
          legal_basis?: string
          retention_period_days?: number
          table_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      data_subject_requests: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          legal_basis: string
          processed_by: string | null
          request_type: string
          requested_data_categories: string[] | null
          response_data: Json | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          legal_basis: string
          processed_by?: string | null
          request_type: string
          requested_data_categories?: string[] | null
          response_data?: Json | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          legal_basis?: string
          processed_by?: string | null
          request_type?: string
          requested_data_categories?: string[] | null
          response_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_delivery_logs: {
        Row: {
          created_at: string
          email_id: string
          event_data: Json | null
          event_type: string
          from_address: string | null
          id: string
          recipient: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email_id: string
          event_data?: Json | null
          event_type: string
          from_address?: string | null
          id?: string
          recipient: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email_id?: string
          event_data?: Json | null
          event_type?: string
          from_address?: string | null
          id?: string
          recipient?: string
          subject?: string | null
        }
        Relationships: []
      }
      email_tracking: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string
          email_address: string
          email_type: string
          id: string
          metadata: Json | null
          opened_at: string | null
          sent_at: string
          subject: string | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          email_address: string
          email_type: string
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          subject?: string | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          email_address?: string
          email_type?: string
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string
          subject?: string | null
        }
        Relationships: []
      }
      emergency_access_requests: {
        Row: {
          access_granted: boolean
          approval_status: string
          approved_at: string | null
          approved_by: string | null
          created_at: string
          emergency_type: string
          expires_at: string
          id: string
          justification: string
          requested_resource: string
          requestor_id: string
          updated_at: string
        }
        Insert: {
          access_granted?: boolean
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          emergency_type: string
          expires_at: string
          id?: string
          justification: string
          requested_resource: string
          requestor_id: string
          updated_at?: string
        }
        Update: {
          access_granted?: boolean
          approval_status?: string
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          emergency_type?: string
          expires_at?: string
          id?: string
          justification?: string
          requested_resource?: string
          requestor_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      emotion_journal_entries: {
        Row: {
          created_at: string
          emotions_practiced_json: Json
          entry_date: string
          generated_image_url: string | null
          id: string
          mood_rating: number | null
          reflection_text: string | null
          strategies_used_json: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emotions_practiced_json?: Json
          entry_date?: string
          generated_image_url?: string | null
          id?: string
          mood_rating?: number | null
          reflection_text?: string | null
          strategies_used_json?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          emotions_practiced_json?: Json
          entry_date?: string
          generated_image_url?: string | null
          id?: string
          mood_rating?: number | null
          reflection_text?: string | null
          strategies_used_json?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      emotion_sessions: {
        Row: {
          calm_meter_final: number
          completed_at: string | null
          correct_answers: number
          created_at: string
          id: string
          module_id: string
          results_json: Json
          session_type: string
          started_at: string
          strategies_used_json: Json
          total_scenes: number
          user_id: string
        }
        Insert: {
          calm_meter_final?: number
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          id?: string
          module_id: string
          results_json?: Json
          session_type?: string
          started_at?: string
          strategies_used_json?: Json
          total_scenes?: number
          user_id: string
        }
        Update: {
          calm_meter_final?: number
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          id?: string
          module_id?: string
          results_json?: Json
          session_type?: string
          started_at?: string
          strategies_used_json?: Json
          total_scenes?: number
          user_id?: string
        }
        Relationships: []
      }
      emotions: {
        Row: {
          ai_prompt: string | null
          color: string | null
          created_at: string
          cues_json: Json
          difficulty_level: number
          icon: string | null
          id: string
          image_url: string | null
          label: string
          module_id: string
        }
        Insert: {
          ai_prompt?: string | null
          color?: string | null
          created_at?: string
          cues_json?: Json
          difficulty_level?: number
          icon?: string | null
          id: string
          image_url?: string | null
          label: string
          module_id: string
        }
        Update: {
          ai_prompt?: string | null
          color?: string | null
          created_at?: string
          cues_json?: Json
          difficulty_level?: number
          icon?: string | null
          id?: string
          image_url?: string | null
          label?: string
          module_id?: string
        }
        Relationships: []
      }
      engagement_matrix: {
        Row: {
          cohort_id: string
          created_at: string
          examples: Json | null
          id: string
          quadrants: Json
          thresholds: Json
          updated_at: string
          window_days: number | null
        }
        Insert: {
          cohort_id: string
          created_at?: string
          examples?: Json | null
          id?: string
          quadrants?: Json
          thresholds?: Json
          updated_at?: string
          window_days?: number | null
        }
        Update: {
          cohort_id?: string
          created_at?: string
          examples?: Json | null
          id?: string
          quadrants?: Json
          thresholds?: Json
          updated_at?: string
          window_days?: number | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string | null
          id: string
          progress: Json | null
          user_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress?: Json | null
          user_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          created_at: string
          error_message: string | null
          file_name: string
          file_size: number
          file_type: string
          generated_flashcards_count: number | null
          id: string
          processing_status: string
          storage_path: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size: number
          file_type: string
          generated_flashcards_count?: number | null
          id?: string
          processing_status?: string
          storage_path: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          generated_flashcards_count?: number | null
          id?: string
          processing_status?: string
          storage_path?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      flashcards: {
        Row: {
          back_content: string
          created_at: string
          difficulty_level: number | null
          front_content: string
          id: string
          last_reviewed_at: string | null
          note_id: string | null
          times_correct: number | null
          times_reviewed: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          back_content: string
          created_at?: string
          difficulty_level?: number | null
          front_content: string
          id?: string
          last_reviewed_at?: string | null
          note_id?: string | null
          times_correct?: number | null
          times_reviewed?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          back_content?: string
          created_at?: string
          difficulty_level?: number | null
          front_content?: string
          id?: string
          last_reviewed_at?: string | null
          note_id?: string | null
          times_correct?: number | null
          times_reviewed?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          created_at: string
          folder_type: string
          id: string
          name: string
          org_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          folder_type: string
          id?: string
          name: string
          org_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          folder_type?: string
          id?: string
          name?: string
          org_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      form_analytics: {
        Row: {
          conversion_funnel: Json | null
          created_at: string
          form_type: string
          id: string
          ip_address: string | null
          page_url: string | null
          session_data: Json | null
          submitted_at: string
          user_agent: string | null
        }
        Insert: {
          conversion_funnel?: Json | null
          created_at?: string
          form_type: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          session_data?: Json | null
          submitted_at?: string
          user_agent?: string | null
        }
        Update: {
          conversion_funnel?: Json | null
          created_at?: string
          form_type?: string
          id?: string
          ip_address?: string | null
          page_url?: string | null
          session_data?: Json | null
          submitted_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          coins_earned: number
          correct_answers: number
          created_at: string
          duration_seconds: number
          id: string
          levels_completed: number
          max_streak: number
          questions_answered: number
          session_data: Json | null
          session_mode: string
          user_id: string
        }
        Insert: {
          coins_earned?: number
          correct_answers?: number
          created_at?: string
          duration_seconds?: number
          id?: string
          levels_completed?: number
          max_streak?: number
          questions_answered?: number
          session_data?: Json | null
          session_mode?: string
          user_id: string
        }
        Update: {
          coins_earned?: number
          correct_answers?: number
          created_at?: string
          duration_seconds?: number
          id?: string
          levels_completed?: number
          max_streak?: number
          questions_answered?: number
          session_data?: Json | null
          session_mode?: string
          user_id?: string
        }
        Relationships: []
      }
      gap_analysis: {
        Row: {
          blockers: Json | null
          cohort_id: string | null
          confidence: number
          course_id: string
          created_at: string
          gap_score: number
          id: string
          metrics: Json | null
          outcome_id: string
          title: string
          updated_at: string
          window_days: number | null
        }
        Insert: {
          blockers?: Json | null
          cohort_id?: string | null
          confidence: number
          course_id: string
          created_at?: string
          gap_score: number
          id?: string
          metrics?: Json | null
          outcome_id: string
          title: string
          updated_at?: string
          window_days?: number | null
        }
        Update: {
          blockers?: Json | null
          cohort_id?: string | null
          confidence?: number
          course_id?: string
          created_at?: string
          gap_score?: number
          id?: string
          metrics?: Json | null
          outcome_id?: string
          title?: string
          updated_at?: string
          window_days?: number | null
        }
        Relationships: []
      }
      goal_milestone_completions: {
        Row: {
          completed_at: string
          completion_time_seconds: number | null
          context_data: Json | null
          created_at: string
          goal_id: string
          id: string
          milestone_id: string
          milestone_title: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          completion_time_seconds?: number | null
          context_data?: Json | null
          created_at?: string
          goal_id: string
          id?: string
          milestone_id: string
          milestone_title: string
          user_id: string
        }
        Update: {
          completed_at?: string
          completion_time_seconds?: number | null
          context_data?: Json | null
          created_at?: string
          goal_id?: string
          id?: string
          milestone_id?: string
          milestone_title?: string
          user_id?: string
        }
        Relationships: []
      }
      goal_progress_history: {
        Row: {
          created_at: string | null
          goal_id: string
          id: string
          new_progress: number
          old_progress: number
          trigger_id: string | null
          trigger_type: string
        }
        Insert: {
          created_at?: string | null
          goal_id: string
          id?: string
          new_progress: number
          old_progress: number
          trigger_id?: string | null
          trigger_type: string
        }
        Update: {
          created_at?: string | null
          goal_id?: string
          id?: string
          new_progress?: number
          old_progress?: number
          trigger_id?: string | null
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_progress_history_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "org_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_reminders: {
        Row: {
          created_at: string
          goal_id: string | null
          id: string
          is_active: boolean
          message: string | null
          next_reminder_at: string | null
          reminder_days: number[] | null
          reminder_time: string | null
          reminder_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_id?: string | null
          id?: string
          is_active?: boolean
          message?: string | null
          next_reminder_at?: string | null
          reminder_days?: number[] | null
          reminder_time?: string | null
          reminder_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_id?: string | null
          id?: string
          is_active?: boolean
          message?: string | null
          next_reminder_at?: string | null
          reminder_days?: number[] | null
          reminder_time?: string | null
          reminder_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goal_reminders_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          milestones: Json | null
          organization_id: string | null
          priority: string
          progress: number
          status: string
          target_date: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestones?: Json | null
          organization_id?: string | null
          priority?: string
          progress?: number
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          milestones?: Json | null
          organization_id?: string | null
          priority?: string
          progress?: number
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      google_oauth_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string | null
          scope: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token?: string | null
          scope: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string | null
          scope?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      grade_levels: {
        Row: {
          created_at: string | null
          display_order: number
          id: number
          irish_name: string
          stage: string
          us_name: string
        }
        Insert: {
          created_at?: string | null
          display_order: number
          id: number
          irish_name: string
          stage: string
          us_name: string
        }
        Update: {
          created_at?: string | null
          display_order?: number
          id?: number
          irish_name?: string
          stage?: string
          us_name?: string
        }
        Relationships: []
      }
      guest_pitches: {
        Row: {
          bio: string
          company: string | null
          created_at: string
          email: string
          headshot_url: string | null
          id: string
          name: string
          previous_appearances: string | null
          status: string
          title: string
          topic: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bio: string
          company?: string | null
          created_at?: string
          email: string
          headshot_url?: string | null
          id?: string
          name: string
          previous_appearances?: string | null
          status?: string
          title: string
          topic: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bio?: string
          company?: string | null
          created_at?: string
          email?: string
          headshot_url?: string | null
          id?: string
          name?: string
          previous_appearances?: string | null
          status?: string
          title?: string
          topic?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      hipaa_access_roles: {
        Row: {
          access_level: string
          created_at: string
          description: string | null
          id: string
          permissions: Json
          role_name: string
          updated_at: string
        }
        Insert: {
          access_level: string
          created_at?: string
          description?: string | null
          id?: string
          permissions?: Json
          role_name: string
          updated_at?: string
        }
        Update: {
          access_level?: string
          created_at?: string
          description?: string | null
          id?: string
          permissions?: Json
          role_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      hipaa_audit_log: {
        Row: {
          access_purpose: string | null
          action_type: string
          audit_trail_hash: string | null
          id: string
          ip_address: unknown
          minimum_necessary_justified: boolean | null
          patient_id: string | null
          phi_accessed: boolean
          resource_id: string | null
          resource_type: string
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          access_purpose?: string | null
          action_type: string
          audit_trail_hash?: string | null
          id?: string
          ip_address?: unknown
          minimum_necessary_justified?: boolean | null
          patient_id?: string | null
          phi_accessed?: boolean
          resource_id?: string | null
          resource_type: string
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          access_purpose?: string | null
          action_type?: string
          audit_trail_hash?: string | null
          id?: string
          ip_address?: unknown
          minimum_necessary_justified?: boolean | null
          patient_id?: string | null
          phi_accessed?: boolean
          resource_id?: string | null
          resource_type?: string
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      iep_accommodations: {
        Row: {
          accommodation_type: string
          context: string
          created_at: string
          description: string
          id: string
          iep_plan_id: string
          is_modification: boolean | null
          notes: string | null
        }
        Insert: {
          accommodation_type: string
          context: string
          created_at?: string
          description: string
          id?: string
          iep_plan_id: string
          is_modification?: boolean | null
          notes?: string | null
        }
        Update: {
          accommodation_type?: string
          context?: string
          created_at?: string
          description?: string
          id?: string
          iep_plan_id?: string
          is_modification?: boolean | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iep_accommodations_iep_plan_id_fkey"
            columns: ["iep_plan_id"]
            isOneToOne: false
            referencedRelation: "iep_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_behavior_plans: {
        Row: {
          behavior_targets: string[] | null
          created_at: string
          crisis_plan: string | null
          fba_reference: string | null
          fba_status: string | null
          id: string
          iep_plan_id: string
          intervention_strategies: string[] | null
          updated_at: string
        }
        Insert: {
          behavior_targets?: string[] | null
          created_at?: string
          crisis_plan?: string | null
          fba_reference?: string | null
          fba_status?: string | null
          id?: string
          iep_plan_id: string
          intervention_strategies?: string[] | null
          updated_at?: string
        }
        Update: {
          behavior_targets?: string[] | null
          created_at?: string
          crisis_plan?: string | null
          fba_reference?: string | null
          fba_status?: string | null
          id?: string
          iep_plan_id?: string
          intervention_strategies?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_behavior_plans_iep_plan_id_fkey"
            columns: ["iep_plan_id"]
            isOneToOne: false
            referencedRelation: "iep_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_consents: {
        Row: {
          consent_type: string
          created_at: string
          date_given: string | null
          id: string
          jurisdiction_details: Json | null
          provider_name: string | null
          status: string
          student_id: string
        }
        Insert: {
          consent_type: string
          created_at?: string
          date_given?: string | null
          id?: string
          jurisdiction_details?: Json | null
          provider_name?: string | null
          status?: string
          student_id: string
        }
        Update: {
          consent_type?: string
          created_at?: string
          date_given?: string | null
          id?: string
          jurisdiction_details?: Json | null
          provider_name?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_consents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "iep_students"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_documents: {
        Row: {
          created_at: string | null
          document_name: string
          id: string
          medical_information: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          id?: string
          medical_information?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          id?: string
          medical_information?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      iep_forms: {
        Row: {
          created_at: string
          created_by: string
          form_name: string
          form_sections: Json
          id: string
          is_active: boolean
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          form_name: string
          form_sections?: Json
          id?: string
          is_active?: boolean
          org_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          form_name?: string
          form_sections?: Json
          id?: string
          is_active?: boolean
          org_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_forms_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_goals: {
        Row: {
          annual_goal: string
          baseline: string
          created_at: string
          curriculum_mapping: string[] | null
          domain: string
          goal_type: string
          id: string
          iep_plan_id: string
          measurement_method: string
          progress_schedule: string
          success_criterion: string
          updated_at: string
        }
        Insert: {
          annual_goal: string
          baseline: string
          created_at?: string
          curriculum_mapping?: string[] | null
          domain: string
          goal_type: string
          id?: string
          iep_plan_id: string
          measurement_method: string
          progress_schedule: string
          success_criterion: string
          updated_at?: string
        }
        Update: {
          annual_goal?: string
          baseline?: string
          created_at?: string
          curriculum_mapping?: string[] | null
          domain?: string
          goal_type?: string
          id?: string
          iep_plan_id?: string
          measurement_method?: string
          progress_schedule?: string
          success_criterion?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_goals_iep_plan_id_fkey"
            columns: ["iep_plan_id"]
            isOneToOne: false
            referencedRelation: "iep_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_guardians: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          relationship: string
          student_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          relationship: string
          student_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          relationship?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_guardians_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "iep_students"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_invites: {
        Row: {
          code: string
          created_at: string
          created_by: string
          current_uses: number
          expires_at: string
          id: string
          max_uses: number
          metadata: Json | null
          org_id: string
          status: string
        }
        Insert: {
          code: string
          created_at?: string
          created_by: string
          current_uses?: number
          expires_at?: string
          id?: string
          max_uses?: number
          metadata?: Json | null
          org_id: string
          status?: string
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string
          current_uses?: number
          expires_at?: string
          id?: string
          max_uses?: number
          metadata?: Json | null
          org_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_invites_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_objectives: {
        Row: {
          created_at: string
          description: string
          goal_id: string
          id: string
          is_alternate_assessment_required: boolean | null
          order_index: number
        }
        Insert: {
          created_at?: string
          description: string
          goal_id: string
          id?: string
          is_alternate_assessment_required?: boolean | null
          order_index: number
        }
        Update: {
          created_at?: string
          description?: string
          goal_id?: string
          id?: string
          is_alternate_assessment_required?: boolean | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "iep_objectives_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "iep_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_plans: {
        Row: {
          completion_percentage: number | null
          created_at: string
          created_by: string
          current_step: number | null
          cycle_end_date: string | null
          cycle_start_date: string | null
          id: string
          jurisdiction: string
          org_id: string
          referral_reason: string | null
          status: string
          student_id: string
          suspected_disability_categories: string[] | null
          updated_at: string
        }
        Insert: {
          completion_percentage?: number | null
          created_at?: string
          created_by: string
          current_step?: number | null
          cycle_end_date?: string | null
          cycle_start_date?: string | null
          id?: string
          jurisdiction?: string
          org_id: string
          referral_reason?: string | null
          status?: string
          student_id: string
          suspected_disability_categories?: string[] | null
          updated_at?: string
        }
        Update: {
          completion_percentage?: number | null
          created_at?: string
          created_by?: string
          current_step?: number | null
          cycle_end_date?: string | null
          cycle_start_date?: string | null
          id?: string
          jurisdiction?: string
          org_id?: string
          referral_reason?: string | null
          status?: string
          student_id?: string
          suspected_disability_categories?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_plans_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_present_levels: {
        Row: {
          assessment_data: Json | null
          baseline: string
          created_at: string
          domain: string
          environmental_factors: string | null
          id: string
          iep_plan_id: string
          motivation_interests: string | null
          strengths: string[] | null
          updated_at: string
        }
        Insert: {
          assessment_data?: Json | null
          baseline: string
          created_at?: string
          domain: string
          environmental_factors?: string | null
          id?: string
          iep_plan_id: string
          motivation_interests?: string | null
          strengths?: string[] | null
          updated_at?: string
        }
        Update: {
          assessment_data?: Json | null
          baseline?: string
          created_at?: string
          domain?: string
          environmental_factors?: string | null
          id?: string
          iep_plan_id?: string
          motivation_interests?: string | null
          strengths?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_present_levels_iep_plan_id_fkey"
            columns: ["iep_plan_id"]
            isOneToOne: false
            referencedRelation: "iep_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_progress_entries: {
        Row: {
          artifact_url: string | null
          comment: string | null
          created_at: string
          goal_id: string
          id: string
          measure_type: string
          measurement_date: string
          recorded_by: string
          value: number | null
        }
        Insert: {
          artifact_url?: string | null
          comment?: string | null
          created_at?: string
          goal_id: string
          id?: string
          measure_type: string
          measurement_date: string
          recorded_by: string
          value?: number | null
        }
        Update: {
          artifact_url?: string | null
          comment?: string | null
          created_at?: string
          goal_id?: string
          id?: string
          measure_type?: string
          measurement_date?: string
          recorded_by?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "iep_progress_entries_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "iep_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_services: {
        Row: {
          created_at: string
          end_date: string | null
          frequency: string | null
          id: string
          iep_plan_id: string
          minutes_per_week: number | null
          notes: string | null
          provider_role: string
          service_type: string
          setting_type: string | null
          start_date: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          frequency?: string | null
          id?: string
          iep_plan_id: string
          minutes_per_week?: number | null
          notes?: string | null
          provider_role: string
          service_type: string
          setting_type?: string | null
          start_date?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          frequency?: string | null
          id?: string
          iep_plan_id?: string
          minutes_per_week?: number | null
          notes?: string | null
          provider_role?: string
          service_type?: string
          setting_type?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iep_services_iep_plan_id_fkey"
            columns: ["iep_plan_id"]
            isOneToOne: false
            referencedRelation: "iep_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_students: {
        Row: {
          class_year: string | null
          created_at: string
          created_by: string
          current_school: string | null
          date_of_birth: string
          first_name: string
          id: string
          languages_at_home: string[] | null
          last_name: string
          org_id: string
          student_id: string
          updated_at: string
        }
        Insert: {
          class_year?: string | null
          created_at?: string
          created_by: string
          current_school?: string | null
          date_of_birth: string
          first_name: string
          id?: string
          languages_at_home?: string[] | null
          last_name: string
          org_id: string
          student_id: string
          updated_at?: string
        }
        Update: {
          class_year?: string | null
          created_at?: string
          created_by?: string
          current_school?: string | null
          date_of_birth?: string
          first_name?: string
          id?: string
          languages_at_home?: string[] | null
          last_name?: string
          org_id?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_students_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      iep_transition_plans: {
        Row: {
          activities_this_year: Json | null
          agency_linkages: Json | null
          created_at: string
          id: string
          iep_plan_id: string
          postsecondary_goals: string[] | null
          student_age: number
          student_interests: string | null
          updated_at: string
        }
        Insert: {
          activities_this_year?: Json | null
          agency_linkages?: Json | null
          created_at?: string
          id?: string
          iep_plan_id: string
          postsecondary_goals?: string[] | null
          student_age: number
          student_interests?: string | null
          updated_at?: string
        }
        Update: {
          activities_this_year?: Json | null
          agency_linkages?: Json | null
          created_at?: string
          id?: string
          iep_plan_id?: string
          postsecondary_goals?: string[] | null
          student_age?: number
          student_interests?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iep_transition_plans_iep_plan_id_fkey"
            columns: ["iep_plan_id"]
            isOneToOne: false
            referencedRelation: "iep_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      imagination_sessions: {
        Row: {
          assembled_prompt: string | null
          created_at: string
          description_boost: string | null
          generated_description: string | null
          generated_image_url: string | null
          id: string
          model: string | null
          session_data: Json
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assembled_prompt?: string | null
          created_at?: string
          description_boost?: string | null
          generated_description?: string | null
          generated_image_url?: string | null
          id?: string
          model?: string | null
          session_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assembled_prompt?: string | null
          created_at?: string
          description_boost?: string | null
          generated_description?: string | null
          generated_image_url?: string | null
          id?: string
          model?: string | null
          session_data?: Json
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      incident_response_actions: {
        Row: {
          action_description: string
          action_type: string
          created_at: string
          evidence: Json | null
          id: string
          incident_id: string
          performed_at: string
          performed_by: string | null
          status: string
        }
        Insert: {
          action_description: string
          action_type: string
          created_at?: string
          evidence?: Json | null
          id?: string
          incident_id: string
          performed_at?: string
          performed_by?: string | null
          status?: string
        }
        Update: {
          action_description?: string
          action_type?: string
          created_at?: string
          evidence?: Json | null
          id?: string
          incident_id?: string
          performed_at?: string
          performed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_response_actions_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "security_incidents"
            referencedColumns: ["id"]
          },
        ]
      }
      interactive_content_metrics: {
        Row: {
          course_id: string
          created_at: string
          date_calculated: string
          id: string
          lesson_id: number
          metric_type: string
          metric_value: number
          sample_size: number | null
        }
        Insert: {
          course_id: string
          created_at?: string
          date_calculated?: string
          id?: string
          lesson_id: number
          metric_type: string
          metric_value: number
          sample_size?: number | null
        }
        Update: {
          course_id?: string
          created_at?: string
          date_calculated?: string
          id?: string
          lesson_id?: number
          metric_type?: string
          metric_value?: number
          sample_size?: number | null
        }
        Relationships: []
      }
      interactive_course_enrollments: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          course_id: string
          course_title: string
          created_at: string
          enrolled_at: string
          id: string
          last_accessed_at: string | null
          org_id: string | null
          total_time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          course_id: string
          course_title: string
          created_at?: string
          enrolled_at?: string
          id?: string
          last_accessed_at?: string | null
          org_id?: string | null
          total_time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          course_id?: string
          course_title?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          last_accessed_at?: string | null
          org_id?: string | null
          total_time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactive_course_enrollments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interactive_course_sessions: {
        Row: {
          course_id: string
          created_at: string
          duration_seconds: number | null
          id: string
          interactions: Json | null
          lesson_id: number | null
          org_id: string | null
          page_views: number | null
          session_end: string | null
          session_start: string
          session_type: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          interactions?: Json | null
          lesson_id?: number | null
          org_id?: string | null
          page_views?: number | null
          session_end?: string | null
          session_start?: string
          session_type?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          interactions?: Json | null
          lesson_id?: number | null
          org_id?: string | null
          page_views?: number | null
          session_end?: string | null
          session_start?: string
          session_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactive_course_sessions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      interactive_learning_paths: {
        Row: {
          course_id: string
          created_at: string
          difficulty_adjustments: Json | null
          id: string
          learning_velocity: number | null
          lesson_sequence: Json
          optimal_path: Json | null
          preferred_session_length_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string
          difficulty_adjustments?: Json | null
          id?: string
          learning_velocity?: number | null
          lesson_sequence: Json
          optimal_path?: Json | null
          preferred_session_length_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string
          difficulty_adjustments?: Json | null
          id?: string
          learning_velocity?: number | null
          lesson_sequence?: Json
          optimal_path?: Json | null
          preferred_session_length_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interactive_learning_preferences: {
        Row: {
          created_at: string
          difficulty_preferences: Json | null
          engagement_patterns: Json | null
          id: string
          learning_style_indicators: Json | null
          optimal_study_times: Json | null
          preferred_learning_speed: string | null
          preferred_session_duration_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty_preferences?: Json | null
          engagement_patterns?: Json | null
          id?: string
          learning_style_indicators?: Json | null
          optimal_study_times?: Json | null
          preferred_learning_speed?: string | null
          preferred_session_duration_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty_preferences?: Json | null
          engagement_patterns?: Json | null
          id?: string
          learning_style_indicators?: Json | null
          optimal_study_times?: Json | null
          preferred_learning_speed?: string | null
          preferred_session_duration_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interactive_lesson_analytics: {
        Row: {
          completed_at: string | null
          completion_method: string | null
          course_id: string
          created_at: string
          engagement_score: number | null
          id: string
          interactions_count: number | null
          lesson_id: number
          lesson_title: string
          org_id: string | null
          scroll_depth_percentage: number | null
          started_at: string
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_method?: string | null
          course_id: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          interactions_count?: number | null
          lesson_id: number
          lesson_title: string
          org_id?: string | null
          scroll_depth_percentage?: number | null
          started_at?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_method?: string | null
          course_id?: string
          created_at?: string
          engagement_score?: number | null
          id?: string
          interactions_count?: number | null
          lesson_id?: number
          lesson_title?: string
          org_id?: string | null
          scroll_depth_percentage?: number | null
          started_at?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactive_lesson_analytics_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_documents: {
        Row: {
          content: string
          content_hash: string | null
          created_at: string | null
          created_by: string | null
          document_type: string
          focus_areas: string[] | null
          id: string
          metadata: Json | null
          publication_date: string | null
          source_name: string
          source_type: string
          source_url: string | null
          title: string
        }
        Insert: {
          content: string
          content_hash?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type: string
          focus_areas?: string[] | null
          id?: string
          metadata?: Json | null
          publication_date?: string | null
          source_name: string
          source_type: string
          source_url?: string | null
          title: string
        }
        Update: {
          content?: string
          content_hash?: string | null
          created_at?: string | null
          created_by?: string | null
          document_type?: string
          focus_areas?: string[] | null
          id?: string
          metadata?: Json | null
          publication_date?: string | null
          source_name?: string
          source_type?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      kb_embedding_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          current_document_title: string | null
          error_message: string | null
          failed_embeddings: number
          id: string
          processed_documents: number
          started_at: string | null
          status: string
          successful_embeddings: number
          total_documents: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_document_title?: string | null
          error_message?: string | null
          failed_embeddings?: number
          id?: string
          processed_documents?: number
          started_at?: string | null
          status?: string
          successful_embeddings?: number
          total_documents?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_document_title?: string | null
          error_message?: string | null
          failed_embeddings?: number
          id?: string
          processed_documents?: number
          started_at?: string | null
          status?: string
          successful_embeddings?: number
          total_documents?: number
        }
        Relationships: []
      }
      kb_embeddings: {
        Row: {
          chunk_index: number
          chunk_text: string
          created_at: string | null
          document_id: string
          embedding: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          chunk_index: number
          chunk_text: string
          created_at?: string | null
          document_id: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number
          chunk_text?: string
          created_at?: string | null
          document_id?: string
          embedding?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_embeddings_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "kb_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_scraping_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          documents_added: number | null
          documents_found: number | null
          error_message: string | null
          id: string
          job_type: string
          search_queries: string[] | null
          source_name: string
          started_at: string | null
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          documents_added?: number | null
          documents_found?: number | null
          error_message?: string | null
          id?: string
          job_type: string
          search_queries?: string[] | null
          source_name: string
          started_at?: string | null
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          documents_added?: number | null
          documents_found?: number | null
          error_message?: string | null
          id?: string
          job_type?: string
          search_queries?: string[] | null
          source_name?: string
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      knowledge_base_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: number
          id: string
          mime_type: string
          processed: boolean
          processed_at: string | null
          storage_path: string
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size: number
          id?: string
          mime_type: string
          processed?: boolean
          processed_at?: string | null
          storage_path: string
          updated_at?: string
          uploaded_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: number
          id?: string
          mime_type?: string
          processed?: boolean
          processed_at?: string | null
          storage_path?: string
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_base_usage: {
        Row: {
          created_at: string | null
          id: string
          query: string
          result_count: number | null
          source_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          query: string
          result_count?: number | null
          source_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          query?: string
          result_count?: number | null
          source_type?: string
          user_id?: string
        }
        Relationships: []
      }
      knowledge_cache: {
        Row: {
          content: string
          created_at: string
          expires_at: string
          id: string
          metadata: Json | null
          query_hash: string
          source_type: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at: string
          id?: string
          metadata?: Json | null
          query_hash: string
          source_type: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string
          id?: string
          metadata?: Json | null
          query_hash?: string
          source_type?: string
        }
        Relationships: []
      }
      knowledge_embeddings: {
        Row: {
          content: string
          created_at: string
          embedding: string
          id: string
          metadata: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          embedding: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          embedding?: string
          id?: string
          metadata?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      learning_analytics: {
        Row: {
          cognitive_load_estimate: number | null
          created_at: string
          difficulty_level: number | null
          engagement_score: number | null
          id: string
          interaction_type: string
          metadata: Json
          session_id: string | null
          success_rate: number | null
          time_spent_seconds: number | null
          topic: string
          user_id: string
        }
        Insert: {
          cognitive_load_estimate?: number | null
          created_at?: string
          difficulty_level?: number | null
          engagement_score?: number | null
          id?: string
          interaction_type: string
          metadata?: Json
          session_id?: string | null
          success_rate?: number | null
          time_spent_seconds?: number | null
          topic: string
          user_id: string
        }
        Update: {
          cognitive_load_estimate?: number | null
          created_at?: string
          difficulty_level?: number | null
          engagement_score?: number | null
          id?: string
          interaction_type?: string
          metadata?: Json
          session_id?: string | null
          success_rate?: number | null
          time_spent_seconds?: number | null
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_attempts: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
          max_score: number | null
          policy: string
          score: number | null
          started_at: string
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
          max_score?: number | null
          policy?: string
          score?: number | null
          started_at?: string
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
          max_score?: number | null
          policy?: string
          score?: number | null
          started_at?: string
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_blocks: {
        Row: {
          created_at: string
          data_json: Json
          id: string
          lesson_id: string
          order_index: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_json?: Json
          id?: string
          lesson_id: string
          order_index: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_json?: Json
          id?: string
          lesson_id?: string
          order_index?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_blocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          status: string
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          status?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_progress_detailed: {
        Row: {
          attention_metrics: Json | null
          completion_quality: Json | null
          course_id: string
          created_at: string
          difficulty_perception: number | null
          id: string
          interaction_count: number | null
          last_interaction_at: string | null
          learning_velocity: number | null
          lesson_id: string
          progress_percentage: number | null
          slide_id: string | null
          time_spent_seconds: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attention_metrics?: Json | null
          completion_quality?: Json | null
          course_id: string
          created_at?: string
          difficulty_perception?: number | null
          id?: string
          interaction_count?: number | null
          last_interaction_at?: string | null
          learning_velocity?: number | null
          lesson_id: string
          progress_percentage?: number | null
          slide_id?: string | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attention_metrics?: Json | null
          completion_quality?: Json | null
          course_id?: string
          created_at?: string
          difficulty_perception?: number | null
          id?: string
          interaction_count?: number | null
          last_interaction_at?: string | null
          learning_velocity?: number | null
          lesson_id?: string
          progress_percentage?: number | null
          slide_id?: string | null
          time_spent_seconds?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_scos: {
        Row: {
          created_at: string
          id: string
          launch_path: string
          lesson_id: string
          mastery_score: number | null
          metadata: Json | null
          sco_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          launch_path: string
          lesson_id: string
          mastery_score?: number | null
          metadata?: Json | null
          sco_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          launch_path?: string
          lesson_id?: string
          mastery_score?: number | null
          metadata?: Json | null
          sco_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_scos_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          audio_url: string | null
          content_type: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          lesson_number: number
          scorm_completion_criteria: Json | null
          scorm_manifest: Json | null
          scorm_package_url: string | null
          sort_order: number | null
          title: string
          transcript: string | null
          transcript_url: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          content_type?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number: number
          scorm_completion_criteria?: Json | null
          scorm_manifest?: Json | null
          scorm_package_url?: string | null
          sort_order?: number | null
          title: string
          transcript?: string | null
          transcript_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          content_type?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          lesson_number?: number
          scorm_completion_criteria?: Json | null
          scorm_manifest?: Json | null
          scorm_package_url?: string | null
          sort_order?: number | null
          title?: string
          transcript?: string | null
          transcript_url?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      mailbag_questions: {
        Row: {
          created_at: string
          email: string
          featured: boolean
          id: string
          name: string
          question: string
          status: string
          topic_category: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          featured?: boolean
          id?: string
          name: string
          question: string
          status?: string
          topic_category?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          featured?: boolean
          id?: string
          name?: string
          question?: string
          status?: string
          topic_category?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      misconception_clusters: {
        Row: {
          cohort_id: string
          confidence: number
          created_at: string
          id: string
          label: string
          linked_outcomes: Json | null
          representative_answers: Json | null
          suggested_actions: Json | null
          support_count: number
          updated_at: string
          window_days: number | null
        }
        Insert: {
          cohort_id: string
          confidence: number
          created_at?: string
          id?: string
          label: string
          linked_outcomes?: Json | null
          representative_answers?: Json | null
          suggested_actions?: Json | null
          support_count?: number
          updated_at?: string
          window_days?: number | null
        }
        Update: {
          cohort_id?: string
          confidence?: number
          created_at?: string
          id?: string
          label?: string
          linked_outcomes?: Json | null
          representative_answers?: Json | null
          suggested_actions?: Json | null
          support_count?: number
          updated_at?: string
          window_days?: number | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          content_type: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          is_published: boolean | null
          metadata: Json | null
          module_number: number
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content_type?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          module_number: number
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content_type?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          module_number?: number
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      native_courses: {
        Row: {
          course_visibility: string | null
          cover_url: string | null
          created_at: string
          created_by: string | null
          discoverable: boolean | null
          est_minutes: number | null
          id: string
          org_id: string | null
          organization_id: string | null
          slug: string
          source: string | null
          status: string | null
          summary: string | null
          title: string
          updated_at: string
          visibility: string
        }
        Insert: {
          course_visibility?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          discoverable?: boolean | null
          est_minutes?: number | null
          id?: string
          org_id?: string | null
          organization_id?: string | null
          slug: string
          source?: string | null
          status?: string | null
          summary?: string | null
          title: string
          updated_at?: string
          visibility?: string
        }
        Update: {
          course_visibility?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string | null
          discoverable?: boolean | null
          est_minutes?: number | null
          id?: string
          org_id?: string | null
          organization_id?: string | null
          slug?: string
          source?: string | null
          status?: string | null
          summary?: string | null
          title?: string
          updated_at?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "native_courses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      native_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string
          id: string
          last_lesson_id: string | null
          last_visit_at: string
          progress_pct: number
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string
          id?: string
          last_lesson_id?: string | null
          last_visit_at?: string
          progress_pct?: number
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string
          id?: string
          last_lesson_id?: string | null
          last_visit_at?: string
          progress_pct?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "native_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "native_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "native_enrollments_last_lesson_id_fkey"
            columns: ["last_lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          email_verified: boolean
          engagement_score: number
          id: string
          interests: string[] | null
          metadata: Json | null
          name: string | null
          source: string | null
          subscribed_at: string
          unsubscribed_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          email_verified?: boolean
          engagement_score?: number
          id?: string
          interests?: string[] | null
          metadata?: Json | null
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          email_verified?: boolean
          engagement_score?: number
          id?: string
          interests?: string[] | null
          metadata?: Json | null
          name?: string | null
          source?: string | null
          subscribed_at?: string
          unsubscribed_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_private: boolean | null
          organization_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          visibility_scope:
            | Database["public"]["Enums"]["note_visibility_scope"]
            | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          organization_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          visibility_scope?:
            | Database["public"]["Enums"]["note_visibility_scope"]
            | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_private?: boolean | null
          organization_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          visibility_scope?:
            | Database["public"]["Enums"]["note_visibility_scope"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read_status: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read_status?: boolean
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read_status?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      org_assignment_targets: {
        Row: {
          assigned_at: string | null
          assignment_id: string
          completed_at: string | null
          due_at: string | null
          started_at: string | null
          status: string | null
          target_id: string
          target_type: string
          updated_at: string | null
        }
        Insert: {
          assigned_at?: string | null
          assignment_id: string
          completed_at?: string | null
          due_at?: string | null
          started_at?: string | null
          status?: string | null
          target_id: string
          target_type: string
          updated_at?: string | null
        }
        Update: {
          assigned_at?: string | null
          assignment_id?: string
          completed_at?: string | null
          due_at?: string | null
          started_at?: string | null
          status?: string | null
          target_id?: string
          target_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_assignment_targets_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "org_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      org_assignments: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          org_id: string
          resource_id: string
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          org_id: string
          resource_id: string
          title?: string | null
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          org_id?: string
          resource_id?: string
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_assignments_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_branding: {
        Row: {
          accent_hex: string | null
          banner_url: string | null
          created_at: string
          favicon_url: string | null
          id: string
          is_active: boolean | null
          logo_dark_url: string | null
          logo_light_url: string | null
          org_id: string
          radius_scale: string | null
          updated_at: string
          version: number | null
          watermark_opacity: number | null
        }
        Insert: {
          accent_hex?: string | null
          banner_url?: string | null
          created_at?: string
          favicon_url?: string | null
          id?: string
          is_active?: boolean | null
          logo_dark_url?: string | null
          logo_light_url?: string | null
          org_id: string
          radius_scale?: string | null
          updated_at?: string
          version?: number | null
          watermark_opacity?: number | null
        }
        Update: {
          accent_hex?: string | null
          banner_url?: string | null
          created_at?: string
          favicon_url?: string | null
          id?: string
          is_active?: boolean | null
          logo_dark_url?: string | null
          logo_light_url?: string | null
          org_id?: string
          radius_scale?: string | null
          updated_at?: string
          version?: number | null
          watermark_opacity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_org_branding_org_id"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_course_assignments: {
        Row: {
          assigned_by: string
          course_id: string
          created_at: string
          due_date: string | null
          id: string
          instructions: string | null
          organization_id: string
          student_ids: string[]
          updated_at: string
        }
        Insert: {
          assigned_by: string
          course_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          instructions?: string | null
          organization_id: string
          student_ids?: string[]
          updated_at?: string
        }
        Update: {
          assigned_by?: string
          course_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          instructions?: string | null
          organization_id?: string
          student_ids?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_course_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_course_assignments_new: {
        Row: {
          assignee_id: string
          assignee_type: string
          course_id: string
          course_table: string
          created_at: string | null
          created_by: string
          due_at: string | null
          id: string
          instructions: string | null
          org_id: string
          required: boolean | null
          updated_at: string | null
        }
        Insert: {
          assignee_id: string
          assignee_type: string
          course_id: string
          course_table: string
          created_at?: string | null
          created_by: string
          due_at?: string | null
          id?: string
          instructions?: string | null
          org_id: string
          required?: boolean | null
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string
          assignee_type?: string
          course_id?: string
          course_table?: string
          created_at?: string | null
          created_by?: string
          due_at?: string | null
          id?: string
          instructions?: string | null
          org_id?: string
          required?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      org_course_imports: {
        Row: {
          created_at: string | null
          created_by: string
          file_name: string
          file_url: string
          id: string
          log: Json | null
          org_id: string
          output_org_course_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          file_name: string
          file_url: string
          id?: string
          log?: Json | null
          org_id: string
          output_org_course_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          file_name?: string
          file_url?: string
          id?: string
          log?: Json | null
          org_id?: string
          output_org_course_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      org_course_versions: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          org_course_id: string
          snapshot_json: Json
          version: number
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          org_course_id: string
          snapshot_json: Json
          version: number
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          org_course_id?: string
          snapshot_json?: Json
          version?: number
        }
        Relationships: []
      }
      org_courses: {
        Row: {
          background_image_url: string | null
          created_at: string | null
          created_by: string
          deleted_at: string | null
          description: string | null
          discoverable: boolean | null
          duration_estimate_mins: number | null
          framework: string | null
          id: string
          import_id: string | null
          lesson_structure: Json | null
          level: string | null
          micro_lesson_data: Json | null
          objectives: Json | null
          org_id: string
          prerequisites: Json | null
          processing_status: string | null
          published: boolean | null
          source: string | null
          status: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string | null
          created_by: string
          deleted_at?: string | null
          description?: string | null
          discoverable?: boolean | null
          duration_estimate_mins?: number | null
          framework?: string | null
          id?: string
          import_id?: string | null
          lesson_structure?: Json | null
          level?: string | null
          micro_lesson_data?: Json | null
          objectives?: Json | null
          org_id: string
          prerequisites?: Json | null
          processing_status?: string | null
          published?: boolean | null
          source?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          description?: string | null
          discoverable?: boolean | null
          duration_estimate_mins?: number | null
          framework?: string | null
          id?: string
          import_id?: string | null
          lesson_structure?: Json | null
          level?: string | null
          micro_lesson_data?: Json | null
          objectives?: Json | null
          org_id?: string
          prerequisites?: Json | null
          processing_status?: string | null
          published?: boolean | null
          source?: string | null
          status?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_courses_import_id_fkey"
            columns: ["import_id"]
            isOneToOne: false
            referencedRelation: "scorm_imports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_courses_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_educators: {
        Row: {
          activation_expires_at: string | null
          activation_status: string
          activation_token: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          invited_at: string | null
          invited_by: string | null
          linked_user_id: string | null
          org_id: string
          pin_hash: string | null
          role: Database["public"]["Enums"]["member_role"]
          status: Database["public"]["Enums"]["member_status"]
          updated_at: string
        }
        Insert: {
          activation_expires_at?: string | null
          activation_status?: string
          activation_token?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          linked_user_id?: string | null
          org_id: string
          pin_hash?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
        }
        Update: {
          activation_expires_at?: string | null
          activation_status?: string
          activation_token?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          linked_user_id?: string | null
          org_id?: string
          pin_hash?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_educators_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_goal_targets: {
        Row: {
          created_at: string | null
          goal_id: string
          progress: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          goal_id: string
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          goal_id?: string
          progress?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_goal_targets_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "org_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      org_goals: {
        Row: {
          category: string | null
          created_at: string
          created_by: string
          description: string | null
          folder_path: string | null
          id: string
          metadata: Json | null
          organization_id: string
          priority: string | null
          progress_percentage: number | null
          status: string | null
          student_id: string
          target_date: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          folder_path?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          priority?: string | null
          progress_percentage?: number | null
          status?: string | null
          student_id: string
          target_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          folder_path?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          priority?: string | null
          progress_percentage?: number | null
          status?: string | null
          student_id?: string
          target_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_goals_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "org_students"
            referencedColumns: ["id"]
          },
        ]
      }
      org_group_course_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string
          course_id: string
          group_id: string
          id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          course_id: string
          group_id: string
          id?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          course_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_group_course_assignments_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "org_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      org_group_members: {
        Row: {
          added_at: string | null
          added_by: string | null
          group_id: string
          id: string | null
          user_id: string
        }
        Insert: {
          added_at?: string | null
          added_by?: string | null
          group_id: string
          id?: string | null
          user_id: string
        }
        Update: {
          added_at?: string | null
          added_by?: string | null
          group_id?: string
          id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "org_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      org_groups: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          org_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          org_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_groups_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_members: {
        Row: {
          access_revoked_at: string | null
          access_revoked_reason: string | null
          created_at: string
          has_seen_ai_assistant_tour: boolean | null
          has_seen_courses_tour: boolean | null
          has_seen_dashboard_tour: boolean | null
          has_seen_goals_notes_tour: boolean | null
          has_seen_groups_tour: boolean | null
          has_seen_iep_tour: boolean | null
          has_seen_settings_tour: boolean | null
          has_seen_students_tour: boolean | null
          id: string
          invitation_link: string | null
          joined_at: string | null
          org_id: string
          pin_hash: string | null
          role: Database["public"]["Enums"]["member_role"]
          status: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Insert: {
          access_revoked_at?: string | null
          access_revoked_reason?: string | null
          created_at?: string
          has_seen_ai_assistant_tour?: boolean | null
          has_seen_courses_tour?: boolean | null
          has_seen_dashboard_tour?: boolean | null
          has_seen_goals_notes_tour?: boolean | null
          has_seen_groups_tour?: boolean | null
          has_seen_iep_tour?: boolean | null
          has_seen_settings_tour?: boolean | null
          has_seen_students_tour?: boolean | null
          id?: string
          invitation_link?: string | null
          joined_at?: string | null
          org_id: string
          pin_hash?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id: string
        }
        Update: {
          access_revoked_at?: string | null
          access_revoked_reason?: string | null
          created_at?: string
          has_seen_ai_assistant_tour?: boolean | null
          has_seen_courses_tour?: boolean | null
          has_seen_dashboard_tour?: boolean | null
          has_seen_goals_notes_tour?: boolean | null
          has_seen_groups_tour?: boolean | null
          has_seen_iep_tour?: boolean | null
          has_seen_settings_tour?: boolean | null
          has_seen_students_tour?: boolean | null
          id?: string
          invitation_link?: string | null
          joined_at?: string | null
          org_id?: string
          pin_hash?: string | null
          role?: Database["public"]["Enums"]["member_role"]
          status?: Database["public"]["Enums"]["member_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_members_organization_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "org_members_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      org_note_folders: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          name: string
          org_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          name: string
          org_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          name?: string
          org_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "org_note_folders_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_note_replies: {
        Row: {
          content: string
          created_at: string
          id: string
          note_id: string
          read_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          note_id: string
          read_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          note_id?: string
          read_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_note_replies_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "org_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      org_note_targets: {
        Row: {
          created_at: string | null
          note_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          note_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          note_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_note_targets_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "org_notes"
            referencedColumns: ["id"]
          },
        ]
      }
      org_notes: {
        Row: {
          category: string | null
          content: string
          created_at: string
          created_by: string
          folder_path: string | null
          id: string
          is_private: boolean
          metadata: Json | null
          organization_id: string
          student_id: string | null
          tags: string[] | null
          title: string
          updated_at: string
          visibility_scope: Database["public"]["Enums"]["note_visibility_scope"]
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          created_by: string
          folder_path?: string | null
          id?: string
          is_private?: boolean
          metadata?: Json | null
          organization_id: string
          student_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          visibility_scope?: Database["public"]["Enums"]["note_visibility_scope"]
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string
          folder_path?: string | null
          id?: string
          is_private?: boolean
          metadata?: Json | null
          organization_id?: string
          student_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          visibility_scope?: Database["public"]["Enums"]["note_visibility_scope"]
        }
        Relationships: [
          {
            foreignKeyName: "org_notes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_portal_settings: {
        Row: {
          allow_self_signup: boolean
          default_auto_enroll_courses: string[] | null
          default_auto_goals: string[] | null
          org_id: string
          require_invite: boolean
        }
        Insert: {
          allow_self_signup?: boolean
          default_auto_enroll_courses?: string[] | null
          default_auto_goals?: string[] | null
          org_id: string
          require_invite?: boolean
        }
        Update: {
          allow_self_signup?: boolean
          default_auto_enroll_courses?: string[] | null
          default_auto_goals?: string[] | null
          org_id?: string
          require_invite?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "org_portal_settings_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      org_students: {
        Row: {
          activation_status: string | null
          activation_token: string | null
          avatar_url: string | null
          created_at: string
          created_by: string
          date_of_birth: string | null
          emergency_contact: Json | null
          full_name: string
          grade_level: string | null
          id: string
          linked_user_id: string | null
          notes: string | null
          org_id: string
          parent_email: string | null
          pin_hash: string | null
          status: string
          student_email: string | null
          student_id: string | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          activation_status?: string | null
          activation_token?: string | null
          avatar_url?: string | null
          created_at?: string
          created_by: string
          date_of_birth?: string | null
          emergency_contact?: Json | null
          full_name: string
          grade_level?: string | null
          id?: string
          linked_user_id?: string | null
          notes?: string | null
          org_id: string
          parent_email?: string | null
          pin_hash?: string | null
          status?: string
          student_email?: string | null
          student_id?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          activation_status?: string | null
          activation_token?: string | null
          avatar_url?: string | null
          created_at?: string
          created_by?: string
          date_of_birth?: string | null
          emergency_contact?: Json | null
          full_name?: string
          grade_level?: string | null
          id?: string
          linked_user_id?: string | null
          notes?: string | null
          org_id?: string
          parent_email?: string | null
          pin_hash?: string | null
          status?: string
          student_email?: string | null
          student_id?: string | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "org_students_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_course_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          course_id: string
          created_at: string
          id: string
          is_active: boolean
          native_course_id: string | null
          organization_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          course_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          native_course_id?: string | null
          organization_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          course_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          native_course_id?: string | null
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_course_assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_course_assignments_native_course_id_fkey"
            columns: ["native_course_id"]
            isOneToOne: false
            referencedRelation: "native_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_course_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_exports: {
        Row: {
          completed_at: string | null
          created_at: string
          expires_at: string
          export_type: string
          file_path: string | null
          id: string
          metadata: Json | null
          organization_id: string
          requested_by: string
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          expires_at?: string
          export_type: string
          file_path?: string | null
          id?: string
          metadata?: Json | null
          organization_id: string
          requested_by: string
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          expires_at?: string
          export_type?: string
          file_path?: string | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          requested_by?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_exports_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          organization_id: string
          recipient_count: number
          sent_at: string
          sent_by: string
          subject: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          notification_type?: string
          organization_id: string
          recipient_count?: number
          sent_at?: string
          sent_by: string
          subject: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          organization_id?: string
          recipient_count?: number
          sent_at?: string
          sent_by?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          ai_settings_updated_at: string | null
          ai_settings_updated_by: string | null
          banner_url: string | null
          brand_accent: string | null
          brand_primary: string | null
          branding: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          instructor_limit: number | null
          instructors_used: number | null
          is_ai_free_chat_enabled: boolean
          is_suspended: boolean
          logo_url: string | null
          name: string
          owner_id: string | null
          plan: string
          restrict_general_chat: boolean | null
          seat_cap: number
          seats_used: number | null
          slug: string | null
          status: string
          suspended_at: string | null
          suspended_by: string | null
          suspended_reason: string | null
          theme_accent: string | null
          theme_dark_mode_accent: string | null
          theme_mode: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          ai_settings_updated_at?: string | null
          ai_settings_updated_by?: string | null
          banner_url?: string | null
          brand_accent?: string | null
          brand_primary?: string | null
          branding?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          instructor_limit?: number | null
          instructors_used?: number | null
          is_ai_free_chat_enabled?: boolean
          is_suspended?: boolean
          logo_url?: string | null
          name: string
          owner_id?: string | null
          plan?: string
          restrict_general_chat?: boolean | null
          seat_cap?: number
          seats_used?: number | null
          slug?: string | null
          status?: string
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          theme_accent?: string | null
          theme_dark_mode_accent?: string | null
          theme_mode?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          ai_settings_updated_at?: string | null
          ai_settings_updated_by?: string | null
          banner_url?: string | null
          brand_accent?: string | null
          brand_primary?: string | null
          branding?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          instructor_limit?: number | null
          instructors_used?: number | null
          is_ai_free_chat_enabled?: boolean
          is_suspended?: boolean
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          plan?: string
          restrict_general_chat?: boolean | null
          seat_cap?: number
          seats_used?: number | null
          slug?: string | null
          status?: string
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          theme_accent?: string | null
          theme_dark_mode_accent?: string | null
          theme_mode?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      parent_iep_data: {
        Row: {
          form_data: Json
          form_section: string
          id: string
          org_id: string
          session_id: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          form_data?: Json
          form_section: string
          id?: string
          org_id: string
          session_id: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          form_data?: Json
          form_section?: string
          id?: string
          org_id?: string
          session_id?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_iep_data_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_iep_data_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "parent_iep_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_iep_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invite_code: string
          last_activity: string | null
          org_id: string
          session_id: string
          status: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invite_code: string
          last_activity?: string | null
          org_id: string
          session_id: string
          status?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invite_code?: string
          last_activity?: string | null
          org_id?: string
          session_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_iep_sessions_invite_code_fkey"
            columns: ["invite_code"]
            isOneToOne: false
            referencedRelation: "iep_invites"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "parent_iep_sessions_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_resources: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string
          display_order: number
          display_section: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          tagline: string
          updated_at: string
          website_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by?: string | null
          description: string
          display_order?: number
          display_section?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          tagline: string
          updated_at?: string
          website_url: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          display_order?: number
          display_section?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          tagline?: string
          updated_at?: string
          website_url?: string
        }
        Relationships: []
      }
      phoenix_concept_prerequisites: {
        Row: {
          concept_id: string
          created_at: string
          id: string
          prerequisite_id: string
          relationship_type: string
          strength: number | null
        }
        Insert: {
          concept_id: string
          created_at?: string
          id?: string
          prerequisite_id: string
          relationship_type: string
          strength?: number | null
        }
        Update: {
          concept_id?: string
          created_at?: string
          id?: string
          prerequisite_id?: string
          relationship_type?: string
          strength?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_concept_prerequisites_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "phoenix_learning_concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phoenix_concept_prerequisites_prerequisite_id_fkey"
            columns: ["prerequisite_id"]
            isOneToOne: false
            referencedRelation: "phoenix_learning_concepts"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_conversations: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          session_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phoenix_feature_flags: {
        Row: {
          configuration: Json | null
          created_at: string
          description: string | null
          feature_name: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          description?: string | null
          feature_name: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          description?: string | null
          feature_name?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      phoenix_feature_usage: {
        Row: {
          config_snapshot: Json | null
          conversation_id: string | null
          created_at: string | null
          error_message: string | null
          execution_duration_ms: number | null
          feature_name: string
          id: string
          message_id: string | null
          user_id: string | null
          was_enabled: boolean
          was_executed: boolean
          was_successful: boolean | null
          was_triggered: boolean
        }
        Insert: {
          config_snapshot?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_duration_ms?: number | null
          feature_name: string
          id?: string
          message_id?: string | null
          user_id?: string | null
          was_enabled: boolean
          was_executed: boolean
          was_successful?: boolean | null
          was_triggered: boolean
        }
        Update: {
          config_snapshot?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          error_message?: string | null
          execution_duration_ms?: number | null
          feature_name?: string
          id?: string
          message_id?: string | null
          user_id?: string | null
          was_enabled?: boolean
          was_executed?: boolean
          was_successful?: boolean | null
          was_triggered?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_feature_usage_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phoenix_feature_usage_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "phoenix_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_governor_logs: {
        Row: {
          blocked: boolean
          conversation_id: string
          created_at: string | null
          id: string
          is_on_topic: boolean
          is_safe: boolean
          original_response: string
          persona: string
          persona_adherence: string
          reason: string | null
          severity: string
          user_message: string
        }
        Insert: {
          blocked?: boolean
          conversation_id: string
          created_at?: string | null
          id?: string
          is_on_topic: boolean
          is_safe: boolean
          original_response: string
          persona: string
          persona_adherence: string
          reason?: string | null
          severity: string
          user_message: string
        }
        Update: {
          blocked?: boolean
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_on_topic?: boolean
          is_safe?: boolean
          original_response?: string
          persona?: string
          persona_adherence?: string
          reason?: string | null
          severity?: string
          user_message?: string
        }
        Relationships: []
      }
      phoenix_learning_concepts: {
        Row: {
          concept_name: string
          concept_slug: string
          created_at: string
          description: string | null
          difficulty_level: number
          domain: string
          estimated_time_hours: number | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          tags: Json | null
          updated_at: string
        }
        Insert: {
          concept_name: string
          concept_slug: string
          created_at?: string
          description?: string | null
          difficulty_level?: number
          domain: string
          estimated_time_hours?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          tags?: Json | null
          updated_at?: string
        }
        Update: {
          concept_name?: string
          concept_slug?: string
          created_at?: string
          description?: string | null
          difficulty_level?: number
          domain?: string
          estimated_time_hours?: number | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          tags?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      phoenix_learning_outcomes: {
        Row: {
          concept_id: string | null
          conversation_id: string | null
          created_at: string
          description: string | null
          evidence: Json | null
          id: string
          mastery_level: number | null
          outcome_type: string
          topic: string
          user_id: string
        }
        Insert: {
          concept_id?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          evidence?: Json | null
          id?: string
          mastery_level?: number | null
          outcome_type: string
          topic: string
          user_id: string
        }
        Update: {
          concept_id?: string | null
          conversation_id?: string | null
          created_at?: string
          description?: string | null
          evidence?: Json | null
          id?: string
          mastery_level?: number | null
          outcome_type?: string
          topic?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_learning_outcomes_concept_id_fkey"
            columns: ["concept_id"]
            isOneToOne: false
            referencedRelation: "phoenix_learning_concepts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phoenix_learning_outcomes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_memory_fragments: {
        Row: {
          content: string
          context: Json | null
          conversation_id: string | null
          created_at: string
          expires_at: string | null
          id: string
          last_referenced_at: string | null
          memory_type: string
          reference_count: number | null
          relevance_score: number | null
          user_id: string
        }
        Insert: {
          content: string
          context?: Json | null
          conversation_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_referenced_at?: string | null
          memory_type: string
          reference_count?: number | null
          relevance_score?: number | null
          user_id: string
        }
        Update: {
          content?: string
          context?: Json | null
          conversation_id?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_referenced_at?: string | null
          memory_type?: string
          reference_count?: number | null
          relevance_score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_memory_fragments_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          intent: Database["public"]["Enums"]["message_intent"] | null
          metadata: Json | null
          persona: Database["public"]["Enums"]["persona_type"]
          sentiment: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          intent?: Database["public"]["Enums"]["message_intent"] | null
          metadata?: Json | null
          persona: Database["public"]["Enums"]["persona_type"]
          sentiment?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          intent?: Database["public"]["Enums"]["message_intent"] | null
          metadata?: Json | null
          persona?: Database["public"]["Enums"]["persona_type"]
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_nite_owl_events: {
        Row: {
          context_snapshot: Json | null
          conversation_id: string | null
          created_at: string | null
          id: string
          message_id: string | null
          session_ended_after: boolean | null
          socratic_turn_count: number | null
          time_to_next_message_ms: number | null
          trigger_reason: string
          turns_since_last_nite_owl: number | null
          user_continued_after: boolean | null
          user_frustration_score: number | null
          user_id: string | null
          was_helpful: boolean | null
        }
        Insert: {
          context_snapshot?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          session_ended_after?: boolean | null
          socratic_turn_count?: number | null
          time_to_next_message_ms?: number | null
          trigger_reason: string
          turns_since_last_nite_owl?: number | null
          user_continued_after?: boolean | null
          user_frustration_score?: number | null
          user_id?: string | null
          was_helpful?: boolean | null
        }
        Update: {
          context_snapshot?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          message_id?: string | null
          session_ended_after?: boolean | null
          socratic_turn_count?: number | null
          time_to_next_message_ms?: number | null
          trigger_reason?: string
          turns_since_last_nite_owl?: number | null
          user_continued_after?: boolean | null
          user_frustration_score?: number | null
          user_id?: string | null
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_nite_owl_events_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phoenix_nite_owl_events_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "phoenix_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_performance_logs: {
        Row: {
          context_loading_duration: number | null
          conversation_id: string | null
          correction_message: string | null
          created_at: string | null
          error_message: string | null
          error_occurred: boolean | null
          feature_flags_snapshot: Json | null
          governor_check_duration: number | null
          id: string
          intent: Database["public"]["Enums"]["message_intent"] | null
          intent_detection_duration: number | null
          intent_was_misinterpreted: boolean | null
          llm_response_duration: number | null
          message_id: string | null
          persona: Database["public"]["Enums"]["persona_type"]
          time_to_first_token: number | null
          total_duration: number
          tts_generation_duration: number | null
          user_id: string | null
        }
        Insert: {
          context_loading_duration?: number | null
          conversation_id?: string | null
          correction_message?: string | null
          created_at?: string | null
          error_message?: string | null
          error_occurred?: boolean | null
          feature_flags_snapshot?: Json | null
          governor_check_duration?: number | null
          id?: string
          intent?: Database["public"]["Enums"]["message_intent"] | null
          intent_detection_duration?: number | null
          intent_was_misinterpreted?: boolean | null
          llm_response_duration?: number | null
          message_id?: string | null
          persona: Database["public"]["Enums"]["persona_type"]
          time_to_first_token?: number | null
          total_duration: number
          tts_generation_duration?: number | null
          user_id?: string | null
        }
        Update: {
          context_loading_duration?: number | null
          conversation_id?: string | null
          correction_message?: string | null
          created_at?: string | null
          error_message?: string | null
          error_occurred?: boolean | null
          feature_flags_snapshot?: Json | null
          governor_check_duration?: number | null
          id?: string
          intent?: Database["public"]["Enums"]["message_intent"] | null
          intent_detection_duration?: number | null
          intent_was_misinterpreted?: boolean | null
          llm_response_duration?: number | null
          message_id?: string | null
          persona?: Database["public"]["Enums"]["persona_type"]
          time_to_first_token?: number | null
          total_duration?: number
          tts_generation_duration?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_performance_logs_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phoenix_performance_logs_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "phoenix_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      phoenix_user_context: {
        Row: {
          confidence_score: number | null
          context_data: Json
          context_type: string
          created_at: string
          extracted_from_sessions: number | null
          id: string
          last_observed_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          context_data?: Json
          context_type: string
          created_at?: string
          extracted_from_sessions?: number | null
          id?: string
          last_observed_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          context_data?: Json
          context_type?: string
          created_at?: string
          extracted_from_sessions?: number | null
          id?: string
          last_observed_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phoenix_user_feedback: {
        Row: {
          context: Json | null
          conversation_id: string | null
          created_at: string | null
          feedback_type: string
          id: string
          message_id: string | null
          persona_before_feedback:
            | Database["public"]["Enums"]["persona_type"]
            | null
          previous_ai_message: string | null
          session_turn_count: number | null
          user_id: string | null
          user_message: string
        }
        Insert: {
          context?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          feedback_type: string
          id?: string
          message_id?: string | null
          persona_before_feedback?:
            | Database["public"]["Enums"]["persona_type"]
            | null
          previous_ai_message?: string | null
          session_turn_count?: number | null
          user_id?: string | null
          user_message: string
        }
        Update: {
          context?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          feedback_type?: string
          id?: string
          message_id?: string | null
          persona_before_feedback?:
            | Database["public"]["Enums"]["persona_type"]
            | null
          previous_ai_message?: string | null
          session_turn_count?: number | null
          user_id?: string | null
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "phoenix_user_feedback_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "phoenix_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phoenix_user_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "phoenix_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      podcast_episodes: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          download_count: number
          duration_seconds: number | null
          episode_number: number
          featured: boolean
          guest_names: string[] | null
          id: string
          play_count: number
          published_at: string | null
          show_notes: string | null
          status: string
          tags: string[] | null
          title: string
          transcript_url: string | null
          updated_at: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number
          duration_seconds?: number | null
          episode_number: number
          featured?: boolean
          guest_names?: string[] | null
          id?: string
          play_count?: number
          published_at?: string | null
          show_notes?: string | null
          status?: string
          tags?: string[] | null
          title: string
          transcript_url?: string | null
          updated_at?: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number
          duration_seconds?: number | null
          episode_number?: number
          featured?: boolean
          guest_names?: string[] | null
          id?: string
          play_count?: number
          published_at?: string | null
          show_notes?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          transcript_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          created_at: string
          created_by: string | null
          current_step: string | null
          error_message: string | null
          id: string
          job_type: string
          metadata: Json | null
          progress: number | null
          status: string
          total_steps: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_step?: string | null
          error_message?: string | null
          id?: string
          job_type: string
          metadata?: Json | null
          progress?: number | null
          status?: string
          total_steps?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_step?: string | null
          error_message?: string | null
          id?: string
          job_type?: string
          metadata?: Json | null
          progress?: number | null
          status?: string
          total_steps?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_scope: string | null
          ai_autoplay_voice: boolean
          ai_credits: number
          ai_hint_aggressiveness: number
          ai_interaction_style: string
          ai_voice_enabled: boolean
          app_reminders: Json | null
          avatar_url: string | null
          beta_access: boolean | null
          beta_invite_code: string | null
          bio: string | null
          calendar_sync: Json | null
          color_contrast: string | null
          comfort_mode: string | null
          created_at: string | null
          current_streak: number | null
          date_format: string | null
          department: string | null
          display_font_size: string
          display_high_contrast: boolean
          display_name: string | null
          display_reduce_motion: boolean
          display_theme: string
          dual_language_enabled: boolean | null
          email: string | null
          email_notifications: Json | null
          font_family: string | null
          full_name: string | null
          gamification_focus_mode: boolean
          gamification_leaderboard_enabled: boolean
          gamification_xp_notify: boolean
          id: string
          job_title: string | null
          last_activity_date: string | null
          learning_styles: string[] | null
          line_spacing: number | null
          onboarding_completed: boolean | null
          pending_role: string | null
          phoenix_settings: Json | null
          phone_extension: string | null
          phone_number: string | null
          primary_language: string | null
          push_notifications_enabled: boolean | null
          signup_completed: boolean | null
          speech_to_text_enabled: boolean | null
          subject_taught: string | null
          text_size: number | null
          time_format: string | null
          timezone: string | null
          total_xp: number | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          access_scope?: string | null
          ai_autoplay_voice?: boolean
          ai_credits?: number
          ai_hint_aggressiveness?: number
          ai_interaction_style?: string
          ai_voice_enabled?: boolean
          app_reminders?: Json | null
          avatar_url?: string | null
          beta_access?: boolean | null
          beta_invite_code?: string | null
          bio?: string | null
          calendar_sync?: Json | null
          color_contrast?: string | null
          comfort_mode?: string | null
          created_at?: string | null
          current_streak?: number | null
          date_format?: string | null
          department?: string | null
          display_font_size?: string
          display_high_contrast?: boolean
          display_name?: string | null
          display_reduce_motion?: boolean
          display_theme?: string
          dual_language_enabled?: boolean | null
          email?: string | null
          email_notifications?: Json | null
          font_family?: string | null
          full_name?: string | null
          gamification_focus_mode?: boolean
          gamification_leaderboard_enabled?: boolean
          gamification_xp_notify?: boolean
          id: string
          job_title?: string | null
          last_activity_date?: string | null
          learning_styles?: string[] | null
          line_spacing?: number | null
          onboarding_completed?: boolean | null
          pending_role?: string | null
          phoenix_settings?: Json | null
          phone_extension?: string | null
          phone_number?: string | null
          primary_language?: string | null
          push_notifications_enabled?: boolean | null
          signup_completed?: boolean | null
          speech_to_text_enabled?: boolean | null
          subject_taught?: string | null
          text_size?: number | null
          time_format?: string | null
          timezone?: string | null
          total_xp?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          access_scope?: string | null
          ai_autoplay_voice?: boolean
          ai_credits?: number
          ai_hint_aggressiveness?: number
          ai_interaction_style?: string
          ai_voice_enabled?: boolean
          app_reminders?: Json | null
          avatar_url?: string | null
          beta_access?: boolean | null
          beta_invite_code?: string | null
          bio?: string | null
          calendar_sync?: Json | null
          color_contrast?: string | null
          comfort_mode?: string | null
          created_at?: string | null
          current_streak?: number | null
          date_format?: string | null
          department?: string | null
          display_font_size?: string
          display_high_contrast?: boolean
          display_name?: string | null
          display_reduce_motion?: boolean
          display_theme?: string
          dual_language_enabled?: boolean | null
          email?: string | null
          email_notifications?: Json | null
          font_family?: string | null
          full_name?: string | null
          gamification_focus_mode?: boolean
          gamification_leaderboard_enabled?: boolean
          gamification_xp_notify?: boolean
          id?: string
          job_title?: string | null
          last_activity_date?: string | null
          learning_styles?: string[] | null
          line_spacing?: number | null
          onboarding_completed?: boolean | null
          pending_role?: string | null
          phoenix_settings?: Json | null
          phone_extension?: string | null
          phone_number?: string | null
          primary_language?: string | null
          push_notifications_enabled?: boolean | null
          signup_completed?: boolean | null
          speech_to_text_enabled?: boolean | null
          subject_taught?: string | null
          text_size?: number | null
          time_format?: string | null
          timezone?: string | null
          total_xp?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      public_domain_books: {
        Row: {
          author: string
          cover_url: string | null
          created_at: string | null
          description: string | null
          download_error_message: string | null
          download_status: string | null
          epub_url: string
          file_size: number | null
          gutenberg_id: number
          id: string
          is_user_added: boolean | null
          language: string | null
          last_download_attempt: string | null
          last_updated: string | null
          openlibrary_key: string | null
          storage_url: string | null
          subjects: string[] | null
          title: string
        }
        Insert: {
          author: string
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          download_error_message?: string | null
          download_status?: string | null
          epub_url: string
          file_size?: number | null
          gutenberg_id: number
          id: string
          is_user_added?: boolean | null
          language?: string | null
          last_download_attempt?: string | null
          last_updated?: string | null
          openlibrary_key?: string | null
          storage_url?: string | null
          subjects?: string[] | null
          title: string
        }
        Update: {
          author?: string
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          download_error_message?: string | null
          download_status?: string | null
          epub_url?: string
          file_size?: number | null
          gutenberg_id?: number
          id?: string
          is_user_added?: boolean | null
          language?: string | null
          last_download_attempt?: string | null
          last_updated?: string | null
          openlibrary_key?: string | null
          storage_url?: string | null
          subjects?: string[] | null
          title?: string
        }
        Relationships: []
      }
      question_responses: {
        Row: {
          answer_given: string
          correct_answer: string | null
          course_id: string
          created_at: string | null
          id: string
          is_correct: boolean
          lesson_id: number
          metadata: Json | null
          question_id: string
          question_text: string
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          answer_given: string
          correct_answer?: string | null
          course_id: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          lesson_id: number
          metadata?: Json | null
          question_id: string
          question_text: string
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          answer_given?: string
          correct_answer?: string | null
          course_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean
          lesson_id?: number
          metadata?: Json | null
          question_id?: string
          question_text?: string
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      quests: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean
          name: string
          quest_id: string
          start_date: string | null
          xp_multiplier: number
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name: string
          quest_id: string
          start_date?: string | null
          xp_multiplier?: number
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          name?: string
          quest_id?: string
          start_date?: string | null
          xp_multiplier?: number
        }
        Relationships: []
      }
      quiz_items: {
        Row: {
          answer_key_json: Json
          block_id: string
          created_at: string
          id: string
          kind: string
          options_json: Json | null
          order_index: number
          points: number
          prompt: string
        }
        Insert: {
          answer_key_json?: Json
          block_id: string
          created_at?: string
          id?: string
          kind: string
          options_json?: Json | null
          order_index: number
          points?: number
          prompt: string
        }
        Update: {
          answer_key_json?: Json
          block_id?: string
          created_at?: string
          id?: string
          kind?: string
          options_json?: Json | null
          order_index?: number
          points?: number
          prompt?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_items_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_progress: {
        Row: {
          book_id: string
          chapter_index: number | null
          completion_percentage: number | null
          created_at: string | null
          current_cfi: string | null
          id: string
          last_read_at: string | null
          reading_time_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          book_id: string
          chapter_index?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          current_cfi?: string | null
          id?: string
          last_read_at?: string | null
          reading_time_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          book_id?: string
          chapter_index?: number | null
          completion_percentage?: number | null
          created_at?: string | null
          current_cfi?: string | null
          id?: string
          last_read_at?: string | null
          reading_time_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reading_sessions: {
        Row: {
          book_category: string | null
          book_id: string
          created_at: string | null
          duration_seconds: number | null
          end_cfi: string | null
          id: string
          pages_read: number | null
          search_query: string | null
          session_end: string | null
          session_start: string | null
          start_cfi: string | null
          user_id: string
        }
        Insert: {
          book_category?: string | null
          book_id: string
          created_at?: string | null
          duration_seconds?: number | null
          end_cfi?: string | null
          id?: string
          pages_read?: number | null
          search_query?: string | null
          session_end?: string | null
          session_start?: string | null
          start_cfi?: string | null
          user_id: string
        }
        Update: {
          book_category?: string | null
          book_id?: string
          created_at?: string | null
          duration_seconds?: number | null
          end_cfi?: string | null
          id?: string
          pages_read?: number | null
          search_query?: string | null
          session_end?: string | null
          session_start?: string | null
          start_cfi?: string | null
          user_id?: string
        }
        Relationships: []
      }
      risk_radar_alerts: {
        Row: {
          cohort_id: string | null
          confidence: number
          created_at: string
          id: string
          next_deadline_at: string | null
          resolved: boolean | null
          resolved_at: string | null
          risk_score: number
          risk_type: string
          student_id: string
          suggested_actions: Json | null
          top_features: Json | null
          updated_at: string
          window_days: number | null
        }
        Insert: {
          cohort_id?: string | null
          confidence: number
          created_at?: string
          id?: string
          next_deadline_at?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          risk_score: number
          risk_type: string
          student_id: string
          suggested_actions?: Json | null
          top_features?: Json | null
          updated_at?: string
          window_days?: number | null
        }
        Update: {
          cohort_id?: string | null
          confidence?: number
          created_at?: string
          id?: string
          next_deadline_at?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          risk_score?: number
          risk_type?: string
          student_id?: string
          suggested_actions?: Json | null
          top_features?: Json | null
          updated_at?: string
          window_days?: number | null
        }
        Relationships: []
      }
      scenes: {
        Row: {
          ai_prompt: string
          caption: string | null
          created_at: string
          cues_json: Json
          difficulty_level: number
          emotion_id: string
          id: string
          image_url: string | null
          module_id: string
          options_json: Json
          scenario: string | null
          title: string
        }
        Insert: {
          ai_prompt: string
          caption?: string | null
          created_at?: string
          cues_json?: Json
          difficulty_level?: number
          emotion_id: string
          id?: string
          image_url?: string | null
          module_id: string
          options_json?: Json
          scenario?: string | null
          title: string
        }
        Update: {
          ai_prompt?: string
          caption?: string | null
          created_at?: string
          cues_json?: Json
          difficulty_level?: number
          emotion_id?: string
          id?: string
          image_url?: string | null
          module_id?: string
          options_json?: Json
          scenario?: string | null
          title?: string
        }
        Relationships: []
      }
      scorm_analytics: {
        Row: {
          duration_ms: number | null
          enrollment_id: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          package_id: string | null
          sco_id: string | null
          score_achieved: number | null
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          duration_ms?: number | null
          enrollment_id?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          package_id?: string | null
          sco_id?: string | null
          score_achieved?: number | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          duration_ms?: number | null
          enrollment_id?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          package_id?: string | null
          sco_id?: string | null
          score_achieved?: number | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scorm_analytics_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_analytics_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "scorm_analytics_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "scorm_analytics_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_package_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_analytics_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_analytics_sco_id_fkey"
            columns: ["sco_id"]
            isOneToOne: false
            referencedRelation: "scorm_scos"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_attempts: {
        Row: {
          attempt_no: number
          completion_status: string | null
          enrollment_id: string | null
          entry: string | null
          exit: string | null
          finished_at: string | null
          id: string
          last_commit_at: string | null
          lesson_location: string | null
          lesson_status: string | null
          raw_cmi: Json | null
          sco_id: string | null
          score_max: number | null
          score_min: number | null
          score_raw: number | null
          score_scaled: number | null
          session_time: string | null
          started_at: string | null
          success_status: string | null
          suspend_data: string | null
          total_time: unknown
        }
        Insert: {
          attempt_no?: number
          completion_status?: string | null
          enrollment_id?: string | null
          entry?: string | null
          exit?: string | null
          finished_at?: string | null
          id?: string
          last_commit_at?: string | null
          lesson_location?: string | null
          lesson_status?: string | null
          raw_cmi?: Json | null
          sco_id?: string | null
          score_max?: number | null
          score_min?: number | null
          score_raw?: number | null
          score_scaled?: number | null
          session_time?: string | null
          started_at?: string | null
          success_status?: string | null
          suspend_data?: string | null
          total_time?: unknown
        }
        Update: {
          attempt_no?: number
          completion_status?: string | null
          enrollment_id?: string | null
          entry?: string | null
          exit?: string | null
          finished_at?: string | null
          id?: string
          last_commit_at?: string | null
          lesson_location?: string | null
          lesson_status?: string | null
          raw_cmi?: Json | null
          sco_id?: string | null
          score_max?: number | null
          score_min?: number | null
          score_raw?: number | null
          score_scaled?: number | null
          session_time?: string | null
          started_at?: string | null
          success_status?: string | null
          suspend_data?: string | null
          total_time?: unknown
        }
        Relationships: []
      }
      scorm_enrollments: {
        Row: {
          completed_at: string | null
          current_sco_id: string | null
          enrolled_at: string
          id: string
          package_id: string
          progress_percentage: number | null
          role: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_sco_id?: string | null
          enrolled_at?: string
          id?: string
          package_id: string
          progress_percentage?: number | null
          role?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_sco_id?: string | null
          enrolled_at?: string
          id?: string
          package_id?: string
          progress_percentage?: number | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scorm_enrollments_current_sco_id_fkey"
            columns: ["current_sco_id"]
            isOneToOne: false
            referencedRelation: "scorm_scos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_enrollments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "scorm_enrollments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_package_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_enrollments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_imports: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          manifest_data: Json | null
          mapped_structure: Json | null
          org_id: string
          progress_percentage: number | null
          status: string
          steps_log: Json
          user_id: string
          warnings_json: Json | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          manifest_data?: Json | null
          mapped_structure?: Json | null
          org_id: string
          progress_percentage?: number | null
          status?: string
          steps_log?: Json
          user_id: string
          warnings_json?: Json | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          manifest_data?: Json | null
          mapped_structure?: Json | null
          org_id?: string
          progress_percentage?: number | null
          status?: string
          steps_log?: Json
          user_id?: string
          warnings_json?: Json | null
        }
        Relationships: []
      }
      scorm_interactions: {
        Row: {
          correct_responses: Json | null
          created_at: string
          description: string | null
          id: string
          interaction_id: string | null
          interaction_index: number
          latency: string | null
          learner_response: string | null
          objectives: Json | null
          result: string | null
          runtime_id: string
          time: string | null
          type: string | null
          weighting: number | null
        }
        Insert: {
          correct_responses?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          interaction_id?: string | null
          interaction_index: number
          latency?: string | null
          learner_response?: string | null
          objectives?: Json | null
          result?: string | null
          runtime_id: string
          time?: string | null
          type?: string | null
          weighting?: number | null
        }
        Update: {
          correct_responses?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          interaction_id?: string | null
          interaction_index?: number
          latency?: string | null
          learner_response?: string | null
          objectives?: Json | null
          result?: string | null
          runtime_id?: string
          time?: string | null
          type?: string | null
          weighting?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scorm_interactions_runtime_id_fkey"
            columns: ["runtime_id"]
            isOneToOne: false
            referencedRelation: "scorm_runtime"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_logs: {
        Row: {
          category: string
          created_at: string
          data: Json | null
          enrollment_id: string | null
          id: string
          level: string
          message: string
          package_id: string | null
          sco_id: string | null
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          data?: Json | null
          enrollment_id?: string | null
          id?: string
          level?: string
          message: string
          package_id?: string | null
          sco_id?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          data?: Json | null
          enrollment_id?: string | null
          id?: string
          level?: string
          message?: string
          package_id?: string | null
          sco_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scorm_logs_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_logs_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "scorm_logs_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "scorm_logs_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_package_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_logs_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_logs_sco_id_fkey"
            columns: ["sco_id"]
            isOneToOne: false
            referencedRelation: "scorm_scos"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_objectives: {
        Row: {
          completion_status:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          created_at: string
          description: string | null
          id: string
          objective_id: string | null
          objective_index: number
          runtime_id: string
          score_max: number | null
          score_min: number | null
          score_raw: number | null
          score_scaled: number | null
          status_12: Database["public"]["Enums"]["lesson_status_12"] | null
          success_status:
            | Database["public"]["Enums"]["success_status_2004"]
            | null
        }
        Insert: {
          completion_status?:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          created_at?: string
          description?: string | null
          id?: string
          objective_id?: string | null
          objective_index: number
          runtime_id: string
          score_max?: number | null
          score_min?: number | null
          score_raw?: number | null
          score_scaled?: number | null
          status_12?: Database["public"]["Enums"]["lesson_status_12"] | null
          success_status?:
            | Database["public"]["Enums"]["success_status_2004"]
            | null
        }
        Update: {
          completion_status?:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          created_at?: string
          description?: string | null
          id?: string
          objective_id?: string | null
          objective_index?: number
          runtime_id?: string
          score_max?: number | null
          score_min?: number | null
          score_raw?: number | null
          score_scaled?: number | null
          status_12?: Database["public"]["Enums"]["lesson_status_12"] | null
          success_status?:
            | Database["public"]["Enums"]["success_status_2004"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "scorm_objectives_runtime_id_fkey"
            columns: ["runtime_id"]
            isOneToOne: false
            referencedRelation: "scorm_runtime"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_packages: {
        Row: {
          access_count: number | null
          created_at: string
          created_by: string | null
          description: string | null
          extract_path: string | null
          id: string
          is_public: boolean | null
          last_accessed_at: string | null
          manifest_path: string | null
          metadata: Json | null
          organizations: Json | null
          parsed_at: string | null
          resources: Json | null
          standard: Database["public"]["Enums"]["scorm_standard"]
          status: Database["public"]["Enums"]["package_status"]
          title: string
          updated_at: string
          upload_size: number | null
          version: string | null
          zip_path: string | null
        }
        Insert: {
          access_count?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          extract_path?: string | null
          id?: string
          is_public?: boolean | null
          last_accessed_at?: string | null
          manifest_path?: string | null
          metadata?: Json | null
          organizations?: Json | null
          parsed_at?: string | null
          resources?: Json | null
          standard?: Database["public"]["Enums"]["scorm_standard"]
          status?: Database["public"]["Enums"]["package_status"]
          title: string
          updated_at?: string
          upload_size?: number | null
          version?: string | null
          zip_path?: string | null
        }
        Update: {
          access_count?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          extract_path?: string | null
          id?: string
          is_public?: boolean | null
          last_accessed_at?: string | null
          manifest_path?: string | null
          metadata?: Json | null
          organizations?: Json | null
          parsed_at?: string | null
          resources?: Json | null
          standard?: Database["public"]["Enums"]["scorm_standard"]
          status?: Database["public"]["Enums"]["package_status"]
          title?: string
          updated_at?: string
          upload_size?: number | null
          version?: string | null
          zip_path?: string | null
        }
        Relationships: []
      }
      scorm_progress: {
        Row: {
          cmi_core_lesson_location: string | null
          cmi_core_lesson_status: string | null
          cmi_core_score_max: number | null
          cmi_core_score_min: number | null
          cmi_core_score_raw: number | null
          cmi_core_session_time: string | null
          cmi_core_total_time: string | null
          cmi_suspend_data: string | null
          course_id: string
          created_at: string
          id: string
          lesson_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cmi_core_lesson_location?: string | null
          cmi_core_lesson_status?: string | null
          cmi_core_score_max?: number | null
          cmi_core_score_min?: number | null
          cmi_core_score_raw?: number | null
          cmi_core_session_time?: string | null
          cmi_core_total_time?: string | null
          cmi_suspend_data?: string | null
          course_id: string
          created_at?: string
          id?: string
          lesson_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cmi_core_lesson_location?: string | null
          cmi_core_lesson_status?: string | null
          cmi_core_score_max?: number | null
          cmi_core_score_min?: number | null
          cmi_core_score_raw?: number | null
          cmi_core_session_time?: string | null
          cmi_core_total_time?: string | null
          cmi_suspend_data?: string | null
          course_id?: string
          created_at?: string
          id?: string
          lesson_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scorm_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_rate_limits: {
        Row: {
          action_type: string
          count: number
          id: string
          user_id: string | null
          window_start: string
        }
        Insert: {
          action_type: string
          count?: number
          id?: string
          user_id?: string | null
          window_start?: string
        }
        Update: {
          action_type?: string
          count?: number
          id?: string
          user_id?: string | null
          window_start?: string
        }
        Relationships: []
      }
      scorm_runtime: {
        Row: {
          cmi_data: Json
          comments: string | null
          comments_from_lms: string | null
          completion_status:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          created_at: string
          credit: string | null
          enrollment_id: string
          entry: string | null
          exit: string | null
          id: string
          initialized_at: string | null
          last_commit_at: string | null
          launch_data: string | null
          lesson_location: string | null
          lesson_status: Database["public"]["Enums"]["lesson_status_12"] | null
          location: string | null
          package_id: string
          progress_measure: number | null
          sco_id: string
          score_max: number | null
          score_min: number | null
          score_raw: number | null
          score_scaled: number | null
          session_start_time: string | null
          session_time: string | null
          session_time_2004: string | null
          standard: Database["public"]["Enums"]["scorm_standard"]
          success_status:
            | Database["public"]["Enums"]["success_status_2004"]
            | null
          suspend_data: string | null
          terminated_at: string | null
          total_time: string | null
          total_time_2004: string | null
          updated_at: string
        }
        Insert: {
          cmi_data?: Json
          comments?: string | null
          comments_from_lms?: string | null
          completion_status?:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          created_at?: string
          credit?: string | null
          enrollment_id: string
          entry?: string | null
          exit?: string | null
          id?: string
          initialized_at?: string | null
          last_commit_at?: string | null
          launch_data?: string | null
          lesson_location?: string | null
          lesson_status?: Database["public"]["Enums"]["lesson_status_12"] | null
          location?: string | null
          package_id: string
          progress_measure?: number | null
          sco_id: string
          score_max?: number | null
          score_min?: number | null
          score_raw?: number | null
          score_scaled?: number | null
          session_start_time?: string | null
          session_time?: string | null
          session_time_2004?: string | null
          standard?: Database["public"]["Enums"]["scorm_standard"]
          success_status?:
            | Database["public"]["Enums"]["success_status_2004"]
            | null
          suspend_data?: string | null
          terminated_at?: string | null
          total_time?: string | null
          total_time_2004?: string | null
          updated_at?: string
        }
        Update: {
          cmi_data?: Json
          comments?: string | null
          comments_from_lms?: string | null
          completion_status?:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          created_at?: string
          credit?: string | null
          enrollment_id?: string
          entry?: string | null
          exit?: string | null
          id?: string
          initialized_at?: string | null
          last_commit_at?: string | null
          launch_data?: string | null
          lesson_location?: string | null
          lesson_status?: Database["public"]["Enums"]["lesson_status_12"] | null
          location?: string | null
          package_id?: string
          progress_measure?: number | null
          sco_id?: string
          score_max?: number | null
          score_min?: number | null
          score_raw?: number | null
          score_scaled?: number | null
          session_start_time?: string | null
          session_time?: string | null
          session_time_2004?: string | null
          standard?: Database["public"]["Enums"]["scorm_standard"]
          success_status?:
            | Database["public"]["Enums"]["success_status_2004"]
            | null
          suspend_data?: string | null
          terminated_at?: string | null
          total_time?: string | null
          total_time_2004?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scorm_runtime_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_runtime_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "scorm_runtime_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "scorm_runtime_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_package_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_runtime_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_runtime_sco_id_fkey"
            columns: ["sco_id"]
            isOneToOne: false
            referencedRelation: "scorm_scos"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_scos: {
        Row: {
          created_at: string
          id: string
          identifier: string
          is_launchable: boolean
          launch_href: string
          mastery_score: number | null
          max_time_allowed: string | null
          package_id: string
          parameters: string | null
          parent_id: string | null
          prerequisites: Json | null
          scorm_type: string | null
          seq_order: number
          time_limit_action: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          identifier: string
          is_launchable?: boolean
          launch_href: string
          mastery_score?: number | null
          max_time_allowed?: string | null
          package_id: string
          parameters?: string | null
          parent_id?: string | null
          prerequisites?: Json | null
          scorm_type?: string | null
          seq_order?: number
          time_limit_action?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          identifier?: string
          is_launchable?: boolean
          launch_href?: string
          mastery_score?: number | null
          max_time_allowed?: string | null
          package_id?: string
          parameters?: string | null
          parent_id?: string | null
          prerequisites?: Json | null
          scorm_type?: string | null
          seq_order?: number
          time_limit_action?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scorm_scos_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "scorm_scos_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_package_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_scos_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "scorm_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_scos_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "scorm_scos"
            referencedColumns: ["id"]
          },
        ]
      }
      search_analytics: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          query: string
          result_count: number | null
          source_type: string | null
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          query: string
          result_count?: number | null
          source_type?: string | null
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          query?: string
          result_count?: number | null
          source_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_incidents: {
        Row: {
          affected_systems: Json | null
          affected_users_count: number | null
          assigned_to: string | null
          containment_timestamp: string | null
          created_at: string
          data_types_affected: Json | null
          description: string
          detection_method: string
          detection_timestamp: string
          escalation_level: number | null
          id: string
          incident_status: string
          incident_type: string
          lessons_learned: string | null
          notifications_sent: Json | null
          regulatory_reporting_required: boolean
          remediation_actions: string | null
          resolution_timestamp: string | null
          severity_level: string
          updated_at: string
        }
        Insert: {
          affected_systems?: Json | null
          affected_users_count?: number | null
          assigned_to?: string | null
          containment_timestamp?: string | null
          created_at?: string
          data_types_affected?: Json | null
          description: string
          detection_method: string
          detection_timestamp?: string
          escalation_level?: number | null
          id?: string
          incident_status?: string
          incident_type: string
          lessons_learned?: string | null
          notifications_sent?: Json | null
          regulatory_reporting_required?: boolean
          remediation_actions?: string | null
          resolution_timestamp?: string | null
          severity_level: string
          updated_at?: string
        }
        Update: {
          affected_systems?: Json | null
          affected_users_count?: number | null
          assigned_to?: string | null
          containment_timestamp?: string | null
          created_at?: string
          data_types_affected?: Json | null
          description?: string
          detection_method?: string
          detection_timestamp?: string
          escalation_level?: number | null
          id?: string
          incident_status?: string
          incident_type?: string
          lessons_learned?: string | null
          notifications_sent?: Json | null
          regulatory_reporting_required?: boolean
          remediation_actions?: string | null
          resolution_timestamp?: string | null
          severity_level?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_time: {
        Row: {
          created_at: string | null
          day: string | null
          id: string
          minutes: number
          org_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day?: string | null
          id?: string
          minutes?: number
          org_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          day?: string | null
          id?: string
          minutes?: number
          org_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_time_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_available: boolean
          item_id: string
          item_type: string
          metadata: Json | null
          name: string
          xp_cost: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          item_id: string
          item_type?: string
          metadata?: Json | null
          name: string
          xp_cost: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_available?: boolean
          item_id?: string
          item_type?: string
          metadata?: Json | null
          name?: string
          xp_cost?: number
        }
        Relationships: []
      }
      slide_analytics: {
        Row: {
          attention_score: number | null
          cognitive_load_indicator: number | null
          completion_status: string | null
          course_id: string
          duration_seconds: number | null
          event_type: string
          id: string
          interaction_data: Json | null
          lesson_id: string | null
          metadata: Json | null
          slide_id: string
          slide_title: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          attention_score?: number | null
          cognitive_load_indicator?: number | null
          completion_status?: string | null
          course_id: string
          duration_seconds?: number | null
          event_type: string
          id?: string
          interaction_data?: Json | null
          lesson_id?: string | null
          metadata?: Json | null
          slide_id: string
          slide_title?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          attention_score?: number | null
          cognitive_load_indicator?: number | null
          completion_status?: string | null
          course_id?: string
          duration_seconds?: number | null
          event_type?: string
          id?: string
          interaction_data?: Json | null
          lesson_id?: string | null
          metadata?: Json | null
          slide_id?: string
          slide_title?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      socratic_assessments: {
        Row: {
          assessment_type: string
          confidence_level: number | null
          created_at: string
          id: string
          misconceptions_identified: Json
          next_learning_targets: Json
          questions_asked: Json
          session_id: string | null
          skills_demonstrated: Json
          student_responses: Json
          topic_focus: string
          understanding_level: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assessment_type: string
          confidence_level?: number | null
          created_at?: string
          id?: string
          misconceptions_identified?: Json
          next_learning_targets?: Json
          questions_asked?: Json
          session_id?: string | null
          skills_demonstrated?: Json
          student_responses?: Json
          topic_focus: string
          understanding_level?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assessment_type?: string
          confidence_level?: number | null
          created_at?: string
          id?: string
          misconceptions_identified?: Json
          next_learning_targets?: Json
          questions_asked?: Json
          session_id?: string | null
          skills_demonstrated?: Json
          student_responses?: Json
          topic_focus?: string
          understanding_level?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "socratic_assessments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      socratic_questions: {
        Row: {
          cognitive_load_target: number | null
          created_at: string
          difficulty_level: number | null
          effectiveness_score: number | null
          id: string
          question_template: string
          strategy_type: string
          subject_areas: Json
          updated_at: string
          usage_count: number | null
        }
        Insert: {
          cognitive_load_target?: number | null
          created_at?: string
          difficulty_level?: number | null
          effectiveness_score?: number | null
          id?: string
          question_template: string
          strategy_type: string
          subject_areas?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Update: {
          cognitive_load_target?: number | null
          created_at?: string
          difficulty_level?: number | null
          effectiveness_score?: number | null
          id?: string
          question_template?: string
          strategy_type?: string
          subject_areas?: Json
          updated_at?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      socratic_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          current_question: string | null
          id: string
          nudge_count: number
          objective: string
          org_id: string | null
          rubric: Json
          score_history: number[]
          source: string | null
          started_at: string
          state: string
          topic: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          current_question?: string | null
          id?: string
          nudge_count?: number
          objective: string
          org_id?: string | null
          rubric?: Json
          score_history?: number[]
          source?: string | null
          started_at?: string
          state?: string
          topic: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          current_question?: string | null
          id?: string
          nudge_count?: number
          objective?: string
          org_id?: string | null
          rubric?: Json
          score_history?: number[]
          source?: string | null
          started_at?: string
          state?: string
          topic?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      socratic_turns: {
        Row: {
          content: string
          correct_part: string | null
          created_at: string
          id: string
          misconception: string | null
          role: string
          score: number | null
          session_id: string
          source: string | null
          tag: string | null
        }
        Insert: {
          content: string
          correct_part?: string | null
          created_at?: string
          id?: string
          misconception?: string | null
          role: string
          score?: number | null
          session_id: string
          source?: string | null
          tag?: string | null
        }
        Update: {
          content?: string
          correct_part?: string | null
          created_at?: string
          id?: string
          misconception?: string | null
          role?: string
          score?: number | null
          session_id?: string
          source?: string | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "socratic_turns_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "socratic_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      strategies: {
        Row: {
          ai_prompt: string | null
          created_at: string
          description: string | null
          duration_seconds: number | null
          icon: string | null
          id: string
          image_url: string | null
          label: string
          mini_game_type: string
          module_id: string
          steps_json: Json
        }
        Insert: {
          ai_prompt?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          icon?: string | null
          id: string
          image_url?: string | null
          label: string
          mini_game_type?: string
          module_id: string
          steps_json?: Json
        }
        Update: {
          ai_prompt?: string | null
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          icon?: string | null
          id?: string
          image_url?: string | null
          label?: string
          mini_game_type?: string
          module_id?: string
          steps_json?: Json
        }
        Relationships: []
      }
      streaks: {
        Row: {
          best_count: number
          created_at: string
          current_count: number
          id: string
          last_activity_date: string
          start_date: string
          streak_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          best_count?: number
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string
          start_date: string
          streak_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          best_count?: number
          created_at?: string
          current_count?: number
          id?: string
          last_activity_date?: string
          start_date?: string
          streak_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      student_activity_log: {
        Row: {
          activity_type: string
          created_at: string
          description: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          org_id: string
          session_id: string | null
          student_id: string
          user_agent: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          org_id: string
          session_id?: string | null
          student_id: string
          user_agent?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          org_id?: string
          session_id?: string | null
          student_id?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      student_attachments: {
        Row: {
          attachment_type: string
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          id: string
          is_public: boolean
          mime_type: string | null
          org_id: string
          student_id: string
          tags: string[] | null
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          attachment_type?: string
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          org_id: string
          student_id: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          attachment_type?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          id?: string
          is_public?: boolean
          mime_type?: string | null
          org_id?: string
          student_id?: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: []
      }
      student_course_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          completion_date: string | null
          course_id: string
          created_at: string
          due_date: string | null
          id: string
          last_accessed_at: string | null
          notes: string | null
          org_id: string
          progress_percentage: number | null
          source_id: string | null
          source_type: string | null
          status: string
          student_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          completion_date?: string | null
          course_id: string
          created_at?: string
          due_date?: string | null
          id?: string
          last_accessed_at?: string | null
          notes?: string | null
          org_id: string
          progress_percentage?: number | null
          source_id?: string | null
          source_type?: string | null
          status?: string
          student_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          completion_date?: string | null
          course_id?: string
          created_at?: string
          due_date?: string | null
          id?: string
          last_accessed_at?: string | null
          notes?: string | null
          org_id?: string
          progress_percentage?: number | null
          source_id?: string | null
          source_type?: string | null
          status?: string
          student_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          is_read: boolean
          message_type: string
          org_id: string
          parent_message_id: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          student_id: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          org_id: string
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          student_id: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          org_id?: string
          parent_message_id?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          student_id?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_notes: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          is_private: boolean
          note_type: string
          org_id: string
          priority: string
          student_id: string
          tags: string[] | null
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          is_private?: boolean
          note_type?: string
          org_id: string
          priority?: string
          student_id: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          is_private?: boolean
          note_type?: string
          org_id?: string
          priority?: string
          student_id?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      student_performance_metrics: {
        Row: {
          course_id: string | null
          created_at: string
          id: string
          max_value: number | null
          metric_name: string
          metric_type: string
          notes: string | null
          org_id: string
          period_end: string | null
          period_start: string | null
          recorded_by: string | null
          student_id: string
          unit: string | null
          updated_at: string
          value: number
        }
        Insert: {
          course_id?: string | null
          created_at?: string
          id?: string
          max_value?: number | null
          metric_name: string
          metric_type: string
          notes?: string | null
          org_id: string
          period_end?: string | null
          period_start?: string | null
          recorded_by?: string | null
          student_id: string
          unit?: string | null
          updated_at?: string
          value: number
        }
        Update: {
          course_id?: string | null
          created_at?: string
          id?: string
          max_value?: number | null
          metric_name?: string
          metric_type?: string
          notes?: string | null
          org_id?: string
          period_end?: string | null
          period_start?: string | null
          recorded_by?: string | null
          student_id?: string
          unit?: string | null
          updated_at?: string
          value?: number
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          adaptive_metrics: Json
          cognitive_load: Json
          created_at: string
          id: string
          knowledge_state: Json
          learning_style: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          adaptive_metrics?: Json
          cognitive_load?: Json
          created_at?: string
          id?: string
          knowledge_state?: Json
          learning_style?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          adaptive_metrics?: Json
          cognitive_load?: Json
          created_at?: string
          id?: string
          knowledge_state?: Json
          learning_style?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          created_at: string
          flashcard_ids: string[]
          id: string
          incorrect_answers: number | null
          session_duration_seconds: number | null
          session_type: string
          total_cards: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string
          flashcard_ids: string[]
          id?: string
          incorrect_answers?: number | null
          session_duration_seconds?: number | null
          session_type: string
          total_cards: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          created_at?: string
          flashcard_ids?: string[]
          id?: string
          incorrect_answers?: number | null
          session_duration_seconds?: number | null
          session_type?: string
          total_cards?: number
          user_id?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      synced_calendar_events: {
        Row: {
          calendar_id: string
          google_event_id: string
          id: string
          last_updated: string
          local_event_id: string
          local_event_type: string
          synced_at: string
          user_id: string
        }
        Insert: {
          calendar_id: string
          google_event_id: string
          id?: string
          last_updated?: string
          local_event_id: string
          local_event_type: string
          synced_at?: string
          user_id: string
        }
        Update: {
          calendar_id?: string
          google_event_id?: string
          id?: string
          last_updated?: string
          local_event_id?: string
          local_event_type?: string
          synced_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapy_notes: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          session_date: string
          therapist_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date: string
          therapist_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          session_date?: string
          therapist_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      threshold_audit_log: {
        Row: {
          action: string
          changes: Json
          id: string
          threshold_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          action: string
          changes?: Json
          id?: string
          threshold_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          action?: string
          changes?: Json
          id?: string
          threshold_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "threshold_audit_log_threshold_id_fkey"
            columns: ["threshold_id"]
            isOneToOne: false
            referencedRelation: "threshold_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      threshold_configs: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          lower_threshold: number
          metric_name: string
          risk_level: string
          status: string
          time_window: string
          updated_at: string
          upper_threshold: number
          user_segment: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          lower_threshold: number
          metric_name: string
          risk_level?: string
          status?: string
          time_window: string
          updated_at?: string
          upper_threshold: number
          user_segment?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          lower_threshold?: number
          metric_name?: string
          risk_level?: string
          status?: string
          time_window?: string
          updated_at?: string
          upper_threshold?: number
          user_segment?: string | null
        }
        Relationships: []
      }
      training_modules: {
        Row: {
          compliance_framework: string | null
          content_url: string | null
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number | null
          id: string
          mandatory: boolean
          module_name: string
          passing_score: number | null
          updated_at: string
        }
        Insert: {
          compliance_framework?: string | null
          content_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          mandatory?: boolean
          module_name: string
          passing_score?: number | null
          updated_at?: string
        }
        Update: {
          compliance_framework?: string | null
          content_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          mandatory?: boolean
          module_name?: string
          passing_score?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      uat_sessions: {
        Row: {
          completed_goals: Json
          feedback_submitted: boolean
          id: string
          last_activity: string
          session_goals: Json
          session_start: string
          user_id: string
        }
        Insert: {
          completed_goals?: Json
          feedback_submitted?: boolean
          id?: string
          last_activity?: string
          session_goals?: Json
          session_start?: string
          user_id: string
        }
        Update: {
          completed_goals?: Json
          feedback_submitted?: boolean
          id?: string
          last_activity?: string
          session_goals?: Json
          session_start?: string
          user_id?: string
        }
        Relationships: []
      }
      uat_testers: {
        Row: {
          created_at: string
          email: string
          id: string
          invited_by: string | null
          is_active: boolean
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          is_active?: boolean
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          is_active?: boolean
          role?: string
        }
        Relationships: []
      }
      usage_logs: {
        Row: {
          feature_type: string
          id: string
          metadata: Json | null
          timestamp: string
          usage_amount: number
          user_id: string
        }
        Insert: {
          feature_type: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          usage_amount?: number
          user_id: string
        }
        Update: {
          feature_type?: string
          id?: string
          metadata?: Json | null
          timestamp?: string
          usage_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      usage_quotas: {
        Row: {
          ai_chat_messages_limit: number
          ai_chat_messages_used: number
          ai_insights_limit: number
          ai_insights_used: number
          created_at: string
          document_processing_limit: number
          document_processing_used: number
          flashcard_generation_limit: number
          flashcard_generation_used: number
          id: string
          knowledge_base_storage_mb_limit: number
          knowledge_base_storage_mb_used: number
          period_end: string
          period_start: string
          rag_queries_limit: number
          rag_queries_used: number
          subscription_tier: string
          updated_at: string
          user_id: string
          voice_minutes_limit: number
          voice_minutes_used: number
        }
        Insert: {
          ai_chat_messages_limit?: number
          ai_chat_messages_used?: number
          ai_insights_limit?: number
          ai_insights_used?: number
          created_at?: string
          document_processing_limit?: number
          document_processing_used?: number
          flashcard_generation_limit?: number
          flashcard_generation_used?: number
          id?: string
          knowledge_base_storage_mb_limit?: number
          knowledge_base_storage_mb_used?: number
          period_end?: string
          period_start?: string
          rag_queries_limit?: number
          rag_queries_used?: number
          subscription_tier?: string
          updated_at?: string
          user_id: string
          voice_minutes_limit?: number
          voice_minutes_used?: number
        }
        Update: {
          ai_chat_messages_limit?: number
          ai_chat_messages_used?: number
          ai_insights_limit?: number
          ai_insights_used?: number
          created_at?: string
          document_processing_limit?: number
          document_processing_used?: number
          flashcard_generation_limit?: number
          flashcard_generation_used?: number
          id?: string
          knowledge_base_storage_mb_limit?: number
          knowledge_base_storage_mb_used?: number
          period_end?: string
          period_start?: string
          rag_queries_limit?: number
          rag_queries_used?: number
          subscription_tier?: string
          updated_at?: string
          user_id?: string
          voice_minutes_limit?: number
          voice_minutes_used?: number
        }
        Relationships: []
      }
      user_access_certifications: {
        Row: {
          certification_type: string
          created_at: string
          expiry_date: string
          id: string
          issued_date: string
          issuer: string | null
          last_access_review: string | null
          status: string
          training_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          certification_type: string
          created_at?: string
          expiry_date: string
          id?: string
          issued_date?: string
          issuer?: string | null
          last_access_review?: string | null
          status?: string
          training_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          certification_type?: string
          created_at?: string
          expiry_date?: string
          id?: string
          issued_date?: string
          issuer?: string | null
          last_access_review?: string | null
          status?: string
          training_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consent: {
        Row: {
          consent_type: string
          created_at: string
          granted_at: string | null
          id: string
          ip_address: unknown
          is_granted: boolean
          legal_basis: string | null
          purpose: string | null
          updated_at: string
          user_agent: string | null
          user_id: string
          withdrawn_at: string | null
        }
        Insert: {
          consent_type: string
          created_at?: string
          granted_at?: string | null
          id?: string
          ip_address?: unknown
          is_granted?: boolean
          legal_basis?: string | null
          purpose?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id: string
          withdrawn_at?: string | null
        }
        Update: {
          consent_type?: string
          created_at?: string
          granted_at?: string | null
          id?: string
          ip_address?: unknown
          is_granted?: boolean
          legal_basis?: string | null
          purpose?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      user_earned_badges: {
        Row: {
          ai_generated_image_url: string | null
          badge_description: string | null
          badge_label: string
          badge_type: string
          created_at: string
          earned_at: string
          earned_for_module_id: string | null
          id: string
          user_id: string
        }
        Insert: {
          ai_generated_image_url?: string | null
          badge_description?: string | null
          badge_label: string
          badge_type: string
          created_at?: string
          earned_at?: string
          earned_for_module_id?: string | null
          id?: string
          user_id: string
        }
        Update: {
          ai_generated_image_url?: string | null
          badge_description?: string | null
          badge_label?: string
          badge_type?: string
          created_at?: string
          earned_at?: string
          earned_for_module_id?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_feedback: {
        Row: {
          created_at: string
          description: string
          feedback_type: string
          id: string
          page_url: string | null
          resolved_at: string | null
          resolved_by: string | null
          screenshot_url: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          feedback_type: string
          id?: string
          page_url?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          screenshot_url?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          feedback_type?: string
          id?: string
          page_url?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          screenshot_url?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_invites: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          invite_token: string
          invited_email: string
          is_used: boolean
          metadata: Json
          org_id: string
          role: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          invite_token: string
          invited_email: string
          is_used?: boolean
          metadata?: Json
          org_id: string
          role: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          invite_token?: string
          invited_email?: string
          is_used?: boolean
          metadata?: Json
          org_id?: string
          role?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_invites_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_module_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_completed: boolean
          is_unlocked: boolean
          module_id: string
          progress_percentage: number
          unlocked_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          is_unlocked?: boolean
          module_id: string
          progress_percentage?: number
          unlocked_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_completed?: boolean
          is_unlocked?: boolean
          module_id?: string
          progress_percentage?: number
          unlocked_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          metadata: Json | null
          permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          metadata?: Json | null
          permission: Database["public"]["Enums"]["app_permission"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          metadata?: Json | null
          permission?: Database["public"]["Enums"]["app_permission"]
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          best_streak: number
          correct_answers: number
          created_at: string
          current_streak: number
          highest_level: number
          id: string
          last_mode: string
          total_answers: number
          total_coins: number
          total_playtime_minutes: number
          updated_at: string
          user_id: string
        }
        Insert: {
          best_streak?: number
          correct_answers?: number
          created_at?: string
          current_streak?: number
          highest_level?: number
          id?: string
          last_mode?: string
          total_answers?: number
          total_coins?: number
          total_playtime_minutes?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          best_streak?: number
          correct_answers?: number
          created_at?: string
          current_streak?: number
          highest_level?: number
          id?: string
          last_mode?: string
          total_answers?: number
          total_coins?: number
          total_playtime_minutes?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          id: string
          purchased_at: string
          shop_item_id: string
          user_id: string
          xp_spent: number
        }
        Insert: {
          id?: string
          purchased_at?: string
          shop_item_id: string
          user_id: string
          xp_spent: number
        }
        Update: {
          id?: string
          purchased_at?: string
          shop_item_id?: string
          user_id?: string
          xp_spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_shop_item_id_fkey"
            columns: ["shop_item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quest_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          progress: Json
          quest_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: Json
          quest_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          progress?: Json
          quest_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quest_progress_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_segments: {
        Row: {
          created_at: string
          criteria: Json
          description: string
          id: string
          name: string
          user_count: number
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description: string
          id?: string
          name: string
          user_count?: number
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string
          id?: string
          name?: string
          user_count?: number
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          animations_enabled: boolean
          created_at: string
          difficulty: string
          id: string
          sound_enabled: boolean
          theme: string
          tutorial_completed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          animations_enabled?: boolean
          created_at?: string
          difficulty?: string
          id?: string
          sound_enabled?: boolean
          theme?: string
          tutorial_completed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          animations_enabled?: boolean
          created_at?: string
          difficulty?: string
          id?: string
          sound_enabled?: boolean
          theme?: string
          tutorial_completed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_training_completions: {
        Row: {
          certificate_url: string | null
          completion_date: string
          created_at: string
          expires_at: string | null
          id: string
          passed: boolean
          score: number | null
          training_module_id: string
          user_id: string
        }
        Insert: {
          certificate_url?: string | null
          completion_date?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          passed?: boolean
          score?: number | null
          training_module_id: string
          user_id: string
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          passed?: boolean
          score?: number | null
          training_module_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_training_completions_training_module_id_fkey"
            columns: ["training_module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_uploaded_books: {
        Row: {
          created_at: string | null
          file_name: string
          file_url: string
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          updated_at: string | null
          uploaded_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_url: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          updated_at?: string | null
          uploaded_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_xp: {
        Row: {
          created_at: string
          id: string
          level: number
          next_level_xp: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          level?: number
          next_level_xp?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          next_level_xp?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      xp_events: {
        Row: {
          created_at: string
          event_type: string
          event_value: number
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          event_value?: number
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          event_value?: number
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      xp_events_new: {
        Row: {
          id: string
          metadata: Json | null
          occurred_at: string | null
          org_id: string | null
          points: number
          scope: string
          source: string
          user_id: string
        }
        Insert: {
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          org_id?: string | null
          points: number
          scope: string
          source: string
          user_id: string
        }
        Update: {
          id?: string
          metadata?: Json | null
          occurred_at?: string | null
          org_id?: string | null
          points?: number
          scope?: string
          source?: string
          user_id?: string
        }
        Relationships: []
      }
      y3_baseline_progress: {
        Row: {
          attempt_count: number | null
          correct: boolean | null
          created_at: string
          id: string
          item_id: string
          lesson_id: string
          response: string | null
          timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_count?: number | null
          correct?: boolean | null
          created_at?: string
          id?: string
          item_id: string
          lesson_id: string
          response?: string | null
          timestamp?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_count?: number | null
          correct?: boolean | null
          created_at?: string
          id?: string
          item_id?: string
          lesson_id?: string
          response?: string | null
          timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      y3_baseline_reflections: {
        Row: {
          answers_json: Json
          created_at: string
          id: string
          lesson_id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          answers_json?: Json
          created_at?: string
          id?: string
          lesson_id: string
          timestamp?: string
          user_id: string
        }
        Update: {
          answers_json?: Json
          created_at?: string
          id?: string
          lesson_id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      scorm_latest_attempt: {
        Row: {
          completion_status:
            | Database["public"]["Enums"]["completion_status_2004"]
            | null
          enrollment_id: string | null
          last_commit_at: string | null
          lesson_status: Database["public"]["Enums"]["lesson_status_12"] | null
          sco_id: string | null
          score_raw: number | null
          score_scaled: number | null
        }
        Relationships: [
          {
            foreignKeyName: "scorm_runtime_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scorm_runtime_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "scorm_learner_progress"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "scorm_runtime_sco_id_fkey"
            columns: ["sco_id"]
            isOneToOne: false
            referencedRelation: "scorm_scos"
            referencedColumns: ["id"]
          },
        ]
      }
      scorm_learner_progress: {
        Row: {
          avg_score: number | null
          completed_scos: number | null
          enrolled_at: string | null
          enrollment_id: string | null
          last_commit_at: string | null
          learner_name: string | null
          package_id: string | null
          package_title: string | null
          progress_percentage: number | null
          total_scos: number | null
          user_id: string | null
        }
        Relationships: []
      }
      scorm_package_metrics: {
        Row: {
          avg_score: number | null
          completion_rate: number | null
          completions: number | null
          created_at: string | null
          description: string | null
          enrollment_count: number | null
          id: string | null
          status: Database["public"]["Enums"]["package_status"] | null
          title: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      accept_invite: { Args: { p_code: string }; Returns: Json }
      activate_student_account: {
        Args: { p_full_name: string; p_pin_hash: string; p_token: string }
        Returns: {
          already_activated: boolean
          linked_user_id: string
          message: string
          org_id: string
          student_id: string
          success: boolean
        }[]
      }
      add_ai_credits: {
        Args: {
          p_amount: number
          p_metadata?: Json
          p_transaction_type: string
          p_user_id: string
        }
        Returns: Json
      }
      auth_is_admin: { Args: never; Returns: boolean }
      auto_publish_scheduled_posts: { Args: never; Returns: undefined }
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: {
          level: number
          next_level_xp: number
        }[]
      }
      check_rate_limit: {
        Args: {
          p_action_type: string
          p_limit?: number
          p_user_id: string
          p_window_seconds?: number
        }
        Returns: boolean
      }
      cleanup_expired_data: {
        Args: never
        Returns: {
          cleanup_date: string
          records_deleted: number
          table_name: string
        }[]
      }
      cleanup_expired_iep_sessions: { Args: never; Returns: undefined }
      cleanup_expired_invitations: {
        Args: never
        Returns: {
          cleanup_type: string
          deleted_count: number
          table_name: string
        }[]
      }
      create_data_subject_request: {
        Args: {
          p_data_categories?: string[]
          p_description?: string
          p_request_type: string
          p_user_id: string
        }
        Returns: string
      }
      create_lesson_analytics_for_enrollment: {
        Args: {
          p_completion_percentage: number
          p_course_id: string
          p_enrolled_at: string
          p_user_id: string
        }
        Returns: undefined
      }
      create_organization:
        | {
            Args: {
              p_name: string
              p_plan?: string
              p_slug: string
              p_user_id?: string
            }
            Returns: string
          }
        | {
            Args: { p_name: string; p_plan?: string; p_slug: string }
            Returns: string
          }
      create_organization_with_membership: {
        Args: {
          p_description?: string
          p_instructor_limit?: number
          p_logo_url?: string
          p_name: string
          p_plan?: string
          p_seat_cap?: number
          p_slug: string
          p_user_id?: string
        }
        Returns: string
      }
      current_user_has_admin_role: { Args: never; Returns: boolean }
      current_user_role: { Args: never; Returns: string }
      deduct_ai_credits: {
        Args: {
          p_amount: number
          p_metadata?: Json
          p_session_id?: string
          p_transaction_type: string
          p_user_id: string
        }
        Returns: Json
      }
      detect_security_incident: {
        Args: {
          p_affected_systems?: Json
          p_data_types_affected?: Json
          p_description: string
          p_incident_type: string
          p_severity_level?: string
        }
        Returns: string
      }
      extract_chat_topics: { Args: { session_id: string }; Returns: Json }
      generate_activation_token: { Args: never; Returns: string }
      generate_iep_invite_code: { Args: never; Returns: string }
      generate_invitation_code: { Args: never; Returns: string }
      generate_invitation_link: { Args: { org_id: string }; Returns: string }
      generate_scorm_package_slug: { Args: { title: string }; Returns: string }
      get_activity_heatmap: {
        Args: { days_back?: number; user_uuid: string }
        Returns: {
          activity_count: number
          activity_date: string
          hour_of_day: number
          total_duration_minutes: number
        }[]
      }
      get_admin_analytics: { Args: never; Returns: Json }
      get_ai_coach_learning_streak: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_ai_credits: { Args: { p_user_id: string }; Returns: number }
      get_analytics_by_role: {
        Args: { p_org_id?: string; p_scope?: string; p_time_range?: unknown }
        Returns: Json
      }
      get_analytics_kpis: { Args: never; Returns: Json }
      get_analytics_trends: {
        Args: { date_from?: string; date_to?: string; package_id?: string }
        Returns: {
          active_learners: number
          avg_score: number
          completion_rate: number
          date: string
          enrollments: number
        }[]
      }
      get_coach_activity_heatmap: {
        Args: { p_date_range?: string; p_user_id: string }
        Returns: Json
      }
      get_coach_dashboard_kpis: {
        Args: { p_date_range?: string; p_user_id: string }
        Returns: Json
      }
      get_coach_learning_time:
        | { Args: { p_source?: string; p_user_id: string }; Returns: number }
        | { Args: { p_user_id: string }; Returns: number }
      get_coach_mastery_over_time: {
        Args: { p_date_range?: string; p_user_id: string }
        Returns: Json
      }
      get_coach_mastery_score:
        | { Args: { p_user_id: string }; Returns: number }
        | { Args: { p_source?: string; p_user_id: string }; Returns: number }
      get_coach_mode_ratio:
        | { Args: { p_source?: string; p_user_id: string }; Returns: Json }
        | { Args: { p_user_id: string }; Returns: Json }
      get_coach_streak: { Args: { p_user_id: string }; Returns: number }
      get_coach_time_by_day: {
        Args: { p_date_range?: string; p_user_id: string }
        Returns: Json
      }
      get_coach_time_by_hour: {
        Args: { p_date_range?: string; p_user_id: string }
        Returns: Json
      }
      get_coach_topic_breakdown: {
        Args: { p_date_range?: string; p_user_id: string }
        Returns: Json
      }
      get_coach_topics:
        | { Args: { p_user_id: string }; Returns: string[] }
        | { Args: { p_source?: string; p_user_id: string }; Returns: string[] }
      get_completion_breakdown: {
        Args: never
        Returns: {
          count: number
          percentage: number
          status: string
        }[]
      }
      get_course_by_slug_with_drafts: {
        Args: { p_slug: string; p_user_id: string }
        Returns: {
          asset_path: string | null
          background_image: string
          content_component: string | null
          content_manifest: Json | null
          content_version: string | null
          course_visibility: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          discoverable: boolean | null
          duration_minutes: number | null
          featured: boolean | null
          framework_type: string | null
          grade_level_id: number | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          org_id: string | null
          organization_id: string | null
          price: number | null
          published_at: string | null
          sequence_order: number | null
          slug: string | null
          source: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "courses"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_course_enrollment_stats: {
        Args: never
        Returns: {
          completion_rate: number
          course_id: string
          course_title: string
          enrollment_count: number
        }[]
      }
      get_daily_active_users: {
        Args: { days_limit?: number }
        Returns: {
          active_users: number
          activity_date: string
        }[]
      }
      get_feature_usage_stats: { Args: { p_days_back?: number }; Returns: Json }
      get_global_avg_score: {
        Args: never
        Returns: {
          avg_score: number
        }[]
      }
      get_global_completion_rate: {
        Args: never
        Returns: {
          completion_rate: number
        }[]
      }
      get_iep_wizard_steps: { Args: { p_jurisdiction?: string }; Returns: Json }
      get_intent_accuracy_report: {
        Args: { p_days_back?: number }
        Returns: Json
      }
      get_nite_owl_effectiveness: {
        Args: { p_days_back?: number }
        Returns: Json
      }
      get_org_student_activity_heatmap: {
        Args: { p_org_id: string }
        Returns: {
          activity_status: string
          avatar_url: string
          current_lesson_id: string
          engagement_score: number
          last_activity_at: string
          progress_velocity: number
          student_email: string
          student_id: string
          student_name: string
          time_spent_today_minutes: number
        }[]
      }
      get_organization_analytics: { Args: { p_org_id: string }; Returns: Json }
      get_organization_leaderboard: {
        Args: never
        Returns: {
          avg_progress: number
          member_count: number
          org_id: string
          org_name: string
          total_enrollments: number
        }[]
      }
      get_organization_statistics: { Args: { p_org_id: string }; Returns: Json }
      get_package_avg_score: {
        Args: { date_from?: string; date_to?: string; package_id: string }
        Returns: {
          avg_score: number
        }[]
      }
      get_package_completion_stats: {
        Args: { date_from?: string; date_to?: string; package_id: string }
        Returns: {
          completion_rate: number
          completions: number
        }[]
      }
      get_phoenix_analytics: { Args: { p_user_id?: string }; Returns: Json }
      get_phoenix_performance_summary: {
        Args: { p_days_back?: number; p_user_id?: string }
        Returns: Json
      }
      get_preview_courses: {
        Args: { p_user_id: string }
        Returns: {
          asset_path: string | null
          background_image: string
          content_component: string | null
          content_manifest: Json | null
          content_version: string | null
          course_visibility: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          discoverable: boolean | null
          duration_minutes: number | null
          featured: boolean | null
          framework_type: string | null
          grade_level_id: number | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          org_id: string | null
          organization_id: string | null
          price: number | null
          published_at: string | null
          sequence_order: number | null
          slug: string | null
          source: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "courses"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_public_platform_metrics: { Args: never; Returns: Json }
      get_published_course_by_slug: {
        Args: { p_slug: string }
        Returns: {
          asset_path: string | null
          background_image: string
          content_component: string | null
          content_manifest: Json | null
          content_version: string | null
          course_visibility: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          discoverable: boolean | null
          duration_minutes: number | null
          featured: boolean | null
          framework_type: string | null
          grade_level_id: number | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          org_id: string | null
          organization_id: string | null
          price: number | null
          published_at: string | null
          sequence_order: number | null
          slug: string | null
          source: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "courses"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_published_courses: {
        Args: never
        Returns: {
          asset_path: string | null
          background_image: string
          content_component: string | null
          content_manifest: Json | null
          content_version: string | null
          course_visibility: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          discoverable: boolean | null
          duration_minutes: number | null
          featured: boolean | null
          framework_type: string | null
          grade_level_id: number | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          org_id: string | null
          organization_id: string | null
          price: number | null
          published_at: string | null
          sequence_order: number | null
          slug: string | null
          source: string | null
          status: string | null
          subject: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "courses"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_recommended_concepts: {
        Args: { p_limit?: number; p_user_id: string }
        Returns: {
          concept_id: string
          concept_name: string
          concept_slug: string
          difficulty_level: number
          domain: string
          reason: string
          recommendation_score: number
        }[]
      }
      get_related_posts: {
        Args: { p_limit?: number; p_post_id: string }
        Returns: {
          excerpt: string
          featured_image_url: string
          id: string
          published_at: string
          slug: string
          title: string
        }[]
      }
      get_relevant_memories: {
        Args: { p_days_back?: number; p_limit?: number; p_user_id: string }
        Returns: {
          content: string
          context: Json
          created_at: string
          days_ago: number
          id: string
          memory_type: string
          relevance_score: number
        }[]
      }
      get_student_analytics:
        | { Args: { p_org_id: string; p_student_id: string }; Returns: Json }
        | { Args: { p_user_id?: string }; Returns: Json }
      get_student_knowledge_pack: { Args: { p_user_id: string }; Returns: Json }
      get_time_spent_by_day: {
        Args: never
        Returns: {
          day_name: string
          total_hours: number
        }[]
      }
      get_user_entitlements: { Args: { p_user_id: string }; Returns: Json }
      get_user_frustration_report: {
        Args: { p_days_back?: number }
        Returns: Json
      }
      get_user_id_by_email: { Args: { user_email: string }; Returns: string }
      get_user_learning_path: {
        Args: { p_domain?: string; p_user_id: string }
        Returns: {
          concept_id: string
          concept_name: string
          concept_slug: string
          difficulty_level: number
          domain: string
          last_interaction: string
          mastery_level: number
          prerequisites: Json
          related_concepts: Json
          status: string
        }[]
      }
      get_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_subscription_status: {
        Args: { check_user_id?: string }
        Returns: string
      }
      has_permission: {
        Args: {
          _permission: Database["public"]["Enums"]["app_permission"]
          _user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_blog_post_views: {
        Args: { post_slug: string }
        Returns: {
          views_count: number
        }[]
      }
      initialize_student_profile: {
        Args: { p_user_id: string }
        Returns: string
      }
      initialize_user_quotas: {
        Args: { p_subscription_tier?: string; p_user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      is_admin_or_coach_user: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_org_member: {
        Args: { p_org_id: string; p_user_id: string }
        Returns: boolean
      }
      is_org_owner: {
        Args: { p_org_id: string; p_user_id: string }
        Returns: boolean
      }
      log_hipaa_access: {
        Args: {
          p_access_purpose?: string
          p_action_type: string
          p_patient_id?: string
          p_phi_accessed?: boolean
          p_resource_id?: string
          p_resource_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      mark_memory_referenced: {
        Args: { p_memory_id: string }
        Returns: undefined
      }
      mark_tour_complete: {
        Args: { p_org_id: string; p_tour_name: string; p_user_id: string }
        Returns: undefined
      }
      match_kb_documents: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          document_type: string
          id: string
          publication_date: string
          similarity: number
          source_name: string
        }[]
      }
      migrate_existing_scorm_lessons: { Args: never; Returns: undefined }
      org_change_plan: {
        Args: { p_org_id: string; p_plan: string }
        Returns: undefined
      }
      org_create_invite: {
        Args: {
          p_created_by?: string
          p_expires_interval?: string
          p_max_uses?: number
          p_org_id: string
          p_role: string
        }
        Returns: string
      }
      org_decrement_seats_if_needed: {
        Args: { p_org_id: string; p_role: string }
        Returns: undefined
      }
      org_increment_seats_if_needed: {
        Args: { p_org_id: string; p_role: string }
        Returns: undefined
      }
      org_seat_available: { Args: { p_org_id: string }; Returns: boolean }
      record_audit_event:
        | {
            Args: {
              p_action: string
              p_legal_basis?: string
              p_new_values?: Json
              p_old_values?: Json
              p_purpose?: string
              p_record_id?: string
              p_table_name: string
              p_user_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_action: string
              p_legal_basis?: string
              p_new_values?: Json
              p_old_values?: Json
              p_purpose?: string
              p_record_id?: string
              p_table_name: string
              p_user_id: string
            }
            Returns: undefined
          }
      reset_monthly_quotas: { Args: never; Returns: undefined }
      safe_table_count: { Args: { p_table_name: string }; Returns: number }
      scorm_commit_runtime: {
        Args: {
          p_analytics_data?: Json
          p_cmi_data: Json
          p_enrollment_id: string
          p_sco_id: string
        }
        Returns: Json
      }
      search_kb_embeddings: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          document_id: string
          similarity: number
        }[]
      }
      track_usage: {
        Args: {
          p_feature_type: string
          p_metadata?: Json
          p_usage_amount?: number
          p_user_id: string
        }
        Returns: boolean
      }
      user_can_access_org: {
        Args: { check_user_id: string; org_id: string }
        Returns: boolean
      }
      user_can_access_org_secure: {
        Args: { check_user_id?: string; org_id: string }
        Returns: boolean
      }
      user_exists_check: { Args: { user_id: string }; Returns: boolean }
      user_has_admin_role: { Args: never; Returns: boolean }
      user_has_org_role: {
        Args: { _org_id: string; _roles: string[]; _user_id: string }
        Returns: boolean
      }
      user_is_linked_to_student: {
        Args: { p_student_id: string }
        Returns: boolean
      }
      user_is_org_leader: {
        Args: { check_org_id: string; check_user_id: string }
        Returns: boolean
      }
      user_is_org_leader_safe: {
        Args: { check_org_id: string; check_user_id: string }
        Returns: boolean
      }
      user_is_org_member:
        | { Args: { org_id: string }; Returns: boolean }
        | { Args: { check_user_id: string; org_id: string }; Returns: boolean }
      user_is_org_member_direct: {
        Args: { check_user_id: string; org_id: string }
        Returns: boolean
      }
      user_is_org_member_safe: {
        Args: { check_user_id: string; org_id: string }
        Returns: boolean
      }
      user_is_org_owner: { Args: { org_id: string }; Returns: boolean }
      user_is_org_owner_direct: {
        Args: { check_user_id: string; org_id: string }
        Returns: boolean
      }
      user_org_role: {
        Args: { org_id: string }
        Returns: Database["public"]["Enums"]["member_role"]
      }
      validate_iep_invite: { Args: { p_code: string }; Returns: Json }
      validate_legal_basis: {
        Args: {
          p_data_categories: string[]
          p_processing_purpose: string
          p_user_id: string
        }
        Returns: Json
      }
      validate_org_invite: { Args: { code: string }; Returns: Json }
      validate_student_pin: {
        Args: { p_full_name: string; p_org_id: string; p_pin_hash: string }
        Returns: {
          is_valid: boolean
          linked_user_id: string
          student_id: string
        }[]
      }
      withdraw_user_consent: {
        Args: { p_consent_type: string; p_reason?: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_permission: "fpk_university_access" | "ai_coach_access"
      app_role: "admin" | "instructor" | "learner" | "ai_coach_user"
      completion_status_2004:
        | "not attempted"
        | "unknown"
        | "incomplete"
        | "completed"
      invitation_status: "pending" | "accepted" | "declined" | "expired"
      lesson_status_12:
        | "not attempted"
        | "browsed"
        | "incomplete"
        | "completed"
        | "passed"
        | "failed"
      member_role:
        | "owner"
        | "instructor"
        | "student"
        | "instructor_aide"
        | "viewer"
        | "admin"
      member_status: "active" | "paused" | "blocked" | "removed"
      message_intent:
        | "socratic_exploration"
        | "quick_question"
        | "story_request"
        | "frustrated_vent"
        | "video_assessment"
        | "general_chat"
        | "unclear"
        | "socratic_guidance"
        | "direct_answer"
        | "request_for_clarification"
        | "platform_question"
        | "query_user_data"
      note_visibility_scope:
        | "student-only"
        | "instructor-visible"
        | "org-public"
      org_subscription_tier: "basic" | "standard" | "premium" | "beta"
      package_status: "uploading" | "parsing" | "ready" | "error" | "archived"
      persona_type: "USER" | "BETTY" | "AL" | "CONDUCTOR" | "NITE_OWL"
      scorm_standard: "SCORM 1.2" | "SCORM 2004"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
        | "trialing"
      subscription_tier: "basic" | "pro" | "premium" | "free"
      success_status_2004: "unknown" | "passed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_permission: ["fpk_university_access", "ai_coach_access"],
      app_role: ["admin", "instructor", "learner", "ai_coach_user"],
      completion_status_2004: [
        "not attempted",
        "unknown",
        "incomplete",
        "completed",
      ],
      invitation_status: ["pending", "accepted", "declined", "expired"],
      lesson_status_12: [
        "not attempted",
        "browsed",
        "incomplete",
        "completed",
        "passed",
        "failed",
      ],
      member_role: [
        "owner",
        "instructor",
        "student",
        "instructor_aide",
        "viewer",
        "admin",
      ],
      member_status: ["active", "paused", "blocked", "removed"],
      message_intent: [
        "socratic_exploration",
        "quick_question",
        "story_request",
        "frustrated_vent",
        "video_assessment",
        "general_chat",
        "unclear",
        "socratic_guidance",
        "direct_answer",
        "request_for_clarification",
        "platform_question",
        "query_user_data",
      ],
      note_visibility_scope: [
        "student-only",
        "instructor-visible",
        "org-public",
      ],
      org_subscription_tier: ["basic", "standard", "premium", "beta"],
      package_status: ["uploading", "parsing", "ready", "error", "archived"],
      persona_type: ["USER", "BETTY", "AL", "CONDUCTOR", "NITE_OWL"],
      scorm_standard: ["SCORM 1.2", "SCORM 2004"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "incomplete",
        "trialing",
      ],
      subscription_tier: ["basic", "pro", "premium", "free"],
      success_status_2004: ["unknown", "passed", "failed"],
    },
  },
} as const
