export interface UserProfile {
  id?: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  
  // Accessibility settings
  font_family?: string;
  text_size?: number;
  line_spacing?: number;
  color_contrast?: string;
  comfort_mode?: string;
  
  // Language settings
  dual_language_enabled?: boolean;
  primary_language?: string;
  
  // Gamification data
  total_xp?: number;
  current_streak?: number;
  level?: number;
  
  // Learning preferences
  learning_styles?: string[];
  
  // Other profile data
  subscription_status?: string;
  roles?: string[];
}
