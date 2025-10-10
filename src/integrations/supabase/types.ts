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
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          id?: string
          job_id?: string | null
          metadata?: Json | null
          occurred_at?: string | null
          source_url?: string | null
        }
        Relationships: [
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
          function_name?: string
          id?: string
          metadata?: Json | null
          started_at?: string | null
          status?: string
          successful_documents?: number | null
          total_documents?: number | null
        }
        Relationships: []
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
          id: string
          kb_id: string
          token_count: number | null
        }
        Insert: {
          chunk_text: string
          created_at?: string | null
          embedding: string
          id?: string
          kb_id: string
          token_count?: number | null
        }
        Update: {
          chunk_text?: string
          created_at?: string | null
          embedding?: string
          id?: string
          kb_id?: string
          token_count?: number | null
        }
        Relationships: [
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
          focus_areas?: string[] | null
          id?: string
          keywords?: string[] | null
          publication_date?: string | null
          source_name?: string
          source_url?: string | null
          summary?: string | null
          title?: string | null
        }
        Relationships: []
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
          created_at: string | null
          date_of_birth: string
          family_id: string
          grade_level: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          photo_url: string | null
          primary_diagnosis: string[] | null
          school_name: string | null
          secondary_conditions: string[] | null
          student_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_of_birth: string
          family_id: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          photo_url?: string | null
          primary_diagnosis?: string[] | null
          school_name?: string | null
          secondary_conditions?: string[] | null
          student_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_of_birth?: string
          family_id?: string
          grade_level?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          photo_url?: string | null
          primary_diagnosis?: string[] | null
          school_name?: string | null
          secondary_conditions?: string[] | null
          student_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      can_add_family_member: {
        Args: { _family_id: string }
        Returns: boolean
      }
      can_add_student: {
        Args: { _family_id: string }
        Returns: boolean
      }
      check_user_onboarding_status: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
      get_intervention_effectiveness_data: {
        Args: { p_days?: number; p_family_id: string; p_student_id: string }
        Returns: {
          incident_count: number
          intervention_count: number
          log_date: string
        }[]
      }
      get_max_users_for_tier: {
        Args: { tier: string }
        Returns: number
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
      get_user_family_role: {
        Args: { _family_id: string; _user_id: string } | { p_family_id: string }
        Returns: string
      }
      get_weekly_mood_counts: {
        Args: { p_family_id: string; p_student_id: string }
        Returns: {
          count: number
          day_of_week: string
          day_order: number
          mood: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_family_member: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      is_family_owner: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      mark_expired_invites: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      users_share_family: {
        Args: { _user_id_1: string; _user_id_2: string }
        Returns: boolean
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "member"
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
      app_role: ["admin", "member"],
    },
  },
} as const
