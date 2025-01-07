import type { PageLoad } from './$types';
import { postStore } from '$lib/stores/postStore';
import { get } from 'svelte/store';
import { supabase } from '$lib/api/supabaseClient';

export const load: PageLoad = async () => {
    const store = get(postStore);
    
    // 캐시가 유효하면 캐시된 데이터 사용
    if (postStore.isCacheValid()) {
        return {
            posts: store.posts
        };
    }

    // 캐시가 없거나 만료되었으면 새로 로드
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('order', { ascending: true })
        .range(0, store.pageSize - 1);

    if (error) {
        console.error('게시글 로딩 실패:', error);
        return {
            posts: []
        };
    }

    // 스토어 업데이트
    postStore.setPosts(posts);

    return {
        posts
    };
}; 