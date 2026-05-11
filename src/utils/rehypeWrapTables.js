export function rehypeWrapTables() {
  return tree => {
    wrapTables(tree);
  };
}

function wrapTables(node) {
  const children = node?.children;
  if (!Array.isArray(children)) return;

  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];

    if (child?.type === "element" && child.tagName === "table") {
      children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["markdown-table-scroll"] },
        children: [child],
      };
      continue;
    }

    wrapTables(child);
  }
}
