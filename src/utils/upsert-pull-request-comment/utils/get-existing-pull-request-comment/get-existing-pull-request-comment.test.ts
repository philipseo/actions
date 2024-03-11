import { MOCK_TOOLKIT_CONTEXT, MOCK_TOOLKIT_GITHUB } from '#/constants';
import getExistingPullRequestComment from '#/utils/upsert-pull-request-comment/utils/get-existing-pull-request-comment/get-existing-pull-request-comment';

const MOCK_TOOLKIT = {
  context: MOCK_TOOLKIT_CONTEXT,
  github: MOCK_TOOLKIT_GITHUB,
};

describe('getExistingPullRequestComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should return existing pull request comment if found', async () => {
    const mockPullRequestComment = 'mock comment body';
    const existingComment = {
      body: mockPullRequestComment,
    };

    MOCK_TOOLKIT.github.issues.listComments.mockResolvedValueOnce({
      data: [existingComment],
    });

    const result = await getExistingPullRequestComment({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
      message: mockPullRequestComment,
    });

    expect(MOCK_TOOLKIT.github.issues.listComments).toHaveBeenCalledWith({
      owner: MOCK_TOOLKIT.context.repository.owner,
      repo: MOCK_TOOLKIT.context.repository.repo,
      issue_number: MOCK_TOOLKIT.context.pullRequest.number,
    });
    expect(result).toEqual(existingComment);
  });

  test('✅ should return undefined if no existing test coverage comment is found', async () => {
    MOCK_TOOLKIT.github.issues.listComments.mockResolvedValueOnce({
      data: [],
    });

    const result = await getExistingPullRequestComment({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      toolkit: MOCK_TOOLKIT,
      message: '',
    });

    expect(MOCK_TOOLKIT.github.issues.listComments).toHaveBeenCalledWith({
      owner: MOCK_TOOLKIT.context.repository.owner,
      repo: MOCK_TOOLKIT.context.repository.repo,
      issue_number: MOCK_TOOLKIT.context.pullRequest.number,
    });
    expect(result).toBeUndefined();
  });
});
