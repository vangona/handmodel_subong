import { SupabaseStorage, SupabaseTable } from '$lib/constants/supabase';
import { supabase } from './supabaseClient';
import type { MainImage } from './supabaseClient';

export async function apiGetMainImage(): Promise<MainImage[]> {
    const { data, error } = await supabase.from(SupabaseTable.MainImages)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function apiUploadMainImage(file: File, positionX: number = 50, positionY: number = 50) {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }

    // 기존 이미지 가져오기
    const { data: existingImages } = await supabase
        .from('main_images')
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
    const { data } = supabase.storage.from(SupabaseStorage.MainImages).getPublicUrl(filePath);

    // DB에 새 이미지 정보 저장
    const { error: dbError } = await supabase
        .from('main_images')
        .insert([{ 
            url: data.publicUrl,
            position_x: positionX,
            position_y: positionY
        }]);

    if (dbError) throw dbError;

    // 기존 이미지들 삭제
    if (existingImages && existingImages.length > 0) {
        for (const image of existingImages) {
            const fileName = image.url.split('/').pop();
            if (!fileName) throw new Error('이미지 파일 이름을 찾을 수 없습니다.');

            await supabase.storage
                .from(SupabaseStorage.MainImages)
                .remove([fileName]);

            await supabase
                .from('main_images')
                .delete()
                .eq('id', image.id);
        }
    }

    return data.publicUrl;
}

export async function apiUpdateImagePosition(
    imageId: string, 
    positionX: number, 
    positionY: number
) {
    const { data, error } = await supabase
        .from('main_images')
        .update({ 
            position_x: positionX,
            position_y: positionY,
            updated_at: new Date().toISOString()
        })
        .eq('id', imageId);

    if (error) throw new Error('이미지 위치 업데이트 중 오류가 발생했습니다.');
    return data;
} 