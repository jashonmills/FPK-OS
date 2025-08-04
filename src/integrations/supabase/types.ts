export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
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
      analytics_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          timestamp: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          timestamp?: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
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
      audit_log: {
        Row: {
          action: string
          id: string
          ip_address: unknown | null
          legal_basis: string | null
          new_values: Json | null
          old_values: Json | null
          purpose: string | null
          record_id: string | null
          session_id: string | null
          table_name: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          new_values?: Json | null
          old_values?: Json | null
          purpose?: string | null
          record_id?: string | null
          session_id?: string | null
          table_name: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          id?: string
          ip_address?: unknown | null
          legal_basis?: string | null
          new_values?: Json | null
          old_values?: Json | null
          purpose?: string | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      courses: {
        Row: {
          asset_path: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          duration_minutes: number | null
          featured: boolean | null
          id: string
          instructor_name: string | null
          is_free: boolean | null
          price: number | null
          published_at: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          asset_path?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          featured?: boolean | null
          id: string
          instructor_name?: string | null
          is_free?: boolean | null
          price?: number | null
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          asset_path?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_minutes?: number | null
          featured?: boolean | null
          id?: string
          instructor_name?: string | null
          is_free?: boolean | null
          price?: number | null
          published_at?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
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
          priority?: string
          progress?: number
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string
          user_id?: string
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
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
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
          display_name: string | null
          dual_language_enabled: boolean | null
          email_notifications: Json | null
          font_family: string | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          learning_styles: string[] | null
          line_spacing: number | null
          onboarding_completed: boolean | null
          primary_language: string | null
          push_notifications_enabled: boolean | null
          speech_to_text_enabled: boolean | null
          text_size: number | null
          time_format: string | null
          timezone: string | null
          total_xp: number | null
          two_factor_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
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
          display_name?: string | null
          dual_language_enabled?: boolean | null
          email_notifications?: Json | null
          font_family?: string | null
          full_name?: string | null
          id: string
          last_activity_date?: string | null
          learning_styles?: string[] | null
          line_spacing?: number | null
          onboarding_completed?: boolean | null
          primary_language?: string | null
          push_notifications_enabled?: boolean | null
          speech_to_text_enabled?: boolean | null
          text_size?: number | null
          time_format?: string | null
          timezone?: string | null
          total_xp?: number | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
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
          display_name?: string | null
          dual_language_enabled?: boolean | null
          email_notifications?: Json | null
          font_family?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          learning_styles?: string[] | null
          line_spacing?: number | null
          onboarding_completed?: boolean | null
          primary_language?: string | null
          push_notifications_enabled?: boolean | null
          speech_to_text_enabled?: boolean | null
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
          ip_address: unknown | null
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
          ip_address?: unknown | null
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
          ip_address?: unknown | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_level_from_xp: {
        Args: { total_xp: number }
        Returns: {
          level: number
          next_level_xp: number
        }[]
      }
      cleanup_expired_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          records_deleted: number
          cleanup_date: string
        }[]
      }
      create_data_subject_request: {
        Args: {
          p_user_id: string
          p_request_type: string
          p_description?: string
          p_data_categories?: string[]
        }
        Returns: string
      }
      detect_security_incident: {
        Args: {
          p_incident_type: string
          p_description: string
          p_severity_level?: string
          p_affected_systems?: Json
          p_data_types_affected?: Json
        }
        Returns: string
      }
      extract_chat_topics: {
        Args: { session_id: string }
        Returns: Json
      }
      get_activity_heatmap: {
        Args: { user_uuid: string; days_back?: number }
        Returns: {
          activity_date: string
          hour_of_day: number
          activity_count: number
          total_duration_minutes: number
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      log_hipaa_access: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_resource_type: string
          p_resource_id?: string
          p_phi_accessed?: boolean
          p_access_purpose?: string
          p_patient_id?: string
        }
        Returns: undefined
      }
      record_audit_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_table_name: string
          p_record_id?: string
          p_old_values?: Json
          p_new_values?: Json
          p_legal_basis?: string
          p_purpose?: string
        }
        Returns: undefined
      }
      validate_legal_basis: {
        Args: {
          p_user_id: string
          p_processing_purpose: string
          p_data_categories: string[]
        }
        Returns: Json
      }
      withdraw_user_consent: {
        Args: { p_user_id: string; p_consent_type: string; p_reason?: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "instructor" | "learner"
      subscription_status:
        | "active"
        | "canceled"
        | "past_due"
        | "incomplete"
        | "trialing"
      subscription_tier: "basic" | "pro" | "premium"
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
      app_role: ["admin", "instructor", "learner"],
      subscription_status: [
        "active",
        "canceled",
        "past_due",
        "incomplete",
        "trialing",
      ],
      subscription_tier: ["basic", "pro", "premium"],
    },
  },
} as const
