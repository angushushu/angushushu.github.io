import { getCollection } from 'astro:content';
import { getAbsoluteUrl, getPostPath, isProtectedPost, sortPostsNewest } from '../utils/posts';

export async function GET() {
	// 受保护文章的正文是密文原料，不能进搜索索引
	const posts = sortPostsNewest(await getCollection('blog')).filter((post) => !isProtectedPost(post));

	const entries = posts.map((post) => {
		const body = post.body || '';
		const plainText = body.replace(/<[^>]*>/g, '').replace(/&#x26;/g, '&').replace(/&amp;/g, '&');
		const url = getAbsoluteUrl(getPostPath(post));

		return `<entry>
		<title>${escapeXml(post.data.title)}</title>
		<url>${escapeXml(url)}</url>
		<content>${escapeXml(plainText)}</content>
	</entry>`;
	});

	const staticEntries = [
		{
			title: 'Shu Hu',
			url: getAbsoluteUrl('/'),
			content: 'Shu Hu personal website research writings blog psychology computational models film perception',
		},
		{
			title: 'Writings',
			url: getAbsoluteUrl('/writings/'),
			content: 'Publications psychology screenplay posters research papers writings',
		},
		{
			title: 'Tags',
			url: getAbsoluteUrl('/tags/'),
			content: 'Blog tags skill math theory model thoughts',
		},
	].map((entry) => `<entry>
		<title>${escapeXml(entry.title)}</title>
		<url>${escapeXml(entry.url)}</url>
		<content>${escapeXml(entry.content)}</content>
	</entry>`);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<search>
${[...entries, ...staticEntries].join('\n')}
</search>`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' },
	});
}

function escapeXml(s) {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
