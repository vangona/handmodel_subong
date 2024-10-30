import { SupabaseStorage, SupabaseTable } from '$lib/constants/supabase';
import { supabase, type MainImage } from './supabaseClient';

export async function apiGetMainImage(): Promise<MainImage[]> {
    const { data, error } = await supabase
        .from(SupabaseTable.MainImages)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

    if (error) throw error;
    return data;
}

export async function apiUploadMainImage(file: File) {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    // 기존 이미지 가져오기
    const { data: existingImages } = await supabase
        .from(SupabaseTable.MainImages)
        .select('*')
        .order('created_at', { ascending: false });

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // 새 이미지 업로드
    const { error: uploadError } = await supabase.storage
        .from(SupabaseStorage.MainImages)
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
        .from(SupabaseStorage.MainImages)
        .getPublicUrl(filePath);

    // DB에 새 이미지 정보 저장
    const { error: dbError } = await supabase
        .from(SupabaseTable.MainImages)
        .insert([{ url: publicUrl }]);

    if (dbError) throw dbError;

    // 기존 이미지들 삭제
    if (existingImages && existingImages.length > 0) {
        for (const image of existingImages) {
            // 스토리지에서 파일 삭제
            const oldFilePath = image.url.split('images/')[1];
            await supabase.storage
                .from(SupabaseStorage.MainImages)
                .remove([oldFilePath]);

            // DB에서 레코드 삭제
            await supabase
                .from(SupabaseTable.MainImages)
                .delete()
                .eq('id', image.id);
        }
    }

    return publicUrl;
}

export async function apiDeleteMainImage(imageId: string, imageUrl: string) {
    // 스토리지에서 파일 삭제
    const filePath = imageUrl.split('images/')[1];
    const { error: storageError } = await supabase.storage
        .from(SupabaseStorage.MainImages)
        .remove([filePath]);

    if (storageError) throw storageError;

    // DB에서 레코드 삭제
    const { error: dbError } = await supabase
        .from(SupabaseTable.MainImages)
        .delete()
        .eq('id', imageId);

    if (dbError) throw dbError;
} 