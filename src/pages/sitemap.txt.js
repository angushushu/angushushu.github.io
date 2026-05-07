import { getCollection } from 'astro:content';
import { getAbsoluteUrl, getPostPath, getPostTags, sortPostsNewest } from '../utils/posts';

export async function GET() {
	const posts = sortPostsNewest(await getCollection('blog'));
	const tags = Array.from(new Set(posts.flatMap(getPostTags))).sort((a, b) => a.localeCompare(b));
	const paths = [
		'/',
		'/writings/',
		'/archives/',
		'/tags/',
		...posts.map(getPostPath),
		...tags.map((tag) => `/tags/${encodeURIComponent(tag)}/`),
	];

	return new Response(paths.map(getAbsoluteUrl).join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
