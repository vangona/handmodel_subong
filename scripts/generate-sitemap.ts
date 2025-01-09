import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// .env 파일 로드
dotenv.config();

// Supabase 설정
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function generateSitemap() {
    try {
        // 모든 포스트 가져오기
        const { data: posts, error } = await supabase
            .from('posts')
            .select('id, created_at')
            .order('created_at', { ascending: false });

        if (error) throw error;

        const today = new Date().toISOString().split('T')[0];

        // XML 생성
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- 메인 페이지 -->
    <url>
        <loc>https://subong.vercel.app/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- 포스트 페이지 -->
    ${posts?.map(post => `    <url>
        <loc>https://subong.vercel.app/?post=${post.id}</loc>
        <lastmod>${new Date(post.created_at).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('\n')}

    <!-- About 페이지 -->
    <url>
        <loc>https://subong.vercel.app/about</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Contact 페이지 -->
    <url>
        <loc>https://subong.vercel.app/contact</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>`;

        // sitemap.xml 파일 저장
        fs.writeFileSync(path.join(process.cwd(), 'static', 'sitemap.xml'), xml);
        console.log('✅ sitemap.xml이 성공적으로 생성되었습니다.');

    } catch (error) {
        console.error('❌ sitemap.xml 생성 중 오류가 발생했습니다:', error);
        process.exit(1);
    }
}

generateSitemap(); 