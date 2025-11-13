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
      admin_audit_log: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_user_id: string
          created_at: string | null
          id: string
          ip_address: string | null
          target_user_id: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_user_id: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_impersonation_sessions: {
        Row: {
          admin_user_id: string
          created_at: string | null
          expires_at: string
          id: string
          is_active: boolean | null
          target_user_id: string
          token: string
        }
        Insert: {
          admin_user_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          is_active?: boolean | null
          target_user_id: string
          token: string
        }
        Update: {
          admin_user_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          is_active?: boolean | null
          target_user_id?: string
          token?: string
        }
        Relationships: []
      }
      ai_credit_balances: {
        Row: {
          created_at: string | null
          family_id: string
          id: string
          last_monthly_reset: string | null
          monthly_allowance: number
          monthly_credits: number
          purchased_credits: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          family_id: string
          id?: string
          last_monthly_reset?: string | null
          monthly_allowance?: number
          monthly_credits?: number
          purchased_credits?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          family_id?: string
          id?: string
          last_monthly_reset?: string | null
          monthly_allowance?: number
          monthly_credits?: number
          purchased_credits?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_credit_balances_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: true
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_credit_costs: {
        Row: {
          action_name: string
          action_type: string
          created_at: string | null
          credits_per_unit: number
          id: string
          is_active: boolean | null
          unit_description: string
          updated_at: string | null
        }
        Insert: {
          action_name: string
          action_type: string
          created_at?: string | null
          credits_per_unit: number
          id?: string
          is_active?: boolean | null
          unit_description: string
          updated_at?: string | null
        }
        Update: {
          action_name?: string
          action_type?: string
          created_at?: string | null
          credits_per_unit?: number
          id?: string
          is_active?: boolean | null
          unit_description?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_credit_ledger: {
        Row: {
          action_type: string
          balance_monthly_after: number
          balance_monthly_before: number
          balance_purchased_after: number
          balance_purchased_before: number
          created_at: string | null
          credits_changed: number
          family_id: string
          id: string
          metadata: Json | null
          transaction_date: string | null
        }
        Insert: {
          action_type: string
          balance_monthly_after: number
          balance_monthly_before: number
          balance_purchased_after: number
          balance_purchased_before: number
          created_at?: string | null
          credits_changed: number
          family_id: string
          id?: string
          metadata?: Json | null
          transaction_date?: string | null
        }
        Update: {
          action_type?: string
          balance_monthly_after?: number
          balance_monthly_before?: number
          balance_purchased_after?: number
          balance_purchased_before?: number
          created_at?: string | null
          credits_changed?: number
          family_id?: string
          id?: string
          metadata?: Json | null
          transaction_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_credit_ledger_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_insights: {
        Row: {
          confidence_score: number | null
          content: string
          document_id: string | null
          family_id: string
          generated_at: string | null
          id: string
          insight_type: string
          is_active: boolean | null
          priority: string | null
          student_id: string
          title: string | null
        }
        Insert: {
          confidence_score?: number | null
          content: string
          document_id?: string | null
          family_id: string
          generated_at?: string | null
          id?: string
          insight_type: string
          is_active?: boolean | null
          priority?: string | null
          student_id: string
          title?: string | null
        }
        Update: {
          confidence_score?: number | null
          content?: string
          document_id?: string | null
          family_id?: string
          generated_at?: string | null
          id?: string
          insight_type?: string
          is_active?: boolean | null
          priority?: string | null
          student_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_insights_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_insights_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_provider_health: {
        Row: {
          average_latency_ms: number | null
          consecutive_failures: number | null
          cooldown_until: string | null
          created_at: string | null
          id: string
          last_error_message: string | null
          last_failure_at: string | null
          last_success_at: string | null
          provider_name: string
          status: string
          total_failures: number | null
          total_requests: number | null
          total_successes: number | null
          updated_at: string | null
        }
        Insert: {
          average_latency_ms?: number | null
          consecutive_failures?: number | null
          cooldown_until?: string | null
          created_at?: string | null
          id?: string
          last_error_message?: string | null
          last_failure_at?: string | null
          last_success_at?: string | null
          provider_name: string
          status?: string
          total_failures?: number | null
          total_requests?: number | null
          total_successes?: number | null
          updated_at?: string | null
        }
        Update: {
          average_latency_ms?: number | null
          consecutive_failures?: number | null
          cooldown_until?: string | null
          created_at?: string | null
          id?: string
          last_error_message?: string | null
          last_failure_at?: string | null
          last_success_at?: string | null
          provider_name?: string
          status?: string
          total_failures?: number | null
          total_requests?: number | null
          total_successes?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      alacarte_purchases: {
        Row: {
          amount: number
          created_at: string | null
          family_id: string
          id: string
          metadata: Json | null
          purchase_type: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          family_id: string
          id?: string
          metadata?: Json | null
          purchase_type: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          family_id?: string
          id?: string
          metadata?: Json | null
          purchase_type?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alacarte_purchases_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_configurations: {
        Row: {
          created_at: string | null
          family_id: string
          heart_rate_duration_seconds: number | null
          heart_rate_threshold_percent: number | null
          id: string
          is_active: boolean | null
          stress_level_threshold: number | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          family_id: string
          heart_rate_duration_seconds?: number | null
          heart_rate_threshold_percent?: number | null
          id?: string
          is_active?: boolean | null
          stress_level_threshold?: number | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          family_id?: string
          heart_rate_duration_seconds?: number | null
          heart_rate_threshold_percent?: number | null
          id?: string
          is_active?: boolean | null
          stress_level_threshold?: number | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_configurations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alert_configurations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_checkpoints: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          data: Json | null
          document_id: string
          error_message: string | null
          family_id: string
          id: string
          phase: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          document_id: string
          error_message?: string | null
          family_id: string
          id?: string
          phase: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          data?: Json | null
          document_id?: string
          error_message?: string | null
          family_id?: string
          id?: string
          phase?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_checkpoints_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_checkpoints_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          failed_documents: number
          family_id: string
          id: string
          job_type: string
          metadata: Json | null
          processed_documents: number
          started_at: string | null
          status: string
          total_documents: number
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          failed_documents?: number
          family_id: string
          id?: string
          job_type?: string
          metadata?: Json | null
          processed_documents?: number
          started_at?: string | null
          status?: string
          total_documents?: number
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          failed_documents?: number
          family_id?: string
          id?: string
          job_type?: string
          metadata?: Json | null
          processed_documents?: number
          started_at?: string | null
          status?: string
          total_documents?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_jobs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_metrics: {
        Row: {
          id: string
          job_id: string | null
          metadata: Json | null
          metric_type: string
          metric_value: number
          timestamp: string | null
        }
        Insert: {
          id?: string
          job_id?: string | null
          metadata?: Json | null
          metric_type: string
          metric_value: number
          timestamp?: string | null
        }
        Update: {
          id?: string
          job_id?: string | null
          metadata?: Json | null
          metric_type?: string
          metric_value?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_metrics_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "analysis_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_queue: {
        Row: {
          completed_at: string | null
          created_at: string
          document_id: string
          error_message: string | null
          estimated_tokens: number | null
          family_id: string
          id: string
          job_id: string | null
          max_retries: number
          priority: number
          processing_time_ms: number | null
          retry_count: number
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          document_id: string
          error_message?: string | null
          estimated_tokens?: number | null
          family_id: string
          id?: string
          job_id?: string | null
          max_retries?: number
          priority?: number
          processing_time_ms?: number | null
          retry_count?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          document_id?: string
          error_message?: string | null
          estimated_tokens?: number | null
          family_id?: string
          id?: string
          job_id?: string | null
          max_retries?: number
          priority?: number
          processing_time_ms?: number | null
          retry_count?: number
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_queue_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_queue_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_queue_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "analysis_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      article_authors: {
        Row: {
          bio: string | null
          created_at: string | null
          credentials: string | null
          id: string
          linkedin_url: string | null
          name: string
          photo_url: string | null
          slug: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          credentials?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          slug: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          credentials?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          slug?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      article_categories: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          name: string
          parent_category_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name: string
          parent_category_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          name?: string
          parent_category_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      article_relationships: {
        Row: {
          article_id: string
          created_at: string | null
          related_article_id: string
          relationship_type: string | null
        }
        Insert: {
          article_id: string
          created_at?: string | null
          related_article_id: string
          relationship_type?: string | null
        }
        Update: {
          article_id?: string
          created_at?: string | null
          related_article_id?: string
          relationship_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_relationships_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_relationships_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      biometric_alerts: {
        Row: {
          alert_time: string | null
          alert_type: string
          baseline_value: number | null
          created_at: string | null
          family_id: string
          id: string
          notes: string | null
          resolved_at: string | null
          student_id: string
          trigger_value: number | null
        }
        Insert: {
          alert_time?: string | null
          alert_type: string
          baseline_value?: number | null
          created_at?: string | null
          family_id: string
          id?: string
          notes?: string | null
          resolved_at?: string | null
          student_id: string
          trigger_value?: number | null
        }
        Update: {
          alert_time?: string | null
          alert_type?: string
          baseline_value?: number | null
          created_at?: string | null
          family_id?: string
          id?: string
          notes?: string | null
          resolved_at?: string | null
          student_id?: string
          trigger_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "biometric_alerts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "biometric_alerts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          attendees: Json | null
          created_at: string | null
          end_time: string
          event_description: string | null
          event_title: string
          family_id: string
          id: string
          integration_id: string
          is_all_day: boolean | null
          location: string | null
          original_event_id: string
          provider: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          attendees?: Json | null
          created_at?: string | null
          end_time: string
          event_description?: string | null
          event_title: string
          family_id: string
          id?: string
          integration_id: string
          is_all_day?: boolean | null
          location?: string | null
          original_event_id: string
          provider: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          attendees?: Json | null
          created_at?: string | null
          end_time?: string
          event_description?: string | null
          event_title?: string
          family_id?: string
          id?: string
          integration_id?: string
          is_all_day?: boolean | null
          location?: string | null
          original_event_id?: string
          provider?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "external_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          created_by: string
          family_id: string
          id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          family_id: string
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          family_id?: string
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
          sources: Json | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
          sources?: Json | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
          sources?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_read_status: {
        Row: {
          discussion_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          discussion_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          discussion_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_read_status_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "team_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analysis_status: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_phase: string | null
          document_id: string
          document_name: string
          error_message: string | null
          family_id: string
          id: string
          insights_extracted: number | null
          job_id: string
          metrics_extracted: number | null
          progress_percent: number | null
          started_at: string | null
          status: string
          status_message: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_phase?: string | null
          document_id: string
          document_name: string
          error_message?: string | null
          family_id: string
          id?: string
          insights_extracted?: number | null
          job_id: string
          metrics_extracted?: number | null
          progress_percent?: number | null
          started_at?: string | null
          status?: string
          status_message?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_phase?: string | null
          document_id?: string
          document_name?: string
          error_message?: string | null
          family_id?: string
          id?: string
          insights_extracted?: number | null
          job_id?: string
          metrics_extracted?: number | null
          progress_percent?: number | null
          started_at?: string | null
          status?: string
          status_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analysis_status_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_analysis_status_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_analysis_status_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "analysis_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analysis_usage: {
        Row: {
          created_at: string | null
          documents_analyzed: number | null
          family_id: string
          id: string
          month_year: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          documents_analyzed?: number | null
          family_id: string
          id?: string
          month_year: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          documents_analyzed?: number | null
          family_id?: string
          id?: string
          month_year?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_analysis_usage_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      document_chart_mapping: {
        Row: {
          chart_identifier: string
          confidence_score: number | null
          created_at: string | null
          document_id: string
          family_id: string
          id: string
        }
        Insert: {
          chart_identifier: string
          confidence_score?: number | null
          created_at?: string | null
          document_id: string
          family_id: string
          id?: string
        }
        Update: {
          chart_identifier?: string
          confidence_score?: number | null
          created_at?: string | null
          document_id?: string
          family_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_chart_mapping_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_chart_mapping_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      document_comparisons: {
        Row: {
          comparison_summary: string | null
          document_id_a: string
          document_id_b: string
          family_id: string
          generated_at: string | null
          id: string
          student_id: string
        }
        Insert: {
          comparison_summary?: string | null
          document_id_a: string
          document_id_b: string
          family_id: string
          generated_at?: string | null
          id?: string
          student_id: string
        }
        Update: {
          comparison_summary?: string | null
          document_id_a?: string
          document_id_b?: string
          family_id?: string
          generated_at?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_comparisons_document_id_a_fkey"
            columns: ["document_id_a"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_comparisons_document_id_b_fkey"
            columns: ["document_id_b"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_comparisons_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_comparisons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      document_extraction_diagnostics: {
        Row: {
          ai_model_used: string | null
          charts_mapped: number | null
          chunk_index: number | null
          classification_method: string | null
          created_at: string | null
          document_id: string
          errors: Json | null
          extraction_method: string
          family_id: string
          id: string
          identified_type: string | null
          insights_generated: number | null
          metrics_extracted: number | null
          processing_time_ms: number | null
          progress_records: number | null
          quality_metrics: Json | null
          quality_score: string
          requires_manual_review: boolean | null
          retry_count: number | null
          text_length: number
          total_chunks: number | null
          type_confidence: number | null
          validation_passed: boolean
          validation_reason: string | null
          warnings: string[] | null
          word_count: number
        }
        Insert: {
          ai_model_used?: string | null
          charts_mapped?: number | null
          chunk_index?: number | null
          classification_method?: string | null
          created_at?: string | null
          document_id: string
          errors?: Json | null
          extraction_method: string
          family_id: string
          id?: string
          identified_type?: string | null
          insights_generated?: number | null
          metrics_extracted?: number | null
          processing_time_ms?: number | null
          progress_records?: number | null
          quality_metrics?: Json | null
          quality_score: string
          requires_manual_review?: boolean | null
          retry_count?: number | null
          text_length: number
          total_chunks?: number | null
          type_confidence?: number | null
          validation_passed: boolean
          validation_reason?: string | null
          warnings?: string[] | null
          word_count: number
        }
        Update: {
          ai_model_used?: string | null
          charts_mapped?: number | null
          chunk_index?: number | null
          classification_method?: string | null
          created_at?: string | null
          document_id?: string
          errors?: Json | null
          extraction_method?: string
          family_id?: string
          id?: string
          identified_type?: string | null
          insights_generated?: number | null
          metrics_extracted?: number | null
          processing_time_ms?: number | null
          progress_records?: number | null
          quality_metrics?: Json | null
          quality_score?: string
          requires_manual_review?: boolean | null
          retry_count?: number | null
          text_length?: number
          total_chunks?: number | null
          type_confidence?: number | null
          validation_passed?: boolean
          validation_reason?: string | null
          warnings?: string[] | null
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "document_extraction_diagnostics_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_extraction_diagnostics_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      document_metrics: {
        Row: {
          context: string | null
          created_at: string | null
          document_id: string | null
          duration_minutes: number | null
          end_time: string | null
          family_id: string
          id: string
          intervention_used: string | null
          measurement_date: string | null
          metric_name: string
          metric_type: string
          metric_unit: string | null
          metric_value: number | null
          start_time: string | null
          student_id: string
          target_value: number | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          document_id?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          family_id: string
          id?: string
          intervention_used?: string | null
          measurement_date?: string | null
          metric_name: string
          metric_type: string
          metric_unit?: string | null
          metric_value?: number | null
          start_time?: string | null
          student_id: string
          target_value?: number | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          document_id?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          family_id?: string
          id?: string
          intervention_used?: string | null
          measurement_date?: string | null
          metric_name?: string
          metric_type?: string
          metric_unit?: string | null
          metric_value?: number | null
          start_time?: string | null
          student_id?: string
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_metrics_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_metrics_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_metrics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      document_reports: {
        Row: {
          created_at: string
          document_ids: Json
          family_id: string
          focus_area: string | null
          generated_at: string
          generated_by: string | null
          id: string
          insights_count: number
          metrics_count: number
          progress_records_count: number
          report_content: string
          report_format: string | null
          student_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          document_ids: Json
          family_id: string
          focus_area?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          insights_count?: number
          metrics_count?: number
          progress_records_count?: number
          report_content: string
          report_format?: string | null
          student_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          document_ids?: Json
          family_id?: string
          focus_area?: string | null
          generated_at?: string
          generated_by?: string | null
          id?: string
          insights_count?: number
          metrics_count?: number
          progress_records_count?: number
          report_content?: string
          report_format?: string | null
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_reports_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: string | null
          created_at: string | null
          document_date: string | null
          extracted_content: string | null
          family_id: string
          file_name: string
          file_path: string
          file_size_kb: number | null
          file_type: string | null
          id: string
          last_analyzed_at: string | null
          metadata: Json | null
          student_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          document_date?: string | null
          extracted_content?: string | null
          family_id: string
          file_name: string
          file_path: string
          file_size_kb?: number | null
          file_type?: string | null
          id?: string
          last_analyzed_at?: string | null
          metadata?: Json | null
          student_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          document_date?: string | null
          extracted_content?: string | null
          family_id?: string
          file_name?: string
          file_path?: string
          file_size_kb?: number | null
          file_type?: string | null
          id?: string
          last_analyzed_at?: string | null
          metadata?: Json | null
          student_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      educator_logs: {
        Row: {
          accuracy_percentage: number | null
          activities_completed: string[] | null
          addressed_goal_ids: string[] | null
          air_quality_fetched_at: string | null
          aqi_european: number | null
          aqi_us: number | null
          areas_for_improvement: string | null
          attachments: Json | null
          behavioral_observations: string | null
          challenges: string | null
          co: number | null
          correct_responses: number | null
          created_at: string | null
          created_by: string
          educator_name: string
          educator_role: string | null
          engagement_level: string | null
          family_id: string
          goals_for_next_session: string | null
          id: string
          iep_goal_addressed: string | null
          lesson_topic: string | null
          log_date: string
          log_time: string | null
          log_type: string
          materials_used: string[] | null
          modifications_used: string[] | null
          next_steps: string | null
          no2: number | null
          o3: number | null
          parent_communication: string | null
          performance_level: string | null
          pm10: number | null
          pm25: number | null
          pollen_alder: number | null
          pollen_birch: number | null
          pollen_grass: number | null
          pollen_mugwort: number | null
          pollen_olive: number | null
          pollen_ragweed: number | null
          progress_notes: string | null
          prompting_level: string | null
          session_duration_minutes: number | null
          session_end_time: string | null
          session_start_time: string | null
          skills_practiced: string[] | null
          skills_worked_on: string[] | null
          so2: number | null
          strengths_observed: string | null
          student_id: string
          subject_area: string | null
          tags: string[] | null
          teaching_method: string | null
          total_attempts: number | null
          updated_at: string | null
          weather_condition: string | null
          weather_fetched_at: string | null
          weather_humidity: number | null
          weather_pressure_mb: number | null
          weather_temp_c: number | null
          weather_temp_f: number | null
          weather_wind_speed: number | null
        }
        Insert: {
          accuracy_percentage?: number | null
          activities_completed?: string[] | null
          addressed_goal_ids?: string[] | null
          air_quality_fetched_at?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          areas_for_improvement?: string | null
          attachments?: Json | null
          behavioral_observations?: string | null
          challenges?: string | null
          co?: number | null
          correct_responses?: number | null
          created_at?: string | null
          created_by: string
          educator_name: string
          educator_role?: string | null
          engagement_level?: string | null
          family_id: string
          goals_for_next_session?: string | null
          id?: string
          iep_goal_addressed?: string | null
          lesson_topic?: string | null
          log_date?: string
          log_time?: string | null
          log_type: string
          materials_used?: string[] | null
          modifications_used?: string[] | null
          next_steps?: string | null
          no2?: number | null
          o3?: number | null
          parent_communication?: string | null
          performance_level?: string | null
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          progress_notes?: string | null
          prompting_level?: string | null
          session_duration_minutes?: number | null
          session_end_time?: string | null
          session_start_time?: string | null
          skills_practiced?: string[] | null
          skills_worked_on?: string[] | null
          so2?: number | null
          strengths_observed?: string | null
          student_id: string
          subject_area?: string | null
          tags?: string[] | null
          teaching_method?: string | null
          total_attempts?: number | null
          updated_at?: string | null
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
        }
        Update: {
          accuracy_percentage?: number | null
          activities_completed?: string[] | null
          addressed_goal_ids?: string[] | null
          air_quality_fetched_at?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          areas_for_improvement?: string | null
          attachments?: Json | null
          behavioral_observations?: string | null
          challenges?: string | null
          co?: number | null
          correct_responses?: number | null
          created_at?: string | null
          created_by?: string
          educator_name?: string
          educator_role?: string | null
          engagement_level?: string | null
          family_id?: string
          goals_for_next_session?: string | null
          id?: string
          iep_goal_addressed?: string | null
          lesson_topic?: string | null
          log_date?: string
          log_time?: string | null
          log_type?: string
          materials_used?: string[] | null
          modifications_used?: string[] | null
          next_steps?: string | null
          no2?: number | null
          o3?: number | null
          parent_communication?: string | null
          performance_level?: string | null
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          progress_notes?: string | null
          prompting_level?: string | null
          session_duration_minutes?: number | null
          session_end_time?: string | null
          session_start_time?: string | null
          skills_practiced?: string[] | null
          skills_worked_on?: string[] | null
          so2?: number | null
          strengths_observed?: string | null
          student_id?: string
          subject_area?: string | null
          tags?: string[] | null
          teaching_method?: string | null
          total_attempts?: number | null
          updated_at?: string | null
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "educator_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educator_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      embedding_queue: {
        Row: {
          created_at: string | null
          error_message: string | null
          family_id: string
          id: string
          processed_at: string | null
          source_id: string
          source_table: string
          status: string | null
          student_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          family_id: string
          id?: string
          processed_at?: string | null
          source_id: string
          source_table: string
          status?: string | null
          student_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          family_id?: string
          id?: string
          processed_at?: string | null
          source_id?: string
          source_table?: string
          status?: string | null
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "embedding_queue_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "embedding_queue_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      external_integrations: {
        Row: {
          access_token: string | null
          created_at: string | null
          family_id: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          provider: string
          refresh_token: string | null
          status: string | null
          token_expires_at: string | null
          updated_at: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          family_id: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider: string
          refresh_token?: string | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          family_id?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          provider?: string
          refresh_token?: string | null
          status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_integrations_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      extraction_circuit_breaker: {
        Row: {
          consecutive_failures: number | null
          created_at: string | null
          disabled_until: string | null
          failure_count: number | null
          file_type: string
          id: string
          is_disabled: boolean | null
          last_failure_at: string | null
          last_success_at: string | null
          updated_at: string | null
        }
        Insert: {
          consecutive_failures?: number | null
          created_at?: string | null
          disabled_until?: string | null
          failure_count?: number | null
          file_type: string
          id?: string
          is_disabled?: boolean | null
          last_failure_at?: string | null
          last_success_at?: string | null
          updated_at?: string | null
        }
        Update: {
          consecutive_failures?: number | null
          created_at?: string | null
          disabled_until?: string | null
          failure_count?: number | null
          file_type?: string
          id?: string
          is_disabled?: boolean | null
          last_failure_at?: string | null
          last_success_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      extraction_queue: {
        Row: {
          attempted_models: string[] | null
          backoff_multiplier: number | null
          chunk_index: number | null
          completed_at: string | null
          created_at: string | null
          document_id: string
          error_message: string | null
          family_id: string
          id: string
          max_retries: number | null
          metadata: Json | null
          model_attempted: string | null
          next_retry_at: string | null
          priority: number | null
          retry_count: number | null
          started_at: string | null
          status: string
          total_chunks: number | null
        }
        Insert: {
          attempted_models?: string[] | null
          backoff_multiplier?: number | null
          chunk_index?: number | null
          completed_at?: string | null
          created_at?: string | null
          document_id: string
          error_message?: string | null
          family_id: string
          id?: string
          max_retries?: number | null
          metadata?: Json | null
          model_attempted?: string | null
          next_retry_at?: string | null
          priority?: number | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          total_chunks?: number | null
        }
        Update: {
          attempted_models?: string[] | null
          backoff_multiplier?: number | null
          chunk_index?: number | null
          completed_at?: string | null
          created_at?: string | null
          document_id?: string
          error_message?: string | null
          family_id?: string
          id?: string
          max_retries?: number | null
          metadata?: Json | null
          model_attempted?: string | null
          next_retry_at?: string | null
          priority?: number | null
          retry_count?: number | null
          started_at?: string | null
          status?: string
          total_chunks?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "extraction_queue_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      extraction_telemetry: {
        Row: {
          api_cost_estimate: number | null
          circuit_breaker_triggered: boolean | null
          created_at: string | null
          document_id: string | null
          error_message: string | null
          error_type: string | null
          extracted_length: number | null
          extraction_method: string
          extraction_time_ms: number | null
          family_id: string | null
          file_name: string
          file_size_kb: number
          file_type: string
          id: string
          model_used: string | null
          retry_count: number | null
          success: boolean
        }
        Insert: {
          api_cost_estimate?: number | null
          circuit_breaker_triggered?: boolean | null
          created_at?: string | null
          document_id?: string | null
          error_message?: string | null
          error_type?: string | null
          extracted_length?: number | null
          extraction_method: string
          extraction_time_ms?: number | null
          family_id?: string | null
          file_name: string
          file_size_kb: number
          file_type: string
          id?: string
          model_used?: string | null
          retry_count?: number | null
          success: boolean
        }
        Update: {
          api_cost_estimate?: number | null
          circuit_breaker_triggered?: boolean | null
          created_at?: string | null
          document_id?: string | null
          error_message?: string | null
          error_type?: string | null
          extracted_length?: number | null
          extraction_method?: string
          extraction_time_ms?: number | null
          family_id?: string | null
          file_name?: string
          file_size_kb?: number
          file_type?: string
          id?: string
          model_used?: string | null
          retry_count?: number | null
          success?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "extraction_telemetry_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "extraction_telemetry_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      families: {
        Row: {
          created_at: string | null
          created_by: string
          family_name: string
          id: string
          initial_doc_analysis_status: string | null
          max_students: number | null
          metadata: Json | null
          special_chart_trial_ends_at: string | null
          storage_limit_mb: number | null
          stripe_customer_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          suggested_charts_config: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          family_name: string
          id?: string
          initial_doc_analysis_status?: string | null
          max_students?: number | null
          metadata?: Json | null
          special_chart_trial_ends_at?: string | null
          storage_limit_mb?: number | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          suggested_charts_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          family_name?: string
          id?: string
          initial_doc_analysis_status?: string | null
          max_students?: number | null
          metadata?: Json | null
          special_chart_trial_ends_at?: string | null
          storage_limit_mb?: number | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          suggested_charts_config?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      family_dashboard_config: {
        Row: {
          created_at: string | null
          custom_metrics: Json | null
          family_id: string
          id: string
          section_order: Json | null
          updated_at: string | null
          visible_sections: Json | null
        }
        Insert: {
          created_at?: string | null
          custom_metrics?: Json | null
          family_id: string
          id?: string
          section_order?: Json | null
          updated_at?: string | null
          visible_sections?: Json | null
        }
        Update: {
          created_at?: string | null
          custom_metrics?: Json | null
          family_id?: string
          id?: string
          section_order?: Json | null
          updated_at?: string | null
          visible_sections?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "family_dashboard_config_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: true
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      family_data_embeddings: {
        Row: {
          chunk_text: string
          created_at: string | null
          embedding: string
          family_id: string
          id: string
          metadata: Json | null
          source_id: string
          source_table: string
          student_id: string | null
        }
        Insert: {
          chunk_text: string
          created_at?: string | null
          embedding: string
          family_id: string
          id?: string
          metadata?: Json | null
          source_id: string
          source_table: string
          student_id?: string | null
        }
        Update: {
          chunk_text?: string
          created_at?: string | null
          embedding?: string
          family_id?: string
          id?: string
          metadata?: Json | null
          source_id?: string
          source_table?: string
          student_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_data_embeddings_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_data_embeddings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          family_id: string
          id: string
          invited_by: string | null
          joined_at: string | null
          permissions: Json | null
          relationship_to_student: string | null
          role: string
          user_id: string
        }
        Insert: {
          family_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          permissions?: Json | null
          relationship_to_student?: string | null
          role: string
          user_id: string
        }
        Update: {
          family_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          permissions?: Json | null
          relationship_to_student?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_user_management_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "family_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          flag_key: string
          flag_name: string
          id: string
          is_enabled: boolean
          metadata: Json | null
          rollout_percentage: number | null
          target_users: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          flag_key: string
          flag_name: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          flag_key?: string
          flag_name?: string
          id?: string
          is_enabled?: boolean
          metadata?: Json | null
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          current_value: number | null
          family_id: string
          goal_description: string | null
          goal_title: string
          goal_type: string
          id: string
          is_active: boolean | null
          start_date: string | null
          student_id: string
          target_date: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          family_id: string
          goal_description?: string | null
          goal_title: string
          goal_type: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          student_id: string
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          family_id?: string
          goal_description?: string | null
          goal_title?: string
          goal_type?: string
          id?: string
          is_active?: boolean | null
          start_date?: string | null
          student_id?: string
          target_date?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_logs: {
        Row: {
          air_quality_fetched_at: string | null
          antecedent: string | null
          aqi_european: number | null
          aqi_us: number | null
          attachments: Json | null
          behavior_description: string
          co: number | null
          consequence: string | null
          created_at: string | null
          created_by: string
          duration_minutes: number | null
          environmental_factors: string[] | null
          family_id: string
          follow_up_notes: string | null
          follow_up_required: boolean | null
          id: string
          incident_date: string
          incident_time: string
          incident_type: string
          injuries: boolean | null
          injury_details: string | null
          intervention_used: string | null
          location: string
          no2: number | null
          notification_method: string | null
          o3: number | null
          parent_notified: boolean | null
          pm10: number | null
          pm25: number | null
          pollen_alder: number | null
          pollen_birch: number | null
          pollen_grass: number | null
          pollen_mugwort: number | null
          pollen_olive: number | null
          pollen_ragweed: number | null
          potential_triggers: Json | null
          reporter_name: string
          reporter_role: string
          severity: string
          so2: number | null
          student_id: string
          tags: string[] | null
          updated_at: string | null
          weather_condition: string | null
          weather_fetched_at: string | null
          weather_humidity: number | null
          weather_pressure_mb: number | null
          weather_temp_c: number | null
          weather_temp_f: number | null
          weather_wind_speed: number | null
          witnesses: string[] | null
        }
        Insert: {
          air_quality_fetched_at?: string | null
          antecedent?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          attachments?: Json | null
          behavior_description: string
          co?: number | null
          consequence?: string | null
          created_at?: string | null
          created_by: string
          duration_minutes?: number | null
          environmental_factors?: string[] | null
          family_id: string
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          incident_date: string
          incident_time: string
          incident_type: string
          injuries?: boolean | null
          injury_details?: string | null
          intervention_used?: string | null
          location: string
          no2?: number | null
          notification_method?: string | null
          o3?: number | null
          parent_notified?: boolean | null
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          potential_triggers?: Json | null
          reporter_name: string
          reporter_role: string
          severity: string
          so2?: number | null
          student_id: string
          tags?: string[] | null
          updated_at?: string | null
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
          witnesses?: string[] | null
        }
        Update: {
          air_quality_fetched_at?: string | null
          antecedent?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          attachments?: Json | null
          behavior_description?: string
          co?: number | null
          consequence?: string | null
          created_at?: string | null
          created_by?: string
          duration_minutes?: number | null
          environmental_factors?: string[] | null
          family_id?: string
          follow_up_notes?: string | null
          follow_up_required?: boolean | null
          id?: string
          incident_date?: string
          incident_time?: string
          incident_type?: string
          injuries?: boolean | null
          injury_details?: string | null
          intervention_used?: string | null
          location?: string
          no2?: number | null
          notification_method?: string | null
          o3?: number | null
          parent_notified?: boolean | null
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          potential_triggers?: Json | null
          reporter_name?: string
          reporter_role?: string
          severity?: string
          so2?: number | null
          student_id?: string
          tags?: string[] | null
          updated_at?: string | null
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
          witnesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "incident_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_errors: {
        Row: {
          error_message: string
          error_stack: string | null
          error_type: string
          family_id: string | null
          id: string
          job_id: string | null
          metadata: Json | null
          occurred_at: string | null
          source_url: string | null
        }
        Insert: {
          error_message: string
          error_stack?: string | null
          error_type: string
          family_id?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          occurred_at?: string | null
          source_url?: string | null
        }
        Update: {
          error_message?: string
          error_stack?: string | null
          error_type?: string
          family_id?: string | null
          id?: string
          job_id?: string | null
          metadata?: Json | null
          occurred_at?: string | null
          source_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_errors_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingestion_errors_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "ingestion_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      ingestion_jobs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          failed_documents: number | null
          family_id: string | null
          function_name: string
          id: string
          metadata: Json | null
          started_at: string | null
          status: string
          successful_documents: number | null
          total_documents: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          failed_documents?: number | null
          family_id?: string | null
          function_name: string
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          successful_documents?: number | null
          total_documents?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          failed_documents?: number | null
          family_id?: string | null
          function_name?: string
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          successful_documents?: number | null
          total_documents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ingestion_jobs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      intervention_outcomes: {
        Row: {
          created_at: string | null
          de_escalation_time_minutes: number | null
          family_id: string
          id: string
          incident_id: string
          intervention_name: string
          outcome_success: boolean
          student_id: string
        }
        Insert: {
          created_at?: string | null
          de_escalation_time_minutes?: number | null
          family_id: string
          id?: string
          incident_id: string
          intervention_name: string
          outcome_success: boolean
          student_id: string
        }
        Update: {
          created_at?: string | null
          de_escalation_time_minutes?: number | null
          family_id?: string
          id?: string
          incident_id?: string
          intervention_name?: string
          outcome_success?: boolean
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "intervention_outcomes_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_outcomes_incident_id_fkey"
            columns: ["incident_id"]
            isOneToOne: false
            referencedRelation: "incident_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "intervention_outcomes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      invites: {
        Row: {
          created_at: string | null
          expires_at: string | null
          family_id: string
          id: string
          invitee_email: string
          inviter_id: string
          role: string
          status: string
          token: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          family_id: string
          id?: string
          invitee_email: string
          inviter_id: string
          role: string
          status?: string
          token?: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          family_id?: string
          id?: string
          invitee_email?: string
          inviter_id?: string
          role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invites_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_chunks: {
        Row: {
          chunk_text: string
          created_at: string | null
          embedding: string
          family_id: string | null
          id: string
          kb_id: string
          token_count: number | null
        }
        Insert: {
          chunk_text: string
          created_at?: string | null
          embedding: string
          family_id?: string | null
          id?: string
          kb_id: string
          token_count?: number | null
        }
        Update: {
          chunk_text?: string
          created_at?: string | null
          embedding?: string
          family_id?: string | null
          id?: string
          kb_id?: string
          token_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_chunks_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_chunks_kb_id_fkey"
            columns: ["kb_id"]
            isOneToOne: false
            referencedRelation: "knowledge_base"
            referencedColumns: ["id"]
          },
        ]
      }
      knowledge_base: {
        Row: {
          created_at: string | null
          document_type: string
          family_id: string | null
          focus_areas: string[] | null
          id: string
          keywords: string[] | null
          publication_date: string | null
          source_name: string
          source_url: string | null
          summary: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          family_id?: string | null
          focus_areas?: string[] | null
          id?: string
          keywords?: string[] | null
          publication_date?: string | null
          source_name: string
          source_url?: string | null
          summary?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          family_id?: string | null
          focus_areas?: string[] | null
          id?: string
          keywords?: string[] | null
          publication_date?: string | null
          source_name?: string
          source_url?: string | null
          summary?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "knowledge_base_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          reference_id: string | null
          reference_table: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          reference_id?: string | null
          reference_table?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          reference_id?: string | null
          reference_table?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          id: string
          invitee_email: string
          inviter_id: string
          organization_id: string
          role: string
          status: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invitee_email: string
          inviter_id: string
          organization_id: string
          role: string
          status?: string
          token?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invitee_email?: string
          inviter_id?: string
          organization_id?: string
          role?: string
          status?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          caseload_student_ids: string[] | null
          department: string | null
          id: string
          invited_by: string | null
          is_active: boolean
          job_title: string | null
          joined_at: string
          organization_id: string
          permissions: Json | null
          role: string
          user_id: string
        }
        Insert: {
          caseload_student_ids?: string[] | null
          department?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean
          job_title?: string | null
          joined_at?: string
          organization_id: string
          permissions?: Json | null
          role: string
          user_id: string
        }
        Update: {
          caseload_student_ids?: string[] | null
          department?: string | null
          id?: string
          invited_by?: string | null
          is_active?: boolean
          job_title?: string | null
          joined_at?: string
          organization_id?: string
          permissions?: Json | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          billing_email: string | null
          city: string | null
          country: string | null
          created_at: string
          created_by: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          max_staff: number | null
          max_students: number | null
          org_name: string
          org_type: string
          phone: string | null
          postal_code: string | null
          state: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_tier: string
          updated_at: string
          website: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          billing_email?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          max_staff?: number | null
          max_students?: number | null
          org_name: string
          org_type: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          billing_email?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          max_staff?: number | null
          max_students?: number | null
          org_name?: string
          org_type?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_tier?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      parent_logs: {
        Row: {
          activity_type: string
          air_quality_fetched_at: string | null
          aqi_european: number | null
          aqi_us: number | null
          attachments: Json | null
          challenges: string | null
          co: number | null
          communication_attempts: string | null
          created_at: string | null
          created_by: string
          duration_minutes: number | null
          family_id: string
          id: string
          location: string
          log_date: string
          log_time: string
          mood: string | null
          no2: number | null
          notes: string | null
          o3: number | null
          observation: string
          pm10: number | null
          pm25: number | null
          pollen_alder: number | null
          pollen_birch: number | null
          pollen_grass: number | null
          pollen_mugwort: number | null
          pollen_olive: number | null
          pollen_ragweed: number | null
          reporter_name: string
          sensory_factors: string[] | null
          so2: number | null
          strategies_used: string | null
          student_id: string
          successes: string | null
          tags: string[] | null
          updated_at: string | null
          weather_condition: string | null
          weather_fetched_at: string | null
          weather_humidity: number | null
          weather_pressure_mb: number | null
          weather_temp_c: number | null
          weather_temp_f: number | null
          weather_wind_speed: number | null
        }
        Insert: {
          activity_type: string
          air_quality_fetched_at?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          attachments?: Json | null
          challenges?: string | null
          co?: number | null
          communication_attempts?: string | null
          created_at?: string | null
          created_by: string
          duration_minutes?: number | null
          family_id: string
          id?: string
          location: string
          log_date: string
          log_time: string
          mood?: string | null
          no2?: number | null
          notes?: string | null
          o3?: number | null
          observation: string
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          reporter_name: string
          sensory_factors?: string[] | null
          so2?: number | null
          strategies_used?: string | null
          student_id: string
          successes?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
        }
        Update: {
          activity_type?: string
          air_quality_fetched_at?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          attachments?: Json | null
          challenges?: string | null
          co?: number | null
          communication_attempts?: string | null
          created_at?: string | null
          created_by?: string
          duration_minutes?: number | null
          family_id?: string
          id?: string
          location?: string
          log_date?: string
          log_time?: string
          mood?: string | null
          no2?: number | null
          notes?: string | null
          o3?: number | null
          observation?: string
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          reporter_name?: string
          sensory_factors?: string[] | null
          so2?: number | null
          strategies_used?: string | null
          student_id?: string
          successes?: string | null
          tags?: string[] | null
          updated_at?: string | null
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_logs_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          full_name: string | null
          has_completed_profile_setup: boolean | null
          id: string
          organization_name: string | null
          phone: string | null
          professional_title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          has_completed_profile_setup?: boolean | null
          id: string
          organization_name?: string | null
          phone?: string | null
          professional_title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          full_name?: string | null
          has_completed_profile_setup?: boolean | null
          id?: string
          organization_name?: string | null
          phone?: string | null
          professional_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_metrics: {
        Row: {
          created_at: string | null
          educator_log_id: string | null
          family_id: string
          id: string
          metric_category: string
          metric_date: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          notes: string | null
          student_id: string
          target_value: number | null
        }
        Insert: {
          created_at?: string | null
          educator_log_id?: string | null
          family_id: string
          id?: string
          metric_category: string
          metric_date?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          notes?: string | null
          student_id: string
          target_value?: number | null
        }
        Update: {
          created_at?: string | null
          educator_log_id?: string | null
          family_id?: string
          id?: string
          metric_category?: string
          metric_date?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          notes?: string | null
          student_id?: string
          target_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_metrics_educator_log_id_fkey"
            columns: ["educator_log_id"]
            isOneToOne: false
            referencedRelation: "educator_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_metrics_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_metrics_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      progress_tracking: {
        Row: {
          baseline_value: number | null
          created_at: string | null
          current_value: number | null
          document_id: string | null
          family_id: string
          id: string
          metric_type: string
          notes: string | null
          period_end: string | null
          period_start: string | null
          progress_percentage: number | null
          student_id: string
          target_value: number | null
          trend: string | null
        }
        Insert: {
          baseline_value?: number | null
          created_at?: string | null
          current_value?: number | null
          document_id?: string | null
          family_id: string
          id?: string
          metric_type: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          progress_percentage?: number | null
          student_id: string
          target_value?: number | null
          trend?: string | null
        }
        Update: {
          baseline_value?: number | null
          created_at?: string | null
          current_value?: number | null
          document_id?: string | null
          family_id?: string
          id?: string
          metric_type?: string
          notes?: string | null
          period_end?: string | null
          period_start?: string | null
          progress_percentage?: number | null
          student_id?: string
          target_value?: number | null
          trend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progress_tracking_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_tracking_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_tracking_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      public_articles: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          created_at: string | null
          description: string | null
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          pillar_page_id: string | null
          published_at: string | null
          reading_time_minutes: number | null
          schema_type: string | null
          slug: string
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content: string
          created_at?: string | null
          description?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          pillar_page_id?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          schema_type?: string | null
          slug: string
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          created_at?: string | null
          description?: string | null
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          pillar_page_id?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          schema_type?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "article_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "article_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_articles_pillar_page_id_fkey"
            columns: ["pillar_page_id"]
            isOneToOne: false
            referencedRelation: "public_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_records: {
        Row: {
          air_quality_fetched_at: string | null
          aqi_european: number | null
          aqi_us: number | null
          asleep_location: string | null
          bedtime: string
          co: number | null
          created_at: string | null
          created_by: string
          daytime_fatigue_level: number | null
          daytime_medication_details: string | null
          daytime_medication_taken: boolean | null
          daytime_notes: string | null
          disturbance_details: string | null
          disturbances: string[] | null
          family_id: string
          fell_asleep_in_school: boolean | null
          fell_asleep_time: string | null
          id: string
          medication_details: string | null
          nap_duration_minutes: number | null
          nap_end_time: string | null
          nap_start_time: string | null
          nap_taken: boolean | null
          nap_time: string | null
          nighttime_awakenings: number | null
          no2: number | null
          notes: string | null
          o3: number | null
          pm10: number | null
          pm25: number | null
          pollen_alder: number | null
          pollen_birch: number | null
          pollen_grass: number | null
          pollen_mugwort: number | null
          pollen_olive: number | null
          pollen_ragweed: number | null
          pre_bed_activities: string[] | null
          sleep_date: string
          sleep_disturbances: string[] | null
          sleep_medication: boolean | null
          sleep_quality_rating: number | null
          so2: number | null
          student_id: string
          total_sleep_hours: number | null
          updated_at: string | null
          wake_time: string
          weather_condition: string | null
          weather_fetched_at: string | null
          weather_humidity: number | null
          weather_pressure_mb: number | null
          weather_temp_c: number | null
          weather_temp_f: number | null
          weather_wind_speed: number | null
        }
        Insert: {
          air_quality_fetched_at?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          asleep_location?: string | null
          bedtime: string
          co?: number | null
          created_at?: string | null
          created_by: string
          daytime_fatigue_level?: number | null
          daytime_medication_details?: string | null
          daytime_medication_taken?: boolean | null
          daytime_notes?: string | null
          disturbance_details?: string | null
          disturbances?: string[] | null
          family_id: string
          fell_asleep_in_school?: boolean | null
          fell_asleep_time?: string | null
          id?: string
          medication_details?: string | null
          nap_duration_minutes?: number | null
          nap_end_time?: string | null
          nap_start_time?: string | null
          nap_taken?: boolean | null
          nap_time?: string | null
          nighttime_awakenings?: number | null
          no2?: number | null
          notes?: string | null
          o3?: number | null
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          pre_bed_activities?: string[] | null
          sleep_date: string
          sleep_disturbances?: string[] | null
          sleep_medication?: boolean | null
          sleep_quality_rating?: number | null
          so2?: number | null
          student_id: string
          total_sleep_hours?: number | null
          updated_at?: string | null
          wake_time: string
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
        }
        Update: {
          air_quality_fetched_at?: string | null
          aqi_european?: number | null
          aqi_us?: number | null
          asleep_location?: string | null
          bedtime?: string
          co?: number | null
          created_at?: string | null
          created_by?: string
          daytime_fatigue_level?: number | null
          daytime_medication_details?: string | null
          daytime_medication_taken?: boolean | null
          daytime_notes?: string | null
          disturbance_details?: string | null
          disturbances?: string[] | null
          family_id?: string
          fell_asleep_in_school?: boolean | null
          fell_asleep_time?: string | null
          id?: string
          medication_details?: string | null
          nap_duration_minutes?: number | null
          nap_end_time?: string | null
          nap_start_time?: string | null
          nap_taken?: boolean | null
          nap_time?: string | null
          nighttime_awakenings?: number | null
          no2?: number | null
          notes?: string | null
          o3?: number | null
          pm10?: number | null
          pm25?: number | null
          pollen_alder?: number | null
          pollen_birch?: number | null
          pollen_grass?: number | null
          pollen_mugwort?: number | null
          pollen_olive?: number | null
          pollen_ragweed?: number | null
          pre_bed_activities?: string[] | null
          sleep_date?: string
          sleep_disturbances?: string[] | null
          sleep_medication?: boolean | null
          sleep_quality_rating?: number | null
          so2?: number | null
          student_id?: string
          total_sleep_hours?: number | null
          updated_at?: string | null
          wake_time?: string
          weather_condition?: string | null
          weather_fetched_at?: string | null
          weather_humidity?: number | null
          weather_pressure_mb?: number | null
          weather_temp_c?: number | null
          weather_temp_f?: number | null
          weather_wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sleep_records_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sleep_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          added_by_org_member_id: string | null
          created_at: string | null
          date_of_birth: string
          family_id: string
          grade_level: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          organization_id: string | null
          personal_notes: string | null
          photo_url: string | null
          primary_diagnosis: string[] | null
          profile_image_url: string | null
          school_name: string | null
          secondary_conditions: string[] | null
          student_name: string
          updated_at: string | null
        }
        Insert: {
          added_by_org_member_id?: string | null
          created_at?: string | null
          date_of_birth: string
          family_id: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          organization_id?: string | null
          personal_notes?: string | null
          photo_url?: string | null
          primary_diagnosis?: string[] | null
          profile_image_url?: string | null
          school_name?: string | null
          secondary_conditions?: string[] | null
          student_name: string
          updated_at?: string | null
        }
        Update: {
          added_by_org_member_id?: string | null
          created_at?: string | null
          date_of_birth?: string
          family_id?: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          organization_id?: string | null
          personal_notes?: string | null
          photo_url?: string | null
          primary_diagnosis?: string[] | null
          profile_image_url?: string | null
          school_name?: string | null
          secondary_conditions?: string[] | null
          student_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_added_by_org_member_id_fkey"
            columns: ["added_by_org_member_id"]
            isOneToOne: false
            referencedRelation: "organization_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_error_log: {
        Row: {
          context_data: Json | null
          created_at: string
          error_code: string | null
          error_message: string
          error_type: string
          family_id: string | null
          id: string
          ip_address: string | null
          stack_trace: string | null
          user_action: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string
          error_code?: string | null
          error_message: string
          error_type: string
          family_id?: string | null
          id?: string
          ip_address?: string | null
          stack_trace?: string | null
          user_action: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string
          error_code?: string | null
          error_message?: string
          error_type?: string
          family_id?: string | null
          id?: string
          ip_address?: string | null
          stack_trace?: string | null
          user_action?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_error_log_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
      }
      team_discussion_notifications: {
        Row: {
          actor_user_id: string
          created_at: string | null
          discussion_id: string
          entity_id: string
          entity_type: string
          id: string
          is_read: boolean | null
          notification_type: string
          read_at: string | null
          recipient_user_id: string
        }
        Insert: {
          actor_user_id: string
          created_at?: string | null
          discussion_id: string
          entity_id: string
          entity_type: string
          id?: string
          is_read?: boolean | null
          notification_type: string
          read_at?: string | null
          recipient_user_id: string
        }
        Update: {
          actor_user_id?: string
          created_at?: string | null
          discussion_id?: string
          entity_id?: string
          entity_type?: string
          id?: string
          is_read?: boolean | null
          notification_type?: string
          read_at?: string | null
          recipient_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_discussion_notifications_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "team_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      team_discussions: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          deleted_at: string | null
          edited_at: string | null
          entity_id: string
          entity_type: string
          family_id: string
          id: string
          is_pinned: boolean | null
          mentioned_user_ids: string[] | null
          parent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          entity_id: string
          entity_type: string
          family_id: string
          id?: string
          is_pinned?: boolean | null
          mentioned_user_ids?: string[] | null
          parent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          deleted_at?: string | null
          edited_at?: string | null
          entity_id?: string
          entity_type?: string
          family_id?: string
          id?: string
          is_pinned?: boolean | null
          mentioned_user_ids?: string[] | null
          parent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_discussions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_discussions_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "team_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_account_status: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          modified_at: string | null
          modified_by: string | null
          status: string
          status_reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          modified_at?: string | null
          modified_by?: string | null
          status: string
          status_reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          modified_at?: string | null
          modified_by?: string | null
          status?: string
          status_reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_chart_layouts: {
        Row: {
          created_at: string | null
          family_id: string
          id: string
          layout: Json
          student_id: string | null
          tab_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          family_id: string
          id?: string
          layout: Json
          student_id?: string | null
          tab_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          family_id?: string
          id?: string
          layout?: Json
          student_id?: string | null
          tab_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_chart_layouts_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_chart_layouts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      user_feature_overrides: {
        Row: {
          created_at: string | null
          flag_key: string
          id: string
          is_enabled: boolean
          user_id: string
        }
        Insert: {
          created_at?: string | null
          flag_key: string
          id?: string
          is_enabled: boolean
          user_id: string
        }
        Update: {
          created_at?: string | null
          flag_key?: string
          id?: string
          is_enabled?: boolean
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tour_progress: {
        Row: {
          created_at: string | null
          has_seen_activities_tour: boolean | null
          has_seen_analytics_tour: boolean | null
          has_seen_dashboard_tour: boolean | null
          has_seen_documents_tour: boolean | null
          has_seen_goals_tour: boolean | null
          has_seen_settings_tour: boolean | null
          id: string
          reset_all_tours: boolean | null
          tours_disabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          has_seen_activities_tour?: boolean | null
          has_seen_analytics_tour?: boolean | null
          has_seen_dashboard_tour?: boolean | null
          has_seen_documents_tour?: boolean | null
          has_seen_goals_tour?: boolean | null
          has_seen_settings_tour?: boolean | null
          id?: string
          reset_all_tours?: boolean | null
          tours_disabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          has_seen_activities_tour?: boolean | null
          has_seen_analytics_tour?: boolean | null
          has_seen_dashboard_tour?: boolean | null
          has_seen_documents_tour?: boolean | null
          has_seen_goals_tour?: boolean | null
          has_seen_settings_tour?: boolean | null
          id?: string
          reset_all_tours?: boolean | null
          tours_disabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      v3_documents: {
        Row: {
          analysis_summary: Json | null
          category: Database["public"]["Enums"]["document_category_enum"] | null
          classified_at: string | null
          classified_by: string | null
          created_at: string | null
          error_message: string | null
          extracted_content: string | null
          family_id: string
          file_name: string
          file_path: string
          file_size_kb: number | null
          id: string
          is_classified: boolean
          status: string
          student_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          analysis_summary?: Json | null
          category?:
            | Database["public"]["Enums"]["document_category_enum"]
            | null
          classified_at?: string | null
          classified_by?: string | null
          created_at?: string | null
          error_message?: string | null
          extracted_content?: string | null
          family_id: string
          file_name: string
          file_path: string
          file_size_kb?: number | null
          id?: string
          is_classified?: boolean
          status?: string
          student_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          analysis_summary?: Json | null
          category?:
            | Database["public"]["Enums"]["document_category_enum"]
            | null
          classified_at?: string | null
          classified_by?: string | null
          created_at?: string | null
          error_message?: string | null
          extracted_content?: string | null
          family_id?: string
          file_name?: string
          file_path?: string
          file_size_kb?: number | null
          id?: string
          is_classified?: boolean
          status?: string
          student_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "v3_documents_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "v3_documents_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      wearable_sleep_data: {
        Row: {
          avg_heart_rate: number | null
          avg_respiration_rate: number | null
          avg_spo2: number | null
          awake_seconds: number | null
          created_at: string | null
          deep_sleep_seconds: number | null
          family_id: string
          id: string
          light_sleep_seconds: number | null
          raw_data: Json | null
          rem_sleep_seconds: number | null
          restlessness_score: number | null
          sleep_date: string
          sleep_end_time: string | null
          sleep_score: number | null
          sleep_start_time: string | null
          student_id: string
        }
        Insert: {
          avg_heart_rate?: number | null
          avg_respiration_rate?: number | null
          avg_spo2?: number | null
          awake_seconds?: number | null
          created_at?: string | null
          deep_sleep_seconds?: number | null
          family_id: string
          id?: string
          light_sleep_seconds?: number | null
          raw_data?: Json | null
          rem_sleep_seconds?: number | null
          restlessness_score?: number | null
          sleep_date: string
          sleep_end_time?: string | null
          sleep_score?: number | null
          sleep_start_time?: string | null
          student_id: string
        }
        Update: {
          avg_heart_rate?: number | null
          avg_respiration_rate?: number | null
          avg_spo2?: number | null
          awake_seconds?: number | null
          created_at?: string | null
          deep_sleep_seconds?: number | null
          family_id?: string
          id?: string
          light_sleep_seconds?: number | null
          raw_data?: Json | null
          rem_sleep_seconds?: number | null
          restlessness_score?: number | null
          sleep_date?: string
          sleep_end_time?: string | null
          sleep_score?: number | null
          sleep_start_time?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wearable_sleep_data_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wearable_sleep_data_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_completions: {
        Row: {
          completed_at: string
          created_at: string
          family_id: string
          generated_report: Json
          id: string
          pdf_url: string | null
          session_id: string
          student_id: string
          wizard_type: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          family_id: string
          generated_report: Json
          id?: string
          pdf_url?: string | null
          session_id: string
          student_id: string
          wizard_type: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          family_id?: string
          generated_report?: Json
          id?: string
          pdf_url?: string | null
          session_id?: string
          student_id?: string
          wizard_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_completions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_completions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "wizard_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_completions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      wizard_sessions: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          current_step: number
          family_id: string
          id: string
          last_updated: string
          session_data: Json
          started_at: string
          status: string
          student_id: string
          total_steps: number
          wizard_type: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by: string
          current_step?: number
          family_id: string
          id?: string
          last_updated?: string
          session_data?: Json
          started_at?: string
          status?: string
          student_id: string
          total_steps: number
          wizard_type: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          current_step?: number
          family_id?: string
          id?: string
          last_updated?: string
          session_data?: Json
          started_at?: string
          status?: string
          student_id?: string
          total_steps?: number
          wizard_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "wizard_sessions_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wizard_sessions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      admin_metrics_quality: {
        Row: {
          earliest_date: string | null
          family_name: string | null
          latest_date: string | null
          metric_type: string | null
          null_dates: number | null
          null_percentage: number | null
          student_name: string | null
          total_metrics: number | null
        }
        Relationships: []
      }
      admin_user_management_view: {
        Row: {
          account_status: string | null
          created_at: string | null
          display_name: string | null
          engagement_metrics: Json | null
          families: Json | null
          full_name: string | null
          last_modified_at: string | null
          last_modified_by: string | null
          photo_url: string | null
          roles: string[] | null
          user_id: string | null
        }
        Relationships: []
      }
      extraction_analytics: {
        Row: {
          avg_time_seconds: number | null
          circuit_breaker_hits: number | null
          date: string | null
          failed: number | null
          file_type: string | null
          successful: number | null
          total_attempts: number | null
          total_cost_cents: number | null
        }
        Relationships: []
      }
      system_health_metrics: {
        Row: {
          active_organizations: number | null
          active_users_24h: number | null
          active_users_7d: number | null
          documents_uploaded_24h: number | null
          errors_24h: number | null
          errors_7d: number | null
          new_families_30d: number | null
          new_users_30d: number | null
          total_documents: number | null
          total_families: number | null
          total_organizations: number | null
          total_storage_kb: number | null
          total_users: number | null
          upload_failures_24h: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_purchased_credits: {
        Args: {
          p_credits_to_add: number
          p_family_id: string
          p_metadata?: Json
        }
        Returns: Json
      }
      can_add_family_member: { Args: { _family_id: string }; Returns: boolean }
      can_add_student: { Args: { _family_id: string }; Returns: boolean }
      check_user_onboarding_status: { Args: never; Returns: boolean }
      consume_ai_credits: {
        Args: {
          p_action_type: string
          p_credits_required: number
          p_family_id: string
          p_metadata?: Json
        }
        Returns: Json
      }
      delete_user_account: {
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      detect_and_recover_stuck_queue_items: {
        Args: never
        Returns: {
          failed_count: number
          recovered_count: number
          retried_count: number
        }[]
      }
      get_academic_fluency_data:
        | {
            Args: {
              p_end_date?: string
              p_family_id: string
              p_start_date?: string
              p_student_id: string
            }
            Returns: {
              math_fluency: number
              math_target: number
              measurement_date: string
              reading_fluency: number
              reading_target: number
            }[]
          }
        | {
            Args: {
              p_days?: number
              p_end_date?: string
              p_family_id: string
              p_start_date?: string
              p_student_id: string
            }
            Returns: {
              math_fluency: number
              math_target: number
              measurement_date: string
              reading_fluency: number
              reading_target: number
            }[]
          }
      get_attention_span_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          avg_attention_minutes: number
          log_date: string
        }[]
      }
      get_available_specialized_charts: {
        Args: { p_family_id: string }
        Returns: {
          chart_identifier: string
          document_count: number
          last_updated: string
        }[]
      }
      get_behavior_function_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          avg_duration: number
          behavior_type: string
          common_antecedent: string
          common_consequence: string
          frequency: number
        }[]
      }
      get_chart_layout: {
        Args: { p_family_id: string; p_student_id: string; p_tab_id: string }
        Returns: Json
      }
      get_communication_progress_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          articulation: number
          expressive_language: number
          measurement_date: string
          pragmatic_skills: number
          receptive_language: number
        }[]
      }
      get_comprehensive_user_data: {
        Args: {
          p_date_after?: string
          p_date_before?: string
          p_limit?: number
          p_offset?: number
          p_role_filter?: string[]
          p_search?: string
          p_status_filter?: string[]
          p_user_id?: string
        }
        Returns: {
          account_status: string
          created_at: string
          display_name: string
          email: string
          engagement_metrics: Json
          families: Json
          full_name: string
          last_login: string
          last_modified_at: string
          last_modified_by: string
          photo_url: string
          roles: string[]
          total_count: number
          user_id: string
        }[]
      }
      get_daily_log_counts: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          educator_count: number
          incident_count: number
          log_date: string
          parent_count: number
          total_count: number
        }[]
      }
      get_dls_trends_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          dressing: number
          hand_washing: number
          log_date: string
          meal_prep: number
          teeth_brushing: number
          toileting: number
        }[]
      }
      get_environmental_impact_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          factor_category: string
          negative_correlation: number
          positive_correlation: number
          sample_size: number
        }[]
      }
      get_executive_function_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          current_score: number
          data_points: number
          skill_area: string
          trend: string
        }[]
      }
      get_fine_motor_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          mastery_percentage: number
          measurement_date: string
          skill_name: string
          target_level: number
        }[]
      }
      get_gross_motor_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          balance_score: number
          coordination_score: number
          measurement_date: string
          skill_name: string
        }[]
      }
      get_iep_goal_progress: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          active_goals: number
          avg_progress: number
          goal_category: string
          goal_count: number
        }[]
      }
      get_incident_frequency_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          incident_count: number
          log_date: string
          severity_avg: number
        }[]
      }
      get_intervention_effectiveness_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          incident_count: number
          intervention_count: number
          log_date: string
        }[]
      }
      get_max_users_for_tier: { Args: { tier: string }; Returns: number }
      get_monthly_credit_allowance: { Args: { tier: string }; Returns: number }
      get_next_extraction_job: {
        Args: never
        Returns: {
          attempted_models: string[]
          document_id: string
          family_id: string
          priority: number
          queue_id: string
          retry_count: number
        }[]
      }
      get_next_queue_items: {
        Args: { p_family_id: string; p_limit?: number }
        Returns: {
          completed_at: string | null
          created_at: string
          document_id: string
          error_message: string | null
          estimated_tokens: number | null
          family_id: string
          id: string
          job_id: string | null
          max_retries: number
          priority: number
          processing_time_ms: number | null
          retry_count: number
          started_at: string | null
          status: string
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "analysis_queue"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_next_queue_job: {
        Args: never
        Returns: {
          document_id: string
          family_id: string
          id: string
          job_type: string
          retry_count: number
        }[]
      }
      get_peer_interaction_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          initiated_interactions: number
          log_date: string
          negative_interactions: number
          positive_interactions: number
        }[]
      }
      get_prompting_trend_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          full_prompt_count: number
          gestural_count: number
          independent_count: number
          log_date: string
          physical_count: number
          verbal_count: number
        }[]
      }
      get_queue_statistics: { Args: { p_hours?: number }; Returns: Json }
      get_queue_stats:
        | {
            Args: { p_family_id: string }
            Returns: {
              avg_processing_time_sec: number
              completed_items: number
              failed_items: number
              pending_items: number
              processing_items: number
              total_items: number
            }[]
          }
        | {
            Args: { p_family_id: string; p_job_id?: string }
            Returns: {
              avg_processing_time_sec: number
              completed_items: number
              failed_items: number
              pending_items: number
              processing_items: number
              total_items: number
            }[]
          }
      get_reading_error_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          error_type: string
          frequency: number
          percentage: number
        }[]
      }
      get_self_regulation_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          emotional_regulation: number
          frustration_tolerance: number
          impulse_control: number
          measurement_date: string
          self_calming: number
        }[]
      }
      get_sensory_integration_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          avoiding_behaviors: number
          regulation_score: number
          seeking_behaviors: number
          sensory_system: string
        }[]
      }
      get_sensory_profile_data:
        | {
            Args: { p_family_id: string; p_student_id: string }
            Returns: {
              avg_value: number
              frequency: number
              intensity_level: string
              sensory_category: string
            }[]
          }
        | {
            Args: { p_days?: number; p_family_id: string; p_student_id: string }
            Returns: {
              avg_value: number
              frequency: number
              intensity_level: string
              sensory_category: string
            }[]
          }
      get_session_activity_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          academic_count: number
          log_date: string
          movement_count: number
          sensory_count: number
          session_duration: number
          social_count: number
        }[]
      }
      get_skill_mastery_data: {
        Args: { p_family_id: string; p_student_id: string }
        Returns: {
          current_level: number
          mastery_percentage: number
          skill_domain: string
          target_level: number
          trend: string
        }[]
      }
      get_sleep_summary_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          nap_taken: boolean
          sleep_date: string
          sleep_quality_rating: number
          total_sleep_hours: number
        }[]
      }
      get_social_skills_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          skill_name: string
          success_rate: number
          total_attempts: number
        }[]
      }
      get_strategy_success_rates_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          strategy_name: string
          success_rate: number
          successful_uses: number
          total_uses: number
        }[]
      }
      get_subscription_tier_details: {
        Args: { tier: string }
        Returns: {
          annual_price: number
          max_students: number
          max_users: number
          monthly_price: number
          storage_limit_mb: number
          tier_name: string
        }[]
      }
      get_task_initiation_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          avg_latency_seconds: number
          measurement_date: string
          prompt_level: string
          task_complexity: string
        }[]
      }
      get_top_priority_goals_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          current_value: number
          goal_title: string
          goal_type: string
          is_active: boolean
          progress_percentage: number
          target_date: string
          target_value: number
        }[]
      }
      get_transition_success_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          avg_support_level: number
          success_rate: number
          successful_transitions: number
          total_transitions: number
          transition_type: string
        }[]
      }
      get_user_family_role:
        | { Args: { p_family_id: string }; Returns: string }
        | { Args: { _family_id: string; _user_id: string }; Returns: string }
      get_user_org_role: { Args: { _org_id: string }; Returns: string }
      get_weekly_mood_counts: {
        Args: { p_family_id: string; p_student_id: string }
        Returns: {
          count: number
          day_of_week: string
          day_order: number
          mood: string
        }[]
      }
      get_working_memory_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          measurement_date: string
          step_count: string
          success_rate: number
          trial_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_super_admin_role: { Args: { _user_id: string }; Returns: boolean }
      is_extraction_allowed: { Args: { p_file_type: string }; Returns: boolean }
      is_family_member: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      is_family_owner: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      is_organization_admin: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      is_organization_member: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      mark_expired_invites: { Args: never; Returns: undefined }
      match_family_data: {
        Args: {
          match_count?: number
          match_threshold?: number
          p_family_id?: string
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          family_id: string
          id: string
          metadata: Json
          similarity: number
          source_id: string
          source_table: string
          student_id: string
        }[]
      }
      match_kb_chunks: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          id: string
          kb_id: string
          similarity: number
          source_name: string
        }[]
      }
      process_queue_worker: { Args: never; Returns: undefined }
      reset_monthly_credits: {
        Args: { p_family_id: string }
        Returns: undefined
      }
      save_chart_layout: {
        Args: {
          p_family_id: string
          p_layout: Json
          p_student_id: string
          p_tab_id: string
        }
        Returns: undefined
      }
      update_circuit_breaker: {
        Args: { p_file_type: string; p_success: boolean }
        Returns: undefined
      }
      update_provider_health: {
        Args: {
          p_error_message?: string
          p_latency_ms?: number
          p_provider_name: string
          p_success: boolean
        }
        Returns: undefined
      }
      user_can_access_org: {
        Args: { _org_id: string; _user_id: string }
        Returns: boolean
      }
      users_share_family: {
        Args: { _user_id_1: string; _user_id_2: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "member" | "super_admin"
      document_category_enum:
        | "IEP"
        | "BIP"
        | "FBA"
        | "Progress_Report"
        | "Evaluation_Report"
        | "504_Plan"
        | "Medical_Record"
        | "Incident_Report"
        | "General_Document"
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
      app_role: ["admin", "member", "super_admin"],
      document_category_enum: [
        "IEP",
        "BIP",
        "FBA",
        "Progress_Report",
        "Evaluation_Report",
        "504_Plan",
        "Medical_Record",
        "Incident_Report",
        "General_Document",
      ],
    },
  },
} as const
