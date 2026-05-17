import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
		schema: ({ image }) =>
			z.object({
				title: z.string(),
				date: z.coerce.date(),
				slug: z.string().optional(),
				tags: z.union([z.string(), z.array(z.string()), z.null()]).optional().transform(v => v ?? []),
				description: z.string().optional(),
				updatedDate: z.coerce.date().optional(),
				heroImage: z.optional(image()),
				password: z.string().optional(),
				password_hint: z.string().optional(),
			}),
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		profile: z.object({
			avatar: z.string(),
			avatarAlt: z.string().optional(),
			name: z.string(),
			emails: z.array(z.string()).default([]),
			links: z.array(z.object({
				label: z.string(),
				href: z.string(),
				external: z.boolean().optional(),
			})).default([]),
		}).optional(),
	}),
});

export const collections = { blog, pages };
