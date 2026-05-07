// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import remarkMath from 'remark-math';
import remarkBreaks from 'remark-breaks';
import rehypeKatex from 'rehype-katex';
import { remarkObsidianMath } from './src/plugins/remark-obsidian-math.mjs';
import { remarkObsidianImage } from './src/plugins/remark-obsidian-image.mjs';
import { rehypeObsidianImage } from './src/plugins/rehype-obsidian-image.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://angushushu.com',
	integrations: [
		mdx(),
		sitemap({
			filter: (page) => !/\/\d{4}\/\d{2}\/\d{2}\//.test(page) && !page.endsWith('/about/'),
		}),
	],
	markdown: {
		remarkPlugins: [remarkMath, remarkObsidianMath, remarkBreaks, remarkObsidianImage],
		rehypePlugins: [rehypeKatex, rehypeObsidianImage],
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
