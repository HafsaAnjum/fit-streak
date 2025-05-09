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
      activities: {
        Row: {
          calories: number | null
          completed_at: string | null
          created_at: string | null
          distance: number | null
          duration: number | null
          heart_rate: number | null
          id: string
          steps: number | null
          type: string
          user_id: string
        }
        Insert: {
          calories?: number | null
          completed_at?: string | null
          created_at?: string | null
          distance?: number | null
          duration?: number | null
          heart_rate?: number | null
          id?: string
          steps?: number | null
          type: string
          user_id: string
        }
        Update: {
          calories?: number | null
          completed_at?: string | null
          created_at?: string | null
          distance?: number | null
          duration?: number | null
          heart_rate?: number | null
          id?: string
          steps?: number | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          badge_image: string | null
          created_at: string | null
          description: string
          end_date: string
          goal_type: string
          goal_value: number
          id: string
          start_date: string
          title: string
        }
        Insert: {
          badge_image?: string | null
          created_at?: string | null
          description: string
          end_date: string
          goal_type: string
          goal_value: number
          id?: string
          start_date: string
          title: string
        }
        Update: {
          badge_image?: string | null
          created_at?: string | null
          description?: string
          end_date?: string
          goal_type?: string
          goal_value?: number
          id?: string
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      fitness_connections: {
        Row: {
          access_token: string
          expires_at: number
          id: string
          provider: string
          refresh_token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          expires_at: number
          id?: string
          provider: string
          refresh_token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          expires_at?: number
          id?: string
          provider?: string
          refresh_token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leaderboard_stats: {
        Row: {
          calories_burned: number | null
          id: string
          monthly: boolean | null
          rank: number
          steps: number | null
          updated_at: string | null
          user_id: string
          weekly: boolean | null
          workouts: number | null
        }
        Insert: {
          calories_burned?: number | null
          id?: string
          monthly?: boolean | null
          rank: number
          steps?: number | null
          updated_at?: string | null
          user_id: string
          weekly?: boolean | null
          workouts?: number | null
        }
        Update: {
          calories_burned?: number | null
          id?: string
          monthly?: boolean | null
          rank?: number
          steps?: number | null
          updated_at?: string | null
          user_id?: string
          weekly?: boolean | null
          workouts?: number | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          target_value: number
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description: string
          icon?: string | null
          id?: string
          target_value: number
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string | null
          id?: string
          target_value?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          fitness_level: string | null
          goal: string | null
          height: number | null
          id: string
          public_profile: boolean | null
          updated_at: string | null
          username: string | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          fitness_level?: string | null
          goal?: string | null
          height?: number | null
          id: string
          public_profile?: boolean | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          fitness_level?: string | null
          goal?: string | null
          height?: number | null
          id?: string
          public_profile?: boolean | null
          updated_at?: string | null
          username?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_challenges: {
        Row: {
          challenge_id: string
          completed: boolean | null
          id: string
          joined_at: string | null
          progress: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          id?: string
          joined_at?: string | null
          progress?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          id?: string
          joined_at?: string | null
          progress?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_milestones: {
        Row: {
          achieved: boolean
          achieved_at: string | null
          created_at: string | null
          id: string
          milestone_id: string
          progress: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved?: boolean
          achieved_at?: string | null
          created_at?: string | null
          id?: string
          milestone_id: string
          progress?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved?: boolean
          achieved_at?: string | null
          created_at?: string | null
          id?: string
          milestone_id?: string
          progress?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_milestones_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sessions: {
        Row: {
          activity_type: string
          calories_burned: number
          completed: boolean
          created_at: string | null
          duration: number
          end_time: string | null
          heart_rate: number | null
          id: string
          start_time: string
          steps: number
          user_id: string
        }
        Insert: {
          activity_type: string
          calories_burned?: number
          completed?: boolean
          created_at?: string | null
          duration?: number
          end_time?: string | null
          heart_rate?: number | null
          id?: string
          start_time?: string
          steps?: number
          user_id: string
        }
        Update: {
          activity_type?: string
          calories_burned?: number
          completed?: boolean
          created_at?: string | null
          duration?: number
          end_time?: string | null
          heart_rate?: number | null
          id?: string
          start_time?: string
          steps?: number
          user_id?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories: number | null
          completed: boolean | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          scheduled_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          scheduled_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          scheduled_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_completed_workouts: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_all_milestones: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          description: string
          icon: string | null
          id: string
          target_value: number
          title: string
          type: string
        }[]
      }
      get_newly_achieved_milestones: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          title: string
          description: string
          type: string
          target_value: number
          icon: string
        }[]
      }
      get_user_fitness_stats: {
        Args: { user_id_param: string }
        Returns: {
          total_workouts: number
          total_steps: number
          total_calories: number
        }[]
      }
      get_user_milestones: {
        Args: { p_user_id: string }
        Returns: {
          id: string
          user_id: string
          milestone_id: string
          achieved: boolean
          achieved_at: string
          progress: number
          milestone_title: string
          milestone_description: string
          milestone_type: string
          milestone_target_value: number
          milestone_icon: string
        }[]
      }
      update_milestone_progress: {
        Args: { p_user_id: string; p_type: string; p_value: number }
        Returns: undefined
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
    Enums: {},
  },
} as const
