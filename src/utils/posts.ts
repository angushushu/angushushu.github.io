import type { CollectionEntry } from 'astro:content';

export const SITE_URL = 'https://angushushu.com';

type BlogPost = CollectionEntry<'blog'>;
type DateLike = Date | string | number;

const pad = (n: number) => String(n).padStart(2, '0');

function toDate(value: DateLike): Date {
	return value instanceof Date ? value : new Date(value);
}

export function getDateParts(value: DateLike) {
	const date = toDate(value);
	const isUtcMidnight =
		date.getUTCHours() === 0 &&
		date.getUTCMinutes() === 0 &&
		date.getUTCSeconds() === 0 &&
		date.getUTCMilliseconds() === 0;
	const localDiffersFromUtc =
		date.getFullYear() !== date.getUTCFullYear() ||
		date.getMonth() !== date.getUTCMonth() ||
		date.getDate() !== date.getUTCDate();

	if (isUtcMidnight && localDiffersFromUtc) {
		return {
			year: date.getUTCFullYear(),
			month: date.getUTCMonth() + 1,
			day: date.getUTCDate(),
			hour: 0,
			minute: 0,
			second: 0,
		};
	}

	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds(),
	};
}

export function formatDate(value: DateLike) {
	const { year, month, day } = getDateParts(value);
	return `${year}-${pad(month)}-${pad(day)}`;
}

export function formatMonthDay(value: DateLike) {
	const { month, day } = getDateParts(value);
	return `${pad(month)}-${pad(day)}`;
}

export function formatDateTime(value: DateLike) {
	const { hour, minute, second } = getDateParts(value);
	return `${formatDate(value)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
}

export function getPostYear(post: BlogPost) {
	return getDateParts(post.data.date).year;
}

export function getPostSlug(post: BlogPost) {
	return post.data.slug ?? post.id;
}

export function getPostPath(post: BlogPost) {
	return `/blog/${getPostSlug(post)}/`;
}

export function getAbsoluteUrl(path: string) {
	return new URL(path, SITE_URL).href;
}

export function getLegacyPostPath(post: BlogPost) {
	const { year, month, day } = getDateParts(post.data.date);
	return `/${year}/${pad(month)}/${pad(day)}/${getPostSlug(post)}/`;
}

export function getPostTags(post: BlogPost) {
	const tags = post.data.tags;
	if (Array.isArray(tags)) return tags.filter(Boolean);
	if (typeof tags === 'string') return tags.split(/[\s,]+/).filter(Boolean);
	return [];
}

export function isProtectedPost(post: BlogPost) {
	return !!post.data.password_id;
}

export function getPostDescription(post: BlogPost) {
	// 受保护文章的正文是机密的，meta description 不能从正文提取
	if (isProtectedPost(post)) return 'This post is password protected.';

	if (post.data.description) return post.data.description;

	const text = (post.body ?? '')
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/<img\b[^>]*>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/[`*_#>$|:[\](){},.]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	return text ? text.slice(0, 160) : 'Personal website and blog';
}

export function sortPostsNewest<T extends BlogPost>(posts: T[]) {
	return [...posts].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
