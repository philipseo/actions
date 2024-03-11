import { writeFile } from 'node:fs/promises';

import {
  MOCK_PACKAGE_JSON,
  MOCK_PACKAGE_JSON_PATH,
  MOCK_VERSION,
} from '#/constants';
import * as versioningUtils from '#/update-version-and-changelog/utils';
import * as utils from '#/utils';

jest.mock('node:fs/promises', () => {
  return {
    writeFile: jest.fn(),
  };
});

describe('updateVersion', () => {
  test('✅ update version in package.json file', async () => {
    const spyGetPackageJson = jest
      .spyOn(utils, 'getPackageJson')
      .mockResolvedValue(MOCK_PACKAGE_JSON);

    await versioningUtils.updateVersion({
      path: MOCK_PACKAGE_JSON_PATH,
      newVersion: MOCK_VERSION,
    });

    expect(utils.getPackageJson).toHaveBeenCalledWith({
      path: MOCK_PACKAGE_JSON_PATH,
    });

    expect(writeFile).toHaveBeenCalledWith(
      MOCK_PACKAGE_JSON_PATH,
      JSON.stringify(MOCK_PACKAGE_JSON, null, 2).replace(/\r\n/g, '\n'),
      { encoding: 'utf-8' },
    );

    spyGetPackageJson.mockRestore();
  });
});
