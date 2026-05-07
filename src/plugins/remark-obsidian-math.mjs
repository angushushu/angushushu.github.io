function getSource(file) {
  if (typeof file?.value === 'string') return file.value;
  return String(file || '');
}

function getRawSource(node, source) {
  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;
  if (typeof start !== 'number' || typeof end !== 'number') return '';
  return source.slice(start, end);
}

function isWhitespace(node) {
  return node.type === 'text' && /^\s*$/.test(node.value);
}

function trimParagraphChildren(children) {
  const trimmed = children.map((child) => ({ ...child }));

  while (trimmed.length > 0 && isWhitespace(trimmed[0])) trimmed.shift();
  while (trimmed.length > 0 && isWhitespace(trimmed[trimmed.length - 1])) trimmed.pop();

  if (trimmed[0]?.type === 'text') {
    trimmed[0].value = trimmed[0].value.replace(/^\s+/, '');
  }
  const last = trimmed[trimmed.length - 1];
  if (last?.type === 'text') {
    last.value = last.value.replace(/\s+$/, '');
  }

  return trimmed.filter((child) => !(child.type === 'text' && child.value.length === 0));
}

function hasContent(children) {
  return children.some((child) => !(child.type === 'text' && /^\s*$/.test(child.value)));
}

function toDisplayMath(node) {
  return {
    type: 'math',
    meta: null,
    value: node.value,
    data: {
      hName: 'pre',
      hChildren: [
        {
          type: 'element',
          tagName: 'code',
          properties: { className: ['language-math', 'math-display'] },
          children: [{ type: 'text', value: node.value }],
        },
      ],
    },
    position: node.position,
  };
}

function isStandaloneDoubleDollarMath(node, source, lines) {
  if (node.type !== 'inlineMath') return false;

  const raw = getRawSource(node, source);
  if (!raw.startsWith('$$') || !raw.endsWith('$$')) return false;

  const startLine = node.position?.start?.line;
  const endLine = node.position?.end?.line;
  if (typeof startLine !== 'number' || startLine !== endLine) return false;

  return lines[startLine - 1]?.trim() === raw.trim();
}

function splitParagraph(paragraph, source, lines) {
  const blocks = [];
  let inlineChildren = [];
  let changed = false;

  const flushParagraph = () => {
    const children = trimParagraphChildren(inlineChildren);
    if (hasContent(children)) {
      blocks.push({ ...paragraph, children });
    }
    inlineChildren = [];
  };

  for (const child of paragraph.children) {
    if (isStandaloneDoubleDollarMath(child, source, lines)) {
      flushParagraph();
      blocks.push(toDisplayMath(child));
      changed = true;
    } else {
      inlineChildren.push(child);
    }
  }

  flushParagraph();
  return changed ? blocks : [paragraph];
}

/**
 * Match Obsidian's one-line display math convention:
 *
 *   $$a+b$$
 *
 * remark-math treats that form as inline math, while Obsidian displays it as
 * a block when it occupies its own source line.
 */
export function remarkObsidianMath() {
  return (tree, file) => {
    const source = getSource(file);
    const lines = source.split(/\r?\n/);

    const walk = (parent) => {
      if (!Array.isArray(parent.children)) return;

      for (let index = 0; index < parent.children.length; index++) {
        const child = parent.children[index];

        if (child.type === 'paragraph') {
          const replacement = splitParagraph(child, source, lines);
          if (replacement.length !== 1 || replacement[0] !== child) {
            parent.children.splice(index, 1, ...replacement);
            index += replacement.length - 1;
            continue;
          }
        }

        walk(child);
      }
    };

    walk(tree);
  };
}
