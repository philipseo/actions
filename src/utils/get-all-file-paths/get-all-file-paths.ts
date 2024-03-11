import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import * as path from 'node:path';

import { FILENAME_OR_IGNORE_PATTERNS_ERROR_MESSAGE } from '#/utils/get-all-file-paths/get-all-file-paths.constants';
import { isIgnoredPattern } from '#/utils/get-all-file-paths/utils';
import { getRootPath } from '#/utils/get-root-path';

/**
 * @property {string} filename - filename
 * @property {string[]} ignorePatterns - ignore patterns
 */
interface GetAllFilePathsProps {
  filename: string;
  ignorePatterns: string[];
}

async function getAllFilePaths({
  filename,
  ignorePatterns,
}: GetAllFilePathsProps) {
  const rootPath = await getRootPath();
  const paths: string[] = [];

  if (!filename || ignorePatterns.length <= 0) {
    throw new Error(FILENAME_OR_IGNORE_PATTERNS_ERROR_MESSAGE);
  } else {
    // eslint-disable-next-line no-inner-declarations
    const recursiveGetFilePaths = async (currentDirectoryPath: string) => {
      const currentDirectoryFilePath = path.join(
        currentDirectoryPath,
        filename,
      );
      const isExistsFile = existsSync(currentDirectoryFilePath);

      if (isExistsFile) {
        paths.push(currentDirectoryFilePath);
      }

      const subItems = await readdir(currentDirectoryPath);

      for await (const subItem of subItems) {
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
    };

    await recursiveGetFilePaths(rootPath);

    return paths;
  }
}

export default getAllFilePaths;
