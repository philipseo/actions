import { MOCK_TOOLKIT_CONTEXT, MOCK_TOOLKIT_GITHUB } from '#/constants';
import { upsertPullRequestComment } from '#/utils';
import * as upsertPullRequestCommentUtils from '#/utils/upsert-pull-request-comment/utils';

const MOCK_TOOLKIT = {
  context: MOCK_TOOLKIT_CONTEXT,
  github: MOCK_TOOLKIT_GITHUB,
};

const mockUpsertPullRequestCommentProps = {
  toolkit: MOCK_TOOLKIT,
  message: 'mock message',
  comment: 'mock comment',
};

describe('upsertPullRequestComment', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock calls after each test
  });

  test('✅ should create a new comment if no existing comment found', async () => {
    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce(undefined);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await upsertPullRequestComment(mockUpsertPullRequestCommentProps);

    expect(MOCK_TOOLKIT.github.issues.createComment).toHaveBeenCalledWith({
      ...MOCK_TOOLKIT.context.repository,
      body: mockUpsertPullRequestCommentProps.comment,
      issue_number: MOCK_TOOLKIT.context.pullRequest.number,
    });
  });

  test('✅ should update existing comment if found', async () => {
    const mockExistingComment = {
      id: 456,
    };

    jest
      .spyOn(upsertPullRequestCommentUtils, 'getExistingPullRequestComment')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .mockResolvedValueOnce(mockExistingComment);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await upsertPullRequestComment(mockUpsertPullRequestCommentProps);

    expect(MOCK_TOOLKIT.github.issues.updateComment).toHaveBeenCalledWith({
      ...MOCK_TOOLKIT.context.repository,
      body: mockUpsertPullRequestCommentProps.comment,
      comment_id: mockExistingComment.id,
    });
  });
});
