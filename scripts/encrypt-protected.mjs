// 构建后处理：把 dist 里受保护文章的正文用 AES-256-GCM 加密。
// Astro 先把正文正常渲染进 HTML（保证渲染管线与普通文章完全一致），本脚本再把
// #protected-content 的 innerHTML 替换为密文，密文参数写进 #password-prompt 的
// data-payload（v1.<salt b64>.<iv b64>.<ciphertext+authTag b64>），供浏览器 WebCrypto 解密。
// 密码从环境变量 SITE_PW_<password_id大写> 读取（本地 .env.local，线上 GitHub Actions secret），
// 读不到就让构建直接失败，宁可发不出去也不发布明文。
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createCipheriv, pbkdf2Sync, randomBytes } from 'node:crypto';
import { join } from 'node:path';

const ITERATIONS = 600000; // OWASP 对 PBKDF2-HMAC-SHA256 的现行建议值
const PROMPT_TAG = '<div id="password-prompt"';

function loadDotEnvLocal() {
	let text;
	try {
		text = readFileSync(join(process.cwd(), '.env.local'), 'utf8');
	} catch {
		return;
	}
	for (const line of text.split(/\r?\n/)) {
		const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
		if (!m) continue;
		if (!(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
	}
}

function* walkHtmlFiles(dir) {
	for (const name of readdirSync(dir)) {
		const p = join(dir, name);
		if (statSync(p).isDirectory()) yield* walkHtmlFiles(p);
		else if (name === 'index.html') yield p;
	}
}

function findProtectedBlock(html) {
	const idAt = html.indexOf('id="protected-content"');
	if (idAt === -1) return null;
	const innerStart = html.indexOf('>', idAt) + 1;
	const promptAt = html.indexOf(PROMPT_TAG, innerStart);
	if (promptAt === -1) throw new Error('found protected content but no password prompt after it');
	const closeAt = html.lastIndexOf('</div>', promptAt);
	if (closeAt < innerStart) throw new Error('malformed protected content block');
	return { innerStart, closeAt };
}

loadDotEnvLocal();

let encrypted = 0;
for (const file of walkHtmlFiles('dist')) {
	const html = readFileSync(file, 'utf8');
	const block = findProtectedBlock(html);
	if (!block) continue;

	const pwId = html.match(/data-pw-id="([^"]+)"/)?.[1];
	if (!pwId) throw new Error(`${file}: protected block is missing data-pw-id`);
	const envKey = `SITE_PW_${pwId.toUpperCase()}`;
	const password = process.env[envKey];
	if (!password) {
		throw new Error(
			`${file}: ${envKey} is not set (add it to .env.local locally, or to the repo secrets in CI); refusing to publish protected content unencrypted`
		);
	}

	const inner = html.slice(block.innerStart, block.closeAt);
	if (!inner.trim()) throw new Error(`${file}: protected content is empty`);

	const salt = randomBytes(16);
	const iv = randomBytes(12);
	const key = pbkdf2Sync(password, salt, ITERATIONS, 32, 'sha256');
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const ciphertext = Buffer.concat([
		cipher.update(inner, 'utf8'),
		cipher.final(),
		cipher.getAuthTag(), // WebCrypto 期望 tag 紧跟在密文后面
	]);
	const payload = `v1.${salt.toString('base64')}.${iv.toString('base64')}.${ciphertext.toString('base64')}`;

	// 清空正文，只留一个空容器给解密后注入
	const stripped = html.slice(0, block.innerStart) + html.slice(block.closeAt);
	const at = stripped.indexOf(PROMPT_TAG);
	if (at === -1) throw new Error(`${file}: prompt div vanished after stripping`);
	const injected =
		stripped.slice(0, at) +
		`<div id="password-prompt" data-payload="${payload}" data-iter="${ITERATIONS}"` +
		stripped.slice(at + PROMPT_TAG.length);

	writeFileSync(file, injected);
	encrypted++;
	console.log(`encrypt-protected: encrypted ${file} (password id: ${pwId})`);
}

console.log(`encrypt-protected: ${encrypted} protected block(s) processed`);
