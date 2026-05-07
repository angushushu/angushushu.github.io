import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getPostDescription, getPostPath, sortPostsNewest } from '../utils/posts';

export async function GET(context) {
	const posts = sortPostsNewest(await getCollection('blog'));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			description: getPostDescription(post),
			link: getPostPath(post),
		})),
	});
}
