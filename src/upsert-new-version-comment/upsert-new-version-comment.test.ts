import {
  MOCK_ERROR_MESSAGE,
  MOCK_TOOLKIT_CONTEXT,
  MOCK_TOOLKIT_FAILURE,
  MOCK_TOOLKIT_GITHUB,
  MOCK_TOOLKIT_SUCCESS,
  MOCK_VERSION,
} from '#/__mocks__';
import upsertNewVersionComment from '#/upsert-new-version-comment/upsert-new-version-comment';
import { DEFAULT_NEW_VERSION_MESSAGE } from '#/upsert-new-version-comment/upsert-new-version-comment.test.constants';
import * as upsertPullRequestCommentUtils from '#/utils/upsert-pull-request-comment/utils';

const MOCK_TOOLKIT = {
  context: MOCK_TOOLKIT_CONTEXT,
  github: MOCK_TOOLKIT_GITHUB,
  success: MOCK_TOOLKIT_SUCCESS,
  failure: MOCK_TOOLKIT_FAILURE,
};

const MOCK_NEW_VERSION_COMMENT = `${DEFAULT_NEW_VERSION_MESSAGE}${MOCK_VERSION}`;

jest.mock('#/utils/get-new-version', () => ({
  getNewVersion: jest.fn().mockImplementation(() => {
    return MOCK_VERSION;
  }),
}));
jest.mock('#/utils/actions-toolkit', () => ({
  ActionsToolkit: jest.fn().mockImplementation(() => {
    return MOCK_TOOLKIT;
  }),
}));

describe('upsertNewVersionComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should successfully upsert new version comment when existing comment is found', async () => {
    const mockExistingComment = {
      id: 456,
    };

    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce(mockExistingComment);

    await upsertNewVersionComment();

    expect(
      upsertPullRequestCommentUtils.getExistingPullRequestComment,
    ).toHaveBeenCalled();
    expect(MOCK_TOOLKIT.github.issues.updateComment).toHaveBeenCalledWith({
      ...MOCK_TOOLKIT.context.repository,
      comment_id: mockExistingComment.id,
      body: MOCK_NEW_VERSION_COMMENT,
    });
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('✅ should successfully upsert new version comment when existing comment is not found', async () => {
    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      .mockResolvedValue(undefined);

    await upsertNewVersionComment();

    expect(MOCK_TOOLKIT.github.issues.createComment).toHaveBeenCalledWith({
      ...MOCK_TOOLKIT.context.repository,
      body: MOCK_NEW_VERSION_COMMENT,
      issue_number: MOCK_TOOLKIT.context.pullRequest.number,
    });
  });

  test('❗ should handle failure', async () => {
    const mockError = new Error(MOCK_ERROR_MESSAGE);

    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      .mockRejectedValue(mockError);

    await upsertNewVersionComment();

    expect(MOCK_TOOLKIT_FAILURE).toHaveBeenCalledWith(mockError);
  });
});
