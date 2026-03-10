export type LeadStatusValue = "pending" | "handled" | "rejected";
export type LeadSendMethodValue = "whatsapp" | "email";
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          user_id: string;
          email: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          email?: string | null;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          email?: string | null;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          settings: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          description: string;
          tags: string[];
          image_url: string | null;
          project_url: string | null;
          is_featured: boolean;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          tags?: string[];
          image_url?: string | null;
          project_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          tags?: string[];
          image_url?: string | null;
          project_url?: string | null;
          is_featured?: boolean;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      client_logos: {
        Row: {
          id: string;
          name: string;
          image_url: string;
          display_order: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image_url: string;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          image_url?: string;
          display_order?: number;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          badge: string;
          title: string;
          body: string;
          image_url: string | null;
          video_url: string | null;
          icon_type: "lucide" | "svg" | "image";
          icon_lucide_name: string | null;
          icon_svg: string | null;
          icon_image_url: string | null;
          reverse_layout: boolean;
          tags: string[];
          bg_gradient: string;
          text_color: string;
          muted_text_color: string;
          badge_bg: string;
          badge_text: string;
          icon_bg: string;
          icon_shadow: string;
          tag_bg: string;
          tag_text: string;
          display_order: number;
          is_published: boolean;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          badge: string;
          title: string;
          body: string;
          image_url?: string | null;
          video_url?: string | null;
          icon_type: "lucide" | "svg" | "image";
          icon_lucide_name?: string | null;
          icon_svg?: string | null;
          icon_image_url?: string | null;
          reverse_layout?: boolean;
          tags?: string[];
          bg_gradient: string;
          text_color: string;
          muted_text_color: string;
          badge_bg: string;
          badge_text: string;
          icon_bg: string;
          icon_shadow: string;
          tag_bg: string;
          tag_text: string;
          display_order?: number;
          is_published?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          badge?: string;
          title?: string;
          body?: string;
          image_url?: string | null;
          video_url?: string | null;
          icon_type?: "lucide" | "svg" | "image";
          icon_lucide_name?: string | null;
          icon_svg?: string | null;
          icon_image_url?: string | null;
          reverse_layout?: boolean;
          tags?: string[];
          bg_gradient?: string;
          text_color?: string;
          muted_text_color?: string;
          badge_bg?: string;
          badge_text?: string;
          icon_bg?: string;
          icon_shadow?: string;
          tag_bg?: string;
          tag_text?: string;
          display_order?: number;
          is_published?: boolean;
          deleted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      faq_items: {
        Row: {
          id: string;
          question: string;
          answer: string;
          is_published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          question?: string;
          answer?: string;
          is_published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      about_content: {
        Row: {
          id: string;
          content: Json;
          deleted_items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          content: Json;
          deleted_items?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          content?: Json;
          deleted_items?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          name: string;
          email: string;
          phone: string;
          company_name: string | null;
          subject: string;
          send_method: LeadSendMethodValue;
          status: LeadStatusValue;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          name: string;
          email: string;
          phone: string;
          company_name?: string | null;
          subject: string;
          send_method: LeadSendMethodValue;
          status?: LeadStatusValue;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          name?: string;
          email?: string;
          phone?: string;
          company_name?: string | null;
          subject?: string;
          send_method?: LeadSendMethodValue;
          status?: LeadStatusValue;
          notes?: string | null;
        };
      };
    };
  };
}
