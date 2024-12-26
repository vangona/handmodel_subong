import { SupabaseStorage, SupabaseTable } from '$lib/constants/supabase';
import { supabase, type PostTable } from './supabaseClient';

export const apiGetPosts = async (): Promise<PostTable[]> => {
	const { data, error } = await supabase.from(SupabaseTable.Posts).select('*');
	if (error) throw new Error(error.message);
	return data ?? [];
};

export const apiDeletePost = async (id: number): Promise<void> => {
	const { error } = await supabase.from(SupabaseTable.Posts).delete().eq('id', id);
	if (error) throw new Error(error.message);
};

export const apiPostAddPost = async (post: { title: string; description: string; category: string[]; images: string[] }): Promise<void> => {
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error('사용자가 인증되지 않았습니다.');

	const { error } = await supabase.from(SupabaseTable.Posts).insert({
		...post,
		user_id: user.id
	});
	if (error) throw new Error(error.message);
};

export const apiGetPostById = async (postId: number): Promise<PostTable> => {
	const { data, error } = await supabase.from(SupabaseTable.Posts).select('*').eq('id', postId).single();
	if (error) throw new Error(error.message);
	if (!data) throw new Error('게시글을 찾을 수 없습니다.');
	return data;
};

export const apiPutUpdatePost = async (postId: number, post: { title: string; description: string; category: string[]; images: string[] }): Promise<void> => {
	const { error } = await supabase.from(SupabaseTable.Posts).update(post).eq('id', postId);
	if (error) throw new Error(error.message);
};

export const apiUploadImage = async (file: File): Promise<string> => {
	const fileExt = file.name.split('.').pop();
	const fileName = `${Math.random()}.${fileExt}`;
	const filePath = `${fileName}`;

	const { error: uploadError } = await supabase.storage
		.from(SupabaseStorage.PostImages)
		.upload(filePath, file);

	if (uploadError) {
		throw new Error('이미지 업로드 중 오류가 발생했습니다.');
	}

	const { data } = supabase.storage.from(SupabaseStorage.PostImages).getPublicUrl(filePath);

	return data.publicUrl;
};

export const apiDeleteImage = async (imageUrl: string): Promise<void> => {
	const fileName = imageUrl.split('/').pop();
	if (!fileName) throw new Error('이미지 파일 이름을 찾을 수 없습니다.');

	const { error } = await supabase.storage.from(SupabaseStorage.PostImages).remove([fileName]);
	if (error) throw new Error('이미지 삭제 중 오류가 발생했습니다.');
};

export async function apiUpdatePostThumbnail(
	postId: string,
	positionX: number,
	positionY: number,
	scale: number
) {
	const { data, error } = await supabase
		.from('posts')
		.update({
			thumbnail_position_x: positionX,
			thumbnail_position_y: positionY,
			thumbnail_scale: scale,
			updated_at: new Date().toISOString()
		})
		.eq('id', postId);

	if (error) throw new Error('섬네일 이미지 위치 업데이트 중 오류가 발생했습니다.');
	return data;
}
