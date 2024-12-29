import type { PageLoad } from './$types';
import { apiGetPosts } from '$lib/api/posts';

export const load: PageLoad = async ({ url }) => {
    const postId = url.searchParams.get('post');
    const posts = await apiGetPosts();
    const selectedPost = postId ? posts?.find(post => post.id.toString() === postId) : null;

    return {
        posts,
        selectedPost,
        meta: {
            title: selectedPost 
                ? `${selectedPost.title} | 손모델 심수연 포트폴리오` 
                : '손모델 심수연 | 포트폴리오',
            description: selectedPost
                ? selectedPost.description.slice(0, 150) + (selectedPost.description.length > 150 ? '...' : '')
                : '손모델 심수연의 포트폴리오 사이트입니다. 다양한 광고와 촬영 작품을 확인하세요.',
            image: selectedPost?.images?.[0] ?? '/og-image.jpg',
            url: url.href
        }
    };
}; 