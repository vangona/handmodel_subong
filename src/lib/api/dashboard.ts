import { supabase } from './supabaseClient';

export const apiGetDashboardData = async () => {
	try {
		const { data: postCount, error: postError } = await supabase.from('posts').select('id', { count: 'exact' });
		const { data: categoryCount, error: categoryError } = await supabase.from('categories').select('id', { count: 'exact' });
		const { data: userCount, error: userError } = await supabase.from('users').select('id', { count: 'exact' });

		if (postError || categoryError || userError) {
			throw new Error(postError?.message || categoryError?.message || userError?.message || '데이터를 가져오는 중 오류가 발생했습니다.');
		}

		return {
			totalPosts: postCount.length,
			totalCategories: categoryCount.length,
			totalUsers: userCount.length
		};
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(error.message);
		} else {
			throw new Error('데이터를 가져오는 중 오류가 발생했습니다.');
		}
	}
};
