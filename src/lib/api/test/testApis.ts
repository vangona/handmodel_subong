import { supabase, type TestTable } from '$lib/api/supabaseClient';

export const getTest = async (): Promise<Array<TestTable>> => {
	const res = await supabase.from('test').select('*');

	if (res.error) {
		// TODO: 에러 핸들링 추가하기
		// res.error에 제네릭으로 타입을 주는 방법은 없어보인다. 타입 가드 할 방법이 없을까?
		throw res.error;
	} else {
		return res.data ?? [];
	}
};
