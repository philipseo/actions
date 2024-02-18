import { COVERAGE_COMMENT_DEFAULT_MESSAGE } from '#/upsert-test-coverage-comment/upsert-test-coverage-comment.constants';
import { getExistingTestCoverageComment } from '#/upsert-test-coverage-comment/utils';

const mockToolkit = {
  github: {
    rest: {
      issues: {
        listComments: jest.fn(),
      },
    },
  },
  context: {
    repository: {
      owner: 'owner',
      repo: 'repo',
    },
    pullRequest: {
      number: 123,
    },
  },
};

describe('getExistingTestCoverageComment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('✅ should return existing test coverage comment if found', async () => {
    const existingComment = {
      body: COVERAGE_COMMENT_DEFAULT_MESSAGE,
    };

    mockToolkit.github.rest.issues.listComments.mockResolvedValueOnce({
      data: [existingComment],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await getExistingTestCoverageComment(mockToolkit);

    expect(mockToolkit.github.rest.issues.listComments).toHaveBeenCalledWith({
      owner: mockToolkit.context.repository.owner,
      repo: mockToolkit.context.repository.repo,
      issue_number: mockToolkit.context.pullRequest.number,
    });
    expect(result).toEqual(existingComment);
  });

  test('✅ should return undefined if no existing test coverage comment is found', async () => {
    mockToolkit.github.rest.issues.listComments.mockResolvedValueOnce({
      data: [],
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await getExistingTestCoverageComment(mockToolkit);

    expect(mockToolkit.github.rest.issues.listComments).toHaveBeenCalledWith({
      owner: mockToolkit.context.repository.owner,
      repo: mockToolkit.context.repository.repo,
      issue_number: mockToolkit.context.pullRequest.number,
    });
    expect(result).toBeUndefined();
  });
});
