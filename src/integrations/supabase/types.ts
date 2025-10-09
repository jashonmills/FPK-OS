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
      educator_logs: {
        Row: {
          accuracy_percentage: number | null
          activities_completed: string[] | null
          aqi_us: number | null
          areas_for_improvement: string | null
          attachments: Json | null
          behavioral_observations: string | null
          challenges: string | null
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
          parent_communication: string | null
          performance_level: string | null
          pm10: number | null
          pm25: number | null
          progress_notes: string | null
          prompting_level: string | null
          session_duration_minutes: number | null
          session_end_time: string | null
          session_start_time: string | null
          skills_practiced: string[] | null
          skills_worked_on: string[] | null
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
          aqi_us?: number | null
          areas_for_improvement?: string | null
          attachments?: Json | null
          behavioral_observations?: string | null
          challenges?: string | null
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
          parent_communication?: string | null
          performance_level?: string | null
          pm10?: number | null
          pm25?: number | null
          progress_notes?: string | null
          prompting_level?: string | null
          session_duration_minutes?: number | null
          session_end_time?: string | null
          session_start_time?: string | null
          skills_practiced?: string[] | null
          skills_worked_on?: string[] | null
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
          aqi_us?: number | null
          areas_for_improvement?: string | null
          attachments?: Json | null
          behavioral_observations?: string | null
          challenges?: string | null
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
          parent_communication?: string | null
          performance_level?: string | null
          pm10?: number | null
          pm25?: number | null
          progress_notes?: string | null
          prompting_level?: string | null
          session_duration_minutes?: number | null
          session_end_time?: string | null
          session_start_time?: string | null
          skills_practiced?: string[] | null
          skills_worked_on?: string[] | null
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
      families: {
        Row: {
          created_at: string | null
          created_by: string
          family_name: string
          id: string
          max_students: number | null
          metadata: Json | null
          storage_limit_mb: number | null
          subscription_status: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          family_name: string
          id?: string
          max_students?: number | null
          metadata?: Json | null
          storage_limit_mb?: number | null
          subscription_status?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          family_name?: string
          id?: string
          max_students?: number | null
          metadata?: Json | null
          storage_limit_mb?: number | null
          subscription_status?: string | null
          subscription_tier?: string | null
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
        ]
      }
      incident_logs: {
        Row: {
          antecedent: string | null
          aqi_us: number | null
          attachments: Json | null
          behavior_description: string
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
          notification_method: string | null
          parent_notified: boolean | null
          pm10: number | null
          pm25: number | null
          reporter_name: string
          reporter_role: string
          severity: string
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
          antecedent?: string | null
          aqi_us?: number | null
          attachments?: Json | null
          behavior_description: string
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
          notification_method?: string | null
          parent_notified?: boolean | null
          pm10?: number | null
          pm25?: number | null
          reporter_name: string
          reporter_role: string
          severity: string
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
          antecedent?: string | null
          aqi_us?: number | null
          attachments?: Json | null
          behavior_description?: string
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
          notification_method?: string | null
          parent_notified?: boolean | null
          pm10?: number | null
          pm25?: number | null
          reporter_name?: string
          reporter_role?: string
          severity?: string
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
          aqi_us: number | null
          attachments: Json | null
          challenges: string | null
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
          notes: string | null
          observation: string
          pm10: number | null
          pm25: number | null
          reporter_name: string
          sensory_factors: string[] | null
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
          aqi_us?: number | null
          attachments?: Json | null
          challenges?: string | null
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
          notes?: string | null
          observation: string
          pm10?: number | null
          pm25?: number | null
          reporter_name: string
          sensory_factors?: string[] | null
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
          aqi_us?: number | null
          attachments?: Json | null
          challenges?: string | null
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
          notes?: string | null
          observation?: string
          pm10?: number | null
          pm25?: number | null
          reporter_name?: string
          sensory_factors?: string[] | null
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
      sleep_records: {
        Row: {
          aqi_us: number | null
          bedtime: string
          created_at: string | null
          created_by: string
          daytime_fatigue_level: number | null
          disturbance_details: string | null
          family_id: string
          id: string
          medication_details: string | null
          nap_duration_minutes: number | null
          nap_taken: boolean | null
          nap_time: string | null
          nighttime_awakenings: number | null
          notes: string | null
          pm10: number | null
          pm25: number | null
          pre_bed_activities: string[] | null
          sleep_date: string
          sleep_disturbances: string[] | null
          sleep_medication: boolean | null
          sleep_quality_rating: number | null
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
          aqi_us?: number | null
          bedtime: string
          created_at?: string | null
          created_by: string
          daytime_fatigue_level?: number | null
          disturbance_details?: string | null
          family_id: string
          id?: string
          medication_details?: string | null
          nap_duration_minutes?: number | null
          nap_taken?: boolean | null
          nap_time?: string | null
          nighttime_awakenings?: number | null
          notes?: string | null
          pm10?: number | null
          pm25?: number | null
          pre_bed_activities?: string[] | null
          sleep_date: string
          sleep_disturbances?: string[] | null
          sleep_medication?: boolean | null
          sleep_quality_rating?: number | null
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
          aqi_us?: number | null
          bedtime?: string
          created_at?: string | null
          created_by?: string
          daytime_fatigue_level?: number | null
          disturbance_details?: string | null
          family_id?: string
          id?: string
          medication_details?: string | null
          nap_duration_minutes?: number | null
          nap_taken?: boolean | null
          nap_time?: string | null
          nighttime_awakenings?: number | null
          notes?: string | null
          pm10?: number | null
          pm25?: number | null
          pre_bed_activities?: string[] | null
          sleep_date?: string
          sleep_disturbances?: string[] | null
          sleep_medication?: boolean | null
          sleep_quality_rating?: number | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_family_member: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
      is_family_owner: {
        Args: { _family_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
