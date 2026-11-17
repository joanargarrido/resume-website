/**
 * Database types, mirroring supabase/migrations. Regenerate against a live project with:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      admins: {
        Row: { user_id: string };
        Insert: { user_id: string };
        Update: { user_id?: string };
        Relationships: [];
      };
      profile: {
        Row: {
          id: number;
          full_name: string;
          photo_path: string | null;
          date_of_birth: string | null;
          dob_display: Database["public"]["Enums"]["dob_display"];
          city: string | null;
          headline: string | null;
          bio: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          email_public: string | null;
          cv_path: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          full_name?: string;
          photo_path?: string | null;
          date_of_birth?: string | null;
          dob_display?: Database["public"]["Enums"]["dob_display"];
          city?: string | null;
          headline?: string | null;
          bio?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          email_public?: string | null;
          cv_path?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profile"]["Insert"]>;
        Relationships: [];
      };
      education: {
        Row: {
          id: string;
          institution: string;
          degree: string;
          field: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          institution: string;
          degree: string;
          field?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["education"]["Insert"]>;
        Relationships: [];
      };
      experience: {
        Row: {
          id: string;
          company: string;
          role: string;
          location: string | null;
          start_date: string;
          end_date: string | null;
          description: string | null;
          company_url: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          company: string;
          role: string;
          location?: string | null;
          start_date: string;
          end_date?: string | null;
          description?: string | null;
          company_url?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["experience"]["Insert"]>;
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          level: number | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          level?: number | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          message: string;
          created_at?: string;
          read?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["contact_messages"]["Insert"]>;
        Relationships: [];
      };
      contact_rate_limits: {
        Row: { id: number; ip_hash: string; created_at: string };
        Insert: { id?: number; ip_hash: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["contact_rate_limits"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: {
      dob_display: "full" | "month_year" | "age" | "hidden";
    };
    CompositeTypes: { [_ in never]: never };
  };
};
