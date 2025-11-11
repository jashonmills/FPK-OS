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
      ai_moderation_log: {
        Row: {
          action_taken: string
          conversation_id: string
          created_at: string
          de_escalation_message: string | null
          id: string
          message_content: string
          processing_time_ms: number | null
          raw_ai_response: Json
          sender_id: string
          severity_score: number
          violation_category: string | null
        }
        Insert: {
          action_taken: string
          conversation_id: string
          created_at?: string
          de_escalation_message?: string | null
          id?: string
          message_content: string
          processing_time_ms?: number | null
          raw_ai_response: Json
          sender_id: string
          severity_score: number
          violation_category?: string | null
        }
        Update: {
          action_taken?: string
          conversation_id?: string
          created_at?: string
          de_escalation_message?: string | null
          id?: string
          message_content?: string
          processing_time_ms?: number | null
          raw_ai_response?: Json
          sender_id?: string
          severity_score?: number
          violation_category?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_moderation_log_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      ban_appeals: {
        Row: {
          admin_notes: string | null
          ban_id: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewed_by_admin_id: string | null
          status: string
          user_justification: string
        }
        Insert: {
          admin_notes?: string | null
          ban_id: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by_admin_id?: string | null
          status?: string
          user_justification: string
        }
        Update: {
          admin_notes?: string | null
          ban_id?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by_admin_id?: string | null
          status?: string
          user_justification?: string
        }
        Relationships: [
          {
            foreignKeyName: "ban_appeals_ban_id_fkey"
            columns: ["ban_id"]
            isOneToOne: false
            referencedRelation: "user_bans"
            referencedColumns: ["id"]
          },
        ]
      }
      bookmarks: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      circle_members: {
        Row: {
          circle_id: string
          id: string
          joined_at: string
          role: Database["public"]["Enums"]["circle_role"]
          user_id: string
        }
        Insert: {
          circle_id: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["circle_role"]
          user_id: string
        }
        Update: {
          circle_id?: string
          id?: string
          joined_at?: string
          role?: Database["public"]["Enums"]["circle_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "circle_members_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      circles: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_default_circle: boolean | null
          is_private: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_default_circle?: boolean | null
          is_private?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_default_circle?: boolean | null
          is_private?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      comment_reactions: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_reactions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_participants_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          conversation_type: string
          created_at: string | null
          created_by: string
          group_avatar_url: string | null
          group_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          conversation_type: string
          created_at?: string | null
          created_by: string
          group_avatar_url?: string | null
          group_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          conversation_type?: string
          created_at?: string | null
          created_by?: string
          group_avatar_url?: string | null
          group_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_prompts: {
        Row: {
          created_at: string | null
          day_of_week: number
          id: string
          prompt_text: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          id?: string
          prompt_text: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          id?: string
          prompt_text?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          circle_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          location_address: string | null
          location_type: string | null
          location_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          circle_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          location_address?: string | null
          location_type?: string | null
          location_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          circle_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          location_address?: string | null
          location_type?: string | null
          location_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_flags: {
        Row: {
          created_at: string
          description: string | null
          flag_name: string
          id: string
          is_enabled: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          flag_name: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          flag_name?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string
          followed_user_id: string
          following_user_id: string
          id: string
        }
        Insert: {
          created_at?: string
          followed_user_id: string
          following_user_id: string
          id?: string
        }
        Update: {
          created_at?: string
          followed_user_id?: string
          following_user_id?: string
          id?: string
        }
        Relationships: []
      }
      invites: {
        Row: {
          created_at: string | null
          created_by_user_id: string
          expires_at: string | null
          id: string
          invite_code: string
          max_uses: number | null
          updated_at: string | null
          uses_count: number
        }
        Insert: {
          created_at?: string | null
          created_by_user_id: string
          expires_at?: string | null
          id?: string
          invite_code: string
          max_uses?: number | null
          updated_at?: string | null
          uses_count?: number
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string
          expires_at?: string | null
          id?: string
          invite_code?: string
          max_uses?: number | null
          updated_at?: string | null
          uses_count?: number
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          persona_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          persona_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          persona_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_reactions_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      message_read_receipts: {
        Row: {
          created_at: string
          id: string
          message_id: string
          read_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          read_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_read_receipts_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string | null
          conversation_id: string
          created_at: string | null
          deleted_at: string | null
          deleted_by_ai: boolean | null
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          image_caption: string | null
          is_deleted: boolean
          is_edited: boolean | null
          is_system_message: boolean | null
          moderation_reason: string | null
          reply_to_message_id: string | null
          sender_id: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          deleted_by_ai?: boolean | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          image_caption?: string | null
          is_deleted?: boolean
          is_edited?: boolean | null
          is_system_message?: boolean | null
          moderation_reason?: string | null
          reply_to_message_id?: string | null
          sender_id: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          deleted_by_ai?: boolean | null
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          image_caption?: string | null
          is_deleted?: boolean
          is_edited?: boolean | null
          is_system_message?: boolean | null
          moderation_reason?: string | null
          reply_to_message_id?: string | null
          sender_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_reply_to_message_id_fkey"
            columns: ["reply_to_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          avatar_url: string | null
          bio: string | null
          comments_count: number
          created_at: string
          diagnosis_info: string | null
          display_name: string
          header_image_url: string | null
          headline: string | null
          id: string
          interests: Json | null
          location: string | null
          persona_type: Database["public"]["Enums"]["persona_type"]
          pinned_post_id: string | null
          posts_count: number
          pronouns: string | null
          social_links: Json | null
          supports_received_count: number
          updated_at: string
          user_id: string
          why_i_am_here: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          comments_count?: number
          created_at?: string
          diagnosis_info?: string | null
          display_name: string
          header_image_url?: string | null
          headline?: string | null
          id?: string
          interests?: Json | null
          location?: string | null
          persona_type: Database["public"]["Enums"]["persona_type"]
          pinned_post_id?: string | null
          posts_count?: number
          pronouns?: string | null
          social_links?: Json | null
          supports_received_count?: number
          updated_at?: string
          user_id: string
          why_i_am_here?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          comments_count?: number
          created_at?: string
          diagnosis_info?: string | null
          display_name?: string
          header_image_url?: string | null
          headline?: string | null
          id?: string
          interests?: Json | null
          location?: string | null
          persona_type?: Database["public"]["Enums"]["persona_type"]
          pinned_post_id?: string | null
          posts_count?: number
          pronouns?: string | null
          social_links?: Json | null
          supports_received_count?: number
          updated_at?: string
          user_id?: string
          why_i_am_here?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_pinned_post_id_fkey"
            columns: ["pinned_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_supports: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_supports_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          circle_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          circle_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          circle_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_circle_id_fkey"
            columns: ["circle_id"]
            isOneToOne: false
            referencedRelation: "circles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          has_completed_tour: boolean
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          has_completed_tour?: boolean
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          has_completed_tour?: boolean
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          inviting_user_id: string
          new_user_id: string
          rewarded_at: string | null
          status: string
          used_invite_code: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inviting_user_id: string
          new_user_id: string
          rewarded_at?: string | null
          status?: string
          used_invite_code: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inviting_user_id?: string
          new_user_id?: string
          rewarded_at?: string | null
          status?: string
          used_invite_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_used_invite_code_fkey"
            columns: ["used_invite_code"]
            isOneToOne: false
            referencedRelation: "invites"
            referencedColumns: ["invite_code"]
          },
        ]
      }
      reflections: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          id: string
          prompt_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          id?: string
          prompt_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reflections_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reflections_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "daily_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      shares: {
        Row: {
          created_at: string
          id: string
          original_post_id: string
          sharing_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          original_post_id: string
          sharing_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          original_post_id?: string
          sharing_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shares_original_post_id_fkey"
            columns: ["original_post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_type: string
          earned_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_bans: {
        Row: {
          banned_by_user_id: string | null
          created_at: string
          expires_at: string
          id: string
          is_ai_ban: boolean
          offending_conversation_id: string | null
          offending_message_content: string
          reason: string
          severity_score: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          banned_by_user_id?: string | null
          created_at?: string
          expires_at: string
          id?: string
          is_ai_ban?: boolean
          offending_conversation_id?: string | null
          offending_message_content: string
          reason: string
          severity_score?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          banned_by_user_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          is_ai_ban?: boolean
          offending_conversation_id?: string | null
          offending_message_content?: string
          reason?: string
          severity_score?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bans_offending_conversation_id_fkey"
            columns: ["offending_conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          lifetime_earned: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          lifetime_earned?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          lifetime_earned?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_feature_flags: {
        Row: {
          created_at: string
          flag_name: string
          id: string
          is_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          flag_name: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          flag_name?: string
          id?: string
          is_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_credits: {
        Args: { p_amount: number; p_reason?: string; p_user_id: string }
        Returns: undefined
      }
      expire_old_bans: { Args: never; Returns: undefined }
      find_existing_dm: {
        Args: { user1_id: string; user2_id: string }
        Returns: string
      }
      generate_invite_code: { Args: never; Returns: string }
      get_trending_circles: {
        Args: { limit_count?: number }
        Returns: {
          activity_score: number
          circle_description: string
          circle_id: string
          circle_name: string
          member_count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_circle_member: {
        Args: { _circle_id: string; _user_id: string }
        Returns: boolean
      }
      is_conversation_admin: {
        Args: { conv_id: string; user_id: string }
        Returns: boolean
      }
      is_conversation_creator: {
        Args: { conv_id: string; user_id: string }
        Returns: boolean
      }
      user_in_conversation: {
        Args: { check_user_id: string; conv_id: string }
        Returns: boolean
      }
      user_owns_persona: {
        Args: { _persona_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      circle_role: "MEMBER" | "ADMIN"
      notification_type: "REFERRAL_REWARD" | "ACHIEVEMENT" | "MESSAGE"
      persona_type: "PARENT" | "EDUCATOR" | "PROFESSIONAL" | "INDIVIDUAL"
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
      app_role: ["admin", "moderator", "user"],
      circle_role: ["MEMBER", "ADMIN"],
      notification_type: ["REFERRAL_REWARD", "ACHIEVEMENT", "MESSAGE"],
      persona_type: ["PARENT", "EDUCATOR", "PROFESSIONAL", "INDIVIDUAL"],
    },
  },
} as const
