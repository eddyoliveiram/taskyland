export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      family_members: {
        Row: {
          id: string
          manager_id: string
          name: string
          avatar_url: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          manager_id: string
          name: string
          avatar_url?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          manager_id?: string
          name?: string
          avatar_url?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          member_id: string
          title: string
          description: string | null
          completed: boolean
          priority: 'low' | 'medium' | 'high'
          due_date: string | null
          completed_at: string | null
          created_at: string
          updated_at: string
          category: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          member_id: string
          title: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          category?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          member_id?: string
          title?: string
          description?: string | null
          completed?: boolean
          priority?: 'low' | 'medium' | 'high'
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          category?: string | null
          tags?: string[] | null
        }
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
  }
}
