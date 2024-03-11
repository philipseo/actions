import { create } from 'istanbul-reports';

import { MOCK_ROOT_PATH } from '#/__mocks__';
import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
import { COVERAGE_TXT_FILE_NAME } from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import { combineCoverage } from '#/upsert-test-coverage-comment/utils';
import * as utils from '#/utils';

jest.mock('node:fs/promises', () => {
  const uuid = crypto.randomUUID();
  const mockPath = `${uuid}/test.ts`;
  const mockFile = JSON.stringify({
    [mockPath]: {
      path: mockPath,
      statementMap: {
        '0': {
          start: { line: 1, column: 13 },
          end: { line: 1, column: 72 },
        },
      },
      fnMap: {},
      branchMap: {},
      s: { '0': 1 },
      f: {},
      b: {},
    },
  });

  return {
    readFile: jest.fn().mockReturnValue(mockFile),
  };
});
jest.mock('istanbul-reports', () => {
  return {
    create: jest.fn(() => {
      return {
        execute: jest.fn(),
      };
    }),
  };
});
jest.mock('#/utils', () => {
  return {
    getRootPath: jest.fn().mockResolvedValue(MOCK_ROOT_PATH),
    getAllFilePaths: jest
      .fn()
      .mockResolvedValueOnce([
        '/coverage1/coverage-final.json',
        '/coverage2/coverage-final.json',
      ]),
  };
});

describe('combineCoverage', () => {
  test('✅ should combine coverage and generate report', async () => {
    await combineCoverage();

    expect(utils.getAllFilePaths).toHaveBeenCalledWith({
      filename: 'coverage-final.json',
      ignorePatterns: DEFAULT_IGNORE_PATTERNS,
    });
    expect(create).toHaveBeenCalledWith('text', {
      file: COVERAGE_TXT_FILE_NAME,
    });
  });
});
