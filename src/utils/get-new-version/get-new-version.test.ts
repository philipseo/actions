import { MOCK_ERROR_MESSAGE, MOCK_PACKAGE_JSON } from '#/__mocks__';
import * as utils from '#/utils';

jest.mock('#/utils/get-root-path', () => {
  return {
    getRootPath: jest.fn(),
  };
});
jest.mock('#/utils/get-package-json', () => {
  return {
    getPackageJson: jest.fn().mockImplementation(() => {
      return MOCK_PACKAGE_JSON;
    }),
  };
});

describe('getNewVersion', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ Major version update', async () => {
    const result = await utils.getNewVersion({ prTitle: 'major: mock' });
    expect(result).toBe('2.0.0');
  });

  test('✅ Minor version update', async () => {
    const result = await utils.getNewVersion({ prTitle: 'feat: mock' });
    expect(result).toBe('1.3.0');
  });

  test('✅ Patch version update', async () => {
    const result = await utils.getNewVersion({ prTitle: 'patch: mock' });
    expect(result).toBe('1.2.4');
  });

  test('❗ Has an error get new version', async () => {
    jest.spyOn(utils, 'getRootPath').mockImplementationOnce(async () => {
      throw new Error(MOCK_ERROR_MESSAGE);
    });

    await expect(utils.getNewVersion({ prTitle: 'test' })).rejects.toThrow(
      MOCK_ERROR_MESSAGE,
    );
  });
});
