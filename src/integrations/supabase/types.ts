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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      archive_entries: {
        Row: {
          body: string | null
          category: Database["public"]["Enums"]["archive_category"]
          created_at: string
          description: string | null
          entry_date: string | null
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          published_at: string | null
          slug: string
          sort_order: number
          tags: string[]
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          body?: string | null
          category?: Database["public"]["Enums"]["archive_category"]
          created_at?: string
          description?: string | null
          entry_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          sort_order?: number
          tags?: string[]
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          body?: string | null
          category?: Database["public"]["Enums"]["archive_category"]
          created_at?: string
          description?: string | null
          entry_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          sort_order?: number
          tags?: string[]
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      articles: {
        Row: {
          author_id: string | null
          body: string
          category_id: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          id: string
          published_at: string | null
          reading_time: number
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          tags: string[]
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author_id?: string | null
          body?: string
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author_id?: string | null
          body?: string
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          id?: string
          published_at?: string | null
          reading_time?: number
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          meta: Json | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          meta?: Json | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          meta?: Json | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      books: {
        Row: {
          author: string | null
          cover_url: string | null
          created_at: string
          id: string
          link: string | null
          note: string | null
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          link?: string | null
          note?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          author?: string | null
          cover_url?: string | null
          created_at?: string
          id?: string
          link?: string | null
          note?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          category: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          launch_year: string | null
          logo_url: string | null
          mission: string | null
          name: string
          problem: string | null
          products: string[]
          progress: number
          roadmap: Json
          services: string[]
          slug: string
          sort_order: number
          status: string
          tagline: string | null
          updated_at: string
          visible: boolean
          vision: string | null
          website: string | null
        }
        Insert: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          launch_year?: string | null
          logo_url?: string | null
          mission?: string | null
          name: string
          problem?: string | null
          products?: string[]
          progress?: number
          roadmap?: Json
          services?: string[]
          slug: string
          sort_order?: number
          status?: string
          tagline?: string | null
          updated_at?: string
          visible?: boolean
          vision?: string | null
          website?: string | null
        }
        Update: {
          category?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          launch_year?: string | null
          logo_url?: string | null
          mission?: string | null
          name?: string
          problem?: string | null
          products?: string[]
          progress?: number
          roadmap?: Json
          services?: string[]
          slug?: string
          sort_order?: number
          status?: string
          tagline?: string | null
          updated_at?: string
          visible?: boolean
          vision?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          archived: boolean
          category: string | null
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          replied: boolean
          subject: string | null
        }
        Insert: {
          archived?: boolean
          category?: string | null
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          replied?: boolean
          subject?: string | null
        }
        Update: {
          archived?: boolean
          category?: string | null
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          replied?: boolean
          subject?: string | null
        }
        Relationships: []
      }
      ecosystem_updates: {
        Row: {
          category: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          featured: boolean
          id: string
          image_url: string | null
          published: boolean
          published_at: string
          sort_order: number
          source: Database["public"]["Enums"]["connection_state"]
          title: string
          updated_at: string
          venture_id: string | null
          venture_label: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          sort_order?: number
          source?: Database["public"]["Enums"]["connection_state"]
          title: string
          updated_at?: string
          venture_id?: string | null
          venture_label?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string
          sort_order?: number
          source?: Database["public"]["Enums"]["connection_state"]
          title?: string
          updated_at?: string
          venture_id?: string | null
          venture_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ecosystem_updates_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          audience_size: string | null
          budget: string | null
          company: string | null
          created_at: string
          details: Json
          email: string
          enquiry_type: string
          event_date: string | null
          event_location: string | null
          event_name: string | null
          id: string
          last_activity_at: string
          message: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
          subject: string | null
          timeline: string | null
          updated_at: string
        }
        Insert: {
          audience_size?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          details?: Json
          email: string
          enquiry_type: string
          event_date?: string | null
          event_location?: string | null
          event_name?: string | null
          id?: string
          last_activity_at?: string
          message: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Update: {
          audience_size?: string | null
          budget?: string | null
          company?: string | null
          created_at?: string
          details?: Json
          email?: string
          enquiry_type?: string
          event_date?: string | null
          event_location?: string | null
          event_name?: string | null
          id?: string
          last_activity_at?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string | null
          timeline?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      enquiry_notes: {
        Row: {
          author_id: string | null
          body: string
          created_at: string
          enquiry_id: string
          id: string
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string
          enquiry_id: string
          id?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string
          enquiry_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enquiry_notes_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_cache: {
        Row: {
          created_at: string
          error: string | null
          fetched_at: string
          id: string
          ok: boolean
          payload: Json
          source_key: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error?: string | null
          fetched_at?: string
          id?: string
          ok?: boolean
          payload?: Json
          source_key: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error?: string | null
          fetched_at?: string
          id?: string
          ok?: boolean
          payload?: Json
          source_key?: string
          updated_at?: string
        }
        Relationships: []
      }
      integration_sources: {
        Row: {
          config: Json
          connection: Database["public"]["Enums"]["connection_state"]
          created_at: string
          enabled: boolean
          endpoint_url: string | null
          id: string
          key: string
          label: string
          last_error: string | null
          last_sync_at: string | null
          provider: string
          updated_at: string
        }
        Insert: {
          config?: Json
          connection?: Database["public"]["Enums"]["connection_state"]
          created_at?: string
          enabled?: boolean
          endpoint_url?: string | null
          id?: string
          key: string
          label: string
          last_error?: string | null
          last_sync_at?: string | null
          provider: string
          updated_at?: string
        }
        Update: {
          config?: Json
          connection?: Database["public"]["Enums"]["connection_state"]
          created_at?: string
          enabled?: boolean
          endpoint_url?: string | null
          id?: string
          key?: string
          label?: string
          last_error?: string | null
          last_sync_at?: string | null
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      journey_milestones: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          project_id: string | null
          published: boolean
          sort_order: number
          title: string
          updated_at: string
          venture_id: string | null
          video_url: string | null
          year: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          project_id?: string | null
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          venture_id?: string | null
          video_url?: string | null
          year: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          project_id?: string | null
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          venture_id?: string | null
          video_url?: string | null
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_milestones_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "work_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_milestones_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      media_library: {
        Row: {
          alt_text: string | null
          created_at: string
          folder: string
          id: string
          mime_type: string | null
          name: string
          path: string
          size_bytes: number | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string | null
          name: string
          path: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          folder?: string
          id?: string
          mime_type?: string | null
          name?: string
          path?: string
          size_bytes?: number | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          source: string | null
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          category: string | null
          client: string | null
          cover_image: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          images: string[]
          slug: string
          sort_order: number
          title: string
          updated_at: string
          video_url: string | null
          visible: boolean
          year: string | null
        }
        Insert: {
          category?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
          year?: string | null
        }
        Update: {
          category?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          images?: string[]
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          video_url?: string | null
          visible?: boolean
          year?: string | null
        }
        Relationships: []
      }
      press_mentions: {
        Row: {
          created_at: string
          headline: string
          id: string
          image_url: string | null
          mention_date: string | null
          publication: string
          published: boolean
          sort_order: number
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          headline: string
          id?: string
          image_url?: string | null
          mention_date?: string | null
          publication: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          headline?: string
          id?: string
          image_url?: string | null
          mention_date?: string | null
          publication?: string
          published?: boolean
          sort_order?: number
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          last_login_at: string | null
          suspended: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          last_login_at?: string | null
          suspended?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          last_login_at?: string | null
          suspended?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          sort_order: number
          title: string
          type: string | null
          updated_at: string
          url: string | null
          visible: boolean
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
          type?: string | null
          updated_at?: string
          url?: string | null
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
          type?: string | null
          updated_at?: string
          url?: string | null
          visible?: boolean
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      speaking: {
        Row: {
          created_at: string
          date: string | null
          description: string | null
          event: string | null
          id: string
          image_url: string | null
          link: string | null
          location: string | null
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          event?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          location?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          event?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          location?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      speaking_topics: {
        Row: {
          audience: string | null
          available: boolean
          created_at: string
          description: string | null
          format: string | null
          id: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          audience?: string | null
          available?: boolean
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          audience?: string | null
          available?: boolean
          created_at?: string
          description?: string | null
          format?: string | null
          id?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          featured: boolean
          id: string
          name: string
          quote: string
          role: string | null
          sort_order: number
          updated_at: string
          visible: boolean
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          name: string
          quote: string
          role?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          name?: string
          quote?: string
          role?: string | null
          sort_order?: number
          updated_at?: string
          visible?: boolean
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
      ventures: {
        Row: {
          accent_color: string | null
          category: string | null
          connection: Database["public"]["Enums"]["connection_state"]
          cover_image: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          featured: boolean
          features: string[]
          id: string
          logo_url: string | null
          long_description: string | null
          name: string
          published: boolean
          published_at: string | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["venture_status"]
          tagline: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          accent_color?: string | null
          category?: string | null
          connection?: Database["public"]["Enums"]["connection_state"]
          cover_image?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          featured?: boolean
          features?: string[]
          id?: string
          logo_url?: string | null
          long_description?: string | null
          name: string
          published?: boolean
          published_at?: string | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["venture_status"]
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          accent_color?: string | null
          category?: string | null
          connection?: Database["public"]["Enums"]["connection_state"]
          cover_image?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          featured?: boolean
          features?: string[]
          id?: string
          logo_url?: string | null
          long_description?: string | null
          name?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["venture_status"]
          tagline?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      work_projects: {
        Row: {
          approach: string | null
          category: string | null
          challenge: string | null
          client: string | null
          cover_image: string | null
          created_at: string
          execution: string | null
          external_url: string | null
          featured: boolean
          gallery: string[]
          id: string
          overview: string | null
          published: boolean
          published_at: string | null
          result: string | null
          role: string | null
          slug: string
          sort_order: number
          summary: string | null
          tags: string[]
          title: string
          updated_at: string
          venture_id: string | null
          video_url: string | null
          year: string | null
        }
        Insert: {
          approach?: string | null
          category?: string | null
          challenge?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          execution?: string | null
          external_url?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          overview?: string | null
          published?: boolean
          published_at?: string | null
          result?: string | null
          role?: string | null
          slug: string
          sort_order?: number
          summary?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          venture_id?: string | null
          video_url?: string | null
          year?: string | null
        }
        Update: {
          approach?: string | null
          category?: string | null
          challenge?: string | null
          client?: string | null
          cover_image?: string | null
          created_at?: string
          execution?: string | null
          external_url?: string | null
          featured?: boolean
          gallery?: string[]
          id?: string
          overview?: string | null
          published?: boolean
          published_at?: string | null
          result?: string | null
          role?: string | null
          slug?: string
          sort_order?: number
          summary?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          venture_id?: string | null
          video_url?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_projects_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_editor: { Args: { _user_id: string }; Returns: boolean }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
      role_rank: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: number
      }
      user_rank: { Args: { _user_id: string }; Returns: number }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor" | "author"
      archive_category:
        | "work"
        | "build"
        | "thoughts"
        | "places"
        | "people"
        | "media"
      connection_state: "live" | "synced" | "curated" | "not_connected"
      content_status: "draft" | "scheduled" | "published" | "archived"
      enquiry_status: "new" | "reviewing" | "contacted" | "meeting" | "closed"
      venture_status:
        | "idea"
        | "building"
        | "beta"
        | "live"
        | "operating"
        | "paused"
        | "archived"
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
      app_role: ["super_admin", "admin", "editor", "author"],
      archive_category: [
        "work",
        "build",
        "thoughts",
        "places",
        "people",
        "media",
      ],
      connection_state: ["live", "synced", "curated", "not_connected"],
      content_status: ["draft", "scheduled", "published", "archived"],
      enquiry_status: ["new", "reviewing", "contacted", "meeting", "closed"],
      venture_status: [
        "idea",
        "building",
        "beta",
        "live",
        "operating",
        "paused",
        "archived",
      ],
    },
  },
} as const
