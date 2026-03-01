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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string | null
          display_order: number
          event_type: string
          id: string
          image: string | null
          registration_link: string | null
          slug: string
          status: string
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          date: string
          description?: string | null
          display_order?: number
          event_type?: string
          id?: string
          image?: string | null
          registration_link?: string | null
          slug: string
          status?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string | null
          display_order?: number
          event_type?: string
          id?: string
          image?: string | null
          registration_link?: string | null
          slug?: string
          status?: string
          title?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          id: string
          image_url: string
        }
        Insert: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url: string
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url?: string
        }
        Relationships: []
      }
      gallery_event_images: {
        Row: {
          caption: string | null
          created_at: string
          gallery_event_id: string
          id: string
          image_url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          gallery_event_id: string
          id?: string
          image_url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          gallery_event_id?: string
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_event_images_gallery_event_id_fkey"
            columns: ["gallery_event_id"]
            isOneToOne: false
            referencedRelation: "gallery_events"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_events: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string | null
          id: string
          title: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      join_applications: {
        Row: {
          academic_year: string
          created_at: string
          debate_experience: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          why_join: string | null
        }
        Insert: {
          academic_year: string
          created_at?: string
          debate_experience?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          why_join?: string | null
        }
        Update: {
          academic_year?: string
          created_at?: string
          debate_experience?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          why_join?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          created_at: string
          description: string | null
          embed_url: string | null
          id: string
          image: string | null
          slug: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          embed_url?: string | null
          id?: string
          image?: string | null
          slug: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          embed_url?: string | null
          id?: string
          image?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      popups: {
        Row: {
          created_at: string
          cta_link: string | null
          cta_text: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          cta_link?: string | null
          cta_text?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          department: string | null
          id: string
          image_url: string | null
          linkedin_url: string | null
          name: string
          role: string
          section: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name: string
          role: string
          section: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          image_url?: string | null
          linkedin_url?: string | null
          name?: string
          role?: string
          section?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
