import {
  MOCK_ERROR_MESSAGE,
  MOCK_TOOLKIT_CONTEXT,
  MOCK_TOOLKIT_GITHUB,
} from '#/constants';
import { MOCK_TOOLKIT_FAILURE, MOCK_TOOLKIT_SUCCESS } from '#/constants/mock';
import upsertTestCoverageComment from '#/upsert-test-coverage-comment/upsert-test-coverage-comment';
import * as upsertTestCoverageCommentUtils from '#/upsert-test-coverage-comment/utils';
import * as upsertPullRequestCommentUtils from '#/utils/upsert-pull-request-comment/utils';

const MOCK_TOOLKIT = {
  context: MOCK_TOOLKIT_CONTEXT,
  github: MOCK_TOOLKIT_GITHUB,
  success: MOCK_TOOLKIT_SUCCESS,
  failure: MOCK_TOOLKIT_FAILURE,
};

jest.mock('#/utils/actions-toolkit', () => ({
  ActionsToolkit: jest.fn().mockImplementation(() => {
    return MOCK_TOOLKIT;
  }),
}));
jest.mock('#/upsert-test-coverage-comment/utils', () => ({
  combineCoverage: jest.fn(),
  generateComment: jest.fn().mockImplementation(() => 'mockedComment'),
}));

describe('upsertTestCoverageComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should successfully upsert test coverage comment when existing comment is found', async () => {
    const mockExistingComment = {
      id: 456,
    };

    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce(mockExistingComment);

    await upsertTestCoverageComment();

    expect(upsertTestCoverageCommentUtils.combineCoverage).toHaveBeenCalled();
    expect(upsertTestCoverageCommentUtils.generateComment).toHaveBeenCalled();
    expect(
      upsertPullRequestCommentUtils.getExistingPullRequestComment,
    ).toHaveBeenCalled();
    expect(MOCK_TOOLKIT.github.issues.updateComment).toHaveBeenCalledWith({
      ...MOCK_TOOLKIT.context.repository,
      comment_id: mockExistingComment.id,
      body: 'mockedComment',
    });
    expect(MOCK_TOOLKIT_SUCCESS).toHaveBeenCalled();
  });

  test('✅ should successfully upsert test coverage comment when existing comment is not found', async () => {
    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      .mockResolvedValue(undefined);

    await upsertTestCoverageComment();

    expect(MOCK_TOOLKIT.github.issues.createComment).toHaveBeenCalledWith({
      ...MOCK_TOOLKIT.context.repository,
      body: 'mockedComment',
      issue_number: MOCK_TOOLKIT.context.pullRequest.number,
    });
  });

  test('❗ should handle failure', async () => {
    const mockError = new Error(MOCK_ERROR_MESSAGE);

    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      .mockRejectedValue(mockError);

    await upsertTestCoverageComment();

    expect(MOCK_TOOLKIT_FAILURE).toHaveBeenCalledWith(mockError);
  });
});
