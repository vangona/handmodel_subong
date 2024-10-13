import { supabase } from './supabaseClient';

export const apiPostLogin = async (email: string, password: string) => {
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw new Error(error.message);
};

export const apiPostLogout = async () => {
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
};

export const apiGetUser = async () => {
	const { data, error } = await supabase.auth.getUser();
	if (error || !data.user) throw new Error('로그인이 필요합니다.');
	return data.user;
};
