import { supabase } from './supabaseClient';

export const apiGetUsers = async () => {
	const { data, error } = await supabase.from('users').select('id, email');
	if (error) throw new Error(error.message);
	return data;
};

export const apiPostAddUser = async (email: string) => {
	const { error } = await supabase.auth.admin.createUser({ email });
	if (error) throw new Error(error.message);
};

export const apiDeleteUser = async (id: string) => {
	const { error } = await supabase.auth.admin.deleteUser(id);
	if (error) throw new Error(error.message);
};
