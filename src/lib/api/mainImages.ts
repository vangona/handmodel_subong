import { SupabaseStorage, SupabaseTable } from '$lib/constants/supabase';
import { supabase } from './supabaseClient';
import type { MainImage } from './supabaseClient';

export async function apiGetMainImage(): Promise<MainImage[]> {
    const { data, error } = await supabase
        .from(SupabaseTable.MainImages)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
    
    if (error) throw new Error(error.message);
    return data ?? [];
}

export async function apiUploadMainImage(file: File, positionX: number = 50, positionY: number = 50, scale: number = 1) {
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
    const { data } = supabase.storage.from(SupabaseStorage.MainImages).getPublicUrl(filePath);

    // DB에 새 이미지 정보 저장
    const { error: dbError } = await supabase
        .from(SupabaseTable.MainImages)
        .insert([{ 
            url: data.publicUrl,
            position_x: positionX,
            position_y: positionY,
            scale: scale
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
                .from(SupabaseTable.MainImages)
                .delete()
                .eq('id', image.id);
        }
    }

    return data.publicUrl;
}

export async function apiUpdateImagePosition(
    imageId: string, 
    positionX: number, 
    positionY: number,
    scale: number
) {
    // 먼저 이미지가 존재하는지 확인
    const { data: existingImage, error: fetchError } = await supabase
        .from(SupabaseTable.MainImages)
        .select()
        .eq('id', Number(imageId))
        .single();

    if (fetchError || !existingImage) {
        throw new Error('이미지를 찾을 수 없습니다.');
    }

    // 업데이트 실행
    const { error: updateError } = await supabase
        .from(SupabaseTable.MainImages)
        .update({ 
            position_x: Number(positionX),
            position_y: Number(positionY),
            scale: Number(scale)
        })
        .eq('id', Number(imageId));

    if (updateError) {
        console.error('Update error:', updateError);
        throw new Error(`이미지 위치 업데이트 중 오류가 발생했습니다: ${updateError.message}`);
    }

    // 업데이트된 데이터 반환
    return {
        ...existingImage,
        position_x: Number(positionX),
        position_y: Number(positionY),
        scale: Number(scale)
    };
} 