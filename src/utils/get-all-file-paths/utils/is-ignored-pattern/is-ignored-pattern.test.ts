import { isIgnoredPattern } from '#/utils/get-all-file-paths/utils';

describe('isIgnoredPattern', () => {
  test('✅ empty ignore pattern is skipped', () => {
    const ignorePatterns = ['**/*.js', '**/*.ts', ''];

    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/index.js' })).toBe(
      true,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/test.ts' })).toBe(
      true,
    );
    expect(
      isIgnoredPattern({ ignorePatterns, pattern: 'src/index.json' }),
    ).toBe(false);
    expect(isIgnoredPattern({ ignorePatterns, pattern: '' })).toBe(false);
  });

  test('✅ only .js files are not ignored with negation', () => {
    const ignorePatterns = ['!**/*.js', '**/*.ts'];

    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/index.js' })).toBe(
      false,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/test.ts' })).toBe(
      true,
    );
  });

  test('✅ files with .js extension are not ignored, except for app?.ts', () => {
    const ignorePatterns = ['src/app?.ts'];

    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/index.js' })).toBe(
      false,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/app1.ts' })).toBe(
      true,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/app12.ts' })).toBe(
      false,
    );
  });

  test('✅ no files are ignored with multiple negations', () => {
    const ignorePatterns = ['!**/*.js', '!**/*.ts'];

    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/index.js' })).toBe(
      true,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/app.ts' })).toBe(
      false,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'node_modules' })).toBe(
      true,
    );
  });

  test('✅ ignores directories with trailing slash and TypeScript files', () => {
    const ignorePatterns = ['node_modules/', '!**/*.ts'];

    expect(
      isIgnoredPattern({ ignorePatterns, pattern: 'path/node_modules' }),
    ).toBe(true);
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/test.json' })).toBe(
      true,
    );
    expect(isIgnoredPattern({ ignorePatterns, pattern: 'src/test.ts' })).toBe(
      false,
    );
  });
});
