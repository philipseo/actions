import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

import { getRootPath, isIgnoredPattern } from '@philipseo/scripts';

import { FILENAME_OR_IGNORE_PATTERNS_ERROR_MESSAGE } from '#/utils/get-all-file-paths/get-all-file-paths.constants';

interface getAllFilePathsProps {
  filename: string;
  ignorePatterns: string[];
}

async function getAllFilePaths({
  filename,
  ignorePatterns,
}: getAllFilePathsProps) {
  const rootPath = await getRootPath();
  const paths: string[] = [];

  if (!filename || ignorePatterns.length <= 0) {
    throw new Error(FILENAME_OR_IGNORE_PATTERNS_ERROR_MESSAGE);
  } else {
    // eslint-disable-next-line no-inner-declarations
    async function recursiveGetFilePaths(currentDirectoryPath: string) {
      const currentDirectoryFilePath = path.join(
        currentDirectoryPath,
        filename,
      );
      const isExistsFile = existsSync(currentDirectoryFilePath);

      if (isExistsFile) {
        paths.push(currentDirectoryFilePath);
      }

      const subItems = await readdir(currentDirectoryPath);

      for (const subItem of subItems) {
        const stats = await stat(path.join(currentDirectoryPath, subItem));
        const isDirectory = stats.isDirectory();

        if (
          !isIgnoredPattern({
            ignorePatterns: ignorePatterns,
            pattern: subItem,
          }) &&
          isDirectory
        ) {
          await recursiveGetFilePaths(path.join(currentDirectoryPath, subItem));
        }
      }
    }

    await recursiveGetFilePaths(rootPath);

    return paths;
  }
}

export default getAllFilePaths;
