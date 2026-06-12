import type { Root } from "mdast";

function extractText(node: any): string {
  if (node.type === "text" || node.type === "inlineCode") {
    return node.value || "";
  }
  if (node.type === "code") {
    return "";
  }
  if (node.type === "html") {
    return "";
  }
  if (node.children) {
    return node.children.map(extractText).join("");
  }
  return "";
}

export function remarkReadingTime() {
  return (_tree: Root, file: any) => {
    const text = extractText(_tree);
    const chineseChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const englishWords = (text.match(/\b[a-zA-Z]+\b/g) || []).length;
    const wordCount = chineseChars + englishWords;
    const readingTime = Math.max(1, Math.ceil(wordCount / 275));

    file.data.astro = file.data.astro || {};
    file.data.astro.frontmatter = file.data.astro.frontmatter || {};
    file.data.astro.frontmatter.wordCount = wordCount;
    file.data.astro.frontmatter.readingTime = readingTime;
  };
}
