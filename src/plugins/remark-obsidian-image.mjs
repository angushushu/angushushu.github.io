import { visit } from 'unist-util-visit';

/**
 * Convert Obsidian ![[path]] wikilinks to standard markdown image nodes
 * and normalize relative image paths to /images/ for the web.
 */
export function remarkObsidianImage() {
  return (tree) => {
    visit(tree, 'paragraph', (paragraph, index, parent) => {
      if (!parent || index === undefined) return;
      const newChildren = [];

      for (const child of paragraph.children) {
        if (child.type !== 'text') {
          newChildren.push(child);
          continue;
        }

        const text = child.value;
        const regex = /!\[\[([^\]]+)\]\]/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
            newChildren.push({ type: 'text', value: text.slice(lastIndex, match.index) });
          }
          const wikiPath = match[1].trim();
          const parts = wikiPath.replace(/\\/g, '/').split('/');
          const filename = parts[parts.length - 1];
          newChildren.push({
            type: 'image',
            url: filename,
            alt: '',
            title: null,
          });
          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
          newChildren.push({ type: 'text', value: text.slice(lastIndex) });
        }
      }

      paragraph.children = newChildren;
    });

    // Normalize all image paths to /images/
    visit(tree, 'image', (node) => {
      if (node.url && !node.url.startsWith('http') && !node.url.startsWith('/')) {
        const filename = node.url.replace(/^\.\/images\//, '').replace(/^images\//, '');
        node.url = `/images/${filename}`;
      }
    });
  };
}
