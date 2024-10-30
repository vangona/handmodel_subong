import { supabase } from './supabaseClient';
import { SupabaseTable } from '$lib/constants/supabase';

export const apiGetCategories = async () => {
	const { data, error } = await supabase.from('categories').select('*');
	if (error) throw new Error(error.message);
	return data;
};

export const apiPostAddCategory = async (name: string) => {
	const { error } = await supabase.from('categories').insert({ name });
	if (error) throw new Error(error.message);
};

export const apiDeleteCategory = async (id: number) => {
	const { error } = await supabase.from('categories').delete().eq('id', id);
	if (error) throw new Error(error.message);
};

export async function apiUpdateCategory(id: number, name: string) {
    const { error } = await supabase
        .from(SupabaseTable.Categories)
        .update({ name })
        .eq('id', id);

    if (error) throw error;
}
