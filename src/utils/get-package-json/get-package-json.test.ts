import * as fs from 'node:fs/promises';

import { MOCK_ERROR_MESSAGE } from '#/constants';
import { getPackageJson, getRootPath } from '#/utils';

describe('getPackageJsonPath function', () => {
  test('✅ Get Package Json Path', async () => {
    const ROOT_PATH = await getRootPath();
    const ROOT_PACKAGE_JSON = await getPackageJson({
      path: `${ROOT_PATH}/package.json`,
    });

    expect(ROOT_PACKAGE_JSON.name).toBe('@philipseo/actions');
  });

  test('❗ Has an error get package.json path', async () => {
    jest.spyOn(fs, 'readFile').mockImplementationOnce(() => {
      throw new Error(MOCK_ERROR_MESSAGE);
    });

    await expect(getPackageJson({ path: '' })).rejects.toThrow(
      MOCK_ERROR_MESSAGE,
    );
  });
});
