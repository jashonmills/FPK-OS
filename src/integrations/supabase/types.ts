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
          activities_completed: string[] | null
          behavioral_observations: string | null
          challenges: string | null
          created_at: string | null
          created_by: string
          educator_name: string
          educator_role: string | null
          family_id: string
          goals_for_next_session: string | null
          id: string
          log_date: string
          log_type: string
          parent_communication: string | null
          progress_notes: string | null
          session_duration_minutes: number | null
          skills_worked_on: string[] | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          activities_completed?: string[] | null
          behavioral_observations?: string | null
          challenges?: string | null
          created_at?: string | null
          created_by: string
          educator_name: string
          educator_role?: string | null
          family_id: string
          goals_for_next_session?: string | null
          id?: string
          log_date?: string
          log_type: string
          parent_communication?: string | null
          progress_notes?: string | null
          session_duration_minutes?: number | null
          skills_worked_on?: string[] | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          activities_completed?: string[] | null
          behavioral_observations?: string | null
          challenges?: string | null
          created_at?: string | null
          created_by?: string
          educator_name?: string
          educator_role?: string | null
          family_id?: string
          goals_for_next_session?: string | null
          id?: string
          log_date?: string
          log_type?: string
          parent_communication?: string | null
          progress_notes?: string | null
          session_duration_minutes?: number | null
          skills_worked_on?: string[] | null
          student_id?: string
          updated_at?: string | null
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
