import { getRootGitIgnorePatterns } from '#/utils/get-all-file-paths/utils';

describe('getRootGitIgnorePatterns function', () => {
  test('✅ get ignore patterns from root .gitignore', async () => {
    const rootGitIgnorePatterns = await getRootGitIgnorePatterns();

    expect(rootGitIgnorePatterns).not.toBeNull();
  });
});
