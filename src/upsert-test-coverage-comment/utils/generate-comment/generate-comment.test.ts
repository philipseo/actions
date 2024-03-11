import { readFile } from 'node:fs/promises';

import { MOCK_ROOT_PATH } from '#/__mocks__';
import {
  COVERAGE_TXT_FILE_NAME,
  DEFAULT_COVERAGE_COMMENT_MESSAGE,
} from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import { generateComment } from '#/upsert-test-coverage-comment/utils';
import { getRootPath } from '#/utils';

jest.mock('node:fs/promises', () => {
  return {
    readFile: jest.fn().mockResolvedValue(''),
  };
});
jest.mock('#/utils', () => {
  return {
    getRootPath: jest.fn().mockResolvedValue(MOCK_ROOT_PATH),
  };
});

describe('generateComment', () => {
  test('✅ should generate a comment with coverage report content', async () => {
    const rootPath = await getRootPath();
    const comment = await generateComment();

    expect(readFile).toHaveBeenCalledWith(
      `${rootPath}/${COVERAGE_TXT_FILE_NAME}`,
    );
    expect(comment).toContain(DEFAULT_COVERAGE_COMMENT_MESSAGE);
  });
});
