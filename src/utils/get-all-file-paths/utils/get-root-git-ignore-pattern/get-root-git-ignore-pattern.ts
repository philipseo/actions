import { readFile } from 'node:fs/promises';

import getRootPath from '#/utils/get-root-path/get-root-path';

async function getRootGitIgnorePatterns() {
  const rootPath = await getRootPath();
  const getRootGitIgnorePatterns = `${rootPath}/.gitignore`;
  const ignorePatterns: Array<string> = [];
  const gitignoreFile = await readFile(getRootGitIgnorePatterns, {
    encoding: 'utf8',
  });

  gitignoreFile.split('\n').forEach((pattern: string) => {
    pattern = pattern.trim();

    // Exclude empty strings, comments, and files.
    if (
      pattern !== '' &&
      !pattern.startsWith('#') &&
      !pattern.startsWith('*')
    ) {
      ignorePatterns.push(pattern.replace('*', ''));
    }
  });

  return ignorePatterns;
}

export default getRootGitIgnorePatterns;
