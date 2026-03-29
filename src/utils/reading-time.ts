/**
 * 计算中文内容阅读时间
 * 中文: ~300字/分钟, 英文: ~200词/分钟, 代码: ~100字符/分钟
 */
export function getReadingTime(content: string): number {
  const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (content.match(/[a-zA-Z]+/g) || []).length;
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).join('').length;

  const minutes = chineseChars / 300 + englishWords / 200 + codeBlocks / 100;
  return Math.max(1, Math.ceil(minutes));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} 分钟阅读`;
}
