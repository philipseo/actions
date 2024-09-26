import {
  MOCK_PACKAGE_JSON_PATH,
  MOCK_TOOLKIT_CONTEXT,
  MOCK_TOOLKIT_FAILURE,
  MOCK_TOOLKIT_SUCCESS,
  MOCK_VERSION,
} from '#/__mocks__';
import updateVersionAndChangelog from '#/update-version-and-changelog/update-version-and-changelog';
import * as updateVersionAndChangelogUtils from '#/update-version-and-changelog/utils';
import * as utils from '#/utils';

describe('updateVersionAndChangelog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should update version and changelog for each package', async () => {
    const releaseMessage = 'Release message';

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        context: MOCK_TOOLKIT_CONTEXT,
        outputs: {
          'new-version': MOCK_VERSION,
        },
        success: MOCK_TOOLKIT_SUCCESS,
      };
    });
    jest.spyOn(utils, 'getNewVersion').mockResolvedValueOnce(MOCK_VERSION);
    jest
      .spyOn(utils, 'getAllFilePaths')
      .mockResolvedValueOnce([MOCK_PACKAGE_JSON_PATH]);
    jest.spyOn(utils, 'getChangedPackagePaths').mockResolvedValueOnce([
      {
        path: 'mock',
        isChangedPackage: true,
      },
    ]);
    jest
      .spyOn(utils, 'generateReleaseMessage')
      .mockReturnValueOnce(releaseMessage);
    jest
      .spyOn(updateVersionAndChangelogUtils, 'updateVersion')
      .mockResolvedValue();
    jest
      .spyOn(updateVersionAndChangelogUtils, 'upsertChangeLog')
      .mockResolvedValue();

    await updateVersionAndChangelog();

    expect(utils.getNewVersion).toHaveBeenCalledWith({
      prTitle: MOCK_TOOLKIT_CONTEXT.pullRequest.title,
    });
    expect(utils.getChangedPackagePaths).toHaveBeenCalledTimes(1);
    expect(utils.generateReleaseMessage).toHaveBeenCalledTimes(1);
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('❗ should handle failure correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    jest.spyOn(utils, 'ActionsToolkit').mockImplementationOnce(() => {
      return {
        failure: MOCK_TOOLKIT_FAILURE,
      };
    });

    await updateVersionAndChangelog();

    expect(MOCK_TOOLKIT_FAILURE).toHaveBeenCalled();
  });
});
