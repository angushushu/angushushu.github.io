// rehype plugin to convert raw ![](...) text back to proper <img> tags
// This handles wikilinks that remark didn't process correctly
import { visit } from 'unist-util-visit';

export function rehypeObsidianImage() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (!node.properties) return;

      if (node.tagName === 'img' && node.properties.src) {
        const src = node.properties.src;
        if (src && !src.startsWith('http') && !src.startsWith('/')) {
          const filename = src.replace(/^\.\/images\//, '').replace(/^images\//, '');
          node.properties.src = `/images/${filename}`;
        }
      }
    });

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || parent.tagName !== 'p') return;

      const match = node.value.match(/^!\[.*?\]\((.*?)\)$/);
      if (match) {
        const url = match[1];
        const fixedUrl = url.startsWith('http') || url.startsWith('/')
          ? url
          : `/images/${url.replace(/^\.\/images\//, '').replace(/^images\//, '')}`;

        const imgNode = {
          type: 'element',
          tagName: 'img',
          properties: { src: fixedUrl, alt: '' },
          children: [],
        };
        parent.children[index] = imgNode;
      }
    });

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || node.value.indexOf('![[') === -1) return;
      const regex = /!\[\[([^\]]+)\]\]/g;
      let match;
      const newNodes = [];
      let lastIndex = 0;
      const text = node.value;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          newNodes.push({ type: 'text', value: text.slice(lastIndex, match.index) });
        }
        const wikiPath = match[1].trim();
        const parts = wikiPath.replace(/\\/g, '/').split('/');
        const filename = parts[parts.length - 1];
        newNodes.push({
          type: 'element',
          tagName: 'img',
          properties: { src: `/images/${filename}`, alt: '' },
          children: [],
        });
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < text.length) {
        newNodes.push({ type: 'text', value: text.slice(lastIndex) });
      }

      if (newNodes.length > 1 || (newNodes.length === 1 && newNodes[0].type !== 'text')) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
