export function getReadingStats(body: string): { wordCount: number; readingTime: number } {
  const chineseChars = (body.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const englishWords = (body.match(/\b[a-zA-Z]+\b/g) || []).length;
  const wordCount = chineseChars + englishWords;
  const readingTime = Math.max(1, Math.ceil(wordCount / 275));
  return { wordCount, readingTime };
}
