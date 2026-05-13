import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import remarkBreaks from 'remark-breaks';
import remarkMath from 'remark-math';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { rehypeObsidianImage } from '../plugins/rehype-obsidian-image.mjs';
import { remarkObsidianImage } from '../plugins/remark-obsidian-image.mjs';
import { remarkObsidianMath } from '../plugins/remark-obsidian-math.mjs';
import { getPostDescription, getPostPath, getPostTags, sortPostsNewest } from '../utils/posts';

function isAbsoluteLikeUrl(value) {
	return /^[a-z][a-z\d+.-]*:/i.test(value) || value.startsWith('#');
}

function rehypeAbsoluteUrls(site) {
	return (tree) => {
		visit(tree, 'element', (node) => {
			for (const key of ['href', 'src']) {
				const value = node.properties?.[key];
				if (typeof value === 'string' && !isAbsoluteLikeUrl(value)) {
					node.properties[key] = new URL(value, site).href;
				}
			}
		});
	};
}

async function renderPostContentForRss(post, site) {
	const file = await unified()
		.use(remarkParse)
		.use(remarkMath)
		.use(remarkObsidianMath)
		.use(remarkBreaks)
		.use(remarkObsidianImage)
		.use(remarkRehype, { allowDangerousHtml: true })
		.use(rehypeRaw)
		.use(rehypeKatex, { output: 'mathml' })
		.use(rehypeObsidianImage)
		.use(() => rehypeAbsoluteUrls(site))
		.use(rehypeStringify, { allowDangerousHtml: true })
		.process(post.body ?? '');

	return String(file);
}

export async function GET(context) {
	const posts = sortPostsNewest(await getCollection('blog'));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: await Promise.all(posts.map(async (post) => ({
			title: post.data.title,
			pubDate: post.data.date,
			description: getPostDescription(post),
			link: getPostPath(post),
			categories: getPostTags(post),
			content: await renderPostContentForRss(post, context.site),
		}))),
	});
}
