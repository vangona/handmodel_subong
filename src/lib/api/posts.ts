import { supabase } from './supabaseClient';

export const apiGetPosts = async () => {
	const { data, error } = await supabase.from('posts').select('*');
	if (error) throw new Error(error.message);
	return data;
};

export const apiDeletePost = async (id: number) => {
	const { error } = await supabase.from('posts').delete().eq('id', id);
	if (error) throw new Error(error.message);
};

export const apiPostAddPost = async (post: { title: string; description: string; category: string[] }) => {
	const { error } = await supabase.from('posts').insert(post);
	if (error) throw new Error(error.message);
};

export const apiGetPostById = async (postId: number) => {
	const { data, error } = await supabase.from('posts').select('*').eq('id', postId).single();
	if (error) throw new Error(error.message);
	return data;
};

export const apiPutUpdatePost = async (postId: number, post: { title: string; description: string; category: string[] }) => {
	const { error } = await supabase.from('posts').update(post).eq('id', postId);
	if (error) throw new Error(error.message);
};
