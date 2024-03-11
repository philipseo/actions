import {
  MOCK_PACKAGE_JSON,
  MOCK_PACKAGE_JSON_PATH,
  MOCK_TOOLKIT_CONTEXT,
  MOCK_TOOLKIT_FAILURE,
  MOCK_TOOLKIT_SUCCESS,
} from '#/__mocks__';
import { DEFAULT_IGNORE_PATTERNS } from '#/constants';
import createGithubReleaseAndTag from '#/create-github-release-and-tag/create-github-release-and-tag';
import * as utils from '#/utils';

describe('createGithubReleaseAndTag', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should create GitHub release for each changeLogPaths', async () => {
    const releaseMessage = 'Release message';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        context: MOCK_TOOLKIT_CONTEXT,
        github: {
          repos: {
            createRelease: jest.fn().mockResolvedValue({}),
          },
        },
        success: MOCK_TOOLKIT_SUCCESS,
      };
    });
    jest
      .spyOn(utils, 'getAllFilePaths')
      .mockResolvedValueOnce([MOCK_PACKAGE_JSON_PATH]);
    jest
      .spyOn(utils, 'getChangedPackagePaths')
      .mockResolvedValueOnce([
        MOCK_PACKAGE_JSON_PATH.replace('/package.json', ''),
      ]);
    jest
      .spyOn(utils, 'getPackageJson')
      .mockResolvedValueOnce(MOCK_PACKAGE_JSON);
    jest
      .spyOn(utils, 'generateReleaseMessage')
      .mockReturnValueOnce(releaseMessage);

    await createGithubReleaseAndTag();

    expect(utils.getAllFilePaths).toHaveBeenCalledWith({
      filename: 'CHANGELOG.md',
      ignorePatterns: DEFAULT_IGNORE_PATTERNS,
    });
    expect(utils.getChangedPackagePaths).toHaveBeenCalledTimes(1);
    expect(utils.generateReleaseMessage).toHaveBeenCalledTimes(1);
    expect(utils.getPackageJson).toHaveBeenCalledTimes(1);
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('❗ should handle error and call toolkit.failure', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        failure: MOCK_TOOLKIT_FAILURE,
      };
    });

    await createGithubReleaseAndTag();

    expect(MOCK_TOOLKIT_FAILURE).toHaveBeenCalled();
  });
});
