import type { SupabaseTable } from '$lib/constants/supabase';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SupabaseTables {
	[SupabaseTable.Posts]: {
		Row: {
			id: number;
			created_at: string;
			title: string;
			category: Array<string>;
			description: string;
			images: Array<string>;
		};
		Insert: {
			title: string;
			description: string;
			category: Array<string>;
			images?: Array<string>;
		};
		Update: {
			title?: string;
			description?: string;
			category?: Array<string>;
			images?: Array<string>;
		};
	};
	[SupabaseTable.MainImages]: {
		Row: {
			id: number;
			url: string;
			position_x: number;
			position_y: number;
			created_at: string;
		};
		Insert: {
			url: string;
			position_x?: number;
			position_y?: number;
		};
		Update: {
			url?: string;
			position_x?: number;
			position_y?: number;
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
export const supabase = createClient<SupabaseDatabase>(supabaseUrl, supabaseAnonKey);
