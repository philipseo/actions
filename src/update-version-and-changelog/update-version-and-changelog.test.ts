import {
  DEFAULT_IGNORE_PATTERNS,
  MOCK_PACKAGE_JSON_PATH,
  MOCK_TOOLKIT_CONTEXT,
  MOCK_TOOLKIT_FAILURE,
  MOCK_TOOLKIT_SUCCESS,
  MOCK_VERSION,
} from '#/constants';
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
    jest
      .spyOn(utils, 'getChangedPackagePaths')
      .mockResolvedValueOnce([
        MOCK_PACKAGE_JSON_PATH.replace('/package.json', ''),
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
    expect(utils.getAllFilePaths).toHaveBeenCalledWith({
      filename: 'package.json',
      ignorePatterns: DEFAULT_IGNORE_PATTERNS,
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
