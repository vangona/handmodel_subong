import type { RequestHandler } from './$types';
import { supabase } from '$lib/api/supabaseClient';

export const GET: RequestHandler = async () => {
    // 모든 포스트 가져오기
    const { data: posts } = await supabase
        .from('posts')
        .select('id, created_at')
        .order('created_at', { ascending: false });

    // XML 생성
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://subong.vercel.app/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>${posts?.map(post => `
    <url>
        <loc>https://subong.vercel.app/?post=${post.id}</loc>
        <lastmod>${new Date(post.created_at).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`).join('')}
    <url>
        <loc>https://subong.vercel.app/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://subong.vercel.app/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`.trim();

    return new Response(xml, {
        headers: {
            'Content-Type': 'text/xml',
            'Cache-Control': 'max-age=0, s-maxage=3600'
        }
    });
}; 