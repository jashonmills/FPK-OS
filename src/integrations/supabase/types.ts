export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      profiles: {
        Row: {
          app_reminders: Json | null
          avatar_url: string | null
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
    }
    Enums: {
      app_role: "admin" | "instructor" | "learner"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "instructor", "learner"],
    },
  },
} as const
