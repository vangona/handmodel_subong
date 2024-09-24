import { supabase, type TestTable } from '$lib/api/supabaseClient';

export const getTest = async (): Promise<Array<TestTable>> => {
	const res = await supabase.from('test').select('*');

	if (res.error) {
		throw res.error;
	} else {
		return res.data ?? [];
	}
};
