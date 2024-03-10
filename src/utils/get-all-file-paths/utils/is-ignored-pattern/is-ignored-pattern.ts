interface IsIgnoredPatternProps {
  /* ignore pattern list */
  ignorePatterns: string[];
  /* pattern to check */
  pattern: string;
}

function isIgnoredPattern({ ignorePatterns, pattern }: IsIgnoredPatternProps) {
  const reversedIgnorePatterns = [...ignorePatterns].reverse();
  let index = 0;

  while (index < ignorePatterns.length) {
    const currentIgnorePattern = reversedIgnorePatterns[index]
      .trim()
      .replace(/\/$/, '');
    if (currentIgnorePattern.trim() === '') {
      index++;
      continue;
    }

    const isNegation = currentIgnorePattern.startsWith('!');
    const normalizedPattern = isNegation
      ? currentIgnorePattern.slice(1)
      : currentIgnorePattern;

    const regexPattern = normalizedPattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\\\*\*/g, '.*')
      .replace(/\\\*/g, '[^/]*')
      .replace(/\\\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);

    if (regex.test(pattern) || pattern.includes(normalizedPattern)) {
      return !isNegation;
    } else if (
      isNegation &&
      !regex.test(pattern) &&
      !pattern.includes(normalizedPattern)
    ) {
      return true;
    }

    index++;
  }

  return false;
}

export default isIgnoredPattern;
