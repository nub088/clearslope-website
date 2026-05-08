const WORDS_PER_MINUTE = 225;

export function readingTimeMinutes(markdown: string): number {
  if (!markdown) return 1;
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_~#>\[\]\(\)!]/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
