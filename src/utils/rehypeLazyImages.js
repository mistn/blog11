export function rehypeLazyImages() {
  return (tree) => {
    walk(tree);
  };
}

function walk(node) {
  if (node.type === "element" && node.tagName === "img") {
    node.properties = node.properties || {};
    node.properties.loading = "lazy";
    node.properties.decoding = "async";
  }
  if (node.children) {
    for (const child of node.children) {
      walk(child);
    }
  }
}
