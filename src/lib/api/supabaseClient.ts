import type { SupabaseTable } from '$lib/constants/supabase';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SupabaseTables {
	[SupabaseTable.Posts]: {
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
	[SupabaseTable.MainImages]: {
		Row: {
			id: number;
			url: string | null;
			position_x: number | null;
			position_y: number | null;
      scale: number | null;
			created_at: string;
		};
		Insert: {
			url: string | null;
			position_x?: number | null;
			position_y?: number | null;
		};
		Update: {
			url?: string | null;
			position_x?: number | null;
			position_y?: number | null;
		};
	};
}

export interface SupabaseDatabase {
	public: {
		Tables: SupabaseTables;
	};
}

export type PostTable = SupabaseTables[SupabaseTable.Posts]['Row'];
export type MainImage = SupabaseTables[SupabaseTable.MainImages]['Row'];
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
