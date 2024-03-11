import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
import * as utils from '#/utils';
import { FILENAME_OR_IGNORE_PATTERNS_ERROR_MESSAGE } from '#/utils/get-all-file-paths/get-all-file-paths.constants';
import { getRootGitIgnorePatterns } from '#/utils/get-all-file-paths/utils';

describe('getAllFilePaths', () => {
  test('✅ Get all package.json paths', async () => {
    const packageJsonName = 'package.json';
    const gitIgnorePatterns = await getRootGitIgnorePatterns();
    const paths = await utils.getAllFilePaths({
      filename: packageJsonName,
      ignorePatterns: [...DEFAULT_IGNORE_PATTERNS, ...gitIgnorePatterns],
    });

    paths?.forEach((path) => {
      expect(path.includes('package.json')).toBe(true);
    });
  });

  test('❗ Has an error get all file paths', async () => {
    await expect(
      utils.getAllFilePaths({
        filename: '',
        ignorePatterns: [],
      }),
    ).rejects.toThrow(FILENAME_OR_IGNORE_PATTERNS_ERROR_MESSAGE);
  });
});
