import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';

import { upsertChangeLog } from '#/update-version-and-changelog/utils';

const MOCK_NEW_VERSION = '1.0.1';
const MOCK_PACKAGE_PATH = '/mock';
const MOCK_CHANGELOG_MD_PATH = `${MOCK_PACKAGE_PATH}/CHANGELOG.md`;
const MOCK_MESSAGE = 'mock message';
const MOCK_CONTENT = `## v${MOCK_NEW_VERSION} (${new Date().toLocaleDateString()})\n\n---\n\n${MOCK_MESSAGE}`;

jest.mock('node:fs/promises', () => {
  return {
    writeFile: jest.fn(),
    readFile: jest.fn(() => MOCK_CONTENT),
  };
});

describe('upsertChangeLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should create new CHANGELOG.md if it does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);

    await upsertChangeLog({
      path: MOCK_PACKAGE_PATH,
      newVersion: MOCK_NEW_VERSION,
      message: MOCK_MESSAGE,
    });

    expect(writeFile).toHaveBeenCalledWith(
      MOCK_CHANGELOG_MD_PATH,
      MOCK_CONTENT,
    );
  });

  test('✅ should update existing CHANGELOG.md if it exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);

    const mockContent = `${MOCK_CONTENT}\n\n---\n\n${MOCK_CONTENT}`;

    await upsertChangeLog({
      path: MOCK_PACKAGE_PATH,
      newVersion: MOCK_NEW_VERSION,
      message: MOCK_MESSAGE,
    });

    expect(writeFile).toHaveBeenCalledWith(MOCK_CHANGELOG_MD_PATH, mockContent);
  });
});
