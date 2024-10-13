import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SupabaseTables {
	posts: {
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
}

export interface SupabaseDatabase {
	public: {
		Tables: SupabaseTables;
	};
}

export type PostTable = SupabaseTables['posts']['Row'];

export const supabase = createClient<SupabaseDatabase>(supabaseUrl, supabaseAnonKey);
