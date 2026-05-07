// Handle Obsidian wikilinks and normalize image paths
// Uses manual tree traversal because unist-util-visit is broken in Astro 6 remark
export function remarkObsidianImage() {
  return (tree) => {
    // Walk ALL nodes to process wikilinks and image paths
    walk(tree);

    function walk(node) {
      if (!node) return;

      if (node.type === 'paragraph' && node.children) {
        const newChildren = [];
        for (const child of node.children) {
          if (child.type === 'text') {
            const text = child.value;
            const regex = /!?\[\[([^\]]+)\]\]/g;
            let lastIdx = 0;
            let match;

            while ((match = regex.exec(text)) !== null) {
              if (match.index > lastIdx) {
                newChildren.push({ type: 'text', value: text.slice(lastIdx, match.index) });
              }
              const wikiPath = match[1].trim();
              const isEmbed = match[0].startsWith('!');
              const parts = wikiPath.replace(/\\/g, '/').split('/');

              if (isEmbed) {
                const filename = parts[parts.length - 1];
                newChildren.push({ type: 'image', url: filename, alt: '', title: null });
              } else {
                const name = parts[parts.length - 1].replace(/\.md$/i, '');
                const slug = name.replace(/\s+/g, '-').toLowerCase();
                newChildren.push({
                  type: 'link',
                  url: `/blog/${encodeURIComponent(slug)}/`,
                  title: null,
                  children: [{ type: 'text', value: name }]
                });
              }
              lastIdx = match.index + match[0].length;
            }
            if (lastIdx < text.length) {
              newChildren.push({ type: 'text', value: text.slice(lastIdx) });
            }
          } else {
            newChildren.push(child);
          }
        }
        node.children = newChildren;
      }

      // Normalize image paths
      if (node.type === 'image' && node.url) {
        if (!node.url.startsWith('http') && !node.url.startsWith('/')) {
          node.url = '/images/' + node.url.replace(/^\.\/images\//, '').replace(/^images\//, '');
        }
      }

      // Normalize raw HTML image paths
      if (node.type === 'html') {
        node.value = node.value.replace(
          /\bsrc=(["'])(?:\.\/)?images\/([^"']+)\1/g,
          'src=$1/images/$2$1',
        );
      }

      if (node.children) {
        for (const child of node.children) walk(child);
      }
    }
  };
}
