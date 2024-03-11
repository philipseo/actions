import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { MOCK_ROOT_PATH } from '#/__mocks__';
import { getRootPath } from '#/utils';
import {
  NOT_FOUND_ROOT_PATH,
  PNPM_LOCK_YAML,
} from '#/utils/get-root-path/get-root-path.constants';

describe('getRootPath', () => {
  test('✅ should return root path when PNPM_LOCK_YAML exists in current directory or its parent directories', async () => {
    const rootPath = await getRootPath();
    const targetFilePath = join(rootPath, PNPM_LOCK_YAML);

    expect(existsSync(targetFilePath)).toBe(true);
  });

  test('❗Has an error get root path', async () => {
    jest.spyOn(process, 'cwd').mockImplementationOnce(() => {
      return MOCK_ROOT_PATH;
    });

    await expect(getRootPath).rejects.toThrow(NOT_FOUND_ROOT_PATH);
  });
});
