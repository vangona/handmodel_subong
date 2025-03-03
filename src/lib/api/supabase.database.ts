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
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      contact_forms: {
        Row: {
          company: string | null
          created_at: string | null
          id: string
          message: string | null
          name: string | null
          phone: string | null
          project_type: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          project_type?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          name?: string | null
          phone?: string | null
          project_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      main_images: {
        Row: {
          created_at: string
          id: number
          is_active: boolean | null
          position_x: number | null
          position_y: number | null
          scale: number | null
          transition_delay: number | null
          transition_duration: number | null
          transition_type: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          position_x?: number | null
          position_y?: number | null
          scale?: number | null
          transition_delay?: number | null
          transition_duration?: number | null
          transition_type?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean | null
          position_x?: number | null
          position_y?: number | null
          scale?: number | null
          transition_delay?: number | null
          transition_duration?: number | null
          transition_type?: string | null
          url?: string | null
        }
        Relationships: []
      }
      page_contents: {
        Row: {
          content: Json
          created_at: string
          id: string
          page_type: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          page_type: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          page_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: string[] | null
          created_at: string
          description: string | null
          id: number
          images: string[] | null
          order: number
          scene_description: string | null
          thumbnail_position_x: number
          thumbnail_position_y: number
          thumbnail_scale: number
          title: string | null
          user_id: string | null
        }
        Insert: {
          category?: string[] | null
          created_at?: string
          description?: string | null
          id?: number
          images?: string[] | null
          order?: number
          scene_description?: string | null
          thumbnail_position_x?: number
          thumbnail_position_y?: number
          thumbnail_scale?: number
          title?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string[] | null
          created_at?: string
          description?: string | null
          id?: number
          images?: string[] | null
          order?: number
          scene_description?: string | null
          thumbnail_position_x?: number
          thumbnail_position_y?: number
          thumbnail_scale?: number
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
