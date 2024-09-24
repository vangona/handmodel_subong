import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface SupabaseTables {
	test: {
		Row: {
			id: number;
			created_at: string;
			test: string;
			category: Array<string>;
			description: string;
		};
		Insert: {
			test: string;
			description: string;
			category: Array<string>;
		};
		Update: {
			test: string;
			description: string;
			category: Array<string>;
		};
	};
}

export interface SupabaseDatabase {
	public: {
		Tables: SupabaseTables;
	};
}

export type TestTable = SupabaseTables['test']['Row'];

// error는 실제로 any 타입
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isPostgresError = (error: any) => {
	console.log(error);
	return Boolean(error.message);
};

export const supabase = createClient<SupabaseDatabase>(supabaseUrl, supabaseAnonKey);
