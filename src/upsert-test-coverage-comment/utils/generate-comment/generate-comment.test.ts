import { readFile } from 'node:fs/promises';

import { getRootPath } from '@philipseo/scripts';

import {
  COVERAGE_COMMENT_DEFAULT_MESSAGE,
  COVERAGE_TXT_FILE_NAME,
} from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import { generateComment } from '#/upsert-test-coverage-comment/utils';

jest.mock('node:fs/promises', () => {
  return {
    readFile: jest.fn().mockResolvedValue(''),
  };
});

describe('generateComment', () => {
  test('✅ should generate a comment with coverage report content', async () => {
    const rootPath = await getRootPath();
    const comment = await generateComment();

    expect(readFile).toHaveBeenCalledWith(
      `${rootPath}/${COVERAGE_TXT_FILE_NAME}`,
    );
    expect(comment).toContain(COVERAGE_COMMENT_DEFAULT_MESSAGE);
  });
});
