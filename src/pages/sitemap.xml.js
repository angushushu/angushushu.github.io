import { getCollection } from 'astro:content';
import {
	formatDate,
	getAbsoluteUrl,
	getPostPath,
	getPostTags,
	isProtectedPost,
	sortPostsNewest,
} from '../utils/posts';

export async function GET() {
	// 受保护文章不进 sitemap，避免搜索引擎收录锁定页
	const posts = sortPostsNewest(await getCollection('blog')).filter((post) => !isProtectedPost(post));
	const latestPostDate = posts[0]?.data.updatedDate ?? posts[0]?.data.date ?? new Date();
	const tags = Array.from(new Set(posts.flatMap(getPostTags))).sort((a, b) => a.localeCompare(b));

	const staticUrls = [
		{ loc: '/', lastmod: latestPostDate, changefreq: 'monthly', priority: '1.0' },
		{ loc: '/writings/', lastmod: latestPostDate, changefreq: 'monthly', priority: '0.6' },
		{ loc: '/archives/', lastmod: latestPostDate, changefreq: 'monthly', priority: '0.6' },
		{ loc: '/tags/', lastmod: latestPostDate, changefreq: 'weekly', priority: '0.3' },
	];

	const postUrls = posts.map((post) => ({
		loc: getPostPath(post),
		lastmod: post.data.updatedDate ?? post.data.date,
		changefreq: 'monthly',
		priority: '0.6',
	}));

	const tagUrls = tags.map((tag) => ({
		loc: `/tags/${encodeURIComponent(tag)}/`,
		lastmod: latestPostDate,
		changefreq: 'weekly',
		priority: '0.2',
	}));

	const entries = [...staticUrls, ...postUrls, ...tagUrls].map((entry) => `  <url>
    <loc>${escapeXml(getAbsoluteUrl(entry.loc))}</loc>
    <lastmod>${formatDate(entry.lastmod)}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}

function escapeXml(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
