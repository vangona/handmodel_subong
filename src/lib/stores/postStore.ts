import { writable, derived } from 'svelte/store';
import type { PostTable } from '$lib/api/supabaseClient';

interface PostCache {
    posts: PostTable[];
    lastFetched: number;
    hasMore: boolean;
    currentPage: number;
    pageSize: number;
    category: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5분

function createPostStore() {
    const initialState: PostCache = {
        posts: [],
        lastFetched: 0,
        hasMore: true,
        currentPage: 1,
        pageSize: 12,
        category: null
    };

    const { subscribe, set, update } = writable<PostCache>(initialState);

    return {
        subscribe,
        setPosts: (posts: PostTable[]) => {
            update(state => ({
                ...state,
                posts,
                lastFetched: Date.now()
            }));
        },
        addPosts: (newPosts: PostTable[]) => {
            update(state => ({
                ...state,
                posts: [...state.posts, ...newPosts],
                hasMore: newPosts.length === state.pageSize,
                currentPage: state.currentPage + 1
            }));
        },
        setCategory: (category: string | null) => {
            update(state => ({
                ...state,
                category,
                posts: [],
                currentPage: 1,
                hasMore: true
            }));
        },
        reset: () => {
            set(initialState);
        },
        isCacheValid: () => {
            let state: PostCache | undefined;
            subscribe(s => { state = s; })();
            return state ? Date.now() - state.lastFetched < CACHE_DURATION : false;
        }
    };
}

export const postStore = createPostStore();

// 파생 스토어: 현재 카테고리의 게시글만 필터링
export const filteredPosts = derived(postStore, $postStore => {
    if (!$postStore.category) return $postStore.posts;
    return $postStore.posts.filter(post => 
        post.category?.includes($postStore.category!) ?? false
    );
}); 